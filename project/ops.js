/* ===========================================================================
   OPS — Cadencia de reuniones (daily / weekly / monthly) y Presupuesto legal
   Cadencia: todo el equipo legal · Presupuesto: Gerente legal y Admin
   =========================================================================== */
'use strict';

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const RIT = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
const ritColor = (k) => (CADENCE.find(c => c.key === k) || {}).color || 'var(--brand)';

/* ───────── BRIEF DEL DAILY (Gerente legal) ───────── */
const briefDone = new Set();
const SLA_DOT = { crit: 'crit', warn: 'warn', ok: 'ok' };

function briefTotals() {
  const all = [...DAILY_BRIEF.mine.map(m => m.id), ...DAILY_BRIEF.team.flatMap(t => t.items.map(i => i.id))];
  return { total: all.length, done: all.filter(id => briefDone.has(id)).length };
}

function dailyBrief() {
  const b = DAILY_BRIEF, t = briefTotals();
  const pct = Math.round(t.done / t.total * 100);
  const mineRows = b.mine.map(m => `<div class="bf-item${briefDone.has(m.id) ? ' done' : ''}" onclick="toggleBrief('${m.id}')">
      <span class="bf-box"><i class="ti ti-check"></i></span>
      <div class="bf-txt">${m.txt}<span class="bf-type">${m.type}</span></div>
      <span class="ar-sla ${m.sla}">${m.due}</span>
    </div>`).join('');
  const teamBlocks = b.team.map(p => {
    const open = p.items.filter(i => !briefDone.has(i.id)).length;
    return `<div class="bf-person">
      <div class="bf-ph"><span class="bf-av">${p.who.replace('. ', '')[0] + p.who.split(' ').pop()[0]}</span>
        <div><div class="bf-who">${p.who}</div><div class="bf-load">${p.load}</div></div>
        <span class="bf-open">${open === 0 ? 'Al día' : open + ' por cerrar hoy'}</span></div>
      ${p.items.map(i => `<div class="bf-item${briefDone.has(i.id) ? ' done' : ''}" onclick="toggleBrief('${i.id}')">
        <span class="bf-box"><i class="ti ti-check"></i></span>
        <div class="bf-txt">${i.txt}${i.blocked ? `<span class="bf-block"><i class="ti ti-hand-stop"></i>${i.blocked}</span>` : ''}</div>
        <span class="ar-sla ${i.sla}">${i.due}</span>
      </div>`).join('')}
    </div>`;
  }).join('');

  return `<section class="bf-wrap">
    <div class="bf-hdr">
      <div>
        <div class="bf-kicker"><i class="ti ti-sun-high"></i>Brief del daily · ${b.hora}</div>
        <h2 class="bf-title">${b.date}</h2>
        <p class="bf-sub">Todo lo que debe quedar cerrado hoy, tuyo y de tu equipo. Úsalo como guion del stand-up: ${b.prep}.</p>
      </div>
      <div class="bf-prog">
        <div class="bf-prog-v">${t.done}<span>/ ${t.total}</span></div>
        <div class="bf-prog-l">pendientes cerrados</div>
        <div class="bf-prog-track"><i style="width:${pct}%"></i></div>
        <button class="mini-btn" onclick="copyBrief()"><i class="ti ti-copy"></i>Copiar guion del daily</button>
      </div>
    </div>
    <div class="bf-cols">
      <div class="bf-col">
        <div class="bf-lbl"><i class="ti ti-user-check"></i>Mis pendientes de hoy<span>${DAILY_BRIEF.mine.filter(m => !briefDone.has(m.id)).length} abiertos</span></div>
        ${mineRows}
      </div>
      <div class="bf-col">
        <div class="bf-lbl"><i class="ti ti-users-group"></i>Pendientes del equipo<span>${b.team.length} abogados</span></div>
        ${teamBlocks}
      </div>
    </div>
    <div class="bf-focus">
      <div class="bf-lbl"><i class="ti ti-target-arrow"></i>Puntos obligados del stand-up</div>
      <div class="bf-focus-grid">${b.focus.map((f, i) => `<div class="bf-f"><span>${i + 1}</span>${f}</div>`).join('')}</div>
    </div>
  </section>`;
}

function toggleBrief(id) {
  briefDone.has(id) ? briefDone.delete(id) : briefDone.add(id);
  const t = briefTotals();
  renderCadence();
  if (t.done === t.total) toast('Brief del daily completo · todos los pendientes de hoy cerrados');
}

