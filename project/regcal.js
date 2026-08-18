/* ===========================================================================
   CALENDARIO REGULATORIO — Obligaciones de cumplimiento con alertas automáticas
   Regla: primer aviso a T-90 días al responsable, recordatorio mensual hasta
   el mes de vencimiento, y recordatorio semanal durante ese mes.
   =========================================================================== */
'use strict';

const RC_TODAY = new Date(2026, 7, 17); // 17 Ago 2026 — reloj del portal
const RC_MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const rcFmt = d => `${String(d.getDate()).padStart(2, '0')} ${RC_MES[d.getMonth()]} ${d.getFullYear()}`;
const rcAdd = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const rcDays = (a, b) => Math.round((b - a) / 86400000);

/* Parámetros de la regla — configurables por la Gerencia Legal */
const RC_RULE = { lead: 90, monthly: 30, weekly: 7, escalate: 10 };

const RC_OWNERS = {
  'L. Mendoza': { role: 'Abogado Senior', mail: 'lmendoza@ternova.group' },
  'S. Aguilar': { role: 'Abogado Junior', mail: 'saguilar@ternova.group' },
  'M. Cruz': { role: 'Analista de Ops Legales', mail: 'mcruz@ternova.group' },
  'R. Castro': { role: 'Abogado Senior', mail: 'rcastro@ternova.group' },
  'J. Barrera': { role: 'Abogado Junior', mail: 'jbarrera@ternova.group' },
};

/* Obligaciones — due: [año, mes(0-11), día] */
const RC_OBLIGATIONS = [
  { id: 'REG-001', name: 'Renovación de licencia de operación', ent: 'Ministerio de Economía', jur: 'Guatemala', freq: 'Anual', due: [2026, 8, 10], owner: 'M. Cruz', backup: 'S. Aguilar', st: 'curso', crit: 'alta' },
  { id: 'REG-002', name: 'Declaración anual de protección de datos', ent: 'INAI', jur: 'México', freq: 'Anual', due: [2026, 8, 30], owner: 'S. Aguilar', backup: 'L. Mendoza', st: 'curso', crit: 'alta' },
  { id: 'REG-003', name: 'Reporte AML trimestral', ent: 'Superintendencia del Sistema Financiero', jur: 'El Salvador', freq: 'Trimestral', due: [2026, 9, 15], owner: 'L. Mendoza', backup: 'R. Castro', st: 'pend', crit: 'alta' },
  { id: 'REG-004', name: 'Actualización de registro sanitario', ent: 'ARSA', jur: 'Honduras', freq: 'Bienal', due: [2026, 10, 5], owner: 'M. Cruz', backup: 'J. Barrera', st: 'pend', crit: 'media' },
  { id: 'REG-005', name: 'Declaración de beneficiario final', ent: 'Registro Nacional', jur: 'Costa Rica', freq: 'Anual', due: [2026, 11, 30], owner: 'J. Barrera', backup: 'M. Cruz', st: 'pend', crit: 'media' },
  { id: 'REG-006', name: 'Renovación de certificado de inversión extranjera', ent: 'Ministerio de Planificación', jur: 'Vietnam', freq: 'Anual', due: [2027, 0, 20], owner: 'R. Castro', backup: 'L. Mendoza', st: 'pend', crit: 'alta' },
  { id: 'REG-007', name: 'Presentación de estados financieros al registro', ent: 'Registro Público', jur: 'Panamá', freq: 'Anual', due: [2027, 2, 30], owner: 'S. Aguilar', backup: 'J. Barrera', st: 'pend', crit: 'media' },
  { id: 'REG-008', name: 'Declaración de tasa única anual', ent: 'Registro de Sociedades', jur: 'Islas Británicas', freq: 'Anual', due: [2027, 4, 31], owner: 'M. Cruz', backup: 'S. Aguilar', st: 'pend', crit: 'baja' },
  { id: 'REG-009', name: 'Renovación de matrícula de comerciante', ent: 'Registro Mercantil', jur: 'Nicaragua', freq: 'Anual', due: [2026, 7, 28], owner: 'M. Cruz', backup: 'J. Barrera', st: 'riesgo', crit: 'media' },
];

