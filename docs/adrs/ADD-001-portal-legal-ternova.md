# ADD-001 — Portal Legal Ternova

| Campo | Valor |
|---|---|
| Documento | Architecture Definition Document (ADD) |
| Iniciativa | Portal Legal Ternova (autoservicio legal, 6 áreas, 4 roles, 5 jurisdicciones) |
| Estado | **Propuesto** — pendiente de revisión por el Architecture Board |
| Política aplicable | PT-ARQ-004 (TOGAF 10 + ITIL 4 + Azure Well-Architected + ISO 27001 + CIS Controls) |
| Fecha | 2026-07-02 |
| Autor | fmartinez@ternova.group (con asistencia de Claude Code) |
| Fase del proceso | RFC → **ADD (este documento)** → Revisión del Board → Decisión → (Excepción si aplica) → Implementación |
| Insumo de diseño | Prototipo HTML/CSS/JS `project/` del handoff de Claude Design (ver `README.md` del repo) |

## 1. Resumen ejecutivo

Este documento propone la arquitectura objetivo para llevar a producción el **Portal Legal Ternova**, hoy un prototipo estático de diseño (sin backend, sin persistencia, sin autenticación real). El portal es un punto único de autoservicio legal para empleados `@ternova.group` en 5 jurisdicciones, con 6 áreas legales, un catálogo de ~29 servicios con SLA, y 4 roles (Solicitante, Abogado, Gerente legal, Admin) con un modelo de permisos ya definido en el prototipo.

**Este ADD no incluye implementación.** Es la propuesta a presentar ante el Architecture Board para obtener validación antes de iniciar cualquier desarrollo, conforme a `P-N-03` (Gobierno Arquitectónico Obligatorio).

## 2. Contexto de negocio

- **Dueño de negocio:** Dirección Legal de Grupo Ternova.
- **Usuarios:** empleados internos con correo `@ternova.group`, en GT, HN, SV, CR y MX.
- **Problema a resolver:** hoy la gestión de solicitudes legales (asesoría, compliance, transacciones, litigio, educación legal, governance) no tiene un canal de autoservicio ni trazabilidad de SLA/auditoría centralizada.
- **Origen:** prototipo de diseño validado visualmente por el negocio (ver `chats/chat1.md`), suficientemente maduro en flujo funcional (login, navegación por rol, solicitudes, bandeja de trabajo, tableros, administración) como para servir de base de requerimientos funcionales.

## 3. Alcance de este documento

Incluye:
- Descomposición en dominios de negocio y su mapeo a capacidades del prototipo.
- Arquitectura de aplicación, integración, datos, seguridad, cómputo y observabilidad objetivo (TO-BE), conforme al stack Azure de referencia de PT-ARQ-004.
- ADRs de las decisiones técnicas clave, cada uno con alternativas evaluadas.
- Autoevaluación preliminar de score de cumplimiento.
- Preguntas abiertas que requieren respuesta del negocio o del Architecture Board antes de aprobar.

**No incluye** (fuera de alcance de esta entrega, según decisión del solicitante):
- Código de implementación (frontend o backend).
- Aprovisionamiento real de recursos Azure.
- Validación final del rediseño visual "El Registro" (commit `3d80740`), que el propio solicitante calificó como **exploratorio, no definitivo** — la arquitectura aquí propuesta es agnóstica al sistema visual/tema y no se ve afectada por ese pendiente.
- Contratación/activación de integraciones mencionadas como mock en el prototipo (DocuSign, SharePoint, Power BI) — se referencian como opciones, no como compromisos.

## 4. Estado del insumo de diseño

El repo contiene dos artefactos de diseño desincronizados:

- `project/` — **fuente de verdad** confirmada por el solicitante (última iteración, "El Registro").
- `index.html` (raíz) — snapshot obsoleto de una iteración previa; **no usar** como referencia.

El modelo de permisos, capacidades y datos mockeados en `project/data.js` y `project/app.js` es la base funcional de este ADD (roles, catálogo de servicios, flujos de solicitud, bandeja de trabajo, auditoría, administración). El detalle está en el análisis funcional ya compartido con el solicitante; no se repite aquí para evitar duplicar contenido que puede desactualizarse.

## 5. Arquitectura de negocio — dominios propuestos (DDD)

Aplicando `P-A-01` (arquitectura desacoplada por dominio):