function copyBrief() {
  const b = DAILY_BRIEF;
  const txt = [`BRIEF DEL DAILY — ${b.date} (${b.hora})`, '', 'MIS PENDIENTES:',
    ...b.mine.map(m => `- [${briefDone.has(m.id) ? 'x' : ' '}] ${m.txt} (${m.due})`), '', 'EQUIPO:',
    ...b.team.flatMap(p => [`${p.who} — ${p.load}`, ...p.items.map(i => `  - [${briefDone.has(i.id) ? 'x' : ' '}] ${i.txt} (${i.due})${i.blocked ? ' · BLOQUEO: ' + i.blocked : ''}`)]),
    '', 'PUNTOS OBLIGADOS:', ...b.focus.map(f => '- ' + f)].join('\n');
  if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {});
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} generó el guion del daily del ${b.date}`, 'var(--ce)');
  toast('Guion del daily copiado al portapapeles');
}

/* ───────── CADENCIA DE REUNIONES ───────── */
const cadSt = { open: 'daily' };

function renderCadence() {
  const host = $('#v-cadence');
  const open = cadSt.open;
  const cards = CADENCE.map(c => {
    const on = c.key === open;
    return `<article class="cad-card${on ? ' on' : ''}" style="--cad:${c.color}" onclick="openCadence('${c.key}')">
      <div class="cad-top">
        <span class="cad-ic"><i class="ti ${c.icon}"></i></span>
        <span class="cad-badge">${c.badge}</span>
      </div>
      <h3 class="cad-name">${c.name}</h3>
      <div class="cad-when"><i class="ti ti-clock-hour-4"></i>${c.when}</div>
      <p class="cad-purpose">${c.purpose}</p>
      <div class="cad-foot">
        <span class="cad-avs">${c.who.map(w => `<span class="cad-av" title="${w}">${w.replace('. ', '')[0] + w.split(' ').pop()[0]}</span>`).join('')}</span>
        <span class="cad-dur">${c.dur} · ${c.mode}</span>
      </div>
    </article>`;
  }).join('');

  const c = CADENCE.find(x => x.key === open);
  const detail = `<div class="cad-detail" style="--cad:${c.color}">
    <div class="cad-dh">
      <div>
        <div class="cad-dh-badge"><i class="ti ${c.icon}"></i>${c.badge} · ${c.dur}</div>
        <h3>${c.name}</h3>
        <div class="cad-dh-meta"><span><i class="ti ti-user-star"></i>${c.lead}</span><span><i class="ti ti-device-laptop"></i>${c.mode}</span><span><i class="ti ti-clock-hour-4"></i>${c.when}</span></div>
      </div>
      <button class="mini-btn" onclick="toast('Invitación de Outlook enviada a ${c.who.length} participantes')"><i class="ti ti-calendar-plus"></i>Agendar en Outlook</button>
    </div>
    <div class="cad-cols">
      <div>
        <div class="cad-lbl">Agenda con tiempos</div>
        <div class="cad-agenda">${c.agenda.map(a => `<div class="cad-ag"><span class="cad-ag-t">${a.t}</span><span>${a.x}</span></div>`).join('')}</div>
      </div>
      <div>
        <div class="cad-lbl">Resultados esperados</div>
        <div class="cad-outs">${c.outputs.map(o => `<div class="cad-out"><i class="ti ti-circle-check"></i>${o}</div>`).join('')}</div>
        <div class="cad-lbl" style="margin-top:1.1rem">Participantes</div>
        <div class="chip-row">${c.who.map(w => `<span class="cfg-chip on"><i class="ti ti-user"></i>${w}</span>`).join('')}</div>
        <div class="cad-rule"><i class="ti ti-flag"></i>${c.rule}</div>
      </div>
    </div>
  </div>`;

  const nextRows = CADENCE_NEXT.map(n => {
    const s = CAD_ST[n.st];
    return `<tr>
      <td style="font-weight:600;white-space:nowrap">${n.date}</td>
      <td><span class="rit-chip" style="--cad:${ritColor(n.rit)}">${RIT[n.rit]}</span></td>
      <td>${n.topic}</td>
      <td style="color:var(--mut);white-space:nowrap">${n.lead}</td>
      <td><span class="stpill ${s.cls}"><i class="ti ${s.icon}"></i>${s.txt}</span></td>
    </tr>`;
  }).join('');

  const pastRows = CADENCE_PAST.map(p => `<tr>
      <td style="font-weight:600;white-space:nowrap">${p.date}</td>
      <td><span class="rit-chip" style="--cad:${ritColor(p.rit)}">${RIT[p.rit]}</span></td>
      <td>${p.topic}</td>
      <td style="color:var(--mut)">${p.mins}</td>
      <td><button class="mini-btn" onclick="toast('Abriendo ${p.mins}')"><i class="ti ti-file-text"></i>Ver minuta</button></td>
    </tr>`).join('');

  const abierto = COMMITMENTS.filter(x => x.st !== 'cumplido').length;
  const riesgo = COMMITMENTS.filter(x => x.st === 'riesgo').length;
  const comRows = COMMITMENTS.map(x => {
    const s = COM_ST[x.st];
    return `<tr class="${x.st === 'cumplido' ? 'row-muted' : ''}">
      <td><span class="sc-code">${x.id}</span></td>
      <td style="font-weight:500">${x.txt}</td>
      <td><span class="rit-chip" style="--cad:${ritColor(x.rit)}">${RIT[x.rit]}</span></td>
      <td style="white-space:nowrap">${x.who}</td>
      <td style="color:var(--mut);white-space:nowrap">${x.due}</td>
      <td><span class="stpill ${s.cls}"><i class="ti ${s.icon}"></i>${s.txt}</span></td>
      <td>${x.st === 'cumplido' ? '<span style="color:var(--mut);font-size:12px">—</span>' : `<button class="mini-btn" onclick="closeCommitment('${x.id}')"><i class="ti ti-check"></i>Marcar cumplido</button>`}</td>
    </tr>`;
  }).join('');

  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <h1 class="ptitle">Cadencia de <em>reuniones</em></h1>
      <p class="psub">Los tres rituales que sostienen la operación legal: el daily sincroniza, el weekly rebalancea y el monthly rinde cuentas. Cada uno con agenda, resultados esperados y acuerdos rastreables.</p>
    </div>
    ${state.role === 'mgr' ? dailyBrief() : ''}
    <div class="info-banner" style="margin-bottom:1.25rem"><i class="ti ti-repeat"></i>Selecciona un ritual para ver su agenda con tiempos, participantes y reglas de operación. Las sesiones se sincronizan con Outlook y Teams.</div>
    <div class="cad-grid">${cards}</div>
    ${detail}
    <div class="sh" style="margin-top:var(--gap)"><h2>Próximas sesiones</h2><span>Agenda de los próximos 14 días</span></div>
    <div class="rtable-wrap" style="margin-bottom:var(--gap)"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Fecha y hora</th><th>Ritual</th><th>Tema principal</th><th>Conduce</th><th>Estado</th></tr></thead>
      <tbody>${nextRows}</tbody>
    </table></div></div>
    <div class="sh"><h2>Acuerdos y compromisos</h2><span>${abierto} abiertos${riesgo ? ` · ${riesgo} en riesgo` : ''}</span></div>
    ${riesgo ? `<div class="alert-banner" style="margin-bottom:1rem"><i class="ti ti-alert-triangle"></i>${riesgo === 1 ? 'Un compromiso está en riesgo de incumplimiento' : `${riesgo} compromisos están en riesgo de incumplimiento`}. Revísalo en el próximo daily.</div>` : ''}
    <div class="rtable-wrap" style="margin-bottom:var(--gap)"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Acuerdo</th><th>Compromiso</th><th>Origen</th><th>Responsable</th><th>Vence</th><th>Estado</th><th></th></tr></thead>
      <tbody>${comRows}</tbody>
    </table></div></div>
    <div class="sh"><h2>Sesiones realizadas</h2><span>Minutas y actas disponibles</span></div>
    <div class="rtable-wrap"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Fecha</th><th>Ritual</th><th>Tema</th><th>Registro</th><th></th></tr></thead>
      <tbody>${pastRows}</tbody>
    </table></div></div>`;
}

