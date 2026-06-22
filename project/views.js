/* ===========================================================================
   VIEWS — Tableros (dashboards), Historial de cambios, Administración
   Gerente legal + Admin (tableros/auditoría) · Admin (administración)
   =========================================================================== */
'use strict';

/* ───────── TABLEROS ───────── */
function renderDash() {
  const host = $('#v-dash');
  const maxArea = Math.max(...DASH.byArea.map(a => a.n));
  const maxTrend = Math.max(...DASH.trend.map(t => t.n));
  const totalStatus = DASH.byStatus.reduce((s, x) => s + x.n, 0);

  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <div class="eyebrow">Indicadores</div>
      <h1 class="ptitle">Tableros</h1>
      <p class="psub">Datos relevantes del portal para seguimiento de la operación legal. Visible para Gerente legal y Admin.</p>
    </div>

    <div class="krow">
      ${DASH.kpis.map(k => `<div class="kpi">
        <div class="kpi-l"><i class="ti ${k.icon}"></i>${k.l}</div>
        <div class="kpi-v">${k.v}</div>
        <div class="kpi-d ${k.cls}"><i class="ti ti-point-filled"></i>${k.d}</div>
      </div>`).join('')}
    </div>

    <div class="dash-grid">
      <div class="chart-card">
        <div class="chart-h"><h3>Solicitudes por área</h3><span>Últimos 90 días</span></div>
        <div class="vbars">
          ${DASH.byArea.map(a => `<div class="vbar">
            <div class="vbar-track"><div class="vbar-fill bar-${a.cls}" style="height:${Math.round(a.n / maxArea * 100)}%"><span class="vbar-n">${a.n}</span></div></div>
            <div class="vbar-l">${a.label}</div>
          </div>`).join('')}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-h"><h3>Estado de solicitudes</h3><span>${totalStatus} totales</span></div>
        <div class="donut-wrap">
          ${donutSVG(DASH.byStatus, totalStatus)}
          <div class="donut-legend">
            ${DASH.byStatus.map(s => `<div class="legend-row"><span class="legend-dot" style="background:${s.color}"></span>${s.label}<b>${s.n}</b></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card" style="margin-bottom:var(--gap)">
      <div class="chart-h"><h3>Volumen mensual de solicitudes</h3><span>6 meses</span></div>
      <div class="vbars trend">
        ${DASH.trend.map(t => `<div class="vbar">
          <div class="vbar-track"><div class="vbar-fill bar-trend" style="height:${Math.round(t.n / maxTrend * 100)}%"><span class="vbar-n">${t.n}</span></div></div>
          <div class="vbar-l">${t.m}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="dash-grid">
      <div class="chart-card">
        <div class="chart-h"><h3>Cumplimiento de SLA por área</h3><span>Meta: 90%</span></div>
        <div style="margin-top:.4rem">
          ${DASH.slaByArea.map(s => `<div class="hbar">
            <div class="hbar-l">${s.label}</div>
            <div class="hbar-track"><div class="hbar-fill ${s.pct >= 90 ? 'ok' : 'warn'}" style="width:${s.pct}%"></div></div>
            <div class="hbar-v">${s.pct}%</div>
          </div>`).join('')}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-h"><h3>Carga por abogado</h3><span>Casos activos</span></div>
        <div style="margin-top:.4rem">
          ${LOAD.map(l => `<div class="hbar">
            <div class="hbar-l">${l.who}</div>
            <div class="hbar-track"><div class="hbar-fill" style="background:${l.color};width:${l.pct}%"></div></div>
            <div class="hbar-v">${l.n}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;

  // animación de barras (decorativa; las alturas/anchos ya están inline)
}

function donutSVG(segs, total) {
  const R = 52, C = 2 * Math.PI * R;
  let off = 0;
  const rings = segs.map(s => {
    const frac = s.n / total;
    const len = frac * C;
    const ring = `<circle r="${R}" cx="70" cy="70" fill="none" stroke="${s.color}" stroke-width="20"
      stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"></circle>`;
    off += len;
    return ring;
  }).join('');
  return `<svg viewBox="0 0 140 140" class="donut" width="150" height="150">
    <circle r="${R}" cx="70" cy="70" fill="none" stroke="var(--bg3)" stroke-width="20"></circle>
    ${rings}
    <text x="70" y="64" text-anchor="middle" class="donut-v">${total}</text>
    <text x="70" y="84" text-anchor="middle" class="donut-l">solicitudes</text>
  </svg>`;
}

/* ───────── HISTORIAL DE CAMBIOS ───────── */
function renderHistory() {
  const host = $('#v-history');
  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <div class="eyebrow">Trazabilidad documental</div>
      <h1 class="ptitle">Historial de cambios</h1>
      <p class="psub">Registro de todas las altas, actualizaciones y eliminaciones de documentación del portal, con autor y fecha.</p>
    </div>
    <div class="rtable-wrap">
      <div class="rtoolbar"><h3>Cambios recientes</h3><span style="font-size:12.5px;color:var(--mut)">${CHANGES.length} eventos</span></div>
      <div style="overflow-x:auto">
        <table class="rt">
          <thead><tr><th>Acción</th><th>Documento</th><th>Área</th><th>Detalle</th><th>Autor</th><th>Cuándo</th></tr></thead>
          <tbody>
            ${CHANGES.map(c => {
              const m = CHANGE_META[c.action];
              return `<tr>
                <td><span class="stpill ${m.cls}"><i class="ti ${m.icon}"></i>${m.txt}</span></td>
                <td style="font-weight:600">${c.doc}</td>
                <td style="color:var(--mut);white-space:nowrap">${c.area}</td>
                <td style="color:var(--mut);max-width:280px">${c.note || '—'}</td>
                <td><span class="who-chip"><span class="who-dot" style="background:${c.color}"></span>${c.who} · ${c.role}</span></td>
                <td style="color:var(--mut);white-space:nowrap">${c.when}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ───────── ADMINISTRACIÓN ───────── */
const ADMIN_TABS = ['users', 'catalog', 'config'];
const ADMIN_LABELS = { users: 'Usuarios y roles', catalog: 'Catálogo y SLA', config: 'Configuración' };

function renderAdmin(tab) {
  const t = tab || 'users';
  const host = $('#v-admin');
  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <div class="eyebrow">Administración</div>
      <h1 class="ptitle">Administración del portal</h1>
      <p class="psub">Gestión de usuarios y roles, catálogo de servicios con sus SLA, y configuración general del portal. Acceso exclusivo de Admin.</p>
    </div>
    <div class="atabs" role="tablist">
      ${ADMIN_TABS.map(x => `<button class="atab ${x === t ? 'on' : ''}" onclick="switchAdmin(this,'${x}')">${ADMIN_LABELS[x]}</button>`).join('')}
    </div>
    <div id="adminHost"></div>`;
  renderAdminTab(t);
}
function switchAdmin(btn, tab) {
  $$('.atab', btn.parentElement).forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderAdminTab(tab);
}
function renderAdminTab(tab) {
  const host = $('#adminHost');
  if (tab === 'users') host.innerHTML = adminUsers();
  else if (tab === 'catalog') host.innerHTML = adminCatalog();
  else host.innerHTML = adminConfig();
}

function adminUsers() {
  const rows = USERS.map(u => {
    const r = ROLES[u.role];
    return `<tr>
      <td><span class="who-chip"><span class="av" style="width:26px;height:26px;font-size:10px;background:${r.color}">${initials(u.name)}</span>${u.name}</span></td>
      <td style="color:var(--mut)">${u.email}</td>
      <td><span class="rtag" style="background:color-mix(in srgb,${r.color} 16%,transparent);color:${r.color}">${r.short}</span></td>
      <td style="color:var(--mut)">${u.area}</td>
      <td><span class="stpill ${u.st === 'on' ? 's-done' : 's-urg'}"><i class="ti ti-point-filled"></i>${u.st === 'on' ? 'Activo' : 'Inactivo'}</span></td>
      <td style="color:var(--mut);white-space:nowrap">${u.last}</td>
      <td><button class="mini-btn" onclick="toast('Editar rol de ${u.name.split(' ')[0]} — demo')"><i class="ti ti-pencil"></i>Editar</button></td>
    </tr>`;
  }).join('');
  return `<div class="admin-toolbar">
      <div><b>${USERS.length}</b> usuarios · <b>${USERS.filter(u => u.st === 'on').length}</b> activos</div>
      <button class="mini-btn primary" onclick="toast('Invitar usuario — demo')"><i class="ti ti-user-plus"></i>Invitar usuario</button>
    </div>
    <div class="rtable-wrap"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Área</th><th>Estado</th><th>Último acceso</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>`;
}

function adminCatalog() {
  const all = [];
  Object.keys(SVCS).forEach(k => SVCS[k].forEach(s => all.push({ ...s, area: AREAS[k].title, cls: AREAS[k].cls })));
  const rows = all.map(s => `<tr>
      <td><span class="sc-code">${s.code}</span></td>
      <td style="font-weight:600">${s.name}</td>
      <td><span class="area-chip area-${s.cls}">${s.area}</span></td>
      <td style="white-space:nowrap">${s.sla}</td>
      <td>${s.restr ? '<span class="stpill s-rev"><i class="ti ti-lock"></i>Restringido</span>' : '<span style="color:var(--mut);font-size:12px">Abierto</span>'}</td>
      <td><label class="toggle"><input type="checkbox" checked onchange="toast('${s.code} '+(event.target.checked?'activado':'desactivado'))"><span class="toggle-track"></span></label></td>
    </tr>`).join('');
  return `<div class="admin-toolbar">
      <div><b>${all.length}</b> servicios en el catálogo · <b>${all.filter(s => s.restr).length}</b> restringidos</div>
      <button class="mini-btn primary" onclick="toast('Nuevo servicio — demo')"><i class="ti ti-plus"></i>Nuevo servicio</button>
    </div>
    <div class="rtable-wrap"><div style="overflow-x:auto"><table class="rt">
      <thead><tr><th>Código</th><th>Servicio</th><th>Área</th><th>SLA</th><th>Acceso</th><th>Activo</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>`;
}

function adminConfig() {
  const roleCols = [['req', 'Solicitante'], ['law', 'Abogado'], ['mgr', 'Gerente'], ['adm', 'Admin']];
  const matrix = `<div class="cfg-card">
      <div class="cfg-h"><i class="ti ti-shield-lock"></i><h3>Política de permisos</h3></div>
      <p class="cfg-sub">Qué puede hacer cada rol en el portal. Esta es la fuente de verdad del control de acceso.</p>
      <div style="overflow-x:auto"><table class="rt perm-table">
        <thead><tr><th>Capacidad</th>${roleCols.map(c => `<th style="text-align:center">${c[1]}</th>`).join('')}</tr></thead>
        <tbody>${PERM_MATRIX.map(p => `<tr>
          <td style="font-weight:500">${p.cap}</td>
          ${roleCols.map(c => `<td style="text-align:center">${p[c[0]] ? '<i class="ti ti-check perm-yes"></i>' : '<span class="perm-no">–</span>'}</td>`).join('')}
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`;

  const juris = `<div class="cfg-card">
      <div class="cfg-h"><i class="ti ti-map-pin"></i><h3>Jurisdicciones activas</h3></div>
      <p class="cfg-sub">Países habilitados en formularios y catálogos del portal.</p>
      <div class="chip-row">${JURISDICTIONS.map(j => `<span class="cfg-chip on"><i class="ti ti-check"></i>${j}</span>`).join('')}
        <button class="cfg-chip add" onclick="toast('Agregar jurisdicción — demo')"><i class="ti ti-plus"></i>Agregar</button></div>
    </div>`;

  const integ = `<div class="cfg-card">
      <div class="cfg-h"><i class="ti ti-plug"></i><h3>Integraciones</h3></div>
      <p class="cfg-sub">Servicios conectados al portal.</p>
      <div>${INTEGRATIONS.map(i => `<div class="integ-row">
        <div class="integ-ic"><i class="ti ${i.icon}"></i></div>
        <div class="integ-info"><div class="integ-name">${i.name}</div><div class="integ-meta">${i.meta}</div></div>
        <span class="integ-st ${i.st === 'on' ? 'on' : 'off'}">${i.st === 'on' ? 'Conectado' : 'Desconectado'}</span>
      </div>`).join('')}</div>
    </div>`;

  return `<div class="cfg-grid">${juris}${integ}</div>${matrix}`;
}
