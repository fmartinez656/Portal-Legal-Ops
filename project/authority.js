/* ===========================================================================
   AUTORIDADES — Motor de aprobaciones de contratos (Transacciones)
   Calcula la cadena de aprobación conforme al Cuadro de Autoridades por tipo
   de contrato, monto total y condiciones especiales; emite alertas cuando el
   contrato requiere aprobaciones adicionales.
   =========================================================================== */
'use strict';

const authType = (id) => AUTH_TYPES.find(t => t.id === id) || AUTH_TYPES[2];
const lvlOrder = (k) => AUTH_LEVELS[k].order;
const lvlKeyByOrder = (o) => Object.keys(AUTH_LEVELS).find(k => AUTH_LEVELS[k].order === o);
const authMoney = (n) => '$' + Number(n || 0).toLocaleString('en-US');
const tierLabel = (t) => t.max === Infinity ? 'Más de ' + authMoney(prevMax(t)) : 'Hasta ' + authMoney(t.max);
function prevMax(t) {
  for (const ty of AUTH_TYPES) { const i = ty.tiers.indexOf(t); if (i > 0) return ty.tiers[i - 1].max; }
  return 0;
}

/* Calcula la cadena de aprobación y las alertas aplicables */
function calcAuth(typeId, amount, flags) {
  const t = authType(typeId);
  const f = flags instanceof Set ? flags : new Set(flags || []);
  const amt = Number(amount) || 0;
  const alerts = [];

  // Autoridad delegada según el monto total
  let tier = t.tiers.find(x => amt <= x.max) || t.tiers[t.tiers.length - 1];
  let finalOrder = lvlOrder(tier.lvl);
  const baseOrder = lvlOrder(t.tiers[0].lvl);

  // Condiciones que alteran la cadena
  if (f.has('unlimited')) {
    finalOrder = Math.max(finalOrder, lvlOrder('CEO'));
    alerts.push({ sev: 'crit', txt: 'Cláusulas de responsabilidad ilimitada, indemnidades materiales o condiciones fuera de estándar: requiere aprobación de <strong>CFO y CEO</strong> sin importar el monto.' });
  }
  if (f.has('offBudget')) {
    finalOrder = Math.min(finalOrder + 1, lvlOrder('JD'));
    alerts.push({ sev: 'warn', txt: 'Erogación no contemplada expresamente en el presupuesto: <strong>escalamiento automático de un nivel adicional</strong> de aprobación.' });
  }
  if (f.has('overBudget') || t.forceJD) {
    finalOrder = lvlOrder('JD');
    alerts.push({ sev: 'crit', txt: 'El contrato supera el presupuesto global de la compañía: <strong>aprobación obligatoria de la Junta Directiva</strong>.' });
  }
  if (f.has('nda')) alerts.push({ sev: 'info', txt: 'Antes de divulgar información confidencial debes validar con Legal la suscripción de un <strong>NDA</strong>.' });
  if (f.has('excluded')) alerts.push({ sev: 'warn', txt: 'Los contratos de deuda, CAPEX y adquisición de activos están <strong>excluidos de este cuadro</strong>: aplica el cuadro de CAPEX o la Política de Estructura de Capital.' });
  if (amt > 300000) alerts.push({ sev: 'crit', txt: `Monto de ${authMoney(amt)}: supera el umbral de $300,000 y debe ser <strong>ratificado por la Junta Directiva</strong>.` });
  else if (amt > 100000) alerts.push({ sev: 'warn', txt: `Monto de ${authMoney(amt)}: excede la delegación del CFO y requiere <strong>aprobación del CEO</strong>.` });

  const chain = [];
  for (let o = baseOrder; o <= finalOrder; o++) chain.push(lvlKeyByOrder(o));
  if (f.has('unlimited') && !chain.includes('CFO')) chain.splice(0, 0, 'CFO');

  const steps = [
    { who: 'Gestor del contrato', act: 'Propone y documenta', icon: 'ti-user' },
    ...(t.committee ? [{ who: 'Comité de Contratos', act: 'Recomienda', icon: 'ti-users-group' }] : []),
    { who: 'Área Legal', act: 'Revisa y valida', icon: 'ti-scale' },
    ...chain.map((k, i) => ({ who: AUTH_LEVELS[k].name, code: AUTH_LEVELS[k].code, act: i === chain.length - 1 ? 'Aprueba (autoridad final)' : 'Aprueba', icon: 'ti-circle-check', approver: true })),
  ];
  return { type: t, tier, amt, chain, steps, alerts, final: AUTH_LEVELS[chain[chain.length - 1]] };
}

