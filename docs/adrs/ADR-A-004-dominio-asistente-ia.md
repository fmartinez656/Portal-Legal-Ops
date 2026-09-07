# ADR-A-004 — Nuevo dominio: Asistente de IA (chatbot de ayuda)

| Campo | Valor |
|---|---|
| Estado | Propuesto |
| Fecha | 2026-07-23 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md), [ADR-A-001](./ADR-A-001-descomposicion-dominios.md), [ADR-A-003](./ADR-A-003-estrategia-integracion.md), [ADR-D-001](./ADR-D-001-estrategia-datos.md) |
| Principios aplicados | `P-A-01` (Arquitectura Desacoplada por dominio), `P-A-02` (API-First), Regla de oro de integración (APIM + Service Bus), `P-D-04` (Seguridad y Protección de Datos) |
| Política adicional aplicable | PT-IA-003 (Política de IA de Ternova) — este ADR resuelve el **diseño técnico**; la iniciativa además requiere TDR y aprobación del Comité de Transformación por el canal de PT-IA-003, independiente de este documento |

## Contexto

El prototipo (`project/`) no tiene ningún asistente de IA ni chatbot — es un placeholder sin funcionalidad (botón "Ayuda" en la topbar que solo dispara un toast "próximamente"). Tampoco hay ningún dominio de "Asistente/IA" en la descomposición de 7 dominios de **ADR-A-001** ni en el ADD.

Se solicita evaluar cómo incorporar un asistente conversacional que ayude a los usuarios (Solicitante, Abogado, Gerente legal, Admin) con dos tipos de duda:
1. **Dudas de uso de la aplicación** ("¿cómo creo una solicitud?", "¿dónde veo mi bandeja?").
2. **Dudas sobre contenido publicado** (catálogo de servicios, SLAs, plantillas, FAQ, políticas del área legal).

Dos restricciones gobiernan este ADR simultáneamente:

- **PT-ARQ-004** (esta política): cualquier dominio nuevo debe seguir la regla de oro de integración (nunca P2P; síncrono vía APIM, asíncrono vía Service Bus) y el resto de los 18 principios (contenedores, Entra ID, Key Vault, Application Insights, etc.), igual que los 7 dominios ya definidos.
- **PT-IA-003** (Política de IA de Ternova): un chatbot es, por definición, consumo de un LLM. La política exige TDR firmado, aprobación previa del Arquitecto Empresarial y de Seguridad, clasificación de datos antes de enviarlos al modelo, **prohibición de enviar datos personales/confidenciales/estratégicos a terceros** (salvo ofuscación), autenticación Entra ID (Client Credentials), secretos en Key Vault, y trazabilidad de cada prompt. Esto es relevante porque el contenido legal del portal (catálogo interno, y sobre todo cualquier dato de casos particulares) es potencialmente confidencial (ver ADD-001 §7 y §15 — clasificación aún pendiente de ratificar con Seguridad).

## Alternativas evaluadas

### Opción A — Widget de chat en el frontend que llama directamente a un proveedor de LLM externo (API pública de OpenAI/Anthropic) desde el navegador o desde un servicio sin gateway

- **Pros:** implementación más rápida, cero servicios nuevos.
- **Contras:** viola la regla de oro de integración (llamada directa a un servicio externo sin pasar por APIM), expondría una API key de un proveedor de LLM en el cliente o en un backend no gobernado, y viola PT-IA-003 (sin clasificación de datos, sin Entra ID, sin trazabilidad de prompts, sin aprobación previa). **Descartada** — no es una opción viable bajo la gobernanza vigente de Ternova, no solo subóptima.

### Opción B — Nuevo dominio de negocio "Asistente IA", microservicio propio con RAG sobre Azure OpenAI, integrado como los demás dominios (recomendada)

Un octavo dominio de negocio (`P-A-01`), contenedorizado, con:
- Su propia base de datos (mínima: historial de conversación y bitácora de prompts para auditoría — no duplica datos de negocio de otros dominios).
- Un índice de conocimiento (Azure AI Search) que indexa **solo contenido de autoservicio ya publicado**: `AUTO` (checklists, FAQ, plantillas, políticas), `SVCS` (catálogo con SLA), y la ayuda de navegación de la propia app — nunca contenido de casos particulares de Casework.
- Consumo del LLM vía **Azure OpenAI Service**, nunca llamado directamente por el frontend — todo el tráfico saliente hacia el modelo se hace desde el microservicio del dominio, autenticado como cualquier otra API interna.
- **Pros:** cumple la regla de oro (expuesto solo vía APIM), cumple PT-IA-003 (autenticación Entra ID, secretos en Key Vault, clasificación de datos por diseño al limitar el índice a contenido ya público dentro de la empresa, trazabilidad de prompts vía evento a Service Bus), reutiliza exactamente el mismo patrón de integración que los 7 dominios existentes (ADR-A-003) — no introduce un mecanismo nuevo que el equipo tenga que aprender.
- **Contras:** un servicio más que operar (8vo dominio, 8vo pipeline CI/CD), requiere aprovisionar Azure OpenAI Service + Azure AI Search en el tenant (no se investigó si Ternova ya los tiene, ver Preguntas abiertas), y requiere el proceso PT-IA-003 completo (TDR + Comité de Transformación) en paralelo al proceso PT-ARQ-004 ya en curso para el resto del portal.

### Opción C — Delegar en una plataforma SaaS de chatbot ya integrada con el ecosistema Microsoft (p. ej. Copilot Studio / Azure Bot Service) apuntando directo a las fuentes, sin dominio propio

