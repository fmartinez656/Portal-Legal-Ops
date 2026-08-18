/* ===========================================================================
   TRIAGE — Reglas de enrutamiento automático de asuntos legales
   Decide si un asunto entra al Abogado Senior, al Abogado Junior o al
   Analista de Operaciones Legales. Motor de puntaje + banderas duras.
   =========================================================================== */
'use strict';

const TRI_TIERS = {
  sr: {
    key: 'sr', name: 'Abogado Senior', short: 'Senior', icon: 'ti-scale', color: 'var(--cr)',
    who: ['L. Mendoza', 'R. Castro'], cap: 12, load: 9, sla: '5 d.h.',
    takes: ['Criterio jurídico complejo o sin precedente interno', 'Exposición alta: responsabilidad ilimitada, indemnidades, penalidades abiertas', 'Litigio, arbitraje y requerimientos de autoridad', 'Operaciones que aprueba CEO o Junta Directiva', 'Multi-jurisdicción o normativa nueva'],
    never: 'No debe recibir trámites, cargas documentales ni contratos plantilla sin desviación.',
  },
  jr: {
    key: 'jr', name: 'Abogado Junior', short: 'Junior', icon: 'ti-gavel', color: 'var(--ca)',
    who: ['S. Aguilar', 'J. Barrera'], cap: 18, load: 11, sla: '3 d.h.',
    takes: ['Criterio jurídico acotado con precedente o política aplicable', 'Contratos estándar con desviaciones menores negociables', 'Riesgo bajo o medio y monto hasta $50,000', 'Opiniones legales de rutina y revisión de cláusulas típicas', 'Una sola jurisdicción, contraparte sin poder de imposición'],
    never: 'Escala al Senior si aparece cualquier bandera dura durante el trabajo.',
  },
  ops: {
    key: 'ops', name: 'Analista de Operaciones Legales', short: 'Ops Legales', icon: 'ti-clipboard-check', color: 'var(--ce)',
    who: ['M. Cruz'], cap: 25, load: 14, sla: '1 d.h.',
    takes: ['Tareas de proceso sin criterio jurídico', 'Emisión de documentos plantilla sin cambios', 'Trámites, legalizaciones, apostillas y certificaciones', 'Carga, indexado y control documental en el repositorio', 'Seguimiento de firmas, vencimientos, reportes y agenda'],
    never: 'Nunca emite opinión legal ni negocia cláusulas. Devuelve o escala si el caso exige criterio.',
  },
};

/* Factores del triage — cada opción suma puntos */
const TRI_FACTORS = [
  { id: 'tipo', label: 'Naturaleza del asunto', icon: 'ti-category',
    opts: [{ v: 'proc', l: 'Trámite o tarea de proceso', p: 0 }, { v: 'std', l: 'Documento plantilla estándar', p: 1 }, { v: 'crit', l: 'Requiere criterio jurídico', p: 4 }, { v: 'estr', l: 'Operación estratégica o estructural', p: 7 }] },
  { id: 'monto', label: 'Monto o valor involucrado', icon: 'ti-coin',
    opts: [{ v: 'na', l: 'Sin monto', p: 0 }, { v: 'lo', l: 'Hasta $25,000', p: 1 }, { v: 'md', l: '$25,001 – $100,000', p: 3 }, { v: 'hi', l: 'Más de $100,000', p: 6 }] },
  { id: 'riesgo', label: 'Riesgo legal estimado', icon: 'ti-shield-half',
    opts: [{ v: 'bajo', l: 'Bajo', p: 0 }, { v: 'medio', l: 'Medio', p: 2 }, { v: 'alto', l: 'Alto', p: 6 }] },
  { id: 'prec', label: 'Precedente disponible', icon: 'ti-book',
    opts: [{ v: 'plant', l: 'Plantilla vigente sin cambios', p: 0 }, { v: 'menor', l: 'Plantilla con desviaciones menores', p: 2 }, { v: 'prec', l: 'Precedente interno aplicable', p: 3 }, { v: 'nuevo', l: 'Sin precedente interno', p: 6 }] },
  { id: 'juris', label: 'Jurisdicción', icon: 'ti-world',
    opts: [{ v: 'una', l: 'Una sola jurisdicción', p: 0 }, { v: 'multi', l: 'Dos o más países del Grupo', p: 3 }, { v: 'ext', l: 'Ley extranjera o foro fuera de la región', p: 5 }] },
  { id: 'expo', label: 'Exposición contractual', icon: 'ti-alert-triangle',
    opts: [{ v: 'no', l: 'Limitada y estándar', p: 0 }, { v: 'cont', l: 'Contingente o penalidades acotadas', p: 2 }, { v: 'ilim', l: 'Ilimitada, indemnidades materiales', p: 8 }] },
  { id: 'vis', label: 'Visibilidad y urgencia', icon: 'ti-eye',
    opts: [{ v: 'rut', l: 'Rutina', p: 0 }, { v: 'prio', l: 'Prioritaria del negocio', p: 2 }, { v: 'jd', l: 'CEO o Junta Directiva', p: 5 }] },
];