| Dominio | Responsabilidad | Origen en el prototipo |
|---|---|---|
| **Identidad y Acceso** | Autenticación (delegada a Entra ID), mapeo de rol de negocio (Solicitante/Abogado/Gerente/Admin) y capacidades | `ROLES`, `CAPS`, `can()` en `app.js` |
| **Catálogo de Servicios** | Áreas legales, servicios, SLAs, contenido de autoservicio, jurisdicciones | `AREAS`, `SVCS`, `AUTO`, `JURISDICTIONS` en `data.js` |
| **Casework (Solicitudes)** | Ciclo de vida de una solicitud: creación, cola, asignación, urgencia, estado, eliminación con motivo | `REQS`, `INBOX`, `QUEUE`, `LOAD` en `app.js` |
| **Gestión Documental** | Versionado de documentación de autoservicio y su historial de cambios | `CHANGES`, edición de documentos en `app.js` |
| **Auditoría** | Bitácora inmutable de eventos de negocio (asignaciones, eliminaciones, cambios documentales) | `logAudit`, vista de Auditoría |
| **Reporting / Tableros** | KPIs, cumplimiento de SLA, carga por abogado, volumen mensual | `DASH`, `views.js` (Tableros) |
| **Administración** | Usuarios y roles, catálogo/SLA editable, configuración de integraciones y jurisdicciones | `USERS`, `PERM_MATRIX`, `INTEGRATIONS`, vista Administración |

Cada dominio se implementa como servicio independiente con su propia base de datos (`P-D-01`, "1 BD por servicio", ver ADR-D-001). El canal web se sirve a través de un **BFF** (Backend-for-Frontend) único, ya que por ahora solo existe un canal (portal web).

Ver **ADR-A-001** para el detalle de descomposición y alternativas evaluadas (incluida la opción de monolito modular, descartada).

## 6. Arquitectura de aplicación (vista lógica)

```
[Usuario @ternova.group]
        │  HTTPS
        ▼
[Frontend SPA]  ──(ver ADR-A-002)
        │  HTTPS (OAuth2/JWT, Entra ID)
        ▼
[BFF Portal Legal]  (App Service / Container App)
        │
        ▼
[Azure API Management]  ← API Gateway único, capa síncrona (P-A-02, API-First)
   ├── /api/v1/identidad
   ├── /api/v1/catalogo
   ├── /api/v1/casework
   ├── /api/v1/documentos
   ├── /api/v1/auditoria
   └── /api/v1/reporting
        │
        ▼
[Microservicios por dominio]  (contenedores Docker en AKS/Container Apps, ver ADR-T-001)
        │
        ├── llamadas síncronas entre dominios → siempre vía APIM, nunca P2P directo
        └── eventos de negocio → Azure Service Bus (Topics + DLQ)
                 ├── SolicitudCreada / SolicitudAsignada / SolicitudEliminada
                 ├── DocumentoActualizado
                 └── consumidores: Auditoría, Notificaciones, Reporting (proyección)
```

Frontend, framework y justificación: **ADR-A-002**.
Estrategia de integración síncrona/asíncrona en detalle: **ADR-A-003**.

## 7. Arquitectura de datos

- **1 base de datos por dominio** (`P-D-01`, "Database per Service"), sin bases compartidas.
- Motor propuesto: Azure SQL Database (ver **ADR-D-001** para alternativas evaluadas frente a PostgreSQL).
- **Auditoría** requiere append-only con protección contra modificación (cumplimiento legal de trazabilidad) — tratamiento diferenciado, ver ADR-D-001 §3.
- **Documentos**: se propone **no** construir un repositorio documental propio; usar SharePoint (ya listado como integración en el prototipo) como almacén de archivos, y que el dominio "Gestión Documental" solo administre metadata y versión/motivo en su propia base. Pendiente confirmar con negocio si SharePoint Legal ya existe o debe aprovisionarse.
- **Data Owners** propuestos (a ratificar por el negocio, `P-D-01`):
  - Catálogo de Servicios → Dirección Legal (proceso/SLA)
  - Casework y Documentos → Gerente Legal por área
  - Auditoría → Compliance / Seguridad de la Información
  - Identidad → IT / Seguridad (Entra ID)
- Datos sensibles (contenido de casos legales, posiblemente confidencial/restringido) deben clasificarse y registrarse en **Purview**, conforme a `P-D-04` y a la clasificación de información de la política de Seguridad de Ternova.

## 8. Seguridad e identidad