function openCadence(key) { cadSt.open = key; renderCadence(); }

function closeCommitment(id) {
  const c = COMMITMENTS.find(x => x.id === id);
  if (!c) return;
  c.st = 'cumplido';
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} marcó cumplido el acuerdo ${id}`, ritColor(c.rit));
  renderCadence();
  toast(`${id} marcado como cumplido`);
}

/* ───────── PRESUPUESTO LEGAL ───────── */
function budgetTotals() {
  const exec = BUDGET.rubros.reduce((s, r) => s + r.exec, 0);
  const commit = BUDGET.rubros.reduce((s, r) => s + r.commit, 0);
  return { exec, commit, avail: BUDGET.total - exec - commit, pct: Math.round(exec / BUDGET.total * 100) };
}

const budgetSt = { tab: 'op' };

function prjTotals() {
  const plan = PROJECTS.reduce((s, p) => s + p.budget.plan, 0);
  const used = PROJECTS.reduce((s, p) => s + p.budget.used, 0);
  return { plan, used, avail: plan - used, pct: Math.round(used / plan * 100) };
}

function renderBudget(tab) {
  const t = budgetTotals(), p = prjTotals();
  budgetSt.tab = tab || budgetSt.tab;
  const host = $('#v-budget');
  const totalAll = BUDGET.total + p.plan;
  const execAll = t.exec + p.used;
  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <h1 class="ptitle">Presupuesto <em>legal ${BUDGET.year}</em></h1>
      <p class="psub">El presupuesto del área se gestiona en dos bolsas independientes: la <strong>operación</strong> recurrente del servicio legal y el <strong>portafolio de proyectos estratégicos</strong> bajo LPM. Cada una con su propia ejecución, solicitudes y aprobaciones.</p>
    </div>
    <div class="bg-split">
      <button class="bg-sp${budgetSt.tab === 'op' ? ' on' : ''}" style="--sp:var(--brand-2)" onclick="switchBudget('op')">
        <span class="bg-sp-l"><i class="ti ti-building-community"></i>Presupuesto de operación</span>
        <span class="bg-sp-v">${money(BUDGET.total)}</span>
        <span class="bg-sp-s">${t.pct}% ejecutado · ${money(t.avail)} disponible</span>
        <span class="bg-sp-bar"><i style="width:${t.pct}%"></i></span>
      </button>
      <button class="bg-sp${budgetSt.tab === 'prj' ? ' on' : ''}" style="--sp:var(--ce)" onclick="switchBudget('prj')">
        <span class="bg-sp-l"><i class="ti ti-target-arrow"></i>Presupuesto de proyectos estratégicos</span>
        <span class="bg-sp-v">${money(p.plan)}</span>
        <span class="bg-sp-s">${p.pct}% ejecutado · ${PROJECTS.length} proyectos</span>
        <span class="bg-sp-bar"><i style="width:${p.pct}%"></i></span>
      </button>
    </div>
    <div class="bg-total"><i class="ti ti-sum"></i><span>Total del área legal <strong>${money(totalAll)}</strong> · ejecutado <strong>${money(execAll)}</strong> (${Math.round(execAll / totalAll * 100)}%)</span></div>
    <div id="bgHost">${budgetSt.tab === 'op' ? budgetOpBlock() : budgetPrjBlock()}</div>`;
}
function switchBudget(tab) { budgetSt.tab = tab; renderBudget(tab); }

