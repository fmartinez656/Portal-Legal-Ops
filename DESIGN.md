# Design

Sistema visual del Portal Legal Ternova — v2 "Producto moderno". Superficie de producto limpia (registro Linear/Stripe/Notion) con identidad Ternova. Reemplaza la iteración "El Registro". Prototipo estático: `project/styles.css` + `project/*.js` + HTML.

## Theme

Doble tema **claro (default) + oscuro**, conmutable con toggle en la topbar, persistido en `localStorage` (`data-theme` en `<html>`). Estrategia de color **Restrained**: neutros con levísimo matiz morado + un único acento (naranja) para acción/estado. El color de área informa (6 dominios), no decora.

Escena: colaborador corporativo, en oficina con luz brillante, resolviendo un trámite bajo plazo → **claro por defecto**; el oscuro sirve al trabajo nocturno/preferencia.

## Color

### Marca
- `--brand` **#2E004F** — morado profundo (ink): titulares clave, botones primarios, superficies de marca.
- `--brand-hover` #431068 · `--brand-mid` #7A3FB5 (texto interactivo, nav activa, enlaces) · tints suaves.
- `--accent` **#FF8000** — naranja Ternova, acento único: foco, indicador activo, CTA de envío, sello del logo. Nunca decorativo.
- `--accent-hover` #E8730A.

### Neutros — claro
`--bg` #F6F5FA (canvas, matiz morado frío) · `--surface` #FFFFFF (tarjetas) · `--surface-2` #FBFAFE (2ª capa: sidebar/topbar/toolbars, thead) · `--border` #E7E5EF · `--border-strong` #D6D3E2 · `--text` #1A1523 · `--text-muted` #57506A (AA sobre surface y bg) · `--text-dim` #857E95 (solo decorativo/grande).

### Neutros — oscuro
`--bg` #0E0A14 · `--surface` #171221 · `--surface-2` #1E1729 · `--border` rgba(255,255,255,.09) · `--text` #F2EEF8 · `--text-muted` #A79FB5. Marca interactiva se aclara: `--brand-mid` #C4A5F0. Acento #FF9838.

### Áreas (6 dominios · base / texto-AA / tint-bg / borde)
Se conserva el mapa semántico existente, recalibrado para ambos temas: riesgo=rojo · asesoría=azul · transacciones=ámbar · litigio=terracota · educación=verde · governance=morado. Cada uso de color de estado acompaña **icono + texto** (no solo color).

Contraste objetivo: cuerpo ≥4.5:1, grande ≥3:1, verificado en claro y oscuro.

## Typography

Una familia + mono de datos (patrón de producto).
- `--sans` **Inter** (variable, Google Fonts) — display, UI, cuerpo, labels. Tracking -0.01 a -0.02em en titulares; `text-wrap:balance` en h1–h3.
- `--mono` **IBM Plex Mono** — datos con rigor: folios (SOL-2026-241), códigos (03.1), SLA, fechas, timestamps, KPIs numéricos. `font-variant-numeric: tabular-nums`.
- Se **retira Fraunces** (serif = señal editorial).

Escala **rem fija** (no fluida) para UI de producto:
`--fs-title` 1.875rem (page h1) · h2 1.25rem · h3 1.0625rem · body 0.9375rem · ui/dense 0.8125–0.875rem · meta 0.75rem. La única excepción con `clamp()` es el hero del login (momento de marca).

## Motion

Crispo en el trabajo, inmersivo solo en el momento de marca. Curvas custom (Emil):
- `--ease-out` cubic-bezier(.23,1,.32,1) · `--ease-in-out` cubic-bezier(.77,0,.175,1) · `--ease-drawer` cubic-bezier(.32,.72,0,1).
- Duraciones: `--d-fast` 140ms (press/hover) · `--d` 200ms (dropdowns, tabs) · `--d-slow` 280ms (modal, vistas).
- Solo `transform`/`opacity` (+ blur/clip-path como material premium). Botones: `scale(0.97)` en `:active`. Popovers/dropdowns **origin-aware** (escalan desde el trigger); modal centrado. Entradas nunca desde `scale(0)`.
- Stagger de grids 40–60ms. Count-up en KPIs. Barras (dashboard/certs/donut) animan al entrar.
- **`prefers-reduced-motion`**: crossfade/instantáneo, sin movimiento; color de estado conservado.

### Animación de marca (entrada) — override deliberado del "no page-load" de producto
1. **Splash al cargar**: lienzo morado; sello naranja se dibuja → wordmark "TERNOVA" revela por máscara → regla barre → "Portal Legal" aparece → disuelve al login. ~2s, **saltable** (clic/tecla), **una vez por sesión** (sessionStorage). Logo recreado en CSS/SVG (no PNG).
2. **Login → portal**: handoff ~600ms — login se difumina/recede, barrido de marca, shell entra con nav + contenido escalonados.

## Components

Vocabulario consistente en todas las pantallas. Cada control interactivo: default/hover/focus/active/disabled (+ loading/error donde aplique).
- **Shell**: topbar (sticky, 2ª capa, con toggle de tema) + sidebar (2ª capa) + main; tabbar inferior en móvil.
- **Cabeceras de vista**: h1 + subtítulo. **Se elimina el eyebrow en cada vista** (kicker mono en mayúsculas repetido = tell de IA); se conserva la etiqueta mono solo en labels de grupo del sidebar y como "cita" de datos.
- Tarjetas de área (índice de dominios), tarjetas de servicio, doc-cards, tablas, bandeja (arow + dropdown propio), KPIs, chips/pills de estado, modal 2 pasos, toast, dropdown custom, toggle.
- Foco visible tokenizado (`--accent` ring). Vacíos que enseñan. `z-index` semántico: dropdown 100 · topbar/sticky 200 · modal-backdrop 300 · modal 310 · tooltip 450 · toast 460 · splash 500.

## Layout

Grid 4/8px. Shell 244px sidebar + 1fr. `repeat(auto-fill/fit, minmax())` para grids responsivos. Responsividad estructural (colapsa sidebar → tabbar, tablas con scroll-x), no tipografía fluida. `max-width` del main 1400px.

## No hacer (bans)
Sin side-stripe >1px como acento, sin gradient-text, sin glassmorphism decorativo por defecto, sin eyebrow en cada sección, sin grids de tarjetas idénticas sin propósito, sin motion que no comunique estado.