/* ───────── MOTOR DE ALERTAS ───────── */
function rcSchedule(ob, lead) {
  const due = new Date(ob.due[0], ob.due[1], ob.due[2]);
  const start = rcAdd(due, -(lead || RC_RULE.lead));
  const monthStart = new Date(due.getFullYear(), due.getMonth(), 1);
  const alerts = [];
  // Aviso inicial + recordatorios mensuales hasta entrar al mes de vencimiento
  for (let d = new Date(start); d < monthStart; d = rcAdd(d, RC_RULE.monthly)) {
    alerts.push({ date: new Date(d), kind: alerts.length ? 'mensual' : 'inicial', to: ob.owner });
  }
  // Recordatorios semanales dentro del mes de vencimiento
  let w = monthStart < start ? new Date(start) : new Date(monthStart);
  for (; w < due; w = rcAdd(w, RC_RULE.weekly)) alerts.push({ date: new Date(w), kind: 'semanal', to: ob.owner });
  // Escalamiento a la Gerencia Legal si sigue sin avance
  alerts.push({ date: rcAdd(due, -RC_RULE.escalate), kind: 'escalamiento', to: 'A. Salgado (Gerente Legal)' });
  alerts.push({ date: new Date(due), kind: 'vencimiento', to: `${ob.owner} + Gerencia Legal` });
  alerts.sort((a, b) => a.date - b.date);
  alerts.forEach(a => { a.days = rcDays(a.date, due); a.sent = a.date <= RC_TODAY; });
  const sent = alerts.filter(a => a.sent).length;
  return { due, start, alerts, sent, pending: alerts.length - sent, left: rcDays(RC_TODAY, due), active: start <= RC_TODAY && due >= RC_TODAY };
}

const RC_KIND = {
  inicial: { l: 'Aviso inicial T-90', i: 'ti-bell-ringing', c: 'var(--brand)' },
  mensual: { l: 'Recordatorio mensual', i: 'ti-calendar-repeat', c: 'var(--ctl)' },
  semanal: { l: 'Recordatorio semanal', i: 'ti-calendar-week', c: 'var(--crl)' },
  escalamiento: { l: 'Escalamiento a Gerencia', i: 'ti-stairs-up', c: 'var(--crl)' },
  vencimiento: { l: 'Día de vencimiento', i: 'ti-flag-3', c: 'var(--crl)' },
};
const RC_ST = { curso: { l: 'En curso', c: 's-prog', i: 'ti-progress' }, pend: { l: 'No iniciado', c: 's-rev', i: 'ti-clock' }, riesgo: { l: 'En riesgo', c: 's-urg', i: 'ti-alert-triangle' } };

const rcSt = { sel: 'REG-001', jur: 'all' };

