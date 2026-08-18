/* ===========================================================================
   MINI CLM — Ciclo de vida contractual (pestaña "Mi contrato" · Transacciones)
   Una sola vista por contrato: etapa, versiones, desviaciones de cláusula,
   cadena de aprobación, firma, obligaciones posteriores y renovación.
   =========================================================================== */
'use strict';

const CLM_STAGES = [
  { k: 'sol', n: 'Solicitud', i: 'ti-file-plus', d: 'Insumos completos y tipo de contrato definido' },
  { k: 'red', n: 'Redacción', i: 'ti-pencil', d: 'Se genera desde plantilla preaprobada' },
  { k: 'neg', n: 'Negociación', i: 'ti-arrows-exchange', d: 'Rondas con la contraparte y control de desviaciones' },
  { k: 'apr', n: 'Aprobaciones', i: 'ti-checkbox', d: 'Cadena según Cuadro de Autoridades' },
  { k: 'fir', n: 'Firma', i: 'ti-signature', d: 'Circulación y firma electrónica' },
  { k: 'vig', n: 'Vigencia', i: 'ti-shield-check', d: 'Obligaciones activas y control de hitos' },
  { k: 'ren', n: 'Renovación o cierre', i: 'ti-refresh', d: 'Decisión con 90 días de anticipación' },
];
const clmIdx = k => CLM_STAGES.findIndex(s => s.k === k);

