# ADR-A-001 — Descomposición de dominios y arquitectura de aplicación

| Campo | Valor |
|---|---|
| Estado | Propuesto |
| Fecha | 2026-07-02 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md) |
| Principios aplicados | `P-A-01` (Arquitectura Desacoplada por dominio), `P-N-02` (Agilidad Empresarial) |

## Contexto

El prototipo `project/` modela el portal como una sola aplicación monolítica de cliente (un `app.js` de 48KB con toda la lógica de negocio). Para producción, la política PT-ARQ-004 exige diseño por dominio (DDD) y prohíbe monolitos no justificados salvo waiver. Hay que decidir cómo particionar el sistema en servicios.

## Alternativas evaluadas

### Opción A — Monolito modular (un solo servicio backend, módulos internos por dominio)
- **Pros:** menor complejidad operativa inicial, un solo pipeline, un solo despliegue.
- **Contras:** no cumple `P-T-06`/`P-A-01` de forma nativa (aunque se podría empaquetar en un contenedor único), acopla el ciclo de vida de dominios con ritmos de cambio distintos (p. ej. Catálogo cambia poco, Casework cambia mucho), requeriría waiver Legacy/Técnica para justificar la desviación del estándar de microservicios por dominio.

### Opción B — Microservicios por dominio (recomendada)
Un servicio contenedorizado por dominio de negocio identificado en el ADD (Identidad, Catálogo, Casework, Documentos, Auditoría, Reporting, Administración), cada uno con su propia base de datos, expuestos únicamente a través de Azure APIM, comunicados de forma asíncrona vía Service Bus para eventos de negocio.
- **Pros:** cumple `P-A-01`/`P-D-01` directamente, ciclos de despliegue independientes, permite escalar solo lo que necesita carga (p. ej. Casework, que es el dominio con más tráfico transaccional), alineado 1:1 con el catálogo de servicios de negocio (`P-N-01`).
- **Contras:** mayor complejidad operativa (7 servicios + BFF en vez de 1), requiere disciplina de contratos de API versionados desde el día uno.

### Opción C — Microservicios por capacidad técnica (ej. "CRUD service", "notification service" genéricos)
- **Pros:** menos servicios que la opción B.
- **Contras:** no seguiría DDD, mezclaría reglas de negocio de dominios distintos en un mismo servicio, dificulta asignar Data Owners claros por servicio. Descartada por no cumplir el espíritu de `P-A-01`.

## Decisión

**Opción B — Microservicios por dominio**, con la siguiente descomposición inicial (7 dominios, ver tabla completa en el ADD §5):

1. Identidad y Acceso
2. Catálogo de Servicios
3. Casework (Solicitudes)
4. Gestión Documental
5. Auditoría
6. Reporting / Tableros
7. Administración

Un único **BFF** agrega estos dominios para el canal web (no hay otros canales hoy; si en el futuro se agrega app móvil, se evalúa un BFF adicional por canal, `P-A-01`).

### Nota sobre Reporting/Tableros

Es un candidato a implementarse inicialmente como **proyección de solo lectura** (vistas materializadas o réplica) alimentada por eventos de Service Bus de los demás dominios, en vez de un microservicio con lógica de negocio propia — evita duplicar reglas y reduce el número de servicios "reales" a 6. Se deja como decisión de diseño detallado en la fase de construcción, no bloquea este ADR.

### Sobre el lenguaje/runtime de cada servicio

Este ADR decide la **descomposición**, no el lenguaje. La política no exige un lenguaje específico (solo cómputo cloud-native en contenedores). La elección de runtime (.NET, Node.js/TypeScript, Java, Python) se deja pendiente de la respuesta a la pregunta abierta #2 del ADD (alineación con estándares existentes del equipo), y puede resolverse por dominio si hay razones justificadas (p. ej. Reporting en Python si se integra con Synapse/Power BI).

## Consecuencias

- Se requieren 6-7 pipelines CI/CD independientes (uno por dominio) + 1 para el BFF + 1 para el frontend.
- Se requieren 6-7 App Registrations o un esquema de identidad de servicio compartido vía Entra ID para llamadas service-to-service.
- Cada dominio necesita un Data Owner asignado antes de iniciar construcción (ver ADD §7, pregunta abierta #5).