- **Pros:** menos código propio, aprovecha tooling ya construido por Microsoft para RAG y conectores.
- **Contras:** menor control sobre qué se indexa y qué se le manda al modelo (relevante dado que el contenido es potencialmente confidencial y la política exige clasificación previa), la trazabilidad de prompts exigida por PT-IA-003 (usuario, timestamp, tipo, metadata, resultado) depende de qué tan granular sea el logging que expone la plataforma, y no se evaluó si Ternova ya tiene licenciamiento/gobierno de Copilot Studio. **No descartada de plano**, pero requiere una evaluación de plataforma que está fuera del alcance de este ADR — se deja como alternativa a revisar si Opción B resulta más costosa de operar de lo esperado.

## Decisión

**Opción B — Nuevo dominio "Asistente IA"**, con las siguientes reglas concretas:

**Alcance funcional (explícito, para no sustituir criterio legal):**
- El asistente responde únicamente sobre (a) cómo usar la aplicación (navegación, flujos de solicitud) y (b) contenido de autoservicio ya publicado (catálogo, SLAs, plantillas, FAQ, políticas).
- **No** da asesoría legal sobre casos particulares ni accede a datos de Casework de otros usuarios — esto preserva el propósito del producto definido en `PRODUCT.md` ("canalizar al equipo legal lo que requiere criterio jurídico", no reemplazarlo).

**Integración (sigue el patrón de ADR-A-003, sin mecanismos nuevos):**
- Síncrono: `BFF → APIM → /api/v1/asistente` (crear conversación, enviar mensaje), igual que los demás dominios — nunca P2P.
- Asíncrono: el dominio publica `PreguntaAsistenteRealizada` (usuario, timestamp, pregunta, fuente citada, si hubo respuesta) a Service Bus; lo consume **Auditoría** (mismo patrón que otros eventos de negocio) para trazabilidad de prompts exigida por PT-IA-003, y opcionalmente **Reporting** (para medir qué dudas son más frecuentes y detectar contenido de autoservicio que falta).
- El índice de conocimiento se refresca consumiendo eventos ya definidos en ADR-A-003 (`DocumentoActualizado`) más un futuro evento equivalente cuando cambie el catálogo de servicios — así el asistente nunca queda desactualizado sin que el dominio Catálogo tenga que saber que el Asistente existe (bajo acoplamiento).

**Consumo del LLM (cumple PT-IA-003 sección D):**
- **Azure OpenAI Service** como proveedor — nunca una API pública de LLM llamada directamente. Registrar proveedor, modelo y versión en el Catálogo de Activos IA.
- Autenticación de servicio con **Entra ID (Client Credentials Flow)**, App Registration propia del dominio, secretos únicamente en **Key Vault**.
- Rate limiting y monitoreo de tokens en APIM, logs estructurados (JSON) en **Application Insights** con ID de transacción, igual que el resto de las APIs del portal.
- Validación de prompts (sin datos sensibles ni instrucciones riesgosas) antes de enviarlos al modelo — responsabilidad del microservicio del dominio, no del frontend.

**Punto de entrada en UI (nota de implementación, no bloquea este ADR):** el botón "Ayuda" placeholder de la topbar del prototipo es el gancho natural para el trigger del chat, reusando los patrones de modal/overlay ya definidos en `DESIGN.md`. Esto se resuelve en la fase de construcción del frontend, junto con el resto de ADR-A-002.

## Consecuencias

- Se agrega un **octavo dominio** a la descomposición de ADR-A-001 (que hoy documenta 7). Al aprobarse este ADR, ADR-A-001 y ADD-001 §5/§6 deben actualizarse para reflejarlo — no se editan en este documento para no alterar decisiones ya presentadas al Board sin su revisión.
- Esta iniciativa **no puede pasar a construcción solo con este ADR**: PT-IA-003 exige TDR firmado y Acta de aprobación del Comité de Transformación como paso previo e independiente del Architecture Board de PT-ARQ-004. Ambos procesos corren en paralelo, no uno reemplaza al otro.
- Requiere confirmar con Seguridad de la Información la clasificación de datos del contenido a indexar (aunque se limita a autoservicio ya publicado, sigue siendo contenido legal de la empresa) antes de aprobar el TDR.
- Se necesita un Data Owner propio para el dominio Asistente IA (historial de conversaciones) — no existe hoy en la lista de Data Owners propuesta en ADD-001 §7.
- Se necesita confirmar si Ternova ya tiene Azure OpenAI Service y Azure AI Search aprovisionados en el tenant, o si esta iniciativa debe solicitarlos (afecta costo y cronograma) — ver preguntas abiertas.

## Preguntas abiertas

1. ¿Ternova ya tiene Azure OpenAI Service y Azure AI Search aprovisionados en el tenant, o deben solicitarse como parte de esta iniciativa?
2. ¿Quién asume el rol de Arquitecto de IA para la evaluación técnica/ética exigida por PT-IA-003 (fase 2 del proceso de 7 fases)?
3. ¿La Dirección Legal aprueba que el contenido de `AUTO`/`SVCS` (catálogo, plantillas, FAQ, políticas) se indexe en Azure AI Search para RAG, o requiere una revisión de clasificación primero?
4. Métrica de éxito propuesta para el TDR: ¿% de preguntas resueltas sin escalar a un abogado, o algún umbral de precisión (p. ej. ≥85%, referencia usada en la plantilla de TDR de PT-IA-003)?
