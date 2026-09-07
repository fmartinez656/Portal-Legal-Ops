# ADR-T-002 — Identidad y autenticación (Entra ID)

| Campo | Valor |
|---|---|
| Estado | Propuesto — **implementación diferida** (decisión explícita del solicitante, no se activa en esta fase) |
| Fecha | 2026-07-02 |
| Relacionado | [ADD-001](./ADD-001-portal-legal-ternova.md) |
| Principios aplicados | `P-T-04` (Seguridad por Diseño / Zero Trust), `P-D-04` |

## Contexto

El prototipo simula "SSO con Microsoft 365" con un simple selector de rol sin autenticación real. La política exige identidad centralizada en Entra ID, sin gestión de usuarios local, MFA y RBAC de mínimo privilegio. El solicitante confirmó que **no se implementa autenticación real en esta etapa** — este ADR documenta la decisión objetivo para cuando se aborde esa fase, de modo que el diseño de dominios/API (ADR-A-001, ADR-A-003) ya sea compatible desde el inicio.

## Alternativas evaluadas

### Opción A — Entra ID + grupos de seguridad mapeados a roles de negocio (recomendada)
- **Pros:** sin tabla de roles paralela que mantener; los 4 roles del prototipo (Solicitante, Abogado, Gerente legal, Admin) se modelan como grupos de Entra ID, y el claim de grupo llega en el token JWT hasta el BFF/APIM; aprovecha MFA y Conditional Access corporativos ya existentes; cumple `P-T-04` sin desarrollo adicional de un sistema de auth propio.
- **Contras:** requiere coordinación con el equipo de IT/Identidad de Ternova para la creación y gobierno de esos grupos (quién puede añadir/quitar miembros) — a definir como proceso, no como problema técnico.

### Opción B — Entra ID solo para autenticación + tabla de roles propia en el dominio Identidad
- **Pros:** más flexible si el modelo de permisos crece más allá de lo que un grupo de Entra ID puede expresar limpiamente (p. ej. permisos por área legal además de por rol).
- **Contras:** introduce una fuente de verdad adicional de autorización que puede desincronizarse de Entra ID; mayor superficie a mantener.

### Opción C — Proveedor de identidad propio (fuera de Entra ID)
- **Contras:** viola directamente `P-T-04` ("Entra ID, sin gestión de usuarios local"). Descartada sin más análisis.

## Decisión

**Opción A como punto de partida**, con posibilidad de evolucionar hacia Opción B si, durante la fase de construcción, el modelo de permisos (`PERM_MATRIX` del prototipo) resulta más granular de lo que los grupos de Entra ID pueden representar razonablemente (p. ej., si "Abogado del área de Litigio" necesita ser distinto de "Abogado del área de Compliance"). Esa granularidad ya existe parcialmente en el prototipo (servicios `restr` por `who`), por lo que se recomienda validarlo temprano en la fase de construcción, no asumir que Opción A alcanza sin revisión.

Componentes técnicos objetivo (a implementar cuando se apruebe la fase de construcción):
- **MSAL** (Microsoft Authentication Library) en el frontend Next.js para el flujo de login.
- Validación de token JWT (emitido por Entra ID) en Azure APIM antes de enrutar a cualquier microservicio — ningún servicio de dominio valida tokens por su cuenta, se centraliza en el gateway.
- **Key Vault** para cualquier secreto de configuración de App Registration (nunca en código).
- MFA heredado de la política de Conditional Access corporativa de Entra ID — no se reconfigura por proyecto.

## Consecuencias

- Mientras no se implemente esta fase, cualquier ambiente de desarrollo/demo debe dejar explícito que usa autenticación simulada/mock — no debe exponerse fuera de redes internas de desarrollo.
- El diseño de API (ADR-A-003) ya asume JWT en cada llamada síncrona vía APIM, por lo que activar esta pieza más adelante no debería requerir rediseñar los contratos de API, solo dejar de simular el token.
- Queda pendiente confirmar con IT/Seguridad si ya existe una App Registration o tenant designado para este proyecto (pregunta abierta del ADD, marcada como "no aplica en esta etapa" por el solicitante) antes de iniciar la implementación real de este ADR.
