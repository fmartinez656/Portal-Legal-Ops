/* ===========================================================================
   APP — Lógica del portal (vanilla JS)
   Estado de sesión, navegación, render dinámico de áreas, modal 2 pasos,
   filtros de tabla, FAQs, checklists, toasts.
   =========================================================================== */
'use strict';

const ROLES = {
  req:  { name: 'Solicitante',     short: 'Solicitante',  team: false, color: '#1B5E96' },
  law:  { name: 'Abogado',         short: 'Abogado',      team: true,  color: '#1F7A4D' },
  mgr:  { name: 'Gerente legal',   short: 'Gerente',      team: true,  color: '#5B2A86' },
  adm:  { name: 'Admin',           short: 'Admin',        team: true,  color: '#B5780A' },
};
const NAMES = { req: 'Camila Ríos', law: 'Luis Mendoza', mgr: 'Ana Salgado', adm: 'Diego Paz' };
const abbr = (n) => n.replace(/^(\w)\w+\s/, '$1. ');

/* Capacidades por rol — fuente única de verdad del modelo de permisos */
const CAPS = {
  req: [],
  law: ['sla', 'inbox', 'inboxOwn', 'docEdit', 'history'],
  mgr: ['sla', 'inbox', 'inboxTeam', 'assign', 'docEdit', 'history', 'dash', 'audit'],
  adm: ['sla', 'inbox', 'inboxRead', 'docEdit', 'history', 'dash', 'audit', 'admin'],
};
function can(c) { return !!(state.role && CAPS[state.role].includes(c)); }
/* Cada vista protegida exige una capacidad */
const VIEW_CAP = { sla: 'sla', inbox: 'inbox', dash: 'dash', history: 'history', audit: 'audit', admin: 'admin' };
/* ¿El usuario crea solicitudes propias? Solo el solicitante. El equipo legal las recibe. */
function isRequester() { return state.role === 'req'; }

const state = {
  role: null,
  view: 'home',
  area: null,
  tab: null,
  reqFilter: 'all',
  modalSvc: null,
  modalStep: 1,
};

/* Estado de edición de documentación (en sesión) */
const docState = { deleted: new Set(), rename: {} };
const dkey = (name) => (state.area || '') + '::' + name;

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const initials = (n) => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

/* ───────── LOGIN ───────── */
function selRole(el, role) {
  $$('.rb').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  el.setAttribute('aria-checked', 'true');
  $$('.rb').forEach(b => { if (b !== el) b.setAttribute('aria-checked', 'false'); });
  state.role = role;
  const b = $('#lbtn');
  b.disabled = false;
  b.classList.remove('armed'); void b.offsetWidth; b.classList.add('armed');   // pulso hacia el siguiente paso
}

function doLogin() {
  if (!state.role) return;
  const r = ROLES[state.role];
  const nm = NAMES[state.role];
  // topbar usuario
  $('#uName').textContent = nm;
  const rt = $('#uRole'); rt.textContent = r.short;
  rt.style.background = 'color-mix(in srgb,' + r.color + ' 16%,transparent)';
  rt.style.color = r.color;
  const av = $('#uAv'); av.textContent = initials(nm); av.style.background = r.color;
  // permisos de navegación según rol
  applyPerms();
  // transición inmersiva login → portal (barrido de marca que enmascara el cambio)
  $('#ls').classList.add('hide');
  const fx = $('#enterFx');
  if (fx) { fx.classList.remove('sweep'); void fx.offsetWidth; fx.classList.add('sweep');
    setTimeout(() => fx.classList.remove('sweep'), 1000); }
  setTimeout(() => {
    $('#ls').style.display = 'none';
    $('#topbar').style.display = '';
    $('#shell').style.display = '';
    $('#mtab').style.display = '';
    buildAreaCards();
    buildHome();
    nav('home');
  }, 480);
}

/* ───────── TEMA CLARO / OSCURO ───────── */
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme-anim', '');            // activa la transición de color
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('tv-theme', next); } catch (e) {}
  clearTimeout(toggleTheme._t);
  toggleTheme._t = setTimeout(() => root.removeAttribute('data-theme-anim'), 340);
}

/* ───────── SPLASH DE MARCA (una vez por sesión) ───────── */
function dismissSplash(fast) {
  const s = $('#splash');
  if (!s || s.dataset.done) return;
  s.dataset.done = '1';
  if (fast) s.classList.add('skip');
  setTimeout(() => s.remove(), fast ? 460 : 120);
}
(function initSplash() {
  const s = document.getElementById('splash');
  if (!s) return;
  if (document.documentElement.getAttribute('data-splash') === 'skip') { s.remove(); return; }
  try { sessionStorage.setItem('tv-splash', '1'); } catch (e) {}
  s.addEventListener('click', () => dismissSplash(true));
  window.addEventListener('keydown', () => dismissSplash(true), { once: true });
  setTimeout(() => dismissSplash(false), 2720);        // tras la animación CSS
})();

/* ───────── COUNT-UP DE MÉTRICAS ───────── */
function animateCounts() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const scope = $('.vw.on');
  if (!scope) return;
  $$('.kpi-v,.lcard-v,.slac-v,.donut-v', scope).forEach(el => {
    if (el.dataset.counted) return;
    const raw = el.textContent.trim();
    const m = raw.match(/^(\D*)(\d[\d,]*\.?\d*)(.*)$/s);
    if (!m) return;
    const pre = m[1], numStr = m[2].replace(/,/g, ''), suf = m[3];
    const target = parseFloat(numStr);
    if (isNaN(target)) return;
    const decimals = (numStr.split('.')[1] || '').length;
    el.dataset.counted = '1';
    const dur = 620, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const val = target * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('es')) + suf;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
    })(t0);
  });
}

/* Muestra/oculta navegación y secciones según las capacidades del rol */
function applyPerms() {
  $$('[data-cap]').forEach(el => {
    const caps = el.dataset.cap.split(' ');
    el.style.display = caps.some(c => can(c)) ? '' : 'none';
  });
  // etiqueta de la bandeja: abogado ve "mis casos", gerente/admin ven "del equipo"
  const inboxLabel = can('inboxTeam') || can('inboxRead') ? 'Bandeja del equipo' : 'Mis casos asignados';
  $$('[data-nav="inbox"] .ni-lbl').forEach(s => s.textContent = inboxLabel);
}

function logout() {
  location.reload();
}