/* Banderas duras — enrutan al Senior sin importar el puntaje */
const TRI_FLAGS = [
  { id: 'lit', label: 'Litigio, arbitraje o conflicto en curso', icon: 'ti-hammer', why: 'Estrategia procesal y plazos preclusivos: solo Senior.' },
  { id: 'aut', label: 'Requerimiento de autoridad o regulador', icon: 'ti-building-bank', why: 'Respuesta vinculante ante tercero con potestad sancionadora.' },
  { id: 'ma', label: 'M&A, joint venture o cambio societario', icon: 'ti-git-merge', why: 'Aprobación de Junta Directiva según Cuadro de Autoridades.' },
  { id: 'lab', label: 'Asunto laboral sensible o denuncia ética', icon: 'ti-user-shield', why: 'Confidencialidad reforzada y riesgo reputacional.' },
  { id: 'nuevo', label: 'Normativa nueva sin criterio del Grupo', icon: 'ti-scale-outline', why: 'Fija posición institucional; debe sentar precedente.' },
];

/* Banderas de devolución — el asunto no entra a la cola */
const TRI_RETURN = [
  { id: 'inc', label: 'Insumos incompletos', txt: 'Ops Legales devuelve al solicitante con la lista exacta de faltantes. El SLA arranca cuando el expediente está completo.' },
  { id: 'noleg', label: 'No es un asunto legal', txt: 'Se redirige al área dueña (Compras, RRHH, Finanzas) y se cierra con nota en la bitácora.' },
];

const TRI_BANDS = [
  { max: 3,  tier: 'ops', txt: 'Sin criterio jurídico: es ejecución de proceso.' },
  { max: 10, tier: 'jr',  txt: 'Criterio acotado con precedente o política aplicable.' },
  { max: 99, tier: 'sr',  txt: 'Complejidad, exposición o visibilidad que exige experiencia.' },
];

/* Cola de entrada del día — clasificación automática ya aplicada */
let TRI_QUEUE = [
  { id: 'SOL-2026-241', svc: 'Revisión de contrato de suministro regional', area: 'Comercial', f: { tipo: 'crit', monto: 'md', riesgo: 'medio', prec: 'menor', juris: 'multi', expo: 'cont', vis: 'prio' }, flags: [], st: 'auto' },
  { id: 'SOL-2026-242', svc: 'Emisión de NDA plantilla con proveedor TI', area: 'TI', f: { tipo: 'std', monto: 'na', riesgo: 'bajo', prec: 'plant', juris: 'una', expo: 'no', vis: 'rut' }, flags: [], st: 'auto' },
  { id: 'SOL-2026-243', svc: 'Contestación de demanda laboral EXP-2026-012', area: 'RRHH', f: { tipo: 'crit', monto: 'md', riesgo: 'alto', prec: 'prec', juris: 'una', expo: 'cont', vis: 'prio' }, flags: ['lit', 'lab'], st: 'auto' },
  { id: 'SOL-2026-244', svc: 'Legalización y apostilla de poder societario', area: 'Finanzas', f: { tipo: 'proc', monto: 'na', riesgo: 'bajo', prec: 'plant', juris: 'una', expo: 'no', vis: 'rut' }, flags: [], st: 'auto' },
  { id: 'SOL-2026-245', svc: 'Joint venture con distribuidor en México', area: 'Dirección General', f: { tipo: 'estr', monto: 'hi', riesgo: 'alto', prec: 'nuevo', juris: 'ext', expo: 'ilim', vis: 'jd' }, flags: ['ma'], st: 'auto' },
  { id: 'SOL-2026-246', svc: 'Carga e indexado de contratos firmados en repositorio', area: 'Legal', f: { tipo: 'proc', monto: 'na', riesgo: 'bajo', prec: 'plant', juris: 'una', expo: 'no', vis: 'rut' }, flags: [], st: 'auto' },
  { id: 'SOL-2026-247', svc: 'Opinión sobre cláusula de exclusividad con cliente', area: 'Comercial', f: { tipo: 'crit', monto: 'lo', riesgo: 'medio', prec: 'prec', juris: 'una', expo: 'no', vis: 'rut' }, flags: [], st: 'auto' },
  { id: 'SOL-2026-248', svc: 'Respuesta a requerimiento de la autoridad tributaria', area: 'Finanzas', f: { tipo: 'crit', monto: 'na', riesgo: 'alto', prec: 'prec', juris: 'una', expo: 'cont', vis: 'prio' }, flags: ['aut'], st: 'auto' },
];