function budgetOpBlock() {
  const t = budgetTotals();
  const desvio = t.pct - BUDGET.pace;
  const maxMonth = Math.max(...BUDGET.months.map(m => Math.max(m.plan, m.real || 0)));

  const rubroRows = BUDGET.rubros.map(r => {
    const pct = Math.round(r.exec / r.plan * 100);
    const cpct = Math.round((r.exec + r.commit) / r.plan * 100);
    const st = cpct > 95 ? 'crit' : pct > BUDGET.pace + 8 ? 'warn' : 'ok';
    const stMeta = { ok: { txt: 'En línea', cls: 's-done', icon: 'ti-circle-check' }, warn: { txt: 'Sobre ritmo', cls: 's-rev', icon: 'ti-trending-up' }, crit: { txt: 'Riesgo de sobregiro', cls: 's-urg', icon: 'ti-alert-triangle' } }[st];
    return `<tr>
      <td><span class="sc-code">${r.code}</span></td>
      <td style="font-weight:600">${r.name}<div style="font-size:11.5px;color:var(--mut);font-weight:400;margin-top:2px">Responsable: ${r.owner}</div></td>
      <td style="white-space:nowrap;font-family:var(--mono)">${money(r.plan)}</td>
      <td style="white-space:nowrap;font-family:var(--mono)">${money(r.exec)}</td>
      <td style="white-space:nowrap;font-family:var(--mono);color:var(--mut)">${money(r.commit)}</td>
      <td style="white-space:nowrap;font-family:var(--mono);font-weight:600">${money(r.plan - r.exec - r.commit)}</td>
      <td style="min-width:170px">
        <div class="bg-track"><i class="bg-exec" style="width:${Math.min(pct, 100)}%;background:${r.color}"></i><i class="bg-com" style="left:${Math.min(pct, 100)}%;width:${Math.min(cpct - pct, 100 - pct)}%"></i><span class="bg-pace" style="left:${BUDGET.pace}%"></span></div>
        <div class="bg-track-l">${pct}% ejecutado</div>
      </td>
      <td><span class="stpill ${stMeta.cls}"><i class="ti ${stMeta.icon}"></i>${stMeta.txt}</span></td>
    </tr>`;
  }).join('');

  const movRows = BUDGET_MOVES.map(m => {
    const s = MOV_ST[m.st];
    const r = BUDGET.rubros.find(x => x.code === m.rubro);
    return `<tr>
      <td><span class="sc-code">${m.id}</span></td>
      <td style="color:var(--mut);white-space:nowrap">${m.date}</td>
      <td style="font-weight:500">${m.concept}<div style="font-size:11.5px;color:var(--mut);margin-top:2px">${m.prov}</div></td>
      <td><span class="rit-chip" style="--cad:${r ? r.color : 'var(--brand)'}">${m.rubro}</span></td>
      <td style="white-space:nowrap;font-family:var(--mono);font-weight:600">${money(m.amount)}</td>
      <td><span class="stpill ${s.cls}"><i class="ti ${s.icon}"></i>${s.txt}</span></td>
    </tr>`;
  }).join('');

  const canApprove = can('budgetApprove');
  const reqCards = BUDGET_REQS.length ? BUDGET_REQS.map(q => {
    const r = BUDGET.rubros.find(x => x.code === q.rubro);
    const avail = r ? r.plan - r.exec - r.commit : 0;
    const fits = avail >= q.amount;
    return `<div class="arow">
      <div class="ar-info">
        <div class="ar-code">${q.id} · ${q.date}</div>
        <div class="ar-name">${q.concept}</div>
        <div class="ar-who">De: ${q.from} · Rubro ${q.rubro}${r ? ' · ' + r.name : ''}</div>
      </div>
      <span class="bg-amt">${money(q.amount)}</span>
      <span class="ar-sla ${fits ? 'ok' : 'crit'}">${fits ? 'Cabe en el rubro' : 'Excede disponible'}</span>
      ${canApprove ? `<div class="queue-acts">
        <button class="mini-btn primary" onclick="approveBudgetReq('${q.id}')"><i class="ti ti-check"></i>Aprobar</button>
        <button class="q-del" onclick="rejectBudgetReq('${q.id}')"><i class="ti ti-x"></i>Rechazar</button>
      </div>` : `<span class="queue-ro"><i class="ti ti-lock"></i>Solo lectura</span>`}
    </div>`;
  }).join('') : `<div class="empty"><i class="ti ti-checks"></i>No hay solicitudes de presupuesto pendientes.</div>`;

  return `
    <div class="lkrow">
      <div class="lcard"><div class="lcard-l">Presupuesto anual de operación</div><div class="lcard-v">${money(BUDGET.total)}</div><div class="lcard-s" style="color:var(--mut)">${BUDGET.cur} · aprobado por la Junta</div></div>
      <div class="lcard"><div class="lcard-l">Ejecutado</div><div class="lcard-v">${money(t.exec)}</div><div class="lcard-s" style="color:${desvio > 5 ? 'var(--ctl)' : 'var(--cel)'}">${t.pct}% del anual · ${desvio > 0 ? '+' : ''}${desvio} pts vs. ritmo</div></div>
      <div class="lcard"><div class="lcard-l">Comprometido</div><div class="lcard-v">${money(t.commit)}</div><div class="lcard-s" style="color:var(--ctl)">Órdenes en firme</div></div>
      <div class="lcard"><div class="lcard-l">Disponible</div><div class="lcard-v">${money(t.avail)}</div><div class="lcard-s" style="color:var(--cel)">Para el resto del año</div></div>
      <div class="lcard"><div class="lcard-l">Solicitudes pendientes</div><div class="lcard-v">${BUDGET_REQS.length}</div><div class="lcard-s" style="color:var(--ctl)">${money(BUDGET_REQS.reduce((s, q) => s + q.amount, 0))} en revisión</div></div>
    </div>

    <div class="bg-hero">
      <div class="bg-hero-h">
        <div><div class="bg-hero-l">Ejecución acumulada del año</div><div class="bg-hero-v">${t.pct}%<span>de ${money(BUDGET.total)}</span></div></div>
        <button class="mini-btn primary" onclick="openMoveModal()"><i class="ti ti-plus"></i>Registrar movimiento</button>
      </div>
      <div class="bg-big"><i class="bg-exec" style="width:${t.pct}%"></i><i class="bg-com" style="left:${t.pct}%;width:${Math.round(t.commit / BUDGET.total * 100)}%"></i><span class="bg-pace" style="left:${BUDGET.pace}%"><b>Ritmo ${BUDGET.pace}%</b></span></div>
      <div class="bg-leg">
        <span><i class="bg-k exec"></i>Ejecutado ${money(t.exec)}</span>
        <span><i class="bg-k com"></i>Comprometido ${money(t.commit)}</span>
        <span><i class="bg-k av"></i>Disponible ${money(t.avail)}</span>
        <span class="bg-note">${desvio > 5 ? `Ejecución ${desvio} puntos por encima del ritmo del año — revisar en el monthly.` : 'Ejecución alineada al ritmo del año.'}</span>
      </div>
    </div>

    <div class="chart-card" style="margin-bottom:var(--gap)">
      <div class="chart-h"><h3>Presupuestado vs. ejecutado por mes</h3><span>${BUDGET.year}</span></div>
      <div class="vbars bg-months">
        ${BUDGET.months.map(m => `<div class="vbar">
          <div class="vbar-track bg-pair">
            <i class="bg-b plan" style="height:${Math.round(m.plan / maxMonth * 100)}%" title="Plan ${money(m.plan)}"></i>
            <i class="bg-b real" style="height:${m.real ? Math.round(m.real / maxMonth * 100) : 0}%" title="${m.real ? 'Real ' + money(m.real) : 'Sin ejecutar'}"></i>
          </div>
          <div class="vbar-l">${m.m}</div>
        </div>`).join('')}
      </div>
      <div class="bg-leg" style="margin-top:1rem"><span><i class="bg-k plan"></i>Presupuestado</span><span><i class="bg-k real"></i>Ejecutado real</span></div>
    </div>

    <div class="sh"><h2>Ejecución por rubro</h2><span>La marca vertical indica el ritmo esperado del año (${BUDGET.pace}%)</span></div>
    <div class="rtable-wrap" style="margin-bottom:var(--gap)"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Rubro</th><th>Concepto</th><th>Presupuesto</th><th>Ejecutado</th><th>Comprometido</th><th>Disponible</th><th>Avance</th><th>Estado</th></tr></thead>
      <tbody>${rubroRows}</tbody>
    </table></div></div>

    <div class="sh"><h2>Solicitudes de presupuesto</h2><span>${canApprove ? 'Aprueba o rechaza el gasto solicitado por el equipo' : 'Pendientes de aprobación del Gerente legal'}</span></div>
    <div style="margin-bottom:var(--gap)">${reqCards}</div>

    <div class="sh"><h2>Movimientos recientes</h2><span>${BUDGET_MOVES.length} registrados</span></div>
    <div class="rtable-wrap"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Folio</th><th>Fecha</th><th>Concepto</th><th>Rubro</th><th>Monto</th><th>Estado</th></tr></thead>
      <tbody>${movRows}</tbody>
    </table></div></div>`;
}

