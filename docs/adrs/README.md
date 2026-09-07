# Architecture Repository — Portal Legal Ternova

Documentación de arquitectura conforme a la política PT-ARQ-004 de Grupo Ternova. Este directorio es la fuente de verdad de decisiones arquitectónicas para esta iniciativa (nada de arquitectura vive solo en chat/email, según la política).

## Estado del proceso

`RFC → ADD (listo) → Revisión del Architecture Board → Decisión → Excepción (si aplica) → Implementación`

Estamos en el paso **ADD**, pendiente de presentar al Architecture Board. No se ha iniciado implementación de código.

## Documentos

| Documento | Descripción |
|---|---|
| [ADD-001](./ADD-001-portal-legal-ternova.md) | Architecture Definition Document — arquitectura propuesta completa, autoevaluación de score, riesgos y preguntas abiertas |
| [ADR-A-001](./ADR-A-001-descomposicion-dominios.md) | Descomposición de dominios y arquitectura de aplicación |
| [ADR-A-002](./ADR-A-002-frontend-framework.md) | Framework de frontend |
| [ADR-A-003](./ADR-A-003-estrategia-integracion.md) | Estrategia de integración síncrona/asíncrona |
| [ADR-A-004](./ADR-A-004-dominio-asistente-ia.md) | Nuevo dominio: Asistente de IA (chatbot de ayuda) — requiere además TDR y aprobación bajo PT-IA-003 |
| [ADR-D-001](./ADR-D-001-estrategia-datos.md) | Estrategia de datos por dominio |
| [ADR-T-001](./ADR-T-001-plataforma-computo.md) | Plataforma de cómputo (AKS vs. Container Apps) |
| [ADR-T-002](./ADR-T-002-identidad-autenticacion.md) | Identidad y autenticación (Entra ID) — implementación diferida |

## Antes de avanzar a implementación

Ver ADD-001 §16 — hay 7 preguntas abiertas para el negocio/Architecture Board. Las más bloqueantes para empezar a construir son #1 (AKS vs. Container Apps ya definido en la organización) y #2 (estándar de lenguaje/runtime de backend existente).