/* ───────── MOTOR ───────── */
function triScore(f, flags) {
  let score = 0; const hits = [];
  TRI_FACTORS.forEach(fa => {
    const o = fa.opts.find(x => x.v === f[fa.id]);
    if (!o) return;
    score += o.p;
    if (o.p > 0) hits.push({ l: fa.label, o: o.l, p: o.p });
  });
  const hard = (flags || []).map(id => TRI_FLAGS.find(x => x.id === id)).filter(Boolean);
  const band = TRI_BANDS.find(b => score <= b.max);
  const tier = hard.length ? 'sr' : band.tier;
  return { score, hits, hard, tier, reason: hard.length ? hard[0].why : band.txt, forced: !!hard.length };
}

/* ───────── VISTA ───────── */
const triSt = {
  f: { tipo: 'crit', monto: 'md', riesgo: 'medio', prec: 'menor', juris: 'una', expo: 'cont', vis: 'rut' },
  flags: [], over: {},
};

function renderTriage() {
  const host = $('#v-triage');
  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <h1 class="ptitle">Triage de <em>asuntos</em></h1>
      <p class="psub">Toda solicitud entra por una sola puerta y se enruta con la misma regla: quien la atiende se define por complejidad, exposición y precedente — nunca por quién tenga tiempo libre.</p>
    </div>
    <div class="info-banner" style="margin-bottom:1.25rem"><i class="ti ti-route"></i>El motor clasifica al recibir la solicitud. La Gerente Legal puede reasignar, y toda reasignación queda en la bitácora con su motivo.</div>
    <div class="tri-grid">${Object.values(TRI_TIERS).map(triTierCard).join('')}</div>
    <div class="sh" style="margin-top:var(--gap)"><h2>Simulador de enrutamiento</h2><span>Ajusta los factores y observa la decisión con su justificación</span></div>
    <div class="tri-sim">
      <div class="tri-form">${TRI_FACTORS.map(triFactorRow).join('')}
        <div class="tri-flagbox">
          <div class="tri-lbl"><i class="ti ti-flag-3"></i>Banderas de escalamiento automático</div>
          <div class="chip-row">${TRI_FLAGS.map(fl => `<button class="tri-flag${triSt.flags.includes(fl.id) ? ' on' : ''}" onclick="triToggleFlag('${fl.id}')" title="${fl.why}"><i class="ti ${fl.icon}"></i>${fl.label}</button>`).join('')}</div>
        </div>
      </div>
      <div id="triOut">${triResult()}</div>
    </div>
    <div class="sh" style="margin-top:var(--gap)"><h2>Cola de entrada de hoy</h2><span>${TRI_QUEUE.length} solicitudes clasificadas automáticamente</span></div>
    <div class="rtable-wrap" style="margin-bottom:var(--gap)"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Folio</th><th>Asunto</th><th>Origen</th><th>Puntaje</th><th>Destino automático</th><th>Motivo</th><th></th></tr></thead>
      <tbody id="triQueueBody">${triQueueRows()}</tbody>
    </table></div></div>
    <div class="sh"><h2>Reglas duras</h2><span>Enrutan al Senior sin importar el puntaje</span></div>
    <div class="tri-rules">${TRI_FLAGS.map(f => `<div class="tri-rule"><i class="ti ${f.icon}"></i><div><strong>${f.label}</strong><span>${f.why}</span></div></div>`).join('')}</div>
    <div class="sh" style="margin-top:var(--gap)"><h2>Qué no entra a la cola</h2><span>Se devuelve antes de consumir capacidad del equipo</span></div>
    <div class="tri-rules">${TRI_RETURN.map(r => `<div class="tri-rule ret"><i class="ti ti-arrow-back-up"></i><div><strong>${r.label}</strong><span>${r.txt}</span></div></div>`).join('')}</div>
    <div class="tri-esc">
      <div class="tri-lbl"><i class="ti ti-stairs-up"></i>Reglas de escalamiento entre niveles</div>
      <div class="tri-esc-row"><span class="tri-esc-a">Ops Legales</span><i class="ti ti-arrow-right"></i><span class="tri-esc-b">Junior</span><p>Si el trámite exige interpretar una cláusula, redactar texto nuevo o responder a una contraparte, el analista escala el mismo día.</p></div>
      <div class="tri-esc-row"><span class="tri-esc-a">Junior</span><i class="ti ti-arrow-right"></i><span class="tri-esc-b">Senior</span><p>Si aparece una bandera dura, si la contraparte impone su formato, o si el asunto supera 2 rondas de negociación sin acuerdo.</p></div>
      <div class="tri-esc-row"><span class="tri-esc-a">Senior</span><i class="ti ti-arrow-right"></i><span class="tri-esc-b">Gerencia Legal</span><p>Si se requiere aprobación fuera del Cuadro de Autoridades, hay conflicto de interés, o el riesgo estimado supera $300,000.</p></div>
    </div>`;
}

function triTierCard(t) {
  const pct = Math.round(t.load / t.cap * 100);
  const cls = pct >= 85 ? 'crit' : pct >= 65 ? 'warn' : 'ok';
  const q = TRI_QUEUE.filter(x => triQueueTier(x) === t.key).length;
  return `<article class="tri-card" style="--tri:${t.color}">
    <div class="tri-top"><span class="tri-ic"><i class="ti ${t.icon}"></i></span><span class="tri-sla">SLA ${t.sla}</span></div>
    <h3 class="tri-name">${t.name}</h3>
    <div class="tri-who">${t.who.map(w => `<span class="cad-av" title="${w}">${w.replace('. ', '')[0] + w.split(' ').pop()[0]}</span>`).join('')}<span class="tri-whotxt">${t.who.join(' · ')}</span></div>
    <div class="tri-load"><div class="tri-load-h"><span>Carga actual</span><span class="tri-load-v">${t.load}/${t.cap}</span></div><div class="tri-bar"><i class="${cls}" style="width:${pct}%"></i></div></div>
    <div class="tri-lbl2">Recibe automáticamente</div>
    <ul class="tri-list">${t.takes.map(x => `<li><i class="ti ti-check"></i>${x}</li>`).join('')}</ul>
    <div class="tri-never"><i class="ti ti-ban"></i>${t.never}</div>
    <div class="tri-foot"><i class="ti ti-inbox"></i>${q} en la cola de hoy</div>
  </article>`;
}

function triFactorRow(fa) {
  return `<div class="tri-fac">
    <div class="tri-lbl"><i class="ti ${fa.icon}"></i>${fa.label}</div>
    <div class="tri-opts">${fa.opts.map(o => `<button class="tri-opt${triSt.f[fa.id] === o.v ? ' on' : ''}" onclick="triSet('${fa.id}','${o.v}')">${o.l}<span class="tri-pts">+${o.p}</span></button>`).join('')}</div>
  </div>`;
}

function triResult() {
  const r = triScore(triSt.f, triSt.flags);
  const t = TRI_TIERS[r.tier];
  const bandMax = TRI_BANDS.map(b => b.max);
  const pos = Math.min(100, Math.round(r.score / 24 * 100));
  return `<div class="tri-res" style="--tri:${t.color}">
    <div class="tri-res-h"><span class="tri-res-lbl">Se asigna a</span><span class="tri-res-score">${r.score} pts</span></div>
    <div class="tri-res-tier"><span class="tri-ic"><i class="ti ${t.icon}"></i></span><div><h3>${t.name}</h3><span>${t.who.join(' · ')} · SLA ${t.sla}</span></div></div>
    <div class="tri-scale"><div class="tri-scale-bar"><i class="ops" style="flex:${bandMax[0] + 1}"></i><i class="jr" style="flex:${bandMax[1] - bandMax[0]}"></i><i class="sr" style="flex:${13}"></i><span class="tri-mark" style="left:${pos}%"></span></div>
      <div class="tri-scale-lg"><span>Ops 0–3</span><span>Junior 4–10</span><span>Senior 11+</span></div></div>
    ${r.forced ? `<div class="tri-forced"><i class="ti ti-flag-3"></i><div><strong>Regla dura activada</strong>${r.hard.map(h => `<span>${h.label} — ${h.why}</span>`).join('')}</div></div>` : `<div class="tri-why"><i class="ti ti-bulb"></i>${r.reason}</div>`}
    <div class="tri-lbl2">Cómo se formó el puntaje</div>
    <div class="tri-hits">${r.hits.length ? r.hits.map(h => `<div class="tri-hit"><span>${h.o}</span><em>${h.l}</em><b>+${h.p}</b></div>`).join('') : '<div class="tri-hit empty">Ningún factor suma puntos: es ejecución de proceso pura.</div>'}</div>
    ${can('assign') ? `<button class="mini-btn primary" style="width:100%;margin-top:1rem;justify-content:center;padding:11px" onclick="triApply('${r.tier}')"><i class="ti ti-send"></i>Crear y asignar a ${t.short}</button>` : `<div class="tri-note"><i class="ti ti-lock"></i>Solo la Gerente Legal confirma o reasigna el destino.</div>`}
  </div>`;
}

function triSet(id, v) { triSt.f[id] = v; renderTriage(); }
function triToggleFlag(id) {
  const i = triSt.flags.indexOf(id);
  i < 0 ? triSt.flags.push(id) : triSt.flags.splice(i, 1);
  renderTriage();
}
function triApply(tier) {
  const t = TRI_TIERS[tier];
  toast(`Asunto enrutado a ${t.name} · ${t.who[0]} · SLA ${t.sla}`);
  logAudit(`Triage asignó un asunto nuevo a ${t.name} (${t.who[0]})`, t.color);
}

function triQueueTier(q) { return triSt.over[q.id] || triScore(q.f, q.flags).tier; }

function triQueueRows() {
  return TRI_QUEUE.map(q => {
    const r = triScore(q.f, q.flags);
    const tier = triSt.over[q.id] || r.tier;
    const t = TRI_TIERS[tier];
    const ov = !!triSt.over[q.id];
    return `<tr>
      <td><span class="sc-code">${q.id}</span></td>
      <td style="font-weight:500">${q.svc}</td>
      <td style="color:var(--mut);white-space:nowrap">${q.area}</td>
      <td><span class="tri-pill-score">${r.score}</span></td>
      <td><span class="tri-pill" style="--tri:${t.color}"><i class="ti ${t.icon}"></i>${t.short}</span>${ov ? '<span class="tri-ovtag">reasignado</span>' : ''}</td>
      <td style="color:var(--mut);font-size:12px">${r.forced ? '<i class="ti ti-flag-3" style="color:var(--crl)"></i> ' + r.hard.map(h => h.label).join(' · ') : r.reason}</td>
      <td>${can('assign') ? `<div class="tri-ovrow">${Object.values(TRI_TIERS).map(x => `<button class="tri-ovbtn${x.key === tier ? ' on' : ''}" title="Reasignar a ${x.name}" onclick="triOverride('${q.id}','${x.key}')"><i class="ti ${x.icon}"></i></button>`).join('')}</div>` : '<span style="color:var(--mut);font-size:12px">—</span>'}</td>
    </tr>`;
  }).join('');
}

function triOverride(id, tier) {
  if (!can('assign')) return;
  const q = TRI_QUEUE.find(x => x.id === id);
  const auto = triScore(q.f, q.flags).tier;
  if (tier === auto) delete triSt.over[id]; else triSt.over[id] = tier;
  const t = TRI_TIERS[tier];
  $('#triQueueBody').innerHTML = triQueueRows();
  toast(`${id} → ${t.name}${tier === auto ? ' (destino automático)' : ' · reasignación manual registrada'}`);
  logAudit(`A. Salgado reasignó ${id} a ${t.name}`, t.color);
}
