/* ===========================================================================
   PROYECTOS ESTRATÉGICOS — Legal Project Management (LPM)
   Portafolio por etapas con gates, hitos, riesgos, entregables y presupuesto.
   =========================================================================== */
'use strict';

const prjSt = { stage: 'all', open: null };
const stageOf = (id) => LPM_STAGES.find(s => s.id === id) || LPM_STAGES[0];
const prjMoney = (n) => '$' + Number(n || 0).toLocaleString('en-US');

function renderProjects() {
  const host = $('#v-projects');
  const act = PROJECTS.length;
  const risk = PROJECTS.filter(p => p.health === 'crit').length;
  const desv = PROJECTS.filter(p => p.health === 'warn').length;
  const bplan = PROJECTS.reduce((s, p) => s + p.budget.plan, 0);
  const bused = PROJECTS.reduce((s, p) => s + p.budget.used, 0);
  const avg = Math.round(PROJECTS.reduce((s, p) => s + p.progress, 0) / act);

  const pipeline = LPM_STAGES.map(s => {
    const n = PROJECTS.filter(p => p.stage === s.id).length;
    const on = prjSt.stage === s.id;
    return `<button class="lpm-stage${on ? ' on' : ''}" style="--st:${s.color}" onclick="filterStage('${on ? 'all' : s.id}')">
      <span class="lpm-ic"><i class="ti ${s.icon}"></i></span>
      <span class="lpm-n">${n}</span>
      <span class="lpm-name">${s.name}</span>
      <span class="lpm-goal">${s.goal}</span>
    </button>`;
  }).join('<i class="ti ti-chevron-right lpm-arr"></i>');

  const cols = LPM_STAGES.map(s => {
    const list = PROJECTS.filter(p => p.stage === s.id);
    const dim = prjSt.stage !== 'all' && prjSt.stage !== s.id;
    return `<div class="lpm-col${dim ? ' dim' : ''}">
      <div class="lpm-col-h" style="--st:${s.color}"><span class="lpm-dot"></span>${s.short}<span>${list.length}</span></div>
      ${list.length ? list.map(p => prjCard(p)).join('') : '<div class="lpm-empty">Sin proyectos en esta etapa</div>'}
    </div>`;
  }).join('');

  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <h1 class="ptitle">Proyectos <em>estratégicos</em></h1>
      <p class="psub">Portafolio legal gestionado bajo Legal Project Management: cada iniciativa avanza por cinco etapas con entregables definidos y un gate de salida que debe aprobarse antes de continuar.</p>
    </div>
    <div class="lkrow">
      <div class="lcard"><div class="lcard-l">Proyectos activos</div><div class="lcard-v">${act}</div><div class="lcard-s" style="color:var(--ctl)">En las 5 etapas del LPM</div></div>
      <div class="lcard"><div class="lcard-l">Avance promedio</div><div class="lcard-v">${avg}%</div><div class="lcard-s" style="color:var(--cel)">Ponderado por portafolio</div></div>
      <div class="lcard"><div class="lcard-l">En riesgo</div><div class="lcard-v">${risk}</div><div class="lcard-s" style="color:var(--crl)">${desv} con desvío</div></div>
      <div class="lcard"><div class="lcard-l">Presupuesto del portafolio</div><div class="lcard-v">${prjMoney(bplan)}</div><div class="lcard-s" style="color:var(--mut)">${prjMoney(bused)} ejecutado</div></div>
    </div>
    <div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-route-2"></i><span>Metodología <strong>LPM</strong>: ningún proyecto avanza de etapa sin cumplir su gate. Haz clic en una etapa para filtrar el portafolio, o en un proyecto para ver hitos, riesgos, entregables y su gate.</span></div>
    <div class="lpm-pipe">${pipeline}</div>
    <div class="sh" style="margin-top:var(--gap)"><h2>Portafolio por etapa</h2><span>${prjSt.stage === 'all' ? 'Todas las etapas' : 'Filtrado: ' + stageOf(prjSt.stage).name + ' · '}${prjSt.stage !== 'all' ? '<a href="#" onclick="filterStage(\'all\');return false" style="color:var(--brand)">quitar filtro</a>' : ''}</span></div>
    <div class="lpm-board">${cols}</div>
    <div class="sh" style="margin-top:var(--gap)"><h2>Qué exige cada etapa</h2><span>Entradas, entregables y criterio de salida</span></div>
    <div class="lpm-meth">${LPM_STAGES.map((s, i) => `<div class="lpm-mcard" style="--st:${s.color}">
      <div class="lpm-mh"><span class="lpm-mn">${i + 1}</span><div><div class="lpm-mname">${s.name}</div><div class="lpm-mgoal">${s.goal}</div></div></div>
      <div class="lpm-mlbl">Entradas</div>${s.inputs.map(x => `<div class="lpm-mitem"><i class="ti ti-arrow-right"></i>${x}</div>`).join('')}
      <div class="lpm-mlbl">Entregables</div>${s.deliverables.map(x => `<div class="lpm-mitem"><i class="ti ti-file-check"></i>${x}</div>`).join('')}
      <div class="lpm-mlbl">Gate de salida</div>${s.gate.map(x => `<div class="lpm-mitem gate"><i class="ti ti-shield-check"></i>${x}</div>`).join('')}
    </div>`).join('')}</div>`;
}

function prjCard(p) {
  const h = PRJ_HEALTH[p.health];
  const late = p.milestones.filter(m => m.st === 'late').length;
  return `<article class="prj" onclick="openProject('${p.id}')">
    <div class="prj-top"><span class="sc-code">${p.id}</span><span class="stpill ${h.cls}"><i class="ti ${h.icon}"></i>${h.txt}</span></div>
    <h4 class="prj-name">${p.name}</h4>
    <div class="prj-meta"><span><i class="ti ti-user-star"></i>${p.lead}</span><span><i class="ti ti-flag"></i>${p.target}</span></div>
    <div class="prj-bar"><i style="width:${p.progress}%"></i></div>
    <div class="prj-foot"><span>${p.progress}% avance</span>${late ? `<span class="prj-late"><i class="ti ti-clock-exclamation"></i>${late} hito${late > 1 ? 's' : ''} atrasado${late > 1 ? 's' : ''}</span>` : `<span>${prjMoney(p.budget.used)} / ${prjMoney(p.budget.plan)}</span>`}</div>
  </article>`;
}

function filterStage(id) { prjSt.stage = id; renderProjects(); }

/* ───────── DETALLE DEL PROYECTO ───────── */
function openProject(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  prjSt.open = id;
  $('#mBg').classList.add('on');
  document.body.style.overflow = 'hidden';
  renderProjectModal();
}
function renderProjectModal() {
  const p = PROJECTS.find(x => x.id === prjSt.open);
  if (!p) return;
  const s = stageOf(p.stage), h = PRJ_HEALTH[p.health];
  const idx = LPM_STAGES.indexOf(s);
  const done = new Set(p.gateDone || []);
  const gateOk = s.gate.every(g => done.has(g));
  const bpct = Math.round(p.budget.used / p.budget.plan * 100);

  $('#mBody').innerHTML = `
    <div class="mhdr">
      <div><span class="mcode">${p.id}</span><div class="mtitle">${p.name}</div></div>
      <button class="mclose" onclick="closeProject()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
    </div>
    <div class="ct-meta">
      <span class="stpill ${h.cls}"><i class="ti ${h.icon}"></i>${h.txt}</span>
      <span class="ct-chip" style="color:${s.color}"><i class="ti ${s.icon}"></i>Etapa ${idx + 1} de 5 · ${s.name}</span>
      <span class="ct-chip"><i class="ti ti-user-star"></i>${p.lead}</span>
      <span class="ct-chip"><i class="ti ti-crown"></i>${p.sponsor}</span>
      <span class="ct-chip"><i class="ti ti-map-pin"></i>${p.juris}</span>
      <span class="ct-chip"><i class="ti ti-calendar"></i>${p.start} → ${p.target}</span>
    </div>
    <div class="prj-track">${LPM_STAGES.map((x, i) => `<div class="prj-tstep${i < idx ? ' past' : i === idx ? ' now' : ''}" style="--st:${x.color}"><span>${i + 1}</span>${x.short}</div>`).join('')}</div>
    <div class="ct-sect"><h4><i class="ti ti-target-arrow"></i>Objetivo</h4><p>${p.objective}</p></div>

    <div class="prj-cols">
      <div>
        <div class="cad-lbl">Hitos del plan</div>
        <div class="prj-ms">${p.milestones.map(m => `<div class="prj-m ${m.st}">
          <span class="prj-m-dot"></span>
          <div><div class="prj-m-n">${m.name}</div><div class="prj-m-d">${m.date} · ${MS_ST[m.st]}</div></div>
        </div>`).join('')}</div>
        <div class="cad-lbl" style="margin-top:1.1rem">Entregables</div>
        ${p.deliverables.map(d => `<div class="prj-d ${d.st}"><i class="ti ti-${d.st === 'done' ? 'circle-check' : d.st === 'curso' ? 'progress' : 'circle'}"></i>${d.n}</div>`).join('')}
      </div>
      <div>
        <div class="cad-lbl">Gate de salida · ${s.name}</div>
        <div class="prj-gate">
          ${s.gate.map(g => `<div class="bf-item${done.has(g) ? ' done' : ''}" onclick="toggleGate('${g.replace(/'/g, "\\'")}')">
            <span class="bf-box"><i class="ti ti-check"></i></span><div class="bf-txt">${g}</div></div>`).join('')}
        </div>
        <div class="cad-lbl" style="margin-top:1.1rem">Riesgos</div>
        ${p.risks.map(r => `<div class="prj-risk ${r.sev}"><div class="prj-risk-t"><i class="ti ti-${r.sev === 'crit' ? 'alert-triangle' : r.sev === 'warn' ? 'alert-circle' : 'circle-check'}"></i>${r.txt}</div><div class="prj-risk-m">Mitigación: ${r.mit}</div></div>`).join('')}
        <div class="cad-lbl" style="margin-top:1.1rem">Presupuesto del proyecto</div>
        <div class="prj-budget">
          <div class="bg-track"><i class="bg-exec" style="width:${Math.min(bpct, 100)}%;background:${s.color}"></i></div>
          <div class="prj-budget-l"><span>${prjMoney(p.budget.used)} ejecutado</span><span>${bpct}% de ${prjMoney(p.budget.plan)}</span></div>
        </div>
        <div class="cad-lbl" style="margin-top:1.1rem">Equipo</div>
        <div class="chip-row">${p.team.map(t => `<span class="cfg-chip on"><i class="ti ti-user"></i>${t}</span>`).join('')}</div>
      </div>
    </div>

    ${idx < LPM_STAGES.length - 1 ? (can('assign')
      ? `<button class="mcont" ${gateOk ? '' : 'disabled'} onclick="advanceStage('${p.id}')"><i class="ti ti-arrow-right"></i>${gateOk ? `Aprobar gate y pasar a ${LPM_STAGES[idx + 1].name}` : `Faltan ${s.gate.length - s.gate.filter(g => done.has(g)).length} criterios del gate`}</button>`
      : `<div class="sla-info"><i class="ti ti-lock"></i>El avance de etapa lo aprueba el Gerente legal una vez cumplido el gate.</div>`)
      : `<div class="sla-info"><i class="ti ti-flag-check"></i>Última etapa del LPM: al cerrar el gate el proyecto pasa a lecciones aprendidas y archivo documental.</div>`}`;
}
function closeProject() { prjSt.open = null; closeModal(); renderProjects(); }
function toggleGate(g) {
  const p = PROJECTS.find(x => x.id === prjSt.open);
  if (!p) return;
  p.gateDone = p.gateDone || [];
  const i = p.gateDone.indexOf(g);
  i >= 0 ? p.gateDone.splice(i, 1) : p.gateDone.push(g);
  renderProjectModal();
}
function advanceStage(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p || !can('assign')) return;
  const idx = LPM_STAGES.indexOf(stageOf(p.stage));
  const next = LPM_STAGES[idx + 1];
  if (!next) return;
  p.stage = next.id;
  p.gateDone = [];
  p.progress = Math.min(98, Math.max(p.progress, Math.round((idx + 1) / LPM_STAGES.length * 100)));
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} aprobó el gate de ${p.id} y avanzó a ${next.name}`, next.color);
  renderProjectModal();
  renderProjects();
  toast(`${p.id} avanzó a ${next.name}`);
}
