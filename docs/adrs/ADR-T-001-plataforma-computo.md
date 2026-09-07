# ADR-T-001 — Plataforma de cómputo (AKS vs. Container Apps)

| Campo | Valor |
|---|---|
| Estado | Propuesto |
| Fecha | 2026-07-02 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md), [ADR-A-001](./ADR-A-001-descomposicion-dominios.md) |
| Principios aplicados | `P-T-01` (Cloud-Native), `P-T-06` (Containerización), `P-T-03` (Resiliencia) |

## Contexto

La política define **AKS como plataforma principal**, con App Services/Container Apps/Functions como opciones **condicionales según carga**. El Portal Legal Ternova es un sistema interno con una base de usuarios acotada (empleados de Ternova en 5 jurisdicciones, no tráfico público masivo), compuesto por 6-7 microservicios + BFF + frontend (ADR-A-001).

## Alternativas evaluadas

### Opción A — Azure Kubernetes Service (AKS)
- **Pros:** es la plataforma principal de la política; si Ternova ya opera un clúster AKS compartido entre dominios, sumar este portal no añade costo/operación incremental significativa; máximo control sobre networking, autoscaling y resiliencia multi-zona.
- **Contras:** si este fuera el **primer** clúster AKS de la organización, el costo de operación (control plane, node pools, actualizaciones, RBAC de K8s, observability del propio clúster) es desproporcionado para 6-7 servicios de carga interna moderada. Requiere equipo con experiencia en Kubernetes para operar con calidad (`P-T-03`).

### Opción B — Azure Container Apps (recomendada, condicional a confirmar con el Board)
- **Pros:** cloud-native y contenedorizado igual que AKS (cumple `P-T-01`/`P-T-06`), pero con Kubernetes gestionado por la plataforma (KEDA para autoscaling, Dapr disponible si se necesita mediar la comunicación entre servicios), mucho menor esfuerzo operativo, encaja con el perfil de carga esperado (tráfico interno, picos previsibles en horario laboral, no necesita multi-región activo-activo desde el día uno).
- **Contras:** menor control fino que AKS directo (aceptable para este caso de uso); si Ternova consolida más adelante muchos dominios en un único clúster AKS corporativo, este portal se migraría (Container Apps y AKS comparten el mismo modelo de imagen Docker en ACR, migración de bajo riesgo).

### Opción C — Azure App Service (contenedores)
- **Pros:** el más simple operativamente.
- **Contras:** peor ajuste para un patrón de varios microservicios con comunicación de eventos vía Service Bus y necesidad de autoscaling por servicio; Container Apps ofrece lo mismo que App Service más el modelo de microservicios nativo sin el escalón operativo de AKS. Se prefiere B sobre C para este caso.

## Decisión

**Azure Container Apps**, como plataforma de cómputo para los 6-7 microservicios de dominio, el BFF y el frontend Next.js — todos empaquetados como contenedores Docker publicados en ACR (`P-T-06`), desplegados vía CI/CD (`P-T-02`), sin pasos manuales.

**Esta decisión está condicionada a la respuesta de la pregunta abierta #1 del ADD**: si Ternova ya opera un clúster AKS compartido y espera que todo cómputo nuevo viva ahí, la decisión cambia a Opción A sin que el resto de la arquitectura (dominios, integración, datos) se vea afectado — el cambio de plataforma de cómputo es de bajo acoplamiento con las demás decisiones de este ADD.

## Consecuencias

- Autoscaling por servicio basado en tráfico HTTP (BFF/APIM) y profundidad de cola (Service Bus) vía KEDA, nativo en Container Apps.
- Resiliencia: Container Apps soporta múltiples réplicas y zonas de disponibilidad dentro de una región; alta disponibilidad activo-activo multi-región (`P-T-03`) se evalúa como fase posterior si el SLO de disponibilidad (99.5% propuesto en el ADD) lo requiere.
- Si en el futuro se opta por AKS (por consolidación corporativa), la migración reutiliza las mismas imágenes de ACR y manifiestos de despliegue se traducen a Helm/K8s sin rediseñar los servicios.