/* ── Presupuesto de PROYECTOS ESTRATÉGICOS ── */
function budgetPrjBlock() {
  const p = prjTotals();
  const canApprove = can('budgetApprove');
  const rows = PROJECTS.map(x => {
    const s = stageOf(x.stage);
    const pct = Math.round(x.budget.used / x.budget.plan * 100);
    const gap = pct - x.progress;
    const st = pct > 95 ? { txt: 'Riesgo de sobregiro', cls: 's-urg', icon: 'ti-alert-triangle' }
      : gap > 15 ? { txt: 'Gasto sobre avance', cls: 's-rev', icon: 'ti-trending-up' }
      : { txt: 'En línea', cls: 's-done', icon: 'ti-circle-check' };
    return `<tr onclick="openProject('${x.id}')" style="cursor:pointer">
      <td><span class="sc-code">${x.id}</span></td>
      <td style="font-weight:600">${x.name}<div style="font-size:11.5px;color:var(--mut);font-weight:400;margin-top:2px">Líder: ${x.lead} · Sponsor: ${x.sponsor}</div></td>
      <td><span class="rit-chip" style="--cad:${s.color}">${s.short}</span></td>
      <td style="white-space:nowrap;font-family:var(--mono)">${money(x.budget.plan)}</td>
      <td style="white-space:nowrap;font-family:var(--mono)">${money(x.budget.used)}</td>
      <td style="white-space:nowrap;font-family:var(--mono);font-weight:600">${money(x.budget.plan - x.budget.used)}</td>
      <td style="min-width:170px">
        <div class="bg-track"><i class="bg-exec" style="width:${Math.min(pct, 100)}%;background:${s.color}"></i><span class="bg-pace" style="left:${x.progress}%"></span></div>
        <div class="bg-track-l">${pct}% gastado · ${x.progress}% avance</div>
      </td>
      <td><span class="stpill ${st.cls}"><i class="ti ${st.icon}"></i>${st.txt}</span></td>
    </tr>`;
  }).join('');

  const movRows = PRJ_MOVES.map(m => {
    const s = MOV_ST[m.st], x = PROJECTS.find(y => y.id === m.prj);
    return `<tr>
      <td><span class="sc-code">${m.id}</span></td>
      <td style="color:var(--mut);white-space:nowrap">${m.date}</td>
      <td style="font-weight:500">${m.concept}<div style="font-size:11.5px;color:var(--mut);margin-top:2px">${m.prov}</div></td>
      <td style="font-size:12px">${x ? x.name : m.prj}</td>
      <td style="white-space:nowrap;font-family:var(--mono);font-weight:600">${money(m.amount)}</td>
      <td><span class="stpill ${s.cls}"><i class="ti ${s.icon}"></i>${s.txt}</span></td>
    </tr>`;
  }).join('');

  const reqCards = PRJ_BUDGET_REQS.length ? PRJ_BUDGET_REQS.map(q => {
    const x = PROJECTS.find(y => y.id === q.prj);
    return `<div class="arow">
      <div class="ar-info">
        <div class="ar-code">${q.id} · ${q.date}</div>
        <div class="ar-name">${q.concept}</div>
        <div class="ar-who">Proyecto: ${x ? x.name : q.prj} · solicita ${q.from}</div>
      </div>
      <span class="bg-amt">${money(q.amount)}</span>
      <span class="ar-sla warn">Incremento de presupuesto</span>
      ${canApprove ? `<div class="queue-acts">
        <button class="mini-btn primary" onclick="approvePrjReq('${q.id}')"><i class="ti ti-check"></i>Aprobar</button>
        <button class="q-del" onclick="rejectPrjReq('${q.id}')"><i class="ti ti-x"></i>Rechazar</button>
      </div>` : `<span class="queue-ro"><i class="ti ti-lock"></i>Solo lectura</span>`}
    </div>`;
  }).join('') : `<div class="empty"><i class="ti ti-checks"></i>No hay incrementos de presupuesto pendientes.</div>`;

  const byStage = LPM_STAGES.map(s => {
    const list = PROJECTS.filter(x => x.stage === s.id);
    return { s, plan: list.reduce((a, x) => a + x.budget.plan, 0), used: list.reduce((a, x) => a + x.budget.used, 0), n: list.length };
  }).filter(x => x.n);
  const maxStage = Math.max(...byStage.map(x => x.plan));

  return `
    <div class="lkrow">
      <div class="lcard"><div class="lcard-l">Presupuesto del portafolio</div><div class="lcard-v">${money(p.plan)}</div><div class="lcard-s" style="color:var(--mut)">${PROJECTS.length} proyectos en LPM</div></div>
      <div class="lcard"><div class="lcard-l">Ejecutado</div><div class="lcard-v">${money(p.used)}</div><div class="lcard-s" style="color:var(--cel)">${p.pct}% del portafolio</div></div>
      <div class="lcard"><div class="lcard-l">Disponible</div><div class="lcard-v">${money(p.avail)}</div><div class="lcard-s" style="color:var(--cel)">Hasta el cierre de los proyectos</div></div>
      <div class="lcard"><div class="lcard-l">Incrementos pendientes</div><div class="lcard-v">${PRJ_BUDGET_REQS.length}</div><div class="lcard-s" style="color:var(--ctl)">${money(PRJ_BUDGET_REQS.reduce((a, q) => a + q.amount, 0))} en revisión</div></div>
    </div>

    <div class="bg-hero">
      <div class="bg-hero-h">
        <div><div class="bg-hero-l">Ejecución del portafolio de proyectos</div><div class="bg-hero-v">${p.pct}%<span>de ${money(p.plan)}</span></div></div>
        <button class="mini-btn primary" onclick="openMoveModal('prj')"><i class="ti ti-plus"></i>Registrar movimiento de proyecto</button>
      </div>
      <div class="bg-big"><i class="bg-exec" style="width:${p.pct}%"></i></div>
      <div class="bg-leg">
        <span><i class="bg-k exec"></i>Ejecutado ${money(p.used)}</span>
        <span><i class="bg-k av"></i>Disponible ${money(p.avail)}</span>
        <span class="bg-note">El presupuesto de proyectos se libera por etapa: cada gate del LPM habilita el gasto de la etapa siguiente.</span>
      </div>
    </div>

    <div class="chart-card" style="margin-bottom:var(--gap)">
      <div class="chart-h"><h3>Presupuesto por etapa del LPM</h3><span>Asignado vs. ejecutado</span></div>
      <div class="vbars bg-months" style="height:150px">
        ${byStage.map(x => `<div class="vbar">
          <div class="vbar-track bg-pair">
            <i class="bg-b plan" style="height:${Math.round(x.plan / maxStage * 100)}%" title="Asignado ${money(x.plan)}"></i>
            <i class="bg-b real" style="height:${Math.round(x.used / maxStage * 100)}%;background:${x.s.color}" title="Ejecutado ${money(x.used)}"></i>
          </div>
          <div class="vbar-l">${x.s.short}<br><small style="color:var(--mut)">${x.n} proy.</small></div>
        </div>`).join('')}
      </div>
      <div class="bg-leg" style="margin-top:1rem"><span><i class="bg-k plan"></i>Asignado</span><span><i class="bg-k real"></i>Ejecutado</span></div>
    </div>

    <div class="sh"><h2>Presupuesto por proyecto</h2><span>La marca vertical indica el % de avance del proyecto</span></div>
    <div class="rtable-wrap" style="margin-bottom:var(--gap)"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Proyecto</th><th>Iniciativa</th><th>Etapa</th><th>Asignado</th><th>Ejecutado</th><th>Disponible</th><th>Gasto vs. avance</th><th>Estado</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>

    <div class="sh"><h2>Solicitudes de incremento</h2><span>${canApprove ? 'Aprueba o rechaza el incremento solicitado por el líder del proyecto' : 'Pendientes de aprobación del Gerente legal'}</span></div>
    <div style="margin-bottom:var(--gap)">${reqCards}</div>

    <div class="sh"><h2>Movimientos de proyectos</h2><span>${PRJ_MOVES.length} registrados</span></div>
    <div class="rtable-wrap"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Folio</th><th>Fecha</th><th>Concepto</th><th>Proyecto</th><th>Monto</th><th>Estado</th></tr></thead>
      <tbody>${movRows}</tbody>
    </table></div></div>`;
}