/* ───────── NAVEGACIÓN ───────── */
function nav(view, area) {
  // guarda de permisos
  if (VIEW_CAP[view] && !can(VIEW_CAP[view])) view = 'home';
  state.view = view;
  state.area = area || null;
  $$('.vw').forEach(v => v.classList.remove('on'));

  if (view === 'area') {
    renderArea(area);
    $('#v-area').classList.add('on');
  } else {
    const el = $('#v-' + view);
    if (el) el.classList.add('on');
    if (view === 'reqs') renderReqs();
    if (view === 'inbox') renderInbox();
    if (view === 'sla') animateCertBars();
    if (view === 'dash') renderDash();
    if (view === 'history') renderHistory();
    if (view === 'admin') renderAdmin();
  }

  // estados activos
  $$('.ni').forEach(n => n.classList.remove('on'));
  $$('.mtab a').forEach(n => n.classList.remove('on'));
  const key = view === 'area' ? 'area-' + area : view;
  $$('[data-nav="' + key + '"]').forEach(n => n.classList.add('on'));
  if (view === 'area') $$('[data-nav="home"]').forEach(n => {});

  // scroll arriba del main
  const main = $('.main'); if (main) main.scrollTop = 0;
  window.scrollTo({ top: 0 });

  requestAnimationFrame(animateCounts);
}

/* ───────── HOME: tarjetas de área ───────── */
function buildHome() {
  const req = isRequester();
  // KPIs: el solicitante ve sus propias solicitudes; el equipo legal no crea solicitudes
  const kReqAct = req
    ? `<div class="kpi"><div class="kpi-l"><i class="ti ti-file-stack"></i>Mis solicitudes activas</div><div class="kpi-v">3</div><div class="kpi-d warn"><i class="ti ti-clock"></i>1 vence hoy</div></div>`
    : `<div class="kpi"><div class="kpi-l"><i class="ti ti-file-stack"></i>Mis solicitudes activas</div><div class="kpi-v">0</div><div class="kpi-d"><i class="ti ti-minus"></i>Sin solicitudes propias</div></div>`;
  const kResolved = req
    ? `<div class="kpi"><div class="kpi-l"><i class="ti ti-circle-check"></i>Resueltas este mes</div><div class="kpi-v">12</div><div class="kpi-d up"><i class="ti ti-trending-up"></i>+4 vs. mayo</div></div>`
    : `<div class="kpi"><div class="kpi-l"><i class="ti ti-circle-check"></i>Resueltas este mes</div><div class="kpi-v">0</div><div class="kpi-d"><i class="ti ti-minus"></i>Como solicitante</div></div>`;
  const kDocs = `<div class="kpi"><div class="kpi-l"><i class="ti ti-download"></i>Documentos disponibles</div><div class="kpi-v">48</div><div class="kpi-d up"><i class="ti ti-check"></i>Autoservicio</div></div>`;
  const kAlerts = can('sla')
    ? `<div class="kpi" style="cursor:pointer" onclick="nav('sla')"><div class="kpi-l"><i class="ti ti-bell"></i>Alertas regulatorias</div><div class="kpi-v">2</div><div class="kpi-d crit"><i class="ti ti-alert-triangle"></i>Requieren acción</div></div>`
    : '';
  $('#homeKpis').innerHTML = kReqAct + kResolved + kDocs + kAlerts;

  // Nota contextual para el equipo legal
  $('#homeNote').innerHTML = req ? '' :
    `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-eye"></i>Esta es la <strong style="font-weight:600;margin:0 3px">vista del solicitante</strong>. Como parte del equipo legal no creas solicitudes propias; gestiona las del equipo desde la <a href="#" onclick="nav('inbox');return false" style="color:var(--brand);font-weight:600">bandeja</a>.</div>`;
}

const AREA_STATS = {
  risk: { sla: '24h–15 d.h.', cnt: '5 servicios' },
  adv:  { sla: '3–20 d.h.',   cnt: '5 servicios' },
  tx:   { sla: '3–30 d.h.',   cnt: '5 servicios' },
  lit:  { sla: '24h–mensual', cnt: '6 servicios' },
  edu:  { sla: '3–15 d.h.',   cnt: '4 servicios' },
  gov:  { sla: 'Autoservicio', cnt: 'Solo consulta' },
};
const AREA_DESC = {
  risk: 'Identifica, evalúa y mitiga riesgos legales y regulatorios en toda la operación.',
  adv:  'Consulta opiniones formales y precedentes, o solicita asesoría especializada.',
  tx:   'Genera contratos desde plantillas preaprobadas y haz seguimiento de firmas.',
  lit:  'Gestiona litigios, arbitrajes, audiencias y provisiones contables.',
  edu:  'Capacítate, certifícate y solicita talleres legales a la medida de tu equipo.',
  gov:  'Consulta el marco corporativo, comités, políticas y la matriz de aprobaciones.',
};

function buildAreaCards() {
  const order = ['risk', 'adv', 'tx', 'lit', 'edu', 'gov'];
  $('#areaGrid').innerHTML = order.map(k => {
    const a = AREAS[k], s = AREA_STATS[k];
    return `<article class="ac ac-${a.cls}" tabindex="0" role="button" onclick="nav('area','${k}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();nav('area','${k}')}">
      <div class="ac-top">
        <div class="aicon"><i class="ti ${a.icon}"></i></div>
        <span class="abadge">§ 0${order.indexOf(k) + 1}</span>
      </div>
      <h3 class="atitle">${a.title}</h3>
      <p class="adesc">${AREA_DESC[k]}</p>
      <div class="aftr">
        <span class="asla">SLA: <strong>${s.sla}</strong></span>
        <span style="display:flex;align-items:center;gap:.6rem">
          <span class="acnt">${s.cnt}</span>
          <i class="ti ti-arrow-right aarr"></i>
        </span>
      </div>
    </article>`;
  }).join('');
}

/* ───────── DETALLE DE ÁREA ───────── */
function renderArea(key) {
  const a = AREAS[key];
  const host = $('#v-area');
  const tabs = a.tabs;
  host.innerHTML = `
    <span class="back" onclick="nav('home')"><i class="ti ti-arrow-left"></i> Todas las áreas</span>
    <div class="dethdr" style="margin-top:1rem">
      <div class="det-ic ac-${a.cls}" style="background:var(--c${a.cls}b);color:var(--c${a.cls})"><i class="ti ${a.icon}"></i></div>
      <div class="dt-wrap">
        <div class="dtitle">${a.title}</div>
        <div class="dt-sub">${a.sub}</div>
      </div>
    </div>
    <div class="atabs" role="tablist">
      ${tabs.map((t, i) => `<button class="atab ${i === 0 ? 'on' : ''}" role="tab" onclick="switchTab(this,'${key}','${t}')">${TAB_LABELS[t]}</button>`).join('')}
    </div>
    <div id="tabHost"></div>`;
  renderTab(key, tabs[0]);
}

function switchTab(btn, key, tab) {
  $$('.atab', btn.parentElement).forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderTab(key, tab);
}

