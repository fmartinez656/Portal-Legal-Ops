# ADR-D-001 — Estrategia de datos por dominio

| Campo | Valor |
|---|---|
| Estado | Propuesto |
| Fecha | 2026-07-02 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md), [ADR-A-001](./ADR-A-001-descomposicion-dominios.md) |
| Principios aplicados | `P-D-01` (Database per Service), `P-D-02`, `P-D-04` |

## Contexto

El prototipo mantiene todo su estado en arrays JS en memoria (`REQS`, `INBOX`, `QUEUE`, `CHANGES`, `USERS`), que se pierde al recargar la página. Hay que definir el motor de base de datos y el patrón de persistencia para cada uno de los dominios de ADR-A-001, y cómo tratar el caso especial de Auditoría (requiere inmutabilidad).

## Alternativas evaluadas — motor de base de datos

### Opción A — Azure SQL Database por servicio (recomendada)
- **Pros:** motor relacional maduro en Azure, encaja naturalmente con los datos altamente estructurados del dominio (solicitudes, catálogo de servicios con SLA, usuarios/roles), soporta Row-Level Security nativo (útil para reforzar "Abogado solo ve sus propios casos" a nivel de base, no solo de aplicación), integración directa con Purview y Azure Monitor.
- **Contras:** costo por instancia si se aprovisiona una por dominio sin compartir tier (mitigable con Elastic Pools).

### Opción B — Azure Database for PostgreSQL por servicio
- **Pros:** también aprobado por la política, buen soporte para JSON semiestructurado (útil si el catálogo de servicios/contenido de autoservicio se modela como documentos flexibles).
- **Contras:** menos alineado si el equipo/DBA de Ternova ya opera principalmente SQL Server (a confirmar) — sin evidencia de preferencia previa, se trata como alternativa válida, no se descarta de plano.

### Opción C — Una sola base de datos compartida para todos los dominios
- **Contras:** viola directamente `P-D-01` ("prohibida BD compartida"). Descartada sin ambigüedad — no requiere más análisis salvo que se busque un waiver, lo cual no se recomienda dado que la política lo marca como riesgo CRÍTICO de bloqueo inmediato.

## Decisión — motor

**Azure SQL Database, una instancia lógica por dominio** (Identidad, Catálogo, Casework, Documentos, Auditoría, Reporting, Administración), pudiendo compartir un Elastic Pool para optimizar costo sin violar el aislamiento lógico exigido por `P-D-01`. Se abre como alternativa PostgreSQL si el Architecture Board indica una preferencia de plataforma de datos ya establecida en Ternova.

## Caso especial — Auditoría (inmutabilidad)

El dominio de Auditoría requiere garantizar que los registros no se alteren ni se borren, por ser evidencia de cumplimiento legal.

### Alternativas evaluadas
- **A. Azure SQL con solo permisos INSERT** (sin UPDATE/DELETE a nivel de rol de aplicación) + auditoría nativa de SQL Server habilitada — más simple de operar, reutiliza el mismo motor que el resto de dominios.
- **B. Azure Table Storage / Cosmos DB en modo append-only** — más barato a gran escala, pero introduce un segundo motor de datos que la organización debe operar y respaldar, sin beneficio claro al volumen esperado de un portal interno.

### Decisión
**Opción A**: Azure SQL con rol de aplicación restringido a INSERT/SELECT únicamente, auditoría nativa habilitada, y respaldo con la retención que defina la política de continuidad de Ternova (ver `ternova-continuidad`, PL-TIC-001/MA-TI-002) — pendiente de aplicar esa skill cuando se defina el plan de respaldo/DRP formal en la fase de construcción.

## Gestión documental

Se decide **no** construir un repositorio de archivos propio. El dominio "Gestión Documental" almacena únicamente metadata (versión, autor, motivo, referencia al archivo) en su propia base Azure SQL; el archivo en sí se propone alojar en **SharePoint** (integración ya prevista en el prototipo, `INTEGRATIONS`), sujeto a confirmar con negocio si ya existe un sitio SharePoint Legal (pregunta abierta #3 del ADD).

## Consecuencias

- 6-7 bases de datos Azure SQL a aprovisionar vía IaC (Terraform), cada una con su propio Data Owner (pendiente de ratificar, pregunta abierta #5 del ADD).
- Se requiere definir el esquema de cada dominio en la fase de construcción (fuera de alcance de este ADD).
- El uso de Row-Level Security en Casework debe evaluarse como refuerzo defensivo, no como sustituto del control de autorización en el BFF/APIM.