/* Aprobar / rechazar incremento de presupuesto de un proyecto */
function approvePrjReq(id) {
  if (!can('budgetApprove')) return;
  const i = PRJ_BUDGET_REQS.findIndex(q => q.id === id);
  if (i < 0) return;
  const q = PRJ_BUDGET_REQS[i];
  PRJ_BUDGET_REQS.splice(i, 1);
  const x = PROJECTS.find(y => y.id === q.prj);
  if (x) x.budget.plan += q.amount;
  PRJ_MOVES.unshift({ id: 'MPY-2026-' + Math.floor(66 + Math.random() * 20), date: '28 Jul 2026', concept: q.concept, prj: q.prj, amount: q.amount, prov: 'Incremento aprobado · ' + q.from, st: 'comprometido' });
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} aprobó el incremento ${q.id} de ${money(q.amount)} para ${q.prj}`, 'var(--ce)');
  renderBudget('prj');
  toast(`${id} aprobado · ${money(q.amount)} añadidos a ${q.prj}`);
}
function rejectPrjReq(id) {
  if (!can('budgetApprove')) return;
  const i = PRJ_BUDGET_REQS.findIndex(q => q.id === id);
  if (i < 0) return;
  const q = PRJ_BUDGET_REQS[i];
  PRJ_BUDGET_REQS.splice(i, 1);
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} rechazó el incremento ${q.id} de ${q.prj}`, 'var(--cr)');
  renderBudget('prj');
  toast(`${id} rechazado · ${q.from} notificado`);
}