const CLM_DEALS = [
  {
    id: 'CTR-2026-104', title: 'Contrato de servicios de logística regional', type: 'log', typeTxt: 'Logístico / Servicios',
    cp: 'TransAndina Cargo, S.A.', jur: 'Guatemala', amount: 145000, term: '24 meses', owner: 'M. Aguilar · Operaciones',
    lawyer: 'S. Aguilar', stage: 'neg', next: 'Cerrar ronda 2 de negociación', nextDue: '21 Ago 2026', tpl: 'Servicios v4',
    steps: { sol: '04 Ago 2026 · M. Aguilar', red: '06 Ago 2026 · S. Aguilar', neg: 'En curso · ronda 2 de 3' },
    versions: [
      { v: 'v1.0', who: 'S. Aguilar', when: '06 Ago', what: 'Generada desde plantilla Servicios v4 sin cambios' },
      { v: 'v1.1', who: 'TransAndina (contraparte)', when: '11 Ago', what: 'Propone limitar responsabilidad a 6 meses de tarifa y ampliar plazo de pago a 60 días' },
      { v: 'v1.2', who: 'S. Aguilar', when: '14 Ago', what: 'Rechaza tope de responsabilidad, acepta 45 días de pago, agrega cláusula de auditoría' },
    ],
    dev: [
      { cl: 'Limitación de responsabilidad', std: '12 meses de tarifa', ask: '6 meses de tarifa', risk: 'alto', st: 'open' },
      { cl: 'Plazo de pago', std: '30 días', ask: '45 días', risk: 'bajo', st: 'ok' },
      { cl: 'Exclusividad territorial', std: 'No aplica', ask: 'Exclusividad en zona norte', risk: 'medio', st: 'open' },
      { cl: 'Ley aplicable y foro', std: 'Guatemala', ask: 'Guatemala', risk: 'bajo', st: 'ok' },
    ],
    signers: [{ n: 'Rep. legal Ternova GT', st: 'wait' }, { n: 'Rep. legal TransAndina', st: 'wait' }],
    obligations: [], flags: [],
  },
  {
    id: 'CTR-2026-101', title: 'Adenda de suministro de resina PET', type: 'log', typeTxt: 'Suministro (logístico)',
    cp: 'PetroQuímica del Istmo', jur: 'El Salvador', amount: 68000, term: '12 meses', owner: 'C. Rivas · Compras',
    lawyer: 'J. Barrera', stage: 'apr', next: 'Aprobación de CFO pendiente', nextDue: '19 Ago 2026', tpl: 'Suministro v3',
    steps: { sol: '28 Jul 2026 · C. Rivas', red: '30 Jul 2026 · J. Barrera', neg: '08 Ago 2026 · cerrada en ronda 1', apr: 'En curso · 2 de 3 aprobado' },
    versions: [
      { v: 'v1.0', who: 'J. Barrera', when: '30 Jul', what: 'Adenda sobre CTR-2026-089, ajuste de precio indexado' },
      { v: 'v1.1', who: 'J. Barrera', when: '08 Ago', what: 'Incorpora fórmula de indexación acordada y techo de +8% anual' },
    ],
    dev: [
      { cl: 'Ajuste de precio', std: 'Fijo por 12 meses', ask: 'Indexado con techo +8%', risk: 'medio', st: 'ok' },
      { cl: 'Penalidad por incumplimiento', std: '5% del valor', ask: '5% del valor', risk: 'bajo', st: 'ok' },
    ],
    signers: [{ n: 'Rep. legal Ternova SV', st: 'wait' }, { n: 'Rep. legal PetroQuímica', st: 'wait' }],
    obligations: [], flags: [],
  },
  {
    id: 'CTR-2026-097', title: 'Contrato marco de servicios de TI', type: 'srv', typeTxt: 'Servicios / TI',
    cp: 'Nexus Cloud Solutions', jur: 'México', amount: 92000, term: '36 meses', owner: 'D. Paz · TI',
    lawyer: 'L. Mendoza', stage: 'fir', next: 'Firma de la contraparte', nextDue: '20 Ago 2026', tpl: 'Servicios v4',
    steps: { sol: '02 Jul 2026 · D. Paz', red: '04 Jul 2026 · L. Mendoza', neg: '22 Jul 2026 · cerrada en ronda 3', apr: '05 Ago 2026 · CEO aprobó', fir: 'En curso · 1 de 2 firmas' },
    versions: [
      { v: 'v1.0', who: 'L. Mendoza', when: '04 Jul', what: 'Generada desde plantilla Servicios v4' },
      { v: 'v2.0', who: 'Nexus (contraparte)', when: '14 Jul', what: 'Sustituye anexo de niveles de servicio por su formato estándar' },
      { v: 'v2.1', who: 'L. Mendoza', when: '22 Jul', what: 'Conserva anexo de la contraparte con créditos por incumplimiento de SLA' },
    ],
    dev: [
      { cl: 'Tratamiento de datos personales', std: 'DPA Ternova', ask: 'DPA Ternova firmado', risk: 'bajo', st: 'ok' },
      { cl: 'Niveles de servicio', std: 'Anexo Ternova', ask: 'Anexo del proveedor + créditos', risk: 'medio', st: 'ok' },
    ],
    signers: [{ n: 'Rep. legal Ternova MX', st: 'done' }, { n: 'Rep. legal Nexus Cloud', st: 'wait' }],
    obligations: [], flags: ['nda'],
  },
  {
    id: 'CTR-2026-089', title: 'Contrato de suministro de resina PET', type: 'log', typeTxt: 'Suministro (logístico)',
    cp: 'PetroQuímica del Istmo', jur: 'El Salvador', amount: 240000, term: '24 meses', owner: 'C. Rivas · Compras',
    lawyer: 'J. Barrera', stage: 'vig', next: 'Verificar hito de volumen mínimo Q3', nextDue: '30 Sep 2026', tpl: 'Suministro v3',
    steps: { sol: '10 Feb 2026', red: '14 Feb 2026', neg: '02 Mar 2026 · cerrada', apr: '18 Mar 2026 · Junta aprobó', fir: '25 Mar 2026 · firmado', vig: 'Vigente desde 01 Abr 2026' },
    versions: [{ v: 'v3.0', who: 'J. Barrera', when: '20 Mar', what: 'Versión final suscrita, archivada en el repositorio' }],
    dev: [{ cl: 'Volumen mínimo trimestral', std: '400 TM', ask: '350 TM', risk: 'medio', st: 'ok' }],
    signers: [{ n: 'Rep. legal Ternova SV', st: 'done' }, { n: 'Rep. legal PetroQuímica', st: 'done' }],
    obligations: [
      { t: 'Verificación de volumen mínimo trimestral', who: 'C. Rivas · Compras', when: '30 Sep 2026', st: 'open' },
      { t: 'Revisión anual de precios', who: 'J. Barrera', when: '01 Abr 2027', st: 'open' },
      { t: 'Póliza de responsabilidad vigente de la contraparte', who: 'M. Cruz · Ops Legales', when: '15 Ago 2026', st: 'done' },
    ],
    flags: [],
  },
  {
    id: 'CTR-2025-142', title: 'Arrendamiento de bodega central', type: 'alq', typeTxt: 'Arrendamiento',
    cp: 'Inmobiliaria Valle Real', jur: 'Costa Rica', amount: 186000, term: '36 meses', owner: 'F. León · Planta',
    lawyer: 'L. Mendoza', stage: 'ren', next: 'Decidir renovación o salida', nextDue: '22 Sep 2026', tpl: 'Arrendamiento v2',
    steps: { sol: '05 Nov 2025', red: '08 Nov 2025', neg: '25 Nov 2025 · cerrada', apr: '02 Dic 2025 · CEO aprobó', fir: '15 Dic 2025 · firmado', vig: 'Vigente desde 01 Ene 2026', ren: 'Ventana abierta · vence 22 Dic 2026' },
    versions: [{ v: 'v2.0', who: 'L. Mendoza', when: '12 Dic 2025', what: 'Versión final suscrita' }],
    dev: [{ cl: 'Preaviso de no renovación', std: '90 días', ask: '90 días', risk: 'bajo', st: 'ok' }],
    signers: [{ n: 'Rep. legal Ternova CR', st: 'done' }, { n: 'Rep. legal Valle Real', st: 'done' }],
    obligations: [{ t: 'Notificar decisión de renovación', who: 'F. León · Planta', when: '22 Sep 2026', st: 'open' }],
    flags: [],
  },
];