function renderTab(key, tab) {
  state.tab = tab;
  const host = $('#tabHost');
  host.innerHTML = '';
  const panel = document.createElement('div');
  panel.className = 'tabpanel on';
  host.appendChild(panel);

  switch (tab) {
    case 'docs':       panel.innerHTML = docGrid(AUTO[key].docs); break;
    case 'templates':  panel.innerHTML = templateBlock(key); break;
    case 'materials':  panel.innerHTML = docGrid(AUTO[key].materials); break;
    case 'policies':   panel.innerHTML = docGrid(AUTO[key].policies); break;
    case 'actas':      panel.innerHTML = actasBlock(key); break;
    case 'courses':    panel.innerHTML = docGrid(AUTO[key].courses); break;
    case 'checklist':  panel.innerHTML = checklistBlock(key); initChecklist(panel); break;
    case 'certs':      panel.innerHTML = certsBlock(key); animateCertBars(panel); break;
    case 'timeline':   panel.innerHTML = timelineBlock(key); break;
    case 'calendar':   panel.innerHTML = calendarBlock(key); break;
    case 'matrix':     panel.innerHTML = matrixBlock(key); break;
    case 'committees': panel.innerHTML = committeesBlock(key); break;
    case 'svcs':       panel.innerHTML = svcsBlock(key); break;
    case 'faq':        panel.innerHTML = faqBlock(key); initFaq(panel); break;
  }
}

/* ── Bloques de autoservicio ── */
function rerenderTab() { if (state.view === 'area' && state.tab) renderTab(state.area, state.tab); }

function docGrid(items, search) {
  const id = 'dg' + Math.random().toString(36).slice(2, 7);
  const editable = can('docEdit');
  const cards = items.filter(d => !docState.deleted.has(dkey(d.name))).map(d => {
    const key = dkey(d.name);
    const name = docState.rename[key] || d.name;
    const esc = name.replace(/'/g, '\\\'');
    return `
    <div class="doc-card${editable ? ' editable' : ''}" data-name="${name.toLowerCase()}" onclick="toast('Descargando “${esc}”')">
      ${editable ? `<div class="doc-acts">
        <button class="doc-act" title="Actualizar documento" onclick="event.stopPropagation();openDocModal('edit','${key}','${esc}')"><i class="ti ti-pencil"></i></button>
        <button class="doc-act del" title="Eliminar documento" onclick="event.stopPropagation();openDocModal('del','${key}','${esc}')"><i class="ti ti-trash"></i></button>
      </div>` : ''}
      <div class="doc-card-top">
        <div class="doc-ic"><i class="ti ${d.icon}"></i></div>
        <div><div class="doc-card-name">${name}</div><div class="doc-card-meta">${d.meta}</div></div>
      </div>
      <span class="doc-tag"><i class="ti ti-tag"></i>${d.tag}</span>
    </div>`;
  }).join('');
  const note = editable ? `<div class="doc-editnote"><i class="ti ti-edit"></i>Como ${ROLES[state.role].short.toLowerCase()}, puedes actualizar o eliminar documentos. Cada cambio queda en el historial.</div>` : '';
  return `${note}<div class="srch-box"><i class="ti ti-search"></i>
      <input type="text" placeholder="Buscar documentos…" oninput="filterDocs(this)">
    </div>
    <div class="doc-grid" id="${id}">${cards}</div>`;
}
function filterDocs(input) {
  const q = input.value.toLowerCase().trim();
  const grid = input.closest('.tabpanel').querySelector('.doc-grid');
  let shown = 0;
  $$('.doc-card', grid).forEach(c => {
    const m = c.dataset.name.includes(q);
    c.style.display = m ? '' : 'none';
    if (m) shown++;
  });
  let empty = grid.parentElement.querySelector('.empty');
  if (shown === 0) {
    if (!empty) { empty = document.createElement('div'); empty.className = 'empty'; empty.innerHTML = '<i class="ti ti-search-off"></i>Sin resultados'; grid.after(empty); }
  } else if (empty) empty.remove();
}

function templateBlock(key) {
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-info-circle"></i>Plantillas preaprobadas por Legal. Úsalas directamente para operaciones estándar; para casos complejos solicita revisión con abogado en la pestaña Servicios.</div>
    ${docGrid(AUTO[key].templates)}`;
}

function checklistBlock(key) {
  const items = AUTO[key].checklist;
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-clipboard-check"></i>Autoevaluación de cumplimiento. Marca cada punto verificado; tu puntaje se calcula automáticamente.</div>
    <div class="chk-list">
      ${items.map((t, i) => `<div class="chk-item" data-i="${i}" onclick="toggleChk(this)">
        <div class="chk-box"></div><div class="chk-txt">${t}</div></div>`).join('')}
    </div>
    <div class="score-row"><span>Puntaje de cumplimiento</span><span class="score-v" id="scoreV">0%</span></div>`;
}
function initChecklist() { /* puntaje arranca en 0 */ }
function toggleChk(el) {
  el.classList.toggle('chk');
  const panel = el.closest('.tabpanel');
  const all = $$('.chk-item', panel);
  const done = $$('.chk-item.chk', panel).length;
  const pct = Math.round((done / all.length) * 100);
  const v = $('#scoreV', panel); if (v) v.textContent = pct + '%';
}

function certsBlock(key) {
  const certs = AUTO[key].certs;
  return `<div class="cert-grid">
    ${certs.map(c => `<div class="cert-item">
      <div class="cert-h"><span>${c.name}</span><span>${c.pct}%</span></div>
      <div class="cert-bar"><div class="cert-fill" style="width:${c.pct}%"></div></div>
    </div>`).join('')}
  </div>`;
}
function animateCertBars(scope) { /* anchos ya inline; sin animación dependiente de rAF */ }