/* Aprobar / rechazar solicitud de presupuesto */
function approveBudgetReq(id) {
  if (!can('budgetApprove')) return;
  const i = BUDGET_REQS.findIndex(q => q.id === id);
  if (i < 0) return;
  const q = BUDGET_REQS[i];
  BUDGET_REQS.splice(i, 1);
  const r = BUDGET.rubros.find(x => x.code === q.rubro);
  if (r) r.commit += q.amount;
  BUDGET_MOVES.unshift({ id: 'MOV-' + BUDGET.year + '-' + Math.floor(320 + Math.random() * 60), date: '28 Jul 2026', concept: q.concept, rubro: q.rubro, amount: q.amount, prov: 'Solicitado por ' + q.from, st: 'comprometido' });
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} aprobó ${q.id} por ${money(q.amount)} (rubro ${q.rubro})`, 'var(--ce)');
  renderBudget('op');
  toast(`${id} aprobado · ${money(q.amount)} comprometido en ${q.rubro}`);
}
function rejectBudgetReq(id) {
  if (!can('budgetApprove')) return;
  const q = BUDGET_REQS.find(x => x.id === id);
  if (!q) return;
  $('#mBg').classList.add('on');
  document.body.style.overflow = 'hidden';
  $('#mBody').innerHTML = `
    <div class="mhdr">
      <div><span class="mcode" style="background:var(--crb);color:var(--crl)">RECHAZAR</span><div class="mtitle">Rechazar solicitud de presupuesto</div></div>
      <button class="mclose" onclick="closeModal()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
    </div>
    <div class="del-warn"><i class="ti ti-alert-triangle"></i><div>Vas a rechazar <strong>${q.id} · ${q.concept}</strong> por ${money(q.amount)}. ${q.from} recibirá el motivo.</div></div>
    <form class="mform" onsubmit="confirmRejectBudget(event,'${id}')">
      <div class="fg"><label>Motivo del rechazo <span style="color:var(--crl)">*</span></label>
        <textarea class="fc" id="bgReason" required minlength="8" placeholder="Ej. el rubro no tiene disponible suficiente, reprogramar al siguiente trimestre…"></textarea></div>
      <button type="submit" class="sbtn" style="background:var(--cr)"><i class="ti ti-x"></i>Rechazar y notificar</button>
    </form>`;
}
function confirmRejectBudget(e, id) {
  e.preventDefault();
  const reason = $('#bgReason').value.trim();
  const i = BUDGET_REQS.findIndex(q => q.id === id);
  if (i < 0) return;
  const q = BUDGET_REQS[i];
  BUDGET_REQS.splice(i, 1);
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} rechazó ${q.id} — motivo: ${reason}`, 'var(--cr)');
  closeModal();
  renderBudget('op');
  toast(`${id} rechazada · ${q.from} notificado`);
}