/* ───────── PESTAÑA: CUADRO DE AUTORIDADES ───────── */
const authSim = { type: 'log', amount: 45000, flags: new Set() };

function authorityBlock() {
  const rows = AUTH_TYPES.map(t => {
    const cell = (k) => {
      const tr = t.tiers.find(x => x.lvl === k);
      if (!tr) return '<span class="au-na">—</span>';
      return tr.max === Infinity ? `<span class="au-y">Más de ${authMoney(t.tiers[t.tiers.indexOf(tr) - 1] ? t.tiers[t.tiers.indexOf(tr) - 1].max : 0)}</span>` : `<span class="au-y">Hasta ${authMoney(tr.max)}</span>`;
    };
    return `<tr>
      <td style="font-weight:600">${t.name}${t.note ? `<div style="font-size:11.5px;color:var(--mut);font-weight:400;margin-top:3px;max-width:320px">${t.note}</div>` : ''}</td>
      <td style="text-align:center">${cell('GN')}</td>
      <td style="text-align:center">${cell('VPD')}</td>
      <td style="text-align:center">${cell('CFO')}</td>
      <td style="text-align:center">${cell('CEO')}</td>
      <td style="text-align:center">${cell('JD')}</td>
    </tr>`;
  }).join('');

  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-hierarchy-3"></i><span>Aprobaciones de contratos por tipo y monto total, conforme al <strong>${AUTH_SOURCE}</strong>. Toda solicitud de contrato en el portal calcula su cadena de aprobación con este cuadro y alerta cuando requiere niveles adicionales.</span></div>
    ${authSimBlock()}
    <div class="sh" style="margin-top:var(--gap)"><h2>Límites de aprobación por nivel</h2><span>Sobre el valor total del contrato</span></div>
    <div class="gtable-wrap"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Tipo de contrato</th><th style="text-align:center">Gerencia<br><small>GN</small></th><th style="text-align:center">VP / Dirección<br><small>VP/D</small></th><th style="text-align:center">Finanzas<br><small>CFO</small></th><th style="text-align:center">Director Ejecutivo<br><small>CEO</small></th><th style="text-align:center">Junta<br><small>JD</small></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>
    <div class="au-rules">
      <div class="cad-lbl">Reglas transversales</div>
      ${AUTH_RULES.map(r => `<div class="au-rule"><i class="ti ti-point-filled"></i>${r}</div>`).join('')}
    </div>`;
}

/* Simulador de aprobaciones (misma lógica que el flujo de solicitud) */
function authSimBlock() {
  return `<div class="au-sim" id="auSim">
    <div class="au-sim-h"><div><div class="cad-lbl" style="margin-bottom:.35rem"><i class="ti ti-calculator"></i>Simulador de aprobaciones</div>
      <p style="font-size:12.5px;color:var(--mut);line-height:1.5;max-width:520px">Indica el tipo de contrato, su valor total y las condiciones aplicables para ver qué niveles deben aprobar antes de la firma.</p></div></div>
    ${authFormFields(authSim, 'authSimUpdate()')}
    <div id="auSimOut">${authResultBlock(calcAuth(authSim.type, authSim.amount, authSim.flags))}</div>
  </div>`;
}
function authFormFields(st, onchange) {
  return `<div class="au-fields">
      <div class="fg"><label>Tipo de contrato</label>
        <select class="fc" id="auType" onchange="${onchange}">${AUTH_TYPES.map(t => `<option value="${t.id}" ${t.id === st.type ? 'selected' : ''}>${t.name}</option>`).join('')}</select></div>
      <div class="fg"><label>Valor total del contrato (US$)</label>
        <input class="fc" id="auAmount" type="number" min="0" step="1000" value="${st.amount}" oninput="${onchange}"></div>
    </div>
    <div class="au-flags">${AUTH_FLAGS.map(f => `<label class="au-flag${st.flags.has(f.id) ? ' on' : ''}">
      <input type="checkbox" value="${f.id}" ${st.flags.has(f.id) ? 'checked' : ''} onchange="${onchange}">
      <span class="au-flag-box"><i class="ti ti-check"></i></span><span>${f.label}</span></label>`).join('')}</div>`;
}
function readAuthForm(st) {
  const ty = $('#auType'), am = $('#auAmount');
  if (ty) st.type = ty.value;
  if (am) st.amount = parseFloat(am.value) || 0;
  st.flags = new Set($$('.au-flag input:checked').map(i => i.value));
  $$('.au-flag').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
}
function authSimUpdate() {
  readAuthForm(authSim);
  const out = $('#auSimOut');
  if (out) out.innerHTML = authResultBlock(calcAuth(authSim.type, authSim.amount, authSim.flags));
}

/* Panel de resultado: cadena de aprobación + alertas */
function authResultBlock(res) {
  const sev = res.alerts.some(a => a.sev === 'crit') ? 'crit' : res.alerts.some(a => a.sev === 'warn') ? 'warn' : 'ok';
  const head = sev === 'ok'
    ? `<div class="au-head ok"><i class="ti ti-circle-check"></i><div><strong>Aprobación estándar</strong> — la autoridad delegada para este contrato es ${res.final.name} (${res.final.code}).</div></div>`
    : `<div class="au-head ${sev}"><i class="ti ti-alert-triangle"></i><div><strong>Este contrato requiere aprobaciones adicionales</strong> — la autoridad final es ${res.final.name} (${res.final.code}); ${res.chain.length} ${res.chain.length === 1 ? 'nivel debe aprobar' : 'niveles deben aprobar'} antes de la firma.</div></div>`;
  return `${head}
    <div class="au-chain">${res.steps.map((s, i) => `<div class="au-step${s.approver ? ' apr' : ''}">
      <span class="au-step-n">${i + 1}</span>
      <div><div class="au-step-who">${s.who}${s.code ? ` <span class="au-code">${s.code}</span>` : ''}</div><div class="au-step-act">${s.act}</div></div>
    </div>`).join('<i class="ti ti-chevron-right au-arr"></i>')}</div>
    ${res.alerts.length ? `<div class="au-alerts">${res.alerts.map(a => `<div class="au-alert ${a.sev}"><i class="ti ti-${a.sev === 'crit' ? 'alert-triangle' : a.sev === 'warn' ? 'alert-circle' : 'info-circle'}"></i><span>${a.txt}</span></div>`).join('')}</div>` : ''}
    <div class="au-src"><i class="ti ti-file-certificate"></i>Fuente: ${AUTH_SOURCE} · tipo “${res.type.name}” · valor ${authMoney(res.amt)}</div>`;
}

/* ───────── PASO DE APROBACIONES EN LA SOLICITUD ───────── */
function renderStepAuth() {
  const s = state.modalSvc;
  if (!state.authReq) state.authReq = { type: s.contract || 'srv', amount: 0, flags: new Set() };
  const st = state.authReq;
  $('#mStepBody').innerHTML = `
    <div class="info-banner" style="margin-bottom:1rem"><i class="ti ti-hierarchy-3"></i><span>Antes de enviar, el portal valida las aprobaciones que exige el <strong>${AUTH_SOURCE}</strong> según el tipo de contrato y su monto.</span></div>
    ${authFormFields(st, 'authReqUpdate()')}
    <div id="auReqOut">${authResultBlock(calcAuth(st.type, st.amount, st.flags))}</div>
    <button class="mcont" onclick="goStep(3)"><i class="ti ti-arrow-right"></i>Continuar al envío</button>`;
}
function authReqUpdate() {
  readAuthForm(state.authReq);
  const out = $('#auReqOut');
  if (out) out.innerHTML = authResultBlock(calcAuth(state.authReq.type, state.authReq.amount, state.authReq.flags));
}
/* Resumen de aprobaciones que se muestra en el paso de envío */
function authSummary() {
  if (!state.authReq) return '';
  const res = calcAuth(state.authReq.type, state.authReq.amount, state.authReq.flags);
  const crit = res.alerts.some(a => a.sev === 'crit');
  return `<div class="au-sum ${crit ? 'crit' : ''}">
    <div class="au-sum-h"><i class="ti ti-${crit ? 'alert-triangle' : 'route'}"></i><strong>Ruta de aprobación de este contrato</strong><span>${authMoney(res.amt)}</span></div>
    <div class="au-sum-chain">${res.chain.map(k => `<span class="au-pill">${AUTH_LEVELS[k].code} · ${AUTH_LEVELS[k].short}</span>`).join('<i class="ti ti-arrow-right"></i>')}</div>
    ${crit ? `<div class="au-sum-note"><i class="ti ti-info-circle"></i>La solicitud se enviará con alerta de aprobaciones adicionales para ${res.final.name}.</div>` : ''}
  </div>`;
}
