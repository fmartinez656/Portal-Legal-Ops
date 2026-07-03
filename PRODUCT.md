# Product

## Register

product

## Users

Cuatro perfiles dentro de Grupo Ternova, todos autenticados con cuenta corporativa (@ternova.group):

- **Solicitante** — colaboradores de áreas no legales (Comercial, Finanzas, Operaciones, RRHH…) que resuelven trámites por autoservicio o piden servicios al equipo legal.
- **Abogado** — atiende las solicitudes que le asignan y gestiona sus casos.
- **Gerente legal** — supervisa la bandeja del equipo, asigna, prioriza y ve tableros/auditoría.
- **Admin** — acceso total: administración de usuarios, catálogo, permisos.

Contexto de uso: entorno de trabajo corporativo, en escritorio y móvil, bajo presión de plazos (SLA) y con necesidad de trazabilidad. El usuario está *en una tarea*: encontrar un documento, pedir un servicio, mover un caso.

## Product Purpose

Portal de autoservicio del equipo Legal de Ternova. Centraliza documentos, plantillas, catálogo de servicios con abogado, seguimiento de solicitudes, alertas de vencimientos (SLA), tableros y auditoría — con permisos por rol. El éxito es: resolver por autoservicio lo resoluble, canalizar al equipo legal lo que requiere criterio jurídico, y que todo quede con SLA claro y trazable. Menos correos, menos fricción, más trazabilidad.

## Brand Personality

Serio, preciso y confiable, pero moderno y sin fricción. Voz institucional que respeta el tiempo del usuario. Tres palabras: **preciso, sobrio, actual**. Emocionalmente debe transmitir *confianza y control* — nunca ansiedad ni ruido. La marca Ternova (morado profundo + naranja) aporta identidad; el naranja es un acento disciplinado, no decoración.

## Anti-references

- **Genérico "SaaS-cream / template de IA"**: fondos beige, eyebrow en mayúsculas sobre cada sección, grids de tarjetas idénticas, número 01/02/03 decorativos. Debe sentirse propio de Ternova, no plantilla.
- El motivo editorial recargado de la iteración anterior ("El Registro": estratos horizontales repetidos, sello sesgado por toda la UI, titulares serif). Se retira en favor de una superficie de producto limpia.
- Portales legales corporativos anticuados (tablas densas grises, cero jerarquía, todo del mismo peso).
- Motion gratuito que distrae del trabajo.

## Design Principles

1. **La herramienta desaparece en la tarea.** Familiaridad ganada (Linear/Stripe/Notion): el usuario confía y avanza sin pausas por componentes "raros".
2. **El movimiento comunica estado, no adorna.** Inmersivo en el momento de marca (entrada), crispo e invisible en el trabajo diario. Siempre con `prefers-reduced-motion`.
3. **Identidad Ternova con disciplina.** Morado como marca, naranja como único acento de acción/estado. El color de área informa, no decora.
4. **Precisión legal como carácter.** Los datos (folios, códigos, SLA, fechas) van en monoespaciada tabular: rigor visible.
5. **Cada estado existe.** default/hover/focus/active/disabled y vacíos que enseñan la interfaz. Nada a medias.

## Accessibility & Inclusion

- **WCAG 2.1 AA**: contraste ≥4.5:1 en texto de cuerpo, ≥3:1 en texto grande; foco visible en todo control; navegación por teclado (ya existe roles/aria en login, tabs, modal).
- **`prefers-reduced-motion`**: reemplaza movimiento por crossfade/instantáneo; el color de estado se conserva.
- No depender solo del color para el estado (SLA/urgencia llevan también icono + texto).
- Objetivos táctiles ≥40px en móvil; tabbar inferior para navegación con pulgar.