/* ───────── VISTA ───────── */
function renderRegcal() {
  const host = $('#v-regcal');
  const all = RC_OBLIGATIONS.map(o => ({ o, s: rcSchedule(o) })).sort((a, b) => a.s.due - b.s.due);
  const rows = rcSt.jur === 'all' ? all : all.filter(x => x.o.jur === rcSt.jur);
  const d30 = all.filter(x => x.s.left <= 30).length;
  const d90 = all.filter(x => x.s.left <= 90).length;
  const act = all.filter(x => x.s.active).length;
  const weekly = all.filter(x => x.s.due.getMonth() === RC_TODAY.getMonth() && x.s.due.getFullYear() === RC_TODAY.getFullYear()).length;
  const juris = ['all', ...new Set(RC_OBLIGATIONS.map(o => o.jur))];
  const sel = all.find(x => x.o.id === rcSt.sel) || all[0];

  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <h1 class="ptitle">Calendario <em>regulatorio</em></h1>
      <p class="psub">Cada obligación tiene una fecha de cumplimiento, un responsable nombrado y un calendario de avisos que se dispara solo. Nadie tiene que recordar la fecha: el portal la recuerda por él.</p>
    </div>
    <div class="rc-rule">
      <div class="rc-rule-h"><i class="ti ti-bell-cog"></i><div><strong>Regla de alertas automáticas</strong><span>Aplica a las ${RC_OBLIGATIONS.length} obligaciones del calendario, sin excepción</span></div></div>
      <div class="rc-steps">
        <div class="rc-step"><span class="rc-tag">T-90</span><strong>Aviso inicial</strong><p>Tres meses antes, el responsable recibe el aviso con la obligación, la autoridad y los insumos requeridos.</p></div>
        <div class="rc-step"><span class="rc-tag">T-90 a T-30</span><strong>Recordatorio mensual</strong><p>Un recordatorio cada 30 días mientras la fecha siga a más de un mes, con el avance registrado.</p></div>
        <div class="rc-step"><span class="rc-tag on">Mes de vencimiento</span><strong>Recordatorio semanal</strong><p>Al entrar el mes del vencimiento la frecuencia cambia a semanal hasta que se marque cumplido.</p></div>
        <div class="rc-step"><span class="rc-tag esc">T-10</span><strong>Escalamiento</strong><p>Si la obligación no está en curso, el aviso copia a la Gerencia Legal y aparece en el stand-up diario.</p></div>
      </div>
      <div class="rc-chan"><span><i class="ti ti-mail"></i>Correo Outlook al responsable y su suplente</span><span><i class="ti ti-brand-teams"></i>Tarjeta en el canal de Teams del equipo legal</span><span><i class="ti ti-bell"></i>Badge en el portal y en Alertas SLA</span><span><i class="ti ti-history"></i>Cada envío queda en bitácora</span></div>
    </div>
    <div class="sla-cards" style="margin-top:var(--gap)">
      <div class="slac slac-30"><div class="slac-v">${d30}</div><div class="slac-l">Vencen en ≤ 30 días</div></div>
      <div class="slac slac-60"><div class="slac-v">${weekly}</div><div class="slac-l">En cadencia semanal este mes</div></div>
      <div class="slac slac-90"><div class="slac-v">${d90}</div><div class="slac-l">Dentro de la ventana de 90 días</div></div>
      <div class="slac"><div class="slac-v">${act}</div><div class="slac-l">Con alertas activas hoy</div></div>
    </div>
    <div class="sh" style="margin-top:var(--gap)"><h2>Obligaciones y su cadencia de avisos</h2><span>Corte al ${rcFmt(RC_TODAY)}</span></div>
    <div class="chip-row" style="margin-bottom:.9rem">${juris.map(j => `<button class="tri-opt${rcSt.jur === j ? ' on' : ''}" onclick="rcJur('${j}')">${j === 'all' ? 'Todas las jurisdicciones' : j}</button>`).join('')}</div>
    <div class="rtable-wrap" style="margin-bottom:var(--gap)"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Obligación</th><th>Jurisdicción</th><th>Frecuencia</th><th>Vence</th><th>Faltan</th><th>Responsable</th><th>Cadencia actual</th><th>Avisos</th><th>Estado</th></tr></thead>
      <tbody>${rows.map(rcRow).join('')}</tbody>
    </table></div></div>
    <div class="sh"><h2>Plan de avisos — ${sel.o.id}</h2><span>${sel.o.name}</span></div>
    <div id="rcDetail">${rcDetail(sel)}</div>`;
}

function rcCadence(s) {
  if (s.left < 0) return { l: 'Vencida', c: 'var(--crl)' };
  if (s.due.getMonth() === RC_TODAY.getMonth() && s.due.getFullYear() === RC_TODAY.getFullYear()) return { l: 'Semanal', c: 'var(--crl)' };
  if (s.active) return { l: 'Mensual', c: 'var(--ctl)' };
  return { l: 'Sin iniciar', c: 'var(--mut)' };
}

function rcRow({ o, s }) {
  const cad = rcCadence(s);
  const st = RC_ST[o.st];
  const on = rcSt.sel === o.id;
  return `<tr class="rc-tr${on ? ' on' : ''}" onclick="rcSel('${o.id}')">
    <td><span class="sc-code">${o.id}</span><div style="font-weight:500;margin-top:2px">${o.name}</div><div style="font-size:11px;color:var(--mut)">${o.ent}</div></td>
    <td style="white-space:nowrap">${o.jur}</td>
    <td style="color:var(--mut)">${o.freq}</td>
    <td style="white-space:nowrap;font-weight:500">${rcFmt(s.due)}</td>
    <td style="white-space:nowrap;font-weight:600;color:${s.left <= 30 ? 'var(--crl)' : s.left <= 90 ? 'var(--ctl)' : 'var(--mut)'}">${s.left} días</td>
    <td style="white-space:nowrap">${o.owner}<div style="font-size:11px;color:var(--mut)">${RC_OWNERS[o.owner].role}</div></td>
    <td><span class="rc-cad" style="--rc:${cad.c}">${cad.l}</span></td>
    <td style="white-space:nowrap"><span class="rc-count">${s.sent}<em>/${s.alerts.length}</em></span></td>
    <td><span class="stpill ${st.c}"><i class="ti ${st.i}"></i>${st.l}</span></td>
  </tr>`;
}

function rcDetail({ o, s }) {
  const own = RC_OWNERS[o.owner], bk = RC_OWNERS[o.backup];
  const next = s.alerts.find(a => !a.sent);
  return `<div class="rc-det">
    <div class="rc-det-side">
      <div class="rc-lbl">Responsable nombrado</div>
      <div class="rc-per"><span class="cad-av">${o.owner.replace('. ', '')[0] + o.owner.split(' ').pop()[0]}</span><div><strong>${o.owner}</strong><span>${own.role}</span><span class="rc-mail">${own.mail}</span></div></div>
      <div class="rc-lbl">Suplente en copia</div>
      <div class="rc-per sub"><span class="cad-av">${o.backup.replace('. ', '')[0] + o.backup.split(' ').pop()[0]}</span><div><strong>${o.backup}</strong><span>${bk.role}</span></div></div>
      <div class="rc-kv"><span>Autoridad</span><b>${o.ent}</b></div>
      <div class="rc-kv"><span>Jurisdicción</span><b>${o.jur}</b></div>
      <div class="rc-kv"><span>Vence</span><b>${rcFmt(s.due)}</b></div>
      <div class="rc-kv"><span>Primer aviso</span><b>${rcFmt(s.start)}</b></div>
      <div class="rc-kv"><span>Criticidad</span><b style="text-transform:capitalize">${o.crit}</b></div>
      ${next ? `<div class="rc-next"><i class="ti ti-send"></i><div><strong>Próximo aviso: ${rcFmt(next.date)}</strong><span>${RC_KIND[next.kind].l} · a ${next.to}</span></div></div>` : ''}
      ${can('assign') ? `<button class="mini-btn" style="width:100%;justify-content:center;margin-top:.8rem" onclick="rcTest('${o.id}')"><i class="ti ti-bell-ringing"></i>Enviar aviso de prueba</button>` : ''}
    </div>
    <div class="rc-det-main">
      <div class="rc-lbl">Cronograma completo de avisos <em>${s.sent} enviados · ${s.pending} programados</em></div>
      <ol class="rc-tl">${s.alerts.map(a => {
        const k = RC_KIND[a.kind];
        return `<li class="rc-ev${a.sent ? ' done' : ''}" style="--rc:${k.c}">
          <span class="rc-dot"><i class="ti ${a.sent ? 'ti-check' : k.i}"></i></span>
          <div class="rc-ev-b"><strong>${k.l}</strong><span>${rcFmt(a.date)} · T-${a.days} · destinatario: ${a.to}</span></div>
          <span class="rc-ev-st">${a.sent ? 'Enviado' : 'Programado'}</span>
        </li>`;
      }).join('')}</ol>
    </div>
  </div>`;
}

function rcSel(id) { rcSt.sel = id; renderRegcal(); }
function rcJur(j) { rcSt.jur = j; renderRegcal(); }
function rcTest(id) {
  const o = RC_OBLIGATIONS.find(x => x.id === id);
  toast(`Aviso de prueba enviado a ${RC_OWNERS[o.owner].mail} y copia a ${o.backup}`);
  logAudit(`Aviso de prueba del calendario regulatorio enviado (${id} · ${o.jur})`, 'var(--ct)');
}