- Identidad centralizada en **Entra ID** (`P-T-04`), sin gestión de usuarios local. El prototipo simula SSO "Microsoft 365"; en producción esto se resuelve con **MSAL** en el frontend y validación de token JWT en el BFF/APIM.
- Roles de negocio (Solicitante/Abogado/Gerente/Admin) se proponen como **grupos de seguridad en Entra ID**, sincronizados a claims del token — evita mantener una tabla de roles paralela. Alternativa evaluada en **ADR-T-002**.
- MFA obligatorio (heredado de la política de Entra ID corporativa).
- Secretos únicamente en **Key Vault**; ninguna cadena de conexión ni client secret en código o configuración de la app.
- APIs protegidas con OAuth2/JWT en APIM (`P-A-02`), RBAC de mínimo privilegio por endpoint según capacidad (reutilizando la matriz `PERM_MATRIX` ya definida en el prototipo como especificación funcional de autorización).
- Sin exposición pública no justificada: el portal es de uso interno — evaluar **Private Endpoints** + acceso solo vía red corporativa/VPN o Entra ID Conditional Access, a definir con Seguridad.
- **No se implementa autenticación real en esta etapa** (decisión explícita del solicitante) — queda como ítem pendiente para cuando se apruebe la fase de construcción.

## 9. Cómputo e infraestructura (mapeo a las 7 capas del stack de referencia)

| Capa | Propuesta para Portal Legal Ternova |
|---|---|
| 1. DevOps/CI-CD | GitHub Actions (repo ya vive en GitHub), ACR para imágenes, Terraform para IaC, SonarQube + SAST/DAST en pipeline |
| 2. Compute | Azure Container Apps para los microservicios y el BFF (ver justificación de carga en **ADR-T-001**); AKS descartado para el arranque, revisar si Ternova ya opera un clúster compartido |
| 3. Datos | Azure SQL (1 por dominio), Blob Storage si se requiere almacenamiento propio de adjuntos livianos, integración SharePoint para documentos formales |
| 4. Dominios/App | 6 microservicios de dominio + 1 BFF, todos contenedorizados |
| 5. Integración | Azure APIM (síncrono) + Azure Service Bus con DLQ (asíncrono) |
| 6. Seguridad/Identidad | Entra ID, Key Vault, App Registrations, Defender for Cloud, Sentinel (alertas de auditoría/seguridad) |
| 7. Observabilidad | Application Insights en cada servicio y en el frontend, Log Analytics, dashboards por dominio, alertas por SLO (p. ej. SLA de solicitudes) |

## 10. Observabilidad

- Instrumentación con Application Insights desde el primer despliegue (`P-A-04`), incluyendo trazas distribuidas (Trace ID) end-to-end: Frontend → BFF → APIM → microservicio → Service Bus.
- SLOs propuestos (a validar con negocio): tiempo de respuesta de bandeja < 2s p95, entrega de notificación de asignación < 5 min, disponibilidad del portal ≥ 99.5%.
- Logs de auditoría de negocio (dominio Auditoría) son distintos de los logs técnicos de observabilidad — ambos requeridos, no se sustituyen entre sí.

## 11. CI/CD e IaC

- Pipeline obligatorio por servicio (build → test ≥70% cobertura → SAST → imagen a ACR → despliegue). Cero pasos manuales a producción.
- Entornos Dev/QA/Prod separados, aprobación manual solo para promoción a Prod.
- Infraestructura 100% como código (Terraform), sin creación manual de recursos.

## 12. Etiquetado de recursos (propuesta inicial, pendiente de confirmar con FinOps)

| Tag | Valor propuesto |
|---|---|
| `service` | `portal-legal-ternova` |
| `domain` | `legal` |
| `business-unit` | `direccion-legal` |
| `owner` / `team` | *(pendiente asignar)* |
| `repository` | URL del repo actual |
| `criticality` | `media-alta` (impacta cumplimiento legal, no es sistema transaccional externo) |
| `data-classification` | `confidencial` (pendiente de ratificar con Seguridad de la Información dado el contenido legal) |
| `environment` | `dev` / `qa` / `prod` según recurso |

## 13. ADRs asociados