const CLM_RISK = { alto: 'var(--crl)', medio: 'var(--ctl)', bajo: 'var(--cel)' };
const clmSt = { sel: 'CTR-2026-104', tab: 'flujo', regSel: 'CTR-2025-142', regF: 'all' };

/* Cuadro de contratos suscritos — alertas con la misma regla del calendario
   regulatorio: T-90 al responsable, mensual, semanal en el mes de vencimiento
   y escalamiento a T-10. due: [año, mes(0-11), día] */
const CLM_REG = [
  { id: 'CTR-2025-142', title: 'Arrendamiento de bodega central', type: 'Arrendamiento', cp: 'Inmobiliaria Valle Real', jur: 'Costa Rica', val: 186000, from: '01 Ene 2026', due: [2026, 11, 22], owner: 'F. León · Planta', lawyer: 'L. Mendoza', renew: 'Preaviso 90 días', auto: false },
  { id: 'CTR-2026-091', title: 'NDA marco con proveedor de TI', type: 'Confidencialidad', cp: 'Nexus Cloud Solutions', jur: 'México', val: 0, from: '15 Mar 2026', due: [2026, 8, 15], owner: 'D. Paz · TI', lawyer: 'S. Aguilar', renew: 'Renovación automática 12 meses', auto: true },
  { id: 'CTR-2026-089', title: 'Contrato de suministro de resina PET', type: 'Suministro', cp: 'PetroQuímica del Istmo', jur: 'El Salvador', val: 240000, from: '01 Abr 2026', due: [2028, 2, 31], owner: 'C. Rivas · Compras', lawyer: 'J. Barrera', renew: 'Preaviso 60 días', auto: false },
  { id: 'CTR-2026-076', title: 'Contrato de transporte terrestre regional', type: 'Logístico', cp: 'TransAndina Cargo', jur: 'Guatemala', val: 98000, from: '01 Feb 2026', due: [2026, 9, 31], owner: 'M. Aguilar · Operaciones', lawyer: 'S. Aguilar', renew: 'Preaviso 30 días', auto: false },
  { id: 'CTR-2026-063', title: 'Servicios de auditoría externa 2026', type: 'Servicios', cp: 'Andrade & Asociados', jur: 'Guatemala', val: 54000, from: '01 Ene 2026', due: [2026, 11, 31], owner: 'Finanzas', lawyer: 'L. Mendoza', renew: 'No renovable · nueva licitación', auto: false },
  { id: 'CTR-2025-198', title: 'Licencia de software de planta', type: 'Licencia', cp: 'IndusSoft', jur: 'Vietnam', val: 41000, from: '01 Nov 2025', due: [2026, 10, 15], owner: 'D. Paz · TI', lawyer: 'R. Castro', renew: 'Renovación automática 12 meses', auto: true },
  { id: 'CTR-2026-055', title: 'Distribución exclusiva zona norte', type: 'Distribución', cp: 'Comercial Sofía', jur: 'Honduras', val: 132000, from: '01 Ene 2026', due: [2027, 0, 31], owner: 'Comercial', lawyer: 'J. Barrera', renew: 'Preaviso 90 días', auto: false },
  { id: 'CTR-2026-048', title: 'Póliza de responsabilidad civil corporativa', type: 'Seguro', cp: 'Aseguradora Continental', jur: 'Panamá', val: 76000, from: '01 Mar 2026', due: [2027, 1, 28], owner: 'Finanzas', lawyer: 'M. Cruz', renew: 'Renovación anual negociada', auto: false },
];
const clmMoney = n => '$' + Number(n).toLocaleString('en-US');