/* Registrar movimiento presupuestario */
function openMoveModal(scope) {
  const prj = scope === 'prj';
  $('#mBg').classList.add('on');
  document.body.style.overflow = 'hidden';
  $('#mBody').innerHTML = `
    <div class="mhdr">
      <div><span class="mcode">${prj ? 'PROYECTO' : 'OPERACIÓN'}</span><div class="mtitle">Registrar movimiento ${prj ? 'de proyecto' : 'de operación'}</div></div>
      <button class="mclose" onclick="closeModal()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
    </div>
    <form class="mform" onsubmit="submitMove(event)">
      <div class="fg"><label>Concepto</label>
        <input class="fc" id="mvConcept" required placeholder="Ej. honorarios firma externa — arbitraje EXP-2026-012"></div>
      <div class="frow">
        <div class="fg"><label>${prj ? 'Proyecto' : 'Rubro'}</label>
          <select class="fc" id="mvRubro">${prj
            ? PROJECTS.map(x => `<option value="${x.id}">${x.id} · ${x.name}</option>`).join('')
            : BUDGET.rubros.map(r => `<option value="${r.code}">${r.code} · ${r.name}</option>`).join('')}</select></div>
        <div class="fg"><label>Monto (${BUDGET.cur})</label>
          <input class="fc" id="mvAmount" type="number" min="1" step="100" required placeholder="0"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Proveedor o beneficiario</label>
          <input class="fc" id="mvProv" required placeholder="Nombre de la firma o entidad"></div>
        <div class="fg"><label>Estado</label>
          <select class="fc" id="mvSt"><option value="comprometido">Comprometido</option><option value="pagado">Pagado</option><option value="revision">En revisión</option></select></div>
      </div>
      <div class="sla-info"><i class="ti ti-history"></i>El movimiento afecta el disponible ${prj ? 'del proyecto' : 'del rubro'} y queda registrado en la auditoría a tu nombre.</div>
      <button type="submit" class="mcont" data-scope="${prj ? 'prj' : 'op'}"><i class="ti ti-device-floppy"></i>Registrar movimiento</button>
    </form>`;
}
function submitMove(e) {
  e.preventDefault();
  const scope = (e.target.querySelector('[data-scope]') || {}).dataset ? e.target.querySelector('[data-scope]').dataset.scope : 'op';
  const concept = $('#mvConcept').value.trim();
  const code = $('#mvRubro').value;
  const amount = parseFloat($('#mvAmount').value) || 0;
  const prov = $('#mvProv').value.trim();
  const st = $('#mvSt').value;
  if (scope === 'prj') {
    const x = PROJECTS.find(y => y.id === code);
    if (x) x.budget.used += amount;
    const pid = 'MPY-2026-' + Math.floor(66 + Math.random() * 30);
    PRJ_MOVES.unshift({ id: pid, date: '28 Jul 2026', concept, prj: code, amount, prov, st });
    if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} registró ${pid} por ${money(amount)} en el proyecto ${code}`, 'var(--ce)');
    closeModal();
    renderBudget('prj');
    toast(`${pid} registrado · ${money(amount)} en ${code}`);
    return;
  }
  const r = BUDGET.rubros.find(x => x.code === code);
  if (r) { if (st === 'pagado') r.exec += amount; else r.commit += amount; }
  const id = 'MOV-' + BUDGET.year + '-' + Math.floor(320 + Math.random() * 60);
  BUDGET_MOVES.unshift({ id, date: '28 Jul 2026', concept, rubro: code, amount, prov, st });
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} registró ${id} por ${money(amount)} en el rubro ${code}`, r ? r.color : 'var(--brand)');
  closeModal();
  renderBudget('op');
  toast(`${id} registrado · ${money(amount)} en ${code}`);
}