| ID | Título | Estado |
|---|---|---|
| [ADR-A-001](./ADR-A-001-descomposicion-dominios.md) | Descomposición de dominios y arquitectura de aplicación | Propuesto |
| [ADR-A-002](./ADR-A-002-frontend-framework.md) | Framework de frontend | Propuesto |
| [ADR-A-003](./ADR-A-003-estrategia-integracion.md) | Estrategia de integración síncrona/asíncrona | Propuesto |
| [ADR-D-001](./ADR-D-001-estrategia-datos.md) | Estrategia de datos por dominio | Propuesto |
| [ADR-T-001](./ADR-T-001-plataforma-computo.md) | Plataforma de cómputo (AKS vs. Container Apps) | Propuesto |
| [ADR-T-002](./ADR-T-002-identidad-autenticacion.md) | Identidad y autenticación (Entra ID) | Propuesto |

## 14. Autoevaluación preliminar de score de cumplimiento

Estimación **antes** de revisión formal del Board (metodología de la política: Integración 25% · Seguridad 25% · DevOps 20% · Observabilidad 15% · Arquitectura/Datos 15%):

| Dimensión | Peso | Autoevaluación | Justificación |
|---|---|---|---|
| Integración | 25% | Alta | 100% vía APIM/Service Bus, sin P2P propuesto |
| Seguridad | 25% | Media | Diseño correcto (Entra ID, Key Vault, JWT) pero **no implementado** aún; Private Endpoints y clasificación de datos pendientes de confirmar |
| DevOps | 20% | Media-Alta | Pipeline y contenedores definidos; falta validar herramientas SAST/DAST concretas y quién las opera |
| Observabilidad | 15% | Media | Plan definido, SLOs son borrador sin validar con negocio |
| Arquitectura/Datos | 15% | Alta | Database-per-service y DDD claros; Data Owners aún no ratificados formalmente |

**Estimado global: en rango 70–79 (aprobable con plan a 90 días)**, condicionado a resolver las preguntas abiertas de la sección 15 antes de la implementación. Este es un autodiagnóstico, no reemplaza el scoring oficial del Architecture Board.

## 15. Riesgos y supuestos

- **Supuesto:** Ternova no exige un lenguaje de backend específico más allá del stack Azure — se deja la elección de lenguaje/runtime para una fase posterior o para el propio equipo asignado (no es una decisión de arquitectura de alto nivel, ver ADR-A-001 §4).
- **Riesgo:** si el rediseño visual "El Registro" cambia significativamente antes de aprobarse, no afecta esta arquitectura (es agnóstica a la capa de presentación), pero sí puede afectar estimaciones de esfuerzo de una futura fase de construcción.
- **Riesgo:** el dato "confidencial" de casos legales reales exige validar con Seguridad de la Información y Legal el nivel de clasificación antes de definir controles de acceso definitivos.
- **Supuesto:** existe (o se puede aprovisionar) un tenant de Entra ID corporativo y capacidad de crear App Registrations — no se investigó en esta entrega (fuera de alcance, decisión del solicitante).

## 16. Preguntas abiertas para el Architecture Board / negocio

1. ¿Ternova ya opera un clúster AKS compartido donde deba vivir este portal, o se autoriza Container Apps como plataforma de cómputo para una iniciativa de este tamaño? (afecta ADR-T-001)
2. ¿Existe un estándar de lenguaje/runtime de backend ya adoptado por otros dominios (.NET, Node.js, Java, Python) al que este proyecto deba alinearse por consistencia, más allá de lo que exige la política de infraestructura?
3. ¿SharePoint Legal ya existe como repositorio documental corporativo, o debe solicitarse/aprovisionarse como parte de esta iniciativa?
4. ¿Cuál es la clasificación de datos formal (Purview) que debe aplicarse al contenido de casos legales y documentos del portal?
5. ¿Quiénes son los Data Owners y Data Stewards formales por dominio (propuesta en sección 7 es solo un borrador)?
6. ¿Cuál es el `cost-center` / `budget-alert` a aplicar en el etiquetado FinOps?
7. Validar con el solicitante si el rediseño "El Registro" se ratifica, revierte o se ajusta — no bloquea este ADD, pero sí una futura fase de construcción del frontend.

## 17. Próximos pasos

1. Presentar este ADD y sus ADRs al Architecture Board (RFC formal).
2. Resolver las preguntas de la sección 16, en particular 1 y 2 (afectan directamente ADR-T-001 y ADR-A-001).
3. Si se aprueba (score ≥70), iniciar plan de construcción por fases: (a) dominios Identidad + Catálogo + Casework primero (ruta crítica funcional), (b) Documentos + Auditoría, (c) Reporting/Tableros.
4. Solo entonces evaluar retomar la implementación del frontend sobre la base visual de `project/`, una vez ratificado o ajustado el rediseño "El Registro".