function timelineBlock(key) {
  const tl = AUTO[key].timeline;
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-route"></i>Seguimiento en vivo de tu contrato en proceso de firma.</div>
    <div class="tl-wrap">
      <div class="tl-hdr"><span>CTR-2026-089 · Contrato de servicios</span><span class="slabadge sla-a"><i class="ti ti-clock"></i>En revisión</span></div>
      ${tl.map(t => `<div class="tl-item">
        <div class="tl-dot ${t.state}"></div>
        <div class="tl-label">${t.label}</div>
        <div class="tl-meta">${t.meta}</div>
      </div>`).join('')}
    </div>`;
}

function calendarBlock(key) {
  const cal = AUTO[key].calendar;
  return `<div class="gtable-wrap"><table class="rt">
    <thead><tr><th>Fecha</th><th>Evento</th><th>Expediente</th><th>Tribunal</th></tr></thead>
    <tbody>${cal.map(c => `<tr><td style="font-weight:600;white-space:nowrap">${c.date}</td><td>${c.event}</td><td><span class="sc-code">${c.exp}</span></td><td style="color:var(--mut)">${c.tribunal}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function matrixBlock(key) {
  const m = AUTO[key].matrix;
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-hierarchy-2"></i>Quién aprueba qué, y por cuál canal. Consulta antes de iniciar cualquier acto que requiera autorización.</div>
    <div class="gtable-wrap"><table class="rt">
    <thead><tr><th>Acto / Umbral</th><th>Aprobador requerido</th><th>Canal</th></tr></thead>
    <tbody>${m.map(r => `<tr><td style="font-weight:600">${r.acto}</td><td>${r.aprobador}</td><td style="color:var(--mut)">${r.canal}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function committeesBlock(key) {
  const c = AUTO[key].committees;
  return `<div class="gtable-wrap"><table class="rt">
    <thead><tr><th>Comité</th><th>Frecuencia</th><th>Próxima sesión</th><th>Preside</th></tr></thead>
    <tbody>${c.map(x => `<tr><td style="font-weight:600">${x.name}</td><td>${x.freq}</td><td style="white-space:nowrap"><span class="slabadge sla-g"><i class="ti ti-calendar"></i>${x.prox}</span></td><td style="color:var(--mut)">${x.chair}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function actasBlock(key) {
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-lock"></i>Acceso restringido. Solo miembros del comité, Gerente Legal y Admin pueden abrir actas de sesiones pasadas.</div>
    ${docGrid(AUTO[key].actas)}`;
}

/* ── Servicios con abogado ── */
const SLA_CLS = { g: 'sla-g', a: 'sla-a', r: 'sla-r' };
const SLA_TXT = { g: 'Rápido', a: 'Medio', r: 'Extenso' };

function svcsBlock(key) {
  const svcs = SVCS[key];
  if (!svcs || !svcs.length) {
    return `<div class="empty"><i class="ti ti-mood-smile"></i>Esta área es 100% autoservicio. No requiere intervención del equipo legal.</div>`;
  }
  return `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-user-shield"></i>Servicios que requieren intervención del equipo legal. Cada uno tiene un código, SLA estimado e insumos requeridos.</div>
    <div class="sgrid">
    ${svcs.map((s, i) => {
      const restricted = s.restr && !canAccess(s);
      return `<div class="sc">
        <div class="sc-top">
          <span class="sc-code">${s.code}</span>
          <span class="slabadge ${SLA_CLS[s.st]}"><i class="ti ti-clock-hour-4"></i>${s.sla}</span>
        </div>
        <div class="sc-name">${s.name}</div>
        <div class="sc-resp"><i class="ti ti-user"></i>${s.resp}</div>
        <div class="sc-del"><strong>Entregable</strong>${s.del}</div>
        ${s.restr ? `<div class="restr"><i class="ti ti-lock"></i>${s.who}</div>` : ''}
        <button class="svc-btn" ${restricted ? 'disabled' : ''} onclick="openModal('${key}',${i})">
          ${restricted ? '<i class="ti ti-lock"></i>Acceso restringido' : '<i class="ti ti-send"></i>Solicitar servicio'}
        </button>
      </div>`;
    }).join('')}
    </div>`;
}

function canAccess(svc) {
  // Solo Gerente y Admin desbloquean servicios restringidos en este prototipo
  return state.role === 'mgr' || state.role === 'adm';
}

function faqBlock(key) {
  const faq = AUTO[key].faq;
  return `<div style="max-width:760px">${faq.map(f => `<div class="faq-item">
    <div class="faq-q" onclick="toggleFaq(this)">${f.q}<i class="ti ti-chevron-down"></i></div>
    <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
  </div>`).join('')}</div>`;
}
function initFaq() {}
function toggleFaq(q) { q.parentElement.classList.toggle('open'); }

/* ───────── MODAL DE SOLICITUD (2 pasos) ───────── */
function openModal(key, idx) {
  const svc = SVCS[key][idx];
  state.modalSvc = svc; state.modalStep = 1;
  $('#mBg').classList.add('on');
  document.body.style.overflow = 'hidden';
  renderModal();
}
function closeModal() {
  $('#mBg').classList.remove('on');
  document.body.style.overflow = '';
  state.modalSvc = null;
}
function renderModal() {
  const s = state.modalSvc;
  const body = $('#mBody');
  body.innerHTML = `
    <div class="mhdr">
      <div>
        <span class="mcode">${s.code}</span>
        <div class="mtitle">${s.name}</div>
      </div>
      <button class="mclose" onclick="closeModal()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
    </div>
    <div class="msteps">
      <div class="mstep ${state.modalStep === 1 ? 'act' : 'done'}" id="mStep1"><span class="mstep-n">${state.modalStep === 1 ? '1' : '✓'}</span>Insumos</div>
      <div class="mstep ${state.modalStep === 2 ? 'act' : ''}" id="mStep2"><span class="mstep-n">2</span>Envío</div>
    </div>
    <div id="mStepBody"></div>`;
  state.modalStep === 1 ? renderStep1() : renderStep2();
}
function renderStep1() {
  const s = state.modalSvc;
  $('#mStepBody').innerHTML = `
    <div class="ins-lbl">Confirma que tienes lista esta información</div>
    ${s.ins.map((t, i) => `<div class="ins-item" data-i="${i}" onclick="toggleIns(this)">
      <div class="ins-box"></div><div class="ins-txt">${t}</div></div>`).join('')}
    <div class="prog-bar"><div class="prog-fill" id="progFill"></div></div>
    <div class="prog-lbl"><span id="progTxt">0 de ${s.ins.length} confirmados</span><span>SLA: ${s.sla}</span></div>
    <button class="mcont" id="contBtn" disabled onclick="goStep2()"><i class="ti ti-arrow-right"></i>Continuar al envío</button>`;
}
function toggleIns(el) {
  el.classList.toggle('chk');
  const all = $$('.ins-item');
  const done = $$('.ins-item.chk').length;
  const pct = (done / all.length) * 100;
  $('#progFill').style.width = pct + '%';
  $('#progTxt').textContent = `${done} de ${all.length} confirmados`;
  $('#contBtn').disabled = done < all.length;
}
function goStep2() { state.modalStep = 2; renderModal(); }
function renderStep2() {
  const s = state.modalSvc;
  $('#mStep1').classList.add('done'); $('#mStep1').classList.remove('act');
  $('#mStepBody').innerHTML = `
    <div class="sla-info"><i class="ti ti-clock-hour-4"></i>Tiempo estimado de respuesta: <strong style="margin-left:2px">${s.sla}</strong></div>
    <form class="mform" onsubmit="submitModal(event)">
      <div class="fg"><label>Asunto de la solicitud</label>
        <input class="fc" required placeholder="Resume tu solicitud en una línea"></div>
      <div class="frow">
        <div class="fg"><label>Jurisdicción</label>
          <select class="fc"><option>Guatemala</option><option>Honduras</option><option>El Salvador</option><option>Costa Rica</option><option>México</option><option>Regional / Varias</option></select></div>
        <div class="fg"><label>Prioridad</label>
          <select class="fc"><option>Normal</option><option>Alta</option><option>Urgente</option></select></div>
      </div>
      <div class="fg"><label>Descripción y contexto</label>
        <textarea class="fc" required placeholder="Describe el contexto, objetivos y cualquier detalle relevante para el equipo legal…"></textarea></div>
      <div class="fg"><label>Fecha objetivo (opcional)</label>
        <input class="fc" type="date"></div>
      <button type="submit" class="sbtn"><i class="ti ti-send"></i>Enviar solicitud al equipo legal</button>
    </form>`;
}
function submitModal(e) {
  e.preventDefault();
  const code = state.modalSvc.code;
  closeModal();
  toast(`Solicitud ${code} enviada · ticket #${Math.floor(1000 + Math.random() * 9000)}`);
}

/* ───────── EDICIÓN DE DOCUMENTACIÓN ───────── */
const AREA_NAME = { risk: 'Riesgo y compliance', adv: 'Asesoría legal', tx: 'Transacciones', lit: 'Litigio y arbitraje', edu: 'Educación legal', gov: 'Governance' };

function openDocModal(mode, key, name) {
  if (!can('docEdit')) return;
  $('#mBg').classList.add('on');
  document.body.style.overflow = 'hidden';
  const body = $('#mBody');
  if (mode === 'edit') {
    body.innerHTML = `
      <div class="mhdr">
        <div><span class="mcode">ACTUALIZAR</span><div class="mtitle">Actualizar documento</div></div>
        <button class="mclose" onclick="closeModal()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
      </div>
      <form class="mform" onsubmit="applyDocEdit(event,'${key}')">
        <div class="fg"><label>Nombre del documento</label>
          <input class="fc" id="docName" required value="${name}"></div>
        <div class="fg"><label>Nota de versión</label>
          <textarea class="fc" id="docNote" required placeholder="Describe qué cambió en esta versión…"></textarea></div>
        <div class="sla-info"><i class="ti ti-history"></i>El cambio quedará registrado a tu nombre en el historial del portal.</div>
        <button type="submit" class="mcont"><i class="ti ti-device-floppy"></i>Guardar nueva versión</button>
      </form>`;
  } else {
    body.innerHTML = `
      <div class="mhdr">
        <div><span class="mcode" style="background:var(--crb);color:var(--crl)">ELIMINAR</span><div class="mtitle">Eliminar documento</div></div>
        <button class="mclose" onclick="closeModal()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
      </div>
      <div class="del-warn"><i class="ti ti-alert-triangle"></i><div>Vas a eliminar <strong>${name}</strong> del portal. Esta acción queda registrada en el historial de cambios.</div></div>
      <form class="mform" onsubmit="confirmDeleteDoc(event,'${key}','${name.replace(/'/g, "\\'")}')">
        <div class="fg"><label>Motivo de la eliminación</label>
          <textarea class="fc" id="docNote" required placeholder="Ej. documento obsoleto, reemplazado por nueva versión…"></textarea></div>
        <button type="submit" class="sbtn" style="background:var(--cr)"><i class="ti ti-trash"></i>Eliminar definitivamente</button>
      </form>`;
  }
}
function applyDocEdit(e, key) {
  e.preventDefault();
  const newName = $('#docName').value.trim();
  const note = $('#docNote').value.trim();
  docState.rename[key] = newName;
  logChange('edit', newName, note);
  closeModal();
  rerenderTab();
  toast(`Documento actualizado · “${newName}”`);
}
function confirmDeleteDoc(e, key, name) {
  e.preventDefault();
  const note = $('#docNote').value.trim();
  docState.deleted.add(key);
  logChange('del', name, note);
  closeModal();
  rerenderTab();
  toast(`Documento eliminado · “${name}”`);
}
function logChange(action, doc, note) {
  CHANGES.unshift({
    action, doc, note: note || '',
    area: AREA_NAME[state.area] || '—',
    who: NAMES[state.role], role: ROLES[state.role].short, color: ROLES[state.role].color,
    when: 'Ahora',
  });
  if (state.view === 'history') renderHistory();
}

/* ───────── MIS SOLICITUDES ───────── */
const REQS = [
  { id: 'SOL-2026-241', svc: '03.1 · Revisión de contrato externo', date: '02 Jun 2026', st: 'rev', resp: 'L. Mendoza', sla: '3 Jun' },
  { id: 'SOL-2026-238', svc: '01.1 · Análisis de riesgo legal', date: '30 May 2026', st: 'rev', resp: 'A. Salgado', sla: '4 Jun' },
  { id: 'SOL-2026-233', svc: '02.1 · Opinión legal formal', date: '28 May 2026', st: 'done', resp: 'L. Mendoza', sla: 'Entregado' },
  { id: 'SOL-2026-229', svc: '04.4 · Medidas cautelares', date: '27 May 2026', st: 'urg', resp: 'R. Castro', sla: 'Hoy' },
  { id: 'SOL-2026-221', svc: '05.2 · Taller legal a medida', date: '24 May 2026', st: 'recv', resp: 'Por asignar', sla: '31 May' },
  { id: 'SOL-2026-218', svc: '03.3 · Redacción de contrato a medida', date: '22 May 2026', st: 'done', resp: 'M. Flores', sla: 'Entregado' },
  { id: 'SOL-2026-210', svc: '01.5 · Compliance transaccional', date: '20 May 2026', st: 'done', resp: 'D. Paz', sla: 'Entregado' },
];
const ST_META = {
  recv: { cls: 's-recv', txt: 'Recibida', icon: 'ti-inbox' },
  rev:  { cls: 's-rev',  txt: 'En revisión', icon: 'ti-eye' },
  done: { cls: 's-done', txt: 'Entregada', icon: 'ti-check' },
  urg:  { cls: 's-urg',  txt: 'Urgente', icon: 'ti-alert-triangle' },
  rejected: { cls: 's-urg', txt: 'Eliminada', icon: 'ti-circle-x' },
};
function renderReqs() {
  const tb = $('#reqBody');
  // El equipo legal no crea solicitudes propias: vista del solicitante vacía
  if (!isRequester()) {
    $('#reqsNote').innerHTML = `<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-eye"></i>Vista del solicitante. Como parte del equipo legal no tienes solicitudes propias; las solicitudes entrantes se gestionan en la <a href="#" onclick="nav('inbox');return false" style="color:var(--brand);font-weight:600">bandeja del equipo</a>.</div>`;
    const filtersHide = $('#reqFilters'); if (filtersHide) filtersHide.style.display = 'none';
    tb.innerHTML = `<tr><td colspan="6"><div class="empty"><i class="ti ti-folder-open"></i>No tienes solicitudes propias registradas.</div></td></tr>`;
    return;
  }
  $('#reqsNote').innerHTML = '';
  const filters = $('#reqFilters'); if (filters) filters.style.display = '';
  const f = state.reqFilter;
  const rows = REQS.filter(r => f === 'all' || r.st === f);
  // Aviso si el equipo legal eliminó alguna solicitud
  const rejected = REQS.filter(r => r.st === 'rejected');
  $('#reqsNote').innerHTML = rejected.length
    ? `<div class="alert-banner" style="margin-bottom:1.1rem"><i class="ti ti-circle-x"></i>${rejected.length === 1 ? 'Una de tus solicitudes fue eliminada por el equipo legal. Revisa el motivo abajo.' : `${rejected.length} de tus solicitudes fueron eliminadas por el equipo legal. Revisa los motivos abajo.`}</div>`
    : '';
  if (!rows.length) { tb.innerHTML = `<tr><td colspan="6"><div class="empty"><i class="ti ti-folder-open"></i>Sin solicitudes en este filtro</div></td></tr>`; return; }
  tb.innerHTML = rows.map(r => {
    const m = ST_META[r.st];
    const reasonRow = r.reason
      ? `<div class="req-reason"><i class="ti ti-info-circle"></i><span><strong>Motivo de eliminación:</strong> ${r.reason} <em>— ${r.by}</em></span></div>`
      : '';
    return `<tr class="${r.st === 'rejected' ? 'req-rejected' : ''}">
      <td><span class="sc-code">${r.id}</span></td>
      <td style="font-weight:500">${r.svc}${reasonRow}</td>
      <td style="color:var(--mut);white-space:nowrap">${r.date}</td>
      <td>${r.resp}</td>
      <td><span class="stpill ${m.cls}"><i class="ti ${m.icon}"></i>${m.txt}</span></td>
      <td style="color:var(--mut);white-space:nowrap">${r.sla}</td>
    </tr>`;
  }).join('');
}
function fReq(btn, filter) {
  $$('#reqFilters .fchip').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  state.reqFilter = filter;
  renderReqs();
}

/* ───────── BANDEJA EQUIPO LEGAL ───────── */
const INBOX = [
  { id: 'SOL-2026-241', svc: '03.1 · Revisión de contrato externo', from: 'C. Ríos · Comercial', resp: 'L. Mendoza', sla: 'crit', slaTxt: 'Vence hoy', st: 'rev' },
  { id: 'SOL-2026-240', svc: '04.1 · Estrategia de defensa judicial', from: 'J. Méndez · Operaciones', resp: 'R. Castro', sla: 'crit', slaTxt: '< 24h', st: 'rev' },
  { id: 'SOL-2026-239', svc: '03.3 · Redacción de contrato a medida', from: 'M. Soto · Ventas', resp: 'L. Mendoza', sla: 'warn', slaTxt: '2 días', st: 'rev' },
  { id: 'SOL-2026-238', svc: '01.1 · Análisis de riesgo legal', from: 'P. Vargas · Finanzas', resp: 'A. Salgado', sla: 'warn', slaTxt: '2 días', st: 'rev' },
  { id: 'SOL-2026-236', svc: '02.1 · Opinión legal formal', from: 'RRHH', resp: 'L. Mendoza', sla: 'ok', slaTxt: '4 días', st: 'recv' },
  { id: 'SOL-2026-235', svc: '02.4 · Due diligence legal', from: 'Dir. M&A', resp: 'L. Mendoza', sla: 'warn', slaTxt: '5 días', st: 'recv' },
  { id: 'SOL-2026-233', svc: '03.4 · Terminación contractual', from: 'A. Lima · Compras', resp: 'M. Flores', sla: 'ok', slaTxt: '5 días', st: 'rev' },
  { id: 'SOL-2026-221', svc: '05.2 · Taller legal a medida', from: 'RRHH', resp: 'Por asignar', sla: 'ok', slaTxt: '6 días', st: 'recv' },
];
const LOAD = [
  { who: 'L. Mendoza', n: 8, pct: 80, color: 'var(--ct)' },
  { who: 'A. Salgado', n: 5, pct: 50, color: 'var(--ce)' },
  { who: 'R. Castro', n: 9, pct: 90, color: 'var(--cr)' },
  { who: 'M. Flores', n: 3, pct: 30, color: 'var(--ca)' },
];
const LAWYERS = ['L. Mendoza', 'A. Salgado', 'R. Castro', 'M. Flores'];

/* Solicitudes en cola — entrantes sin asignar (gestiona el Gerente legal) */
let QUEUE = [
  { id: 'SOL-2026-244', svc: '03.1 · Revisión de contrato externo', from: 'Camila Ríos · Comercial', requester: 'req', sla: 'warn', slaTxt: '2 días', date: '07 Jun 2026' },
  { id: 'SOL-2026-243', svc: '01.2 · Opinión regulatoria', from: 'P. Vargas · Finanzas', requester: null, sla: 'ok', slaTxt: '4 días', date: '07 Jun 2026' },
  { id: 'SOL-2026-242', svc: '05.2 · Taller legal a medida', from: 'RRHH', requester: null, sla: 'ok', slaTxt: '6 días', date: '06 Jun 2026' },
  { id: 'SOL-2026-237', svc: '02.5 · Asesoría en propiedad intelectual', from: 'Camila Ríos · Comercial', requester: 'req', sla: 'ok', slaTxt: '5 días', date: '06 Jun 2026' },
  { id: 'SOL-2026-234', svc: '04.3 · Arbitraje y ADR', from: 'J. Méndez · Operaciones', requester: null, sla: 'warn', slaTxt: '3 días', date: '05 Jun 2026' },
];

function renderInbox() {
  const mode = can('inboxTeam') ? 'team' : can('inboxRead') ? 'read' : 'own';
  const host = $('#v-inbox');

  if (mode === 'own') {
    const me = abbr(NAMES[state.role]);
    const mine = INBOX.filter(r => r.resp === me);
    const risk = mine.filter(r => r.sla === 'crit').length;
    host.innerHTML = `
      <div style="margin-bottom:1.5rem">
        <div class="eyebrow">Mi trabajo</div>
        <h1 class="ptitle">Mis casos asignados</h1>
        <p class="psub">Las solicitudes que tienes asignadas. Actualiza el estado conforme avanzas — la asignación y las urgencias las gestiona el Gerente legal.</p>
      </div>
      <div class="lkrow">
        <div class="lcard"><div class="lcard-l">Mis casos activos</div><div class="lcard-v">${mine.length}</div><div class="lcard-s" style="color:var(--ctl)">${mine.filter(r => r.st === 'rev').length} en revisión</div></div>
        <div class="lcard"><div class="lcard-l">SLA en riesgo</div><div class="lcard-v">${risk}</div><div class="lcard-s" style="color:var(--crl)">Vencen ≤ 24h</div></div>
        <div class="lcard"><div class="lcard-l">Resueltos esta semana</div><div class="lcard-v">7</div><div class="lcard-s" style="color:var(--cel)">A tiempo</div></div>
        <div class="lcard"><div class="lcard-l">Mi cumplimiento SLA</div><div class="lcard-v">96%</div><div class="lcard-s" style="color:var(--cel)">Últimos 30 días</div></div>
      </div>
      <div class="sh"><h2>Cola de mis casos</h2><span>${mine.length} asignados a ti</span></div>
      ${inboxRows(mine, 'own')}`;
    return;
  }

  const readonly = mode === 'read';
  const canQueue = can('assign');
  host.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <div class="eyebrow">Equipo legal</div>
      <h1 class="ptitle">Bandeja del equipo</h1>
      <p class="psub">${readonly ? 'Vista de administrador con visibilidad completa de la operación legal.' : 'Solicitudes entrantes, carga por abogado y gestión de asignaciones, urgencias y estado.'}</p>
    </div>
    ${readonly ? '<div class="info-banner" style="margin-bottom:1.1rem"><i class="ti ti-eye"></i>Vista de solo lectura — la asignación, eliminación y los cambios de urgencia los realiza el Gerente legal.</div>' : ''}
    <div class="lkrow">
      <div class="lcard"><div class="lcard-l">En cola</div><div class="lcard-v" id="kQueue">${QUEUE.length}</div><div class="lcard-s" style="color:var(--ctl)">Por asignar</div></div>
      <div class="lcard"><div class="lcard-l">SLA en riesgo</div><div class="lcard-v">3</div><div class="lcard-s" style="color:var(--crl)">Vencen ≤ 48h</div></div>
      <div class="lcard"><div class="lcard-l">Resueltas hoy</div><div class="lcard-v">6</div><div class="lcard-s" style="color:var(--cel)">A tiempo</div></div>
      <div class="lcard"><div class="lcard-l">Cumplimiento SLA</div><div class="lcard-v">94%</div><div class="lcard-s" style="color:var(--cel)">Últimos 30 días</div></div>
    </div>

    <div class="sh"><h2>Solicitudes en cola</h2><span>Revisa y asigna o descarta las solicitudes entrantes</span></div>
    ${readonly ? '' : '<div class="info-banner" style="margin-bottom:.85rem"><i class="ti ti-inbox"></i>Asigna cada solicitud a un abogado o elimínala indicando el motivo (el solicitante verá la razón en “Mis solicitudes”).</div>'}
    <div id="queueHost" style="margin-bottom:1.75rem">${queueRows(canQueue)}</div>

    <div class="sh"><h2>Carga por abogado</h2><span>Casos activos por persona</span></div>
    <div style="margin-bottom:1.75rem">${LOAD.map(l => `<div class="arow"><div class="ar-info"><div class="ar-name">${l.who}</div><div class="ar-who">${l.n} casos activos</div></div><div class="lbar"><i style="width:${l.pct}%;background:${l.color}"></i></div></div>`).join('')}</div>

    <div class="sh"><h2>Solicitudes asignadas</h2><span>${INBOX.length} en la bandeja</span></div>
    ${inboxRows(INBOX, readonly ? 'read' : 'team')}`;
}

/* ── Cola de solicitudes ── */
function queueRows(canAct) {
  if (!QUEUE.length) return `<div class="empty"><i class="ti ti-checks"></i>No hay solicitudes en cola. Todo asignado.</div>`;
  return QUEUE.map(q => `
    <div class="arow queue-row" data-id="${q.id}">
      <div class="ar-info">
        <div class="ar-code">${q.id} · ${q.date}</div>
        <div class="ar-name">${q.svc}</div>
        <div class="ar-who">De: ${q.from}</div>
      </div>
      <span class="ar-sla ${q.sla}">${q.slaTxt}</span>
      ${canAct ? `<div class="queue-acts">
        <div class="ar-st"><label class="ar-mini">Asignar a</label>${dropdown(q.id, 'qassign', [{ v: '', label: 'Elegir abogado…' }, ...LAWYERS.map(w => ({ v: w, label: w }))], '', false)}</div>
        <button class="q-del" onclick="openQueueDelete('${q.id}')"><i class="ti ti-trash"></i>Eliminar</button>
      </div>` : `<span class="queue-ro"><i class="ti ti-lock"></i>Solo lectura</span>`}
    </div>`).join('');
}

/* Asignar una solicitud en cola → pasa a "Solicitudes asignadas" */
function assignQueue(id, lawyer) {
  const i = QUEUE.findIndex(q => q.id === id);
  if (i < 0 || !lawyer) return;
  const q = QUEUE[i];
  QUEUE.splice(i, 1);
  INBOX.unshift({ id: q.id, svc: q.svc, from: q.from, resp: lawyer, sla: q.sla, slaTxt: q.slaTxt, st: 'recv' });
  // auditoría + actualización de vista
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} asignó ${q.id} a ${lawyer}`, 'var(--ca)');
  renderInbox();
  toast(`${id} asignado a ${lawyer}`);
}

/* Modal de eliminación con motivo (visible para el solicitante) */
function openQueueDelete(id) {
  const q = QUEUE.find(x => x.id === id);
  if (!q || !can('assign')) return;
  $('#mBg').classList.add('on');
  document.body.style.overflow = 'hidden';
  $('#mBody').innerHTML = `
    <div class="mhdr">
      <div><span class="mcode" style="background:var(--crb);color:var(--crl)">ELIMINAR</span><div class="mtitle">Eliminar solicitud</div></div>
      <button class="mclose" onclick="closeModal()" aria-label="Cerrar"><i class="ti ti-x"></i></button>
    </div>
    <div class="del-warn"><i class="ti ti-alert-triangle"></i><div>Vas a eliminar <strong>${q.id} · ${q.svc}</strong> de la cola. El solicitante (<strong>${q.from}</strong>) verá el motivo en “Mis solicitudes”.</div></div>
    <form class="mform" onsubmit="confirmQueueDelete(event,'${id}')">
      <div class="fg"><label>Motivo de la eliminación <span style="color:var(--crl)">*</span></label>
        <textarea class="fc" id="qReason" required minlength="8" placeholder="Ej. solicitud duplicada, fuera del alcance del equipo legal, falta de información crítica…"></textarea></div>
      <div class="sla-info"><i class="ti ti-eye"></i>Este motivo será visible para el solicitante y quedará registrado en la auditoría.</div>
      <button type="submit" class="sbtn" style="background:var(--cr)"><i class="ti ti-trash"></i>Eliminar y notificar al solicitante</button>
    </form>`;
}
function confirmQueueDelete(e, id) {
  e.preventDefault();
  const reason = $('#qReason').value.trim();
  const i = QUEUE.findIndex(q => q.id === id);
  if (i < 0) return;
  const q = QUEUE[i];
  QUEUE.splice(i, 1);
  // Visible para el solicitante: si la solicitud es suya, aparece como eliminada con motivo
  if (q.requester === 'req') {
    REQS.unshift({ id: q.id, svc: q.svc, date: q.date, st: 'rejected', resp: '—', sla: 'Eliminada', reason, by: NAMES[state.role] });
  }
  if (typeof logAudit === 'function') logAudit(`${NAMES[state.role]} eliminó ${q.id} — motivo: ${reason}`, 'var(--cr)');
  closeModal();
  renderInbox();
  toast(`${id} eliminada · solicitante notificado`);
}

/* Urgencia → clase + etiqueta de la píldora de SLA */
const URG = {
  ok:   { label: 'Normal',  txt: 'En plazo' },
  warn: { label: 'Alta',    txt: 'Prioritaria' },
  crit: { label: 'Urgente', txt: 'Urgente' },
};
const ST_LABEL = { recv: 'Recibida', rev: 'En revisión', wait: 'En espera de insumos', done: 'Entregada' };

/* Desplegable propio — se abre justo debajo del control donde se hace clic.
   field: 'resp' | 'sla' | 'st' · opts: [{v,label}] · cur: valor actual */
function dropdown(id, field, opts, cur, dis) {
  const sel = opts.find(o => o.v === cur) || opts[0];
  const items = opts.map(o =>
    `<button type="button" class="dd-opt${o.v === cur ? ' on' : ''}" role="option" data-v="${o.v}"
      onclick="pickDD(this,'${id}','${field}','${o.v}')">${o.label}<i class="ti ti-check"></i></button>`).join('');
  return `<div class="dd${dis ? ' dis' : ''}" data-field="${field}">
    <button type="button" class="dd-btn" ${dis ? 'disabled' : ''} onclick="toggleDD(this)" aria-haspopup="listbox">
      <span class="dd-val">${sel.label}</span><i class="ti ti-chevron-down dd-caret"></i>
    </button>
    <div class="dd-menu" role="listbox">${items}</div>
  </div>`;
}

function inboxRows(rows, mode) {
  if (!rows.length) return `<div class="empty"><i class="ti ti-inbox"></i>No tienes casos asignados ahora mismo.</div>`;
  const stOpts = [
    { v: 'recv', label: 'Recibida' }, { v: 'rev', label: 'En revisión' },
    { v: 'wait', label: 'En espera de insumos' }, { v: 'done', label: 'Entregada' },
  ];
  const urgOpts = [{ v: 'ok', label: 'Normal' }, { v: 'warn', label: 'Alta' }, { v: 'crit', label: 'Urgente' }];
  return rows.map(r => {
    let controls;
    if (mode === 'own') {
      controls = `<div class="ar-st"><label class="ar-mini">Estado</label>${dropdown(r.id, 'st', stOpts, r.st, false)}</div>`;
    } else {
      const dis = mode === 'read';
      const respOpts = [{ v: 'Por asignar', label: 'Por asignar' }, ...LAWYERS.map(w => ({ v: w, label: w }))];
      controls = `
      <div class="ar-st"><label class="ar-mini">Asignado a</label>${dropdown(r.id, 'resp', respOpts, r.resp, dis)}</div>
      <div class="ar-st"><label class="ar-mini">Urgencia</label>${dropdown(r.id, 'sla', urgOpts, r.sla, dis)}</div>
      <div class="ar-st"><label class="ar-mini">Estado</label>${dropdown(r.id, 'st', stOpts, r.st, dis)}</div>`;
    }
    return `<div class="arow inbox-row${r.st === 'done' ? ' row-done' : ''}" data-id="${r.id}">
      <div class="ar-info">
        <div class="ar-code">${r.id}</div>
        <div class="ar-name">${r.svc}</div>
        <div class="ar-who" data-who>De: ${r.from}${mode !== 'own' ? ' · Resp: ' + r.resp : ''}</div>
      </div>
      <span class="ar-sla ${r.sla}" data-sla>${r.slaTxt}</span>
      <div class="inbox-ctrls">${controls}</div>
    </div>`;
  }).join('');
}

/* Abre/cierra el menú; lo posiciona hacia arriba si no cabe debajo */
function toggleDD(btn) {
  const dd = btn.closest('.dd');
  const open = dd.classList.contains('open');
  closeAllDD();
  if (open) return;
  dd.classList.add('open');
  const menu = dd.querySelector('.dd-menu');
  const r = dd.getBoundingClientRect();
  const below = window.innerHeight - r.bottom;
  dd.classList.toggle('up', below < menu.offsetHeight + 16 && r.top > below);
}
function closeAllDD() { $$('.dd.open').forEach(d => d.classList.remove('open', 'up')); }

/* Selección de una opción */
function pickDD(opt, id, field, value) {
  const dd = opt.closest('.dd');
  dd.querySelectorAll('.dd-opt').forEach(o => o.classList.remove('on'));
  opt.classList.add('on');
  dd.querySelector('.dd-val').textContent = opt.childNodes[0].textContent.trim();
  closeAllDD();
  if (field === 'qassign') { assignQueue(id, value); return; }
  setInbox(id, field, value, dd);
}

/* Registra un evento en el log de auditoría (visible en la pestaña Auditoría) */
function logAudit(evt, color) {
  const wrap = $('#v-audit .audit-wrap');
  if (!wrap) return;
  const row = document.createElement('div');
  row.className = 'audit-row';
  row.innerHTML = `<span class="audit-dot" style="background:${color || 'var(--brand)'}"></span><div><div class="audit-evt">${evt}</div><div class="audit-meta">Ahora · ${NAMES[state.role]} · ${ROLES[state.role].short}</div></div>`;
  wrap.prepend(row);
}

/* Actualiza el modelo y refleja el cambio en la fila al instante */
function setInbox(id, field, value, sel) {
  const r = INBOX.find(x => x.id === id);
  if (!r) return;
  const row = sel.closest('.inbox-row');

  if (field === 'resp') {
    r.resp = value;
    const who = row.querySelector('[data-who]');
    if (who) who.innerHTML = who.innerHTML.replace(/· Resp:.*$/, '· Resp: ' + value);
    toast(value === 'Por asignar' ? `${id} sin asignar` : `${id} asignado a ${value}`);
  } else if (field === 'sla') {
    r.sla = value; r.slaTxt = URG[value].txt;
    const pill = row.querySelector('[data-sla]');
    pill.className = 'ar-sla ' + value;
    pill.textContent = URG[value].txt;
    row.classList.add('row-flash');
    setTimeout(() => row.classList.remove('row-flash'), 600);
    toast(`Urgencia de ${id}: ${URG[value].label}`);
  } else if (field === 'st') {
    r.st = value;
    row.classList.toggle('row-done', value === 'done');
    toast(`${id} · ${ST_LABEL[value]}`);
  }
}

/* ───────── TOAST ───────── */
let toastT;
function toast(msg) {
  let t = $('#toast');
  if (t) t.remove();
  t = document.createElement('div');
  t.id = 'toast'; t.className = 'toast';
  t.innerHTML = `<i class="ti ti-circle-check"></i>${msg}`;
  document.body.appendChild(t);
  clearTimeout(toastT);
  toastT = setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  }, 3000);
}

/* ───────── ATAJOS ───────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if ($('#mBg').classList.contains('on')) closeModal(); closeAllDD(); }
});
document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeAllDD(); }, true);
$('#mBg') && $('#mBg').addEventListener('click', e => { if (e.target.id === 'mBg') closeModal(); });