/* ───────── BLOQUE PRINCIPAL ───────── */
function clmBlock() {
  const d = CLM_DEALS.find(x => x.id === clmSt.sel) || CLM_DEALS[0];
  const inflight = CLM_DEALS.filter(x => clmIdx(x.stage) < clmIdx('vig')).length;
  const ren = CLM_DEALS.filter(x => x.stage === 'ren').length;
  const devOpen = CLM_DEALS.reduce((a, x) => a + x.dev.filter(v => v.st === 'open').length, 0);
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-route"></i><span>Ciclo de vida completo de cada contrato en una sola vista: de la solicitud a la renovación, con versiones, desviaciones de cláusula, aprobaciones y obligaciones. El expediente vive aquí; el documento vive en SharePoint.</span></div>
    <div class="lkrow" style="margin-bottom:1.1rem">
      <div class="lcard"><div class="lcard-l">En proceso</div><div class="lcard-v">${inflight}</div><div class="lcard-s" style="color:var(--ctl)">Antes de firma</div></div>
      <div class="lcard"><div class="lcard-l">Desviaciones abiertas</div><div class="lcard-v">${devOpen}</div><div class="lcard-s" style="color:var(--crl)">Requieren criterio legal</div></div>
      <div class="lcard"><div class="lcard-l">En ventana de renovación</div><div class="lcard-v">${ren}</div><div class="lcard-s" style="color:var(--ctl)">Decisión a 90 días</div></div>
      <div class="lcard"><div class="lcard-l">Etapas del ciclo</div><div class="lcard-v">${CLM_STAGES.length}</div><div class="lcard-s">Una sola ruta para todos</div></div>
    </div>
    <div class="clm-pipe">${CLM_STAGES.map(clmPipeCol).join('')}</div>
    <div class="clm-ws">${clmWorkspace(d)}</div>
    ${clmRegister()}`;
}

/* ───────── CUADRO DE CONTRATOS + ALERTAS ───────── */
function clmRegister() {
  const rows = CLM_REG.map(c => ({ c, s: rcSchedule({ due: c.due, owner: c.owner }, c.auto ? 120 : RC_RULE.lead) })).sort((a, b) => a.s.due - b.s.due);
  const view = clmSt.regF === 'all' ? rows : clmSt.regF === 'auto' ? rows.filter(x => x.c.auto) : rows.filter(x => x.s.left <= 90);
  const sel = rows.find(x => x.c.id === clmSt.regSel) || rows[0];
  const d90 = rows.filter(x => x.s.left <= 90).length;
  const d30 = rows.filter(x => x.s.left <= 30).length;
  const autoR = rows.filter(x => x.c.auto).length;
  const filters = [['all', 'Todos los contratos'], ['90', 'En ventana de 90 días'], ['auto', 'Renovación automática']];
  return `<div class="sh" style="margin-top:var(--gap)"><h2>Cuadro de contratos y alertas de vencimiento</h2><span>${CLM_REG.length} contratos suscritos · corte al ${rcFmt(RC_TODAY)}</span></div>
    <div class="rc-rule" style="margin-bottom:1.1rem">
      <div class="rc-rule-h"><i class="ti ti-bell-cog"></i><div><strong>Misma regla de avisos del calendario regulatorio</strong><span>Se dispara sobre la fecha de vencimiento o la fecha límite de preaviso, según cuál llegue primero</span></div></div>
      <div class="rc-steps">
        <div class="rc-step"><span class="rc-tag">T-90</span><strong>Aviso inicial</strong><p>El dueño del contrato y el abogado a cargo reciben el aviso con la decisión a tomar: renovar, renegociar o dejar vencer.</p></div>
        <div class="rc-step"><span class="rc-tag">T-90 a T-30</span><strong>Recordatorio mensual</strong><p>Un recordatorio cada 30 días con el estado de la decisión y el valor anual en juego.</p></div>
        <div class="rc-step on"><span class="rc-tag on">Mes de vencimiento</span><strong>Recordatorio semanal</strong><p>La cadencia sube a semanal hasta que se registre la decisión o se suscriba la renovación.</p></div>
        <div class="rc-step"><span class="rc-tag esc">T-10</span><strong>Escalamiento</strong><p>Sin decisión registrada, el aviso copia a la Gerencia Legal y entra al stand-up diario.</p></div>
      </div>
      <div class="rc-chan"><span><i class="ti ti-repeat"></i>Renovación automática: el aviso se emite a T-120 para alcanzar el preaviso</span><span><i class="ti ti-mail"></i>Outlook al dueño + abogado</span><span><i class="ti ti-history"></i>Cada envío queda en bitácora</span></div>
    </div>
    <div class="lkrow" style="margin-bottom:1rem">
      <div class="lcard"><div class="lcard-l">Vencen en ≤ 30 días</div><div class="lcard-v">${d30}</div><div class="lcard-s" style="color:var(--crl)">Cadencia semanal</div></div>
      <div class="lcard"><div class="lcard-l">En ventana de 90 días</div><div class="lcard-v">${d90}</div><div class="lcard-s" style="color:var(--ctl)">Con avisos activos</div></div>
      <div class="lcard"><div class="lcard-l">Renovación automática</div><div class="lcard-v">${autoR}</div><div class="lcard-s">Requieren preaviso para salir</div></div>
    </div>
    <div class="chip-row" style="margin-bottom:.9rem">${filters.map(([k, l]) => `<button class="tri-opt${clmSt.regF === k ? ' on' : ''}" onclick="clmRegF('${k}')">${l}</button>`).join('')}</div>
    <div class="rtable-wrap" style="margin-bottom:1.1rem"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Código</th><th>Contrato</th><th>Contraparte</th><th>Jurisdicción</th><th>Valor</th><th>Vigencia hasta</th><th>Faltan</th><th>Renovación</th><th>Cadencia</th><th>Avisos</th><th>Responsable</th></tr></thead>
      <tbody>${view.map(({ c, s }) => {
        const cad = rcCadence(s);
        return `<tr class="rc-tr${clmSt.regSel === c.id ? ' on' : ''}" onclick="clmRegSel('${c.id}')">
          <td><span class="sc-code">${c.id}</span></td>
          <td style="font-weight:500">${c.title}<div style="font-size:11px;color:var(--mut)">${c.type}</div></td>
          <td>${c.cp}</td>
          <td style="color:var(--mut);white-space:nowrap">${c.jur}</td>
          <td style="white-space:nowrap">${c.val ? clmMoney(c.val) : '—'}</td>
          <td style="white-space:nowrap;font-weight:500">${rcFmt(s.due)}</td>
          <td style="white-space:nowrap;font-weight:600;color:${s.left <= 30 ? 'var(--crl)' : s.left <= 90 ? 'var(--ctl)' : 'var(--mut)'}">${s.left} días</td>
          <td style="font-size:11.5px;color:var(--mut)">${c.auto ? '<span class="clm-auto"><i class="ti ti-repeat"></i>Automática</span>' : c.renew}</td>
          <td><span class="rc-cad" style="--rc:${cad.c}">${cad.l}</span></td>
          <td style="white-space:nowrap"><span class="rc-count">${s.sent}<em>/${s.alerts.length}</em></span></td>
          <td style="white-space:nowrap;font-size:11.5px">${c.owner}<div style="font-size:10.5px;color:var(--mut)">Legal: ${c.lawyer}</div></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div></div>
    <div class="clm-ws">
      <div class="clm-hd" style="margin-bottom:1rem">
        <div><span class="sc-code">${sel.c.id}</span><h3 class="clm-t">Plan de avisos · ${sel.c.title}</h3>
        <div class="clm-meta"><span><i class="ti ti-building"></i>${sel.c.cp}</span><span><i class="ti ti-calendar"></i>${sel.c.from} → ${rcFmt(sel.s.due)}</span><span><i class="ti ti-user"></i>${sel.c.owner}</span><span><i class="ti ti-scale"></i>${sel.c.lawyer}</span><span><i class="ti ti-refresh"></i>${sel.c.renew}</span></div></div>
        <div class="clm-hd-r"><span class="clm-stage"><i class="ti ti-bell-ringing"></i>${sel.s.sent} enviados · ${sel.s.pending} programados</span></div>
      </div>
      <ol class="rc-tl">${sel.s.alerts.map(a => {
        const k = RC_KIND[a.kind];
        return `<li class="rc-ev${a.sent ? ' done' : ''}" style="--rc:${k.c}">
          <span class="rc-dot"><i class="ti ${a.sent ? 'ti-check' : k.i}"></i></span>
          <div class="rc-ev-b"><strong>${k.l}</strong><span>${rcFmt(a.date)} · T-${a.days} · destinatario: ${a.kind === 'escalamiento' ? a.to : sel.c.owner + ' + ' + sel.c.lawyer}</span></div>
          <span class="rc-ev-st">${a.sent ? 'Enviado' : 'Programado'}</span></li>`;
      }).join('')}</ol>
      <div class="clm-acts">
        <button class="mini-btn" onclick="clmAct('Aviso de vencimiento reenviado al responsable','${sel.c.id}')"><i class="ti ti-send"></i>Reenviar aviso ahora</button>
        <button class="mini-btn" onclick="clmAct('Decisión de renovación registrada','${sel.c.id}')"><i class="ti ti-check"></i>Registrar decisión de renovación</button>
        <button class="mini-btn" onclick="clmAct('Contrato agregado al calendario de vencimientos','${sel.c.id}')"><i class="ti ti-calendar-plus"></i>Ver en Alertas SLA</button>
      </div>
    </div>`;
}
function clmRegSel(id) { clmSt.regSel = id; clmRerender(); }
function clmRegF(f) { clmSt.regF = f; clmRerender(); }

function clmPipeCol(s) {
  const items = CLM_DEALS.filter(d => d.stage === s.k);
  return `<div class="clm-col">
    <div class="clm-col-h"><i class="ti ${s.i}"></i><span>${s.n}</span><b>${items.length}</b></div>
    <p class="clm-col-d">${s.d}</p>
    <div class="clm-col-b">${items.map(d => `<button class="clm-mini${d.id === clmSt.sel ? ' on' : ''}" onclick="clmSel('${d.id}')">
      <span class="sc-code">${d.id}</span><strong>${d.title}</strong><span class="clm-mini-m">${d.cp} · ${clmMoney(d.amount)}</span></button>`).join('') || '<div class="clm-empty">Sin contratos</div>'}</div>
  </div>`;
}

function clmWorkspace(d) {
  const i = clmIdx(d.stage);
  const res = typeof calcAuth === 'function' ? calcAuth(d.type, d.amount, new Set(d.flags)) : null;
  return `<div class="clm-hd">
      <div>
        <span class="sc-code">${d.id}</span>
        <h3 class="clm-t">${d.title}</h3>
        <div class="clm-meta"><span><i class="ti ti-building"></i>${d.cp}</span><span><i class="ti ti-map-pin"></i>${d.jur}</span><span><i class="ti ti-cash"></i>${clmMoney(d.amount)}</span><span><i class="ti ti-clock"></i>${d.term}</span><span><i class="ti ti-file-description"></i>${d.tpl}</span></div>
      </div>
      <div class="clm-hd-r">
        <span class="clm-stage"><i class="ti ${CLM_STAGES[i].i}"></i>${CLM_STAGES[i].n}</span>
        <div class="clm-next"><i class="ti ti-target-arrow"></i><div><strong>${d.next}</strong><span>Fecha objetivo: ${d.nextDue}</span></div></div>
      </div>
    </div>
    <div class="clm-track">${CLM_STAGES.map((s, k) => {
      const state = k < i ? 'done' : k === i ? 'now' : '';
      return `<div class="clm-tk ${state}"><span class="clm-tk-d"><i class="ti ${k < i ? 'ti-check' : s.i}"></i></span><strong>${s.n}</strong><span>${d.steps[s.k] || '—'}</span></div>`;
    }).join('')}</div>
    <div class="clm-tabs">${[['flujo', 'Versiones y negociación', 'ti-git-branch'], ['aprob', 'Aprobaciones y firma', 'ti-checkbox'], ['oblig', 'Obligaciones y renovación', 'ti-list-check']].map(([k, l, ic]) =>
      `<button class="clm-tab${clmSt.tab === k ? ' on' : ''}" onclick="clmTab('${k}')"><i class="ti ${ic}"></i>${l}</button>`).join('')}</div>
    <div class="clm-panel">${clmSt.tab === 'flujo' ? clmFlow(d) : clmSt.tab === 'aprob' ? clmApprovals(d, res) : clmOblig(d)}</div>
    <div class="clm-acts">
      ${can('assign') || can('docEdit')
      ? `<button class="mini-btn primary" onclick="clmAdvance('${d.id}')"><i class="ti ti-arrow-right"></i>Avanzar a ${CLM_STAGES[Math.min(i + 1, CLM_STAGES.length - 1)].n}</button>
         <button class="mini-btn" onclick="clmAct('Nueva versión cargada al expediente','${d.id}')"><i class="ti ti-upload"></i>Cargar versión</button>
         <button class="mini-btn" onclick="clmAct('Contrato enviado a firma electrónica','${d.id}')"><i class="ti ti-signature"></i>Enviar a firma</button>`
      : `<button class="mini-btn" onclick="clmAct('Estado del contrato consultado','${d.id}')"><i class="ti ti-bell"></i>Avisarme al cambiar de etapa</button>`}
      <button class="mini-btn" onclick="clmAct('Expediente abierto en SharePoint','${d.id}')"><i class="ti ti-folder-open"></i>Abrir documento en SharePoint</button>
    </div>`;
}

function clmFlow(d) {
  return `<div class="clm-two">
    <div>
      <div class="rc-lbl">Historial de versiones <em>${d.versions.length} versiones</em></div>
      <ol class="rc-tl">${d.versions.map((v, k) => `<li class="rc-ev done" style="--rc:${k === d.versions.length - 1 ? 'var(--brand)' : 'var(--ce)'}">
        <span class="rc-dot"><i class="ti ti-file-diff"></i></span>
        <div class="rc-ev-b"><strong>${v.v} · ${v.who}</strong><span>${v.what}</span></div>
        <span class="rc-ev-st">${v.when}</span></li>`).join('')}</ol>
    </div>
    <div>
      <div class="rc-lbl">Desviaciones frente a la plantilla <em>${d.dev.filter(x => x.st === 'open').length} abiertas</em></div>
      <div class="clm-dev">${d.dev.map(v => `<div class="clm-dv" style="--rk:${CLM_RISK[v.risk]}">
        <div class="clm-dv-h"><strong>${v.cl}</strong><span class="clm-rk">Riesgo ${v.risk}</span></div>
        <div class="clm-dv-b"><span><em>Plantilla</em>${v.std}</span><i class="ti ti-arrow-right"></i><span><em>Contraparte pide</em>${v.ask}</span></div>
        <span class="stpill ${v.st === 'open' ? 's-urg' : 's-done'}"><i class="ti ${v.st === 'open' ? 'ti-alert-triangle' : 'ti-circle-check'}"></i>${v.st === 'open' ? 'En negociación' : 'Acordada'}</span>
      </div>`).join('')}</div>
    </div>
  </div>`;
}

function clmApprovals(d, res) {
  const steps = res ? res.steps : [];
  const done = clmIdx(d.stage) > clmIdx('apr');
  const cut = d.stage === 'apr' ? steps.length - 1 : done ? steps.length : 0;
  const sevCls = { crit: 'crit', warn: 'warn', info: 'info' };
  return `<div class="clm-two">
    <div>
      <div class="rc-lbl">Cadena de aprobación <em>${res ? res.type.name.split(',')[0] : ''} · ${clmMoney(d.amount)} · autoridad final ${res ? res.final.code : '—'}</em></div>
      <ol class="rc-tl">${steps.map((s, k) => {
        const ok = k < cut;
        return `<li class="rc-ev${ok ? ' done' : ''}" style="--rc:var(--ct)">
          <span class="rc-dot"><i class="ti ${ok ? 'ti-check' : s.icon}"></i></span>
          <div class="rc-ev-b"><strong>${s.who}${s.code ? ' · ' + s.code : ''}</strong><span>${s.act}</span></div>
          <span class="rc-ev-st">${ok ? 'Completado' : 'Pendiente'}</span></li>`;
      }).join('')}</ol>
      ${res && res.alerts.length ? res.alerts.map(a => `<div class="clm-alert ${sevCls[a.sev] || 'info'}"><i class="ti ti-alert-triangle"></i><span>${a.txt}</span></div>`).join('') : ''}
    </div>
    <div>
      <div class="rc-lbl">Firma electrónica <em>${d.signers.filter(s => s.st === 'done').length} de ${d.signers.length}</em></div>
      <div class="clm-sign">${d.signers.map(s => `<div class="clm-sg${s.st === 'done' ? ' done' : ''}"><i class="ti ${s.st === 'done' ? 'ti-circle-check' : 'ti-clock'}"></i><strong>${s.n}</strong><span>${s.st === 'done' ? 'Firmado' : 'Pendiente'}</span></div>`).join('')}</div>
      <div class="rc-lbl" style="margin-top:1.1rem">Responsables del expediente</div>
      <div class="rc-kv"><span>Solicitante</span><b>${d.owner}</b></div>
      <div class="rc-kv"><span>Abogado a cargo</span><b>${d.lawyer}</b></div>
      <div class="rc-kv"><span>Plantilla base</span><b>${d.tpl}</b></div>
      <div class="rc-kv"><span>Jurisdicción</span><b>${d.jur}</b></div>
    </div>
  </div>`;
}

function clmOblig(d) {
  const ob = d.obligations;
  return `<div class="clm-two">
    <div>
      <div class="rc-lbl">Obligaciones posteriores a la firma <em>${ob.filter(o => o.st === 'open').length} abiertas</em></div>
      ${ob.length ? `<div class="clm-obs">${ob.map(o => `<div class="clm-ob${o.st === 'done' ? ' done' : ''}">
        <i class="ti ${o.st === 'done' ? 'ti-circle-check' : 'ti-circle'}"></i>
        <div><strong>${o.t}</strong><span>${o.who}</span></div>
        <span class="clm-ob-d">${o.when}</span></div>`).join('')}</div>`
      : '<div class="clm-note"><i class="ti ti-info-circle"></i>Las obligaciones se activan al firmar. Este contrato aún no llega a vigencia.</div>'}
    </div>
    <div>
      <div class="rc-lbl">Renovación y salida</div>
      <div class="clm-ren">
        <div class="rc-kv"><span>Plazo</span><b>${d.term}</b></div>
        <div class="rc-kv"><span>Preaviso de no renovación</span><b>90 días</b></div>
        <div class="rc-kv"><span>Decisión objetivo</span><b>${d.stage === 'ren' ? d.nextDue : 'Se fija al firmar'}</b></div>
        <div class="clm-note" style="margin-top:.8rem"><i class="ti ti-bell-ringing"></i>La fecha de vencimiento entra al <strong>calendario regulatorio</strong> con la misma regla de avisos: T-90 al responsable, mensual, y semanal en el mes del vencimiento.</div>
      </div>
    </div>
  </div>`;
}

/* ───────── ACCIONES ───────── */
function clmRerender() {
  const p = $('#tabHost .tabpanel');
  if (p) p.innerHTML = clmBlock();
}
function clmSel(id) { clmSt.sel = id; clmRerender(); }
function clmTab(t) { clmSt.tab = t; clmRerender(); }
function clmAdvance(id) {
  const d = CLM_DEALS.find(x => x.id === id);
  const i = clmIdx(d.stage);
  if (i >= CLM_STAGES.length - 1) return toast(`${d.id} ya está en la última etapa del ciclo`);
  const nx = CLM_STAGES[i + 1];
  d.stage = nx.k;
  d.steps[nx.k] = 'En curso · movido hoy';
  d.next = `Trabajo de la etapa ${nx.n}`;
  clmRerender();
  toast(`${d.id} avanzó a ${nx.n}`);
  logAudit(`${d.id} avanzó a la etapa ${nx.n} del ciclo contractual`, 'var(--ct)');
}
function clmAct(msg, id) { toast(`${id} — ${msg}`); logAudit(`${msg} (${id})`, 'var(--ct)'); }
