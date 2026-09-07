# ADR-A-002 — Framework de frontend

| Campo | Valor |
|---|---|
| Estado | Propuesto |
| Fecha | 2026-07-02 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md) |
| Principios aplicados | `P-T-06` (Containerización), `P-A-02` (API-First), `P-T-05` (Estandarización Tecnológica) |

## Contexto

El prototipo `project/` es HTML/CSS/JS vanilla con manipulación directa de `innerHTML` y estado global en variables JS — válido para un prototipo de diseño, no apto para producción (sin tipado, sin componentización real, sin testeo estructurado, cobertura de pruebas ≥70% exigida por la política sería inviable de mantener así). El README del propio bundle ya indica: *"recreate them pixel-perfectly... don't copy the prototype's internal structure"*.

Ternova tiene stacks divergentes hoy (Expo/React Native en móvil, Python/Streamlit y Vercel en otros proyectos), señalados en la política como desviaciones del estándar Azure a resolver por plan de modernización, no como precedente a repetir en proyectos nuevos.

## Alternativas evaluadas

### Opción A — React + Next.js (recomendada)
- **Pros:** ecosistema maduro en Azure (Container Apps/App Service soportan Next.js en contenedor sin fricción), comparte lenguaje (TypeScript/JS) y parte del modelo mental con el equipo móvil (Expo/React Native), permite SSR/SSG si se necesita rendimiento inicial, tipado fuerte con TypeScript reduce bugs de un dominio con reglas de negocio complejas (matriz de permisos por rol).
- **Contras:** requiere definir convenciones nuevas (no hay un proyecto Next.js de referencia en Ternova hoy, a confirmar).

### Opción B — Vue 3 + Nuxt
- **Pros:** curva de aprendizaje suave, buen soporte SSR.
- **Contras:** sin adopción previa conocida en Ternova; no aporta sinergia con el stack móvil existente (React Native).

### Opción C — Blazor (.NET)
- **Pros:** si el backend termina siendo .NET, permite compartir modelos/validaciones cliente-servidor.
- **Contras:** solo tiene sentido si ADR-A-001 termina resolviéndose hacia .NET en todos los dominios; menor ecosistema de componentes UI modernos comparado con React; no hay evidencia de adopción .NET en Ternova hoy.

### Opción D — Mantener JS vanilla, solo modularizar
- **Pros:** menor migración desde el prototipo.
- **Contras:** no resuelve el problema real (tipado, testeo, mantenibilidad a largo plazo), no es una arquitectura de aplicación defendible ante el Architecture Board para un sistema con lógica de autorización compleja por rol.

## Decisión

**Opción A — React + Next.js**, contenedorizado (`P-T-06`) y desplegado en la misma plataforma de cómputo que el resto de servicios (ver ADR-T-001). Se reimplementa el resultado visual del prototipo `project/` como componentes React con TypeScript, consumiendo el BFF vía API versionada (`/api/v1/...`), sin copiar la estructura interna del prototipo (`innerHTML`, estado global mutable).

Queda pendiente confirmar si existe ya una convención de frontend en algún otro proyecto Azure de Ternova a la que debamos alinearnos por consistencia (pregunta abierta #2 del ADD).

## Consecuencias

- El sistema de diseño de `project/styles.css` (variables CSS, tokens de color por área) se traduce a un design system de componentes (p. ej. CSS Modules, Tailwind o styled-components — decisión de detalle, no bloquea este ADR).
- El modelo de permisos (`CAPS`, `can()`) se reimplementa como hooks/guards de React alimentados por los claims del token de Entra ID (ver ADR-T-002), no por un objeto de rol hardcodeado en el cliente.
- No se lleva a producción el panel de "Tweaks" (React/JSX) del prototipo — es una herramienta de la plataforma de diseño, ya excluida por el propio equipo del prototipo en el commit `3d80740`.
