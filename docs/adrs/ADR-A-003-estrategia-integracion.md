# ADR-A-003 — Estrategia de integración síncrona/asíncrona

| Campo | Valor |
|---|---|
| Estado | Propuesto |
| Fecha | 2026-07-02 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md), [ADR-A-001](./ADR-A-001-descomposicion-dominios.md) |
| Principios aplicados | Regla de oro de integración (APIM + Service Bus), `P-D-03`, `P-A-02` |

## Contexto

La política PT-ARQ-004 prohíbe de forma absoluta la integración punto a punto entre aplicaciones: toda comunicación síncrona va por Azure API Management, toda comunicación asíncrona va por Azure Service Bus. Con 6-7 dominios (ADR-A-001) que necesitan comunicarse entre sí y con el BFF, hay que definir qué flujos son síncronos y cuáles asíncronos.

## Alternativas evaluadas

### Opción A — Todo síncrono vía APIM
- **Pros:** modelo mental simple, todas las llamadas son request/response.
- **Contras:** acopla temporalmente dominios que no deberían depender de la disponibilidad del otro en tiempo real (p. ej., que Auditoría esté caída no debería bloquear la creación de una solicitud). No aprovecha el Service Bus exigido por la política para eventos de negocio.

### Opción B — Todo asíncrono vía Service Bus
- **Pros:** máximo desacople.
- **Contras:** el BFF necesita respuestas síncronas para renderizar la UI (listar solicitudes, ver catálogo) — forzar todo a asíncrono introduciría complejidad innecesaria (polling, WebSockets) sin beneficio real para operaciones de lectura/escritura directa iniciadas por el usuario.

### Opción C — Híbrido: síncrono para operaciones iniciadas por el usuario, asíncrono para efectos secundarios y eventos de negocio (recomendada)
- **Pros:** cumple la regla de oro sin sobre-ingeniería; cada flujo usa el mecanismo que corresponde a su naturaleza.
- **Contras:** requiere que el equipo entienda cuándo usar cada mecanismo (mitigado documentando los flujos explícitamente, ver abajo).

## Decisión

**Opción C.** Reglas concretas:

**Síncrono (vía Azure APIM, `/api/v1/...`, OAuth2/JWT):**
- BFF → Identidad: validar/enriquecer claims de rol.
- BFF → Catálogo: listar áreas, servicios, SLAs, contenido de autoservicio.
- BFF → Casework: crear solicitud, listar "mis solicitudes", listar bandeja de trabajo, asignar, cambiar urgencia/estado.
- BFF → Documentos: listar documentos, obtener historial de versión.
- BFF → Administración: CRUD de usuarios/roles, catálogo y configuración (solo Admin).
- BFF → Reporting: obtener KPIs/tableros (si no se resuelve como proyección de solo lectura, ver ADR-A-001).

**Asíncrono (vía Azure Service Bus, Topics + DLQ):**
- `SolicitudCreada` → consumida por Notificaciones (alertar al Gerente/abogados) y Reporting (actualizar proyección de KPIs).
- `SolicitudAsignada` → consumida por Notificaciones (avisar al abogado asignado) y Auditoría.
- `SolicitudEliminada` (con motivo) → consumida por Auditoría (registro inmutable) y Notificaciones (avisar al solicitante).
- `DocumentoActualizado` → consumida por Auditoría (historial de cambios) y Reporting.
- `SLAProximoAVencer` (evento generado por un job programado en Casework) → consumida por Notificaciones para alertas SLA.

Todos los eventos usan Dead Letter Queue para manejo de fallos, y ningún dominio llama directamente a otro dominio sin pasar por APIM (síncrono) o publicar/consumir en Service Bus (asíncrono).

## Consecuencias

- El dominio Auditoría no necesita exponer API síncrona de escritura — solo consume eventos, lo que refuerza su naturaleza de bitácora inmutable (ver ADR-D-001).
- Se requiere definir contratos de evento (esquema JSON versionado) para cada tópico, documentados junto al contrato OpenAPI de cada servicio.
- Un futuro dominio de "Notificaciones" (email/Teams) no está en el ADD como dominio de negocio con vista propia en el portal, pero sí como consumidor técnico de eventos — se decide si es un servicio propio o una Azure Function ligera en la fase de construcción.
