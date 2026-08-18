/* ===========================================================================
   DATOS — Contenido del portal (autoservicio + catálogo de servicios)
   Todo mockeado. AUTO = autoservicio por área · SVCS = servicios con abogado.
   =========================================================================== */

const AUTO = {
  risk: {
    docs: [
      { name: 'Política de gestión de riesgos v3.2', meta: 'Actualizado: Ene 2026', tag: 'PDF · Descargable', icon: 'ti-file-type-pdf' },
      { name: 'Calendario regulatorio 2026', meta: 'GT · HN · SV · CR · MX', tag: 'Tabla interactiva', icon: 'ti-calendar-event' },
      { name: 'Checklist de autoevaluación anual', meta: 'Formulario con puntaje', tag: 'Interactivo', icon: 'ti-checklist' },
      { name: 'Guía de gestión de riesgos operativos', meta: 'Versión 2025 · 28 págs.', tag: 'PDF · Descargable', icon: 'ti-file-text' },
    ],
    checklist: [
      '¿Las políticas de privacidad están actualizadas al año vigente?',
      '¿Se realizó la capacitación de cumplimiento anual al equipo?',
      '¿Los contratos con terceros incluyen cláusulas de protección de datos?',
      '¿El registro de riesgos fue revisado en los últimos 30 días?',
      '¿Existe un responsable designado de compliance en cada área?',
    ],
    faq: [
      { q: '¿Qué es el compliance transaccional y cuándo aplica?', a: 'Es la verificación de que una transacción comercial cumple con normativas AML, FCPA y listas de sanciones internacionales. Aplica para cualquier operación que involucre montos relevantes o partes en jurisdicciones de alto riesgo.' },
      { q: '¿Cuándo necesito un análisis de riesgo legal formal (01.1)?', a: 'Cuando estás evaluando una operación nueva, una alianza comercial, un cambio regulatorio o cualquier situación que pueda tener consecuencias legales significativas para la empresa.' },
      { q: '¿Qué diferencia hay entre riesgo regulatorio y riesgo operativo?', a: 'El riesgo regulatorio surge del incumplimiento de leyes y normativas externas. El riesgo operativo proviene de fallas internas en procesos, personas o sistemas. Ambos deben reportarse al equipo legal.' },
    ],
  },
  adv: {
    docs: [
      { name: 'OL-2026-034 · Uso de IA en RRHH', meta: 'Área: Laboral · Abr 2026', tag: 'Opinión previa', icon: 'ti-file-certificate' },
      { name: 'OL-2026-021 · Protección de datos', meta: 'Área: Regulatorio · Mar 2026', tag: 'Opinión previa', icon: 'ti-file-certificate' },
      { name: 'OL-2025-189 · Propiedad intelectual', meta: 'Área: Contractual · Nov 2025', tag: 'Opinión previa', icon: 'ti-file-certificate' },
      { name: 'Precedentes internos — Laboral 2025', meta: '12 casos resueltos', tag: 'Repositorio', icon: 'ti-folder' },
    ],
    faq: [
      { q: '¿Cuándo necesito una opinión legal formal vs. una consulta informal?', a: 'Cuando la decisión tiene consecuencias contractuales, regulatorias o económicas significativas, necesitas una opinión formal (servicio 02.1) que quede documentada y firmada por el equipo legal.' },
      { q: '¿Qué incluye el servicio de due diligence legal (02.4)?', a: 'Revisión de contratos clave, estructura societaria, litigios activos, cumplimiento regulatorio y análisis de propiedad intelectual de la contraparte. Entrega un informe con semáforo de riesgos.' },
      { q: '¿Puedo compartir datos de clientes con un tercero para análisis?', a: 'No sin un DPA (Data Processing Agreement) firmado y base legal adecuada. Siempre consulta a compliance antes de proceder con cualquier transferencia de datos personales.' },
    ],
  },
  tx: {
    templates: [
      { name: 'NDA Estándar v2', meta: 'NDA-STD-v2 · Bilingüe ES/EN', tag: 'DOCX + PDF', icon: 'ti-file-download' },
      { name: 'Contrato de servicios v3', meta: 'SVC-v3 · Actualizado Mar 2026', tag: 'DOCX', icon: 'ti-file-download' },
      { name: 'Compraventa de activos v1', meta: 'CVA-v1 · Revisado Ene 2026', tag: 'DOCX', icon: 'ti-file-download' },
      { name: 'Arrendamiento comercial v2', meta: 'ARR-v2 · Feb 2026', tag: 'DOCX', icon: 'ti-file-download' },
      { name: 'Acuerdo de confidencialidad mutuo', meta: 'ACM-v1 · Ene 2026', tag: 'DOCX', icon: 'ti-file-download' },
      { name: 'Contrato de consultoría', meta: 'CONS-v2 · Feb 2026', tag: 'DOCX', icon: 'ti-file-download' },
    ],
    timeline: [
      { label: 'Borrador creado', meta: 'CTR-2026-089 · M. Aguilar · 28 May', state: 'done' },
      { label: 'Subido para revisión legal', meta: '29 May 2026', state: 'done' },
      { label: 'En revisión · L. Mendoza', meta: 'SLA: 3 Jun 2026', state: 'act' },
      { label: 'Aprobado y enviado a firma', meta: 'Pendiente', state: '' },
      { label: 'Firmado · Archivo final', meta: 'Pendiente', state: '' },
    ],
    faq: [
      { q: '¿Cuándo puedo usar la plantilla NDA estándar sin revisión legal?', a: 'Cuando es un NDA estándar de no-divulgación unilateral con un proveedor nacional de bajo riesgo. Para NDAs bilaterales, con partes extranjeras o con cláusulas adicionales, usa el servicio 03.1.' },
      { q: '¿Qué contrato necesita fast-track?', a: 'Cualquier contrato cuyo cierre tiene una fecha comercial inamovible en las próximas 24 horas. Marca "fast-track" en el formulario y obtén aprobación del Gerente Comercial antes de enviar.' },
      { q: '¿Cuándo se requiere la firma del Gerente General?', a: 'Para contratos superiores a $50,000 USD, contratos con duración mayor a 3 años, y cualquier contrato con cláusulas de exclusividad territorial o cambio de control.' },
    ],
  },
  lit: {
    docs: [
      { name: 'EXP-2026-012 · Demanda laboral Juzgado 3°', meta: 'En proceso · Audiencia: 5 Jun', tag: 'Activo', icon: 'ti-scale' },
      { name: 'ARB-2025-004 · Arbitraje comercial CAMCA', meta: 'Cerrado · Laudo favorable', tag: 'Cerrado', icon: 'ti-scale' },
      { name: 'EXP-2026-008 · Nulidad contrato Sala Civil', meta: 'Urgente · Vista: 12 Jun', tag: 'Urgente', icon: 'ti-scale' },
      { name: 'Reporte de provisiones Q2 2026', meta: 'Exposición total: $285,000', tag: 'Contabilidad', icon: 'ti-chart-bar' },
    ],
    calendar: [
      { date: '5 Jun 2026', event: 'Audiencia inicial', exp: 'EXP-2026-012', tribunal: 'Juzgado 3° Laboral' },
      { date: '12 Jun 2026', event: 'Vista de la causa', exp: 'EXP-2026-008', tribunal: 'Sala Civil' },
      { date: '30 Jun 2026', event: 'Laudo pendiente', exp: 'ARB-2025-004', tribunal: 'CAMCA' },
    ],
    faq: [
      { q: '¿Qué hago si recibo una demanda judicial fuera del horario laboral?', a: 'Contacta inmediatamente a lit@legal.com. El equipo tiene disponibilidad de guardia para notificaciones urgentes. No firmes ni respondas nada antes de consultar al abogado litigante asignado.' },
      { q: '¿Cuándo aplica el arbitraje vs. la vía judicial?', a: 'El arbitraje aplica cuando el contrato contiene una cláusula compromisoria que lo estipula. Si no hay cláusula arbitral, la vía es judicial. El servicio 04.3 evalúa cuál corresponde en tu caso.' },
      { q: '¿Qué son las provisiones legales y para qué sirven?', a: 'Son reservas contables que reflejan la exposición económica estimada de litigios activos, clasificadas como probable, posible o remota. El equipo legal las actualiza mensualmente para el cierre contable (servicio 04.6).' },
    ],
  },
  edu: {
    courses: [
      { name: 'Introducción al compliance', meta: '2h · Todos los roles · Obligatorio', tag: 'Certificación', icon: 'ti-video' },
      { name: 'RGPD y protección de datos', meta: '3h · Tecnología, Marketing', tag: 'Certificación', icon: 'ti-video' },
      { name: 'Negociación de contratos', meta: '1.5h · Comercial', tag: 'Electivo', icon: 'ti-video' },
      { name: 'Ética empresarial', meta: '1h · Todos los roles', tag: 'Obligatorio', icon: 'ti-video' },
      { name: 'Gestión de riesgos legales', meta: '2h · Gerencias', tag: 'Electivo', icon: 'ti-video' },
    ],
    certs: [
      { name: 'Compliance básico', pct: 100 },
      { name: 'Protección de datos', pct: 70 },
      { name: 'Negociación contractual', pct: 40 },
      { name: 'Ética empresarial', pct: 0 },
    ],
    materials: [
      { name: 'Guía de ética empresarial', meta: 'PDF · 24 páginas', tag: 'Descargable', icon: 'ti-file-download' },
      { name: 'Resumen normativo 2026', meta: 'PDF · Actualizado Ene 2026', tag: 'Descargable', icon: 'ti-file-download' },
      { name: 'Infografía: protección de datos', meta: 'PNG · Imprimible', tag: 'Descargable', icon: 'ti-photo' },
      { name: 'Guía rápida de contratos', meta: 'PDF · 8 páginas', tag: 'Descargable', icon: 'ti-file-download' },
    ],
    faq: [
      { q: '¿Cómo solicito un taller personalizado para mi equipo?', a: 'Usa el servicio 05.2 — Taller legal a medida. Completa el formulario con el tema, tamaño del grupo, nivel previo y fechas disponibles. El equipo confirma en 5 días hábiles.' },
      { q: '¿Cuáles certificaciones son obligatorias para todos los empleados?', a: 'Compliance básico y Ética empresarial son obligatorias para todos los roles. Las certificaciones de protección de datos son obligatorias para áreas que manejan datos personales (Tecnología, Marketing, Ventas).' },
      { q: '¿Con qué frecuencia se actualiza el catálogo de cursos?', a: 'El catálogo se revisa trimestralmente. Para cambios regulatorios urgentes, el equipo emite un boletín inmediato (servicio 05.3) que incluye materiales de referencia y sesión de actualización.' },
    ],
  },
  gov: {
    docs: [
      { name: 'Marco de governance corporativa v2', meta: 'Aprobado: Dic 2025 · Junta Directiva', tag: 'PDF · Descargable', icon: 'ti-file-text' },
      { name: 'Estatutos sociales vigentes', meta: 'Última modificación: Nov 2025', tag: 'PDF · Confidencial', icon: 'ti-file-certificate' },
      { name: 'Reglamento interno de Junta Directiva', meta: 'Versión 2025 · 18 páginas', tag: 'PDF · Descargable', icon: 'ti-book' },
      { name: 'Políticas corporativas consolidadas', meta: '12 políticas · Actualizado Ene 2026', tag: 'PDF · Descargable', icon: 'ti-files' },
    ],
    matrix: [
      { acto: 'Contrato < $10,000', aprobador: 'Gerente de área', canal: 'Email + portal' },
      { acto: 'Contrato $10,000–$50,000', aprobador: 'Director + Gerente Legal', canal: 'Portal + firma digital' },
      { acto: 'Contrato > $50,000', aprobador: 'Gerente General + Junta', canal: 'Portal + sesión de aprobación' },
      { acto: 'Joint venture / alianza', aprobador: 'Junta Directiva', canal: 'Sesión formal + acta' },
      { acto: 'Modificación estatutaria', aprobador: 'Asamblea de accionistas', canal: 'Sesión extraordinaria' },
      { acto: 'Adquisición de activos > $100k', aprobador: 'Comité ejecutivo + Junta', canal: 'Due diligence + acta' },
    ],
    committees: [
      { name: 'Junta Directiva', freq: 'Trimestral', prox: '15 Jun 2026', chair: 'Presidente del Consejo' },
      { name: 'Comité de Auditoría', freq: 'Mensual', prox: '5 Jun 2026', chair: 'Dir. Auditoría Interna' },
      { name: 'Comité de Riesgos', freq: 'Mensual', prox: '10 Jun 2026', chair: 'CFO' },
      { name: 'Comité de Cumplimiento', freq: 'Bimestral', prox: '30 Jun 2026', chair: 'Gerente Legal' },
      { name: 'Comité Ejecutivo', freq: 'Semanal', prox: '7 Jun 2026', chair: 'CEO' },
    ],
    actas: [
      { name: 'Acta Junta Directiva — Mar 2026', meta: 'Aprobada · 12 Mar 2026', tag: 'Confidencial', icon: 'ti-file-description', physicalLocation: 'Oficina legal, gabeta 4, carpeta Actas JD 2026' },
      { name: 'Acta Comité Riesgos — May 2026', meta: 'Aprobada · 28 May 2026', tag: 'Restringida', icon: 'ti-file-description', physicalLocation: 'Oficina legal, gabeta 5, carpeta Comité de Riesgos' },
      { name: 'Acta Comité Auditoría — May 2026', meta: 'Pendiente firma · 30 May 2026', tag: 'Pendiente', icon: 'ti-file-description' },
      { name: 'Acta Comité Cumplimiento — Abr 2026', meta: 'Aprobada · 15 Abr 2026', tag: 'Confidencial', icon: 'ti-file-description', physicalLocation: 'Oficina legal, gabeta 5, carpeta Comité de Cumplimiento' },
    ],
    policies: [
      { name: 'POL-001 · Código de ética y conducta', meta: 'Rev. 3 · Ene 2026', tag: 'Vigente', icon: 'ti-shield-check', physicalLocation: 'Oficina legal, gabeta 1, carpeta 1' },
      { name: 'POL-002 · Política anticorrupción (FCPA)', meta: 'Rev. 2 · Nov 2025', tag: 'Vigente', icon: 'ti-shield-check', physicalLocation: 'Oficina legal, gabeta 1, carpeta 2' },
      { name: 'POL-003 · Política de conflicto de interés', meta: 'Rev. 4 · Feb 2026', tag: 'Vigente', icon: 'ti-shield-check' },
      { name: 'POL-004 · Política de protección de datos', meta: 'Rev. 5 · Mar 2026', tag: 'Vigente', icon: 'ti-shield-check' },
      { name: 'POL-005 · Política de operaciones con partes relacionadas', meta: 'Rev. 1 · Oct 2025', tag: 'Vigente', icon: 'ti-shield-check', physicalLocation: 'Oficina legal, gabeta 2, carpeta 3' },
      { name: 'POL-006 · Política de retención de documentos', meta: 'Rev. 2 · Dic 2025', tag: 'Vigente', icon: 'ti-shield-check' },
    ],
    faq: [
      { q: '¿Qué actos requieren aprobación de la Junta Directiva?', a: 'Contratos superiores a $50,000 USD, adquisiciones de activos relevantes, modificaciones estatutarias, operaciones con partes relacionadas, y cualquier acto que implique riesgo reputacional o regulatorio significativo para la organización.' },
      { q: '¿Cómo solicito que un tema se incluya en la agenda de un comité?', a: 'Envía la solicitud al secretario del comité correspondiente con al menos 10 días hábiles de anticipación. El material de apoyo (memorandos, análisis legal, presentaciones) debe estar listo 5 días antes de la sesión.' },
      { q: '¿Dónde encuentro las actas de comités anteriores?', a: 'En el repositorio de actas de este portal, en la sección de autoservicio de Governance. El acceso está restringido por rol: solo miembros del comité, Gerente Legal y Admin pueden acceder a actas de sesiones pasadas.' },
      { q: '¿Qué es una operación con parte relacionada y qué aprobación necesita?', a: 'Es cualquier transacción entre la empresa y sus accionistas, directores, empleados clave o empresas vinculadas. Requiere divulgación previa al Comité de Auditoría y aprobación de la Junta Directiva, según la POL-005.' },
    ],
  },
};

const SVCS = {
  risk: [
    { code: '01.1', name: 'Análisis de riesgo legal', sla: '5 d.h.', st: 'a', resp: 'Abogado de Riesgo / Gerente Legal', del: 'Informe con semáforo + plan de acción.', ins: ['Descripción de la operación o situación', 'Jurisdicción aplicable', 'Contexto comercial relevante'], restr: false },
    { code: '01.2', name: 'Opinión regulatoria', sla: '3–5 d.h.', st: 'g', resp: 'Especialista Regulatorio', del: 'Opinión escrita con análisis legal y posición recomendada.', ins: ['Normativa aplicable identificada', 'Consulta específica por escrito', 'Impacto estimado en la operación'], restr: false },
    { code: '01.3', name: 'Auditoría legal interna', sla: '10–15 d.h.', st: 'r', resp: 'Gerente Legal + Compliance', del: 'Informe con hallazgos y recomendaciones priorizadas.', ins: ['Alcance y áreas a revisar definidos', 'Período confirmado', 'Acceso a documentos autorizado'], restr: true, who: 'Solo Dirección General o Comité de Auditoría' },
    { code: '01.4', name: 'Plan de mitigación de riesgos', sla: '5–7 d.h.', st: 'a', resp: 'Abogado de Riesgo', del: 'Plan con acciones, responsables y KPIs.', ins: ['Informe de riesgo previo (01.1)', 'Área responsable identificada'], restr: false },
    { code: '01.5', name: 'Compliance transaccional', sla: '24–48h', st: 'r', resp: 'Abogado Compliance / Oficial AML', del: 'Verificación AML/FCPA/sanciones y visto bueno.', ins: ['Descripción de la transacción', 'Partes y jurisdicción', 'Monto de la operación'], restr: false },
  ],
  adv: [
    { code: '02.1', name: 'Opinión legal formal', sla: '3–5 d.h.', st: 'g', resp: 'Abogado asignado al área', del: 'Memorando con fundamento jurídico y recomendación.', ins: ['Consulta detallada por escrito', 'Contexto completo', 'Normativa relacionada si se conoce'], restr: false },
    { code: '02.2', name: 'Asesoría en decisión estratégica', sla: '5–10 d.h.', st: 'a', resp: 'Gerente / Director Legal', del: 'Informe con análisis de opciones y riesgos.', ins: ['Decisión a tomar documentada', 'Opciones evaluadas', 'Impacto esperado y jurisdicción'], restr: true, who: 'Solo Dirección General, C-Suite o Juntas directivas' },
    { code: '02.3', name: 'Revisión de actos jurídicos', sla: '3–5 d.h.', st: 'g', resp: 'Abogado corporativo', del: 'Documento revisado con redline y visto bueno.', ins: ['Acto jurídico a revisar', 'Contexto de la revisión'], restr: false },
    { code: '02.4', name: 'Due diligence legal', sla: '10–20 d.h.', st: 'r', resp: 'Equipo Legal M&A', del: 'Informe con semáforo de riesgos y recomendación.', ins: ['Documentación de la contraparte', 'Estructura societaria', 'Contratos clave y litigios activos'], restr: true, who: 'Solo M&A, Inversiones o Alianzas Estratégicas' },
    { code: '02.5', name: 'Asesoría en propiedad intelectual', sla: '5–7 d.h.', st: 'a', resp: 'Abogado de PI', del: 'Opinión sobre titularidad y recomendaciones de protección.', ins: ['Descripción del activo', 'Uso previsto y territorio'], restr: false },
  ],
  tx: [
    { code: '03.1', contract: 'log', name: 'Revisión de contrato externo', sla: '3–7 d.h.', st: 'g', resp: 'Abogado de contratos', del: 'Contrato con redline y lista de cláusulas a negociar.', ins: ['Contrato en versión editable', 'Contexto de negociación', 'Monto y plazo'], restr: false },
    { code: '03.2', contract: 'log', name: 'Negociación de contrato complejo', sla: '7–20 d.h.', st: 'r', resp: 'Abogado Senior / Gerente Legal', del: 'Contrato negociado + resumen ejecutivo de términos.', ins: ['Posición comercial documentada', 'Redline inicial', 'Deal-breakers y concesiones'], restr: false },
    { code: '03.3', contract: 'srv', name: 'Redacción de contrato a medida', sla: '5–10 d.h.', st: 'a', resp: 'Abogado de contratos', del: 'Contrato desde cero listo para contraparte.', ins: ['Brief: partes y objeto', 'Obligaciones y precio', 'Plazo y penalidades'], restr: false },
    { code: '03.4', contract: 'log', name: 'Terminación contractual', sla: '3–5 d.h.', st: 'g', resp: 'Abogado de contratos', del: 'Carta de terminación, liquidación o finiquito.', ins: ['Contrato original', 'Causa de terminación documentada', 'Comunicaciones previas'], restr: false },
    { code: '03.5', contract: 'presup', name: 'Estructuración de joint ventures', sla: '15–30 d.h.', st: 'r', resp: 'Equipo Legal M&A', del: 'Termsheet, LOI o convenio de JV.', ins: ['Modelo de negocio conjunto', 'Estructura propuesta', 'Aportaciones y jurisdicción'], restr: true, who: 'Solo Dirección General o Desarrollo de negocios' },
  ],
  lit: [
    { code: '04.1', name: 'Estrategia de defensa judicial', sla: '48–72h', st: 'r', resp: 'Abogado Litigante / Gerente Legal', del: 'Análisis defensivo, estrategia y hoja de ruta procesal.', ins: ['Demanda recibida completa', 'Documentación de respaldo', 'Historial con el demandante'], restr: false },
    { code: '04.2', name: 'Representación ante tribunales', sla: 'Según agenda', st: 'a', resp: 'Abogado Litigante', del: 'Escritos, audiencias y actuaciones procesales.', ins: ['Poder notarial vigente', 'Expediente completo', 'Instrucciones autorizadas'], restr: true, who: 'Solo Dirección General con autorización' },
    { code: '04.3', name: 'Arbitraje y ADR', sla: 'Según reglas', st: 'a', resp: 'Abogado de Arbitraje', del: 'Estrategia arbitral y escritos de demanda.', ins: ['Contrato con cláusula arbitral', 'Descripción de la disputa', 'Pretensiones económicas'], restr: false },
    { code: '04.4', name: 'Medidas cautelares', sla: 'Inmediato — 24h', st: 'r', resp: 'Abogado Litigante Senior', del: 'Solicitud de medida cautelar y seguimiento.', ins: ['Hechos urgentes documentados', 'Evidencias disponibles', 'Riesgo de daño irreparable'], restr: false },
    { code: '04.5', name: 'Negociación de settlement', sla: '5–30 d.h.', st: 'a', resp: 'Gerente / Director Legal', del: 'Acuerdo transaccional firmado y desistimiento.', ins: ['Posición de la organización', 'Límite de concesión autorizado', 'Historial de la disputa'], restr: false },
    { code: '04.6', name: 'Gestión de provisiones', sla: 'Mensual', st: 'a', resp: 'Gerente Legal + Abogados', del: 'Reporte de contingencias para contabilidad.', ins: ['Estado de casos activos', 'Probabilidad de condena', 'Exposición máxima estimada'], restr: false },
  ],
  edu: [
    { code: '05.1', name: 'Diseño de programa de capacitación', sla: '10–15 d.h.', st: 'r', resp: 'Gerente Legal + Especialista', del: 'Programa con módulos, objetivos y calendario de sesiones.', ins: ['Objetivos de aprendizaje', 'Áreas y roles destinatarios', 'Presupuesto y fechas tentativas'], restr: true, who: 'Solo Gerencias o Recursos Humanos' },
    { code: '05.2', name: 'Taller legal a medida', sla: '5 d.h.', st: 'g', resp: 'Abogado capacitador', del: 'Taller diseñado + materiales para el equipo.', ins: ['Tema del taller', 'Tamaño del grupo y nivel previo', 'Fechas disponibles'], restr: false },
    { code: '05.3', name: 'Boletín de actualización regulatoria', sla: '3 d.h.', st: 'a', resp: 'Equipo de Compliance', del: 'Boletín con cambios normativos y sesión de actualización.', ins: ['Jurisdicción de interés', 'Áreas afectadas'], restr: false },
    { code: '05.4', name: 'Evaluación de competencias legales', sla: '7 d.h.', st: 'a', resp: 'Especialista en formación', del: 'Diagnóstico con brechas y ruta de certificación.', ins: ['Perfil del equipo', 'Certificaciones requeridas por rol'], restr: false },
  ],
};

/* Metadatos de cada área (color, icono, copy del header, tabs disponibles) */
const AREAS = {
  risk: { cls: 'r', icon: 'ti-shield-half', title: 'Riesgo y compliance', sub: 'Políticas, calendarios, autoevaluación y análisis de riesgo con abogado.', tabs: ['docs', 'checklist', 'svcs', 'faq'] },
  adv: { cls: 'a', icon: 'ti-message-dots', title: 'Asesoría legal', sub: 'Opiniones previas, precedentes y servicios de asesoría formal.', tabs: ['docs', 'svcs', 'faq'] },
  tx: { cls: 't', icon: 'ti-file-text', title: 'Gestión de transacciones', sub: 'Plantillas preaprobadas, contratos suscritos, seguimiento de firmas y revisión con abogado.', tabs: ['agent', 'templates', 'contracts', 'authority', 'timeline', 'svcs', 'faq'] },
  lit: { cls: 'l', icon: 'ti-gavel', title: 'Litigio y arbitraje', sub: 'Expedientes, calendario de audiencias, provisiones y defensa judicial.', tabs: ['docs', 'calendar', 'svcs', 'faq'] },
  edu: { cls: 'e', icon: 'ti-school', title: 'Educación legal', sub: 'Cursos, certificaciones, materiales y programas de capacitación.', tabs: ['courses', 'certs', 'materials', 'svcs', 'faq'] },
  gov: { cls: 'g', icon: 'ti-building-bank', title: 'Governance', sub: 'Marco corporativo, comités, matriz de aprobaciones, políticas y actas.', tabs: ['agent', 'docs', 'matrix', 'committees', 'policies', 'actas', 'faq'] },
};

const TAB_LABELS = {
  docs: 'Documentos', checklist: 'Autoevaluación', svcs: 'Servicios', faq: 'Preguntas frecuentes',
  templates: 'Plantillas', timeline: 'Mi contrato', calendar: 'Audiencias', courses: 'Cursos',
  certs: 'Mis certificaciones', materials: 'Materiales', matrix: 'Matriz de aprobaciones',
  committees: 'Comités', policies: 'Políticas', actas: 'Actas', agent: 'Asistente IA', contracts: 'Contratos suscritos',
  authority: 'Cuadro de autoridades',
};

/* ===========================================================================
   BASE DE CONOCIMIENTO DE GOVERNANCE — para el Asistente IA
   Datos societarios básicos (NO confidenciales) de las sociedades del grupo.
   El asistente responde ÚNICAMENTE con estos hechos; nunca inventa ni revela
   contenido confidencial de actas o deliberaciones de la Junta.
   =========================================================================== */
const GOV_ENTITIES = [
  {
    name: 'Termoencogibles, S.A. de C.V.',
    alias: ['Termoencogibles', 'Termo', 'TESA'],
    pais: 'El Salvador',
    rep: 'Rodrigo Alfaro Beltrán',
    repCargo: 'Representante Legal y Gerente General',
    repDesde: 'Marzo 2022',
    constitucion: '18 de febrero de 1998, San Salvador',
    registro: 'Registro de Comercio de El Salvador · Matrícula 214-88',
    objeto: 'Fabricación de empaque flexible y películas termoencogibles.',
    junta: 'Preside Valeria Ortiz (CEO Grupo Ternova); 5 miembros.',
    fuente: 'Estatutos sociales vigentes · Poder general de representación (Rev. Nov 2025)',
  },
  {
    name: 'Grupo Ternova, S.A.',
    alias: ['Grupo Ternova', 'Ternova', 'la matriz', 'holding'],
    pais: 'Guatemala (sociedad matriz)',
    rep: 'Valeria Ortiz Marroquín',
    repCargo: 'CEO y Representante Legal',
    repDesde: 'Enero 2019',
    constitucion: '3 de mayo de 2005, Ciudad de Guatemala',
    registro: 'Registro Mercantil de Guatemala · Folio 512, Libro 210',
    objeto: 'Sociedad holding de las operaciones de empaque de Centroamérica y México.',
    junta: 'Junta Directiva de 6 miembros; presidencia del Consejo rotativa anual.',
    fuente: 'Estatutos sociales vigentes · Marco de governance corporativa v2 (Dic 2025)',
  },
  {
    name: 'Ternova Empaques México, S. de R.L. de C.V.',
    alias: ['Ternova México', 'Empaques México', 'TEM'],
    pais: 'México',
    rep: 'Mariana Cuevas Ríos',
    repCargo: 'Apoderada legal (poder para actos de administración)',
    repDesde: 'Agosto 2023',
    constitucion: '11 de septiembre de 2015, Monterrey, N.L.',
    registro: 'Registro Público de Comercio de N.L. · Folio mercantil 98214',
    objeto: 'Producción y comercialización de empaque flexible en México.',
    junta: 'Consejo de gerentes de 3 miembros.',
    fuente: 'Poder notarial 4.512 ante Notario Púb. 87 de Monterrey (vigente)',
  },
  {
    name: 'Inversiones Ternova Costa Rica, S.A.',
    alias: ['Ternova Costa Rica', 'Inversiones CR'],
    pais: 'Costa Rica',
    rep: 'Esteban Jiménez Vargas',
    repCargo: 'Presidente con representación judicial y extrajudicial',
    repDesde: 'Febrero 2021',
    constitucion: '27 de junio de 2011, San José',
    registro: 'Registro Nacional de Costa Rica · Cédula jurídica 3-101-628914',
    objeto: 'Distribución regional y tesorería de las operaciones del grupo.',
    junta: 'Junta Directiva de 4 miembros.',
    fuente: 'Personería jurídica vigente · Estatutos sociales',
  },
];
/* Datos de governance del grupo que el asistente también puede citar */
const GOV_FACTS = [
  'Matriz de aprobaciones: contratos menores a $10,000 los aprueba el Gerente de área; de $10,000 a $50,000, Director + Gerente Legal; mayores a $50,000, Gerente General + Junta Directiva.',
  'Joint ventures y alianzas: los aprueba la Junta Directiva en sesión formal con acta.',
  'Modificaciones estatutarias: las aprueba la Asamblea de accionistas en sesión extraordinaria.',
  'Comités del grupo: Junta Directiva (trimestral), Comité de Auditoría (mensual), Comité de Riesgos (mensual), Comité de Cumplimiento (bimestral), Comité Ejecutivo (semanal).',
  'La Gerente Legal del grupo es Ana Salgado; el CEO es Valeria Ortiz.',
  'Políticas corporativas vigentes: POL-001 Código de ética, POL-002 Anticorrupción (FCPA), POL-003 Conflicto de interés, POL-004 Protección de datos, POL-005 Operaciones con partes relacionadas, POL-006 Retención de documentos.',
  'Una operación con parte relacionada requiere divulgación previa al Comité de Auditoría y aprobación de la Junta Directiva (POL-005).',
];

/* Construye el system prompt del asistente con la base de conocimiento */
function govAgentSystem() {
  const ents = GOV_ENTITIES.map(e =>
    `• ${e.name} (también: ${e.alias.join(', ')})\n  - País/constitución: ${e.pais}. Constituida el ${e.constitucion}.\n  - Registro: ${e.registro}.\n  - Representante legal: ${e.rep} — ${e.repCargo} (desde ${e.repDesde}).\n  - Objeto social: ${e.objeto}\n  - Órgano de gobierno: ${e.junta}\n  - Fuente documental: ${e.fuente}`
  ).join('\n\n');
  return `Eres el Asistente de Governance del Portal Legal de Grupo Ternova. Respondes preguntas BÁSICAS de gobierno corporativo del personal autorizado, para que no tengan que abrir y leer los documentos.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con la información de la BASE DE CONOCIMIENTO de abajo. Nunca inventes datos, nombres, fechas ni cifras.
2. Si la respuesta no está en la base, dilo con claridad: "No tengo ese dato en la base de governance. Te sugiero solicitarlo al equipo legal o consultar el documento correspondiente." No especules.
3. NO reveles contenido confidencial de actas ni deliberaciones de la Junta Directiva; solo datos societarios de registro y el marco de governance.
4. Sé breve y directo (2-4 frases). Responde en español.
5. Cuando cites un dato societario, menciona la FUENTE documental entre paréntesis al final.
6. No das asesoría legal; solo información de referencia.

BASE DE CONOCIMIENTO — SOCIEDADES DEL GRUPO:
${ents}

BASE DE CONOCIMIENTO — GOVERNANCE DEL GRUPO:
${GOV_FACTS.map(f => '• ' + f).join('\n')}`;
}
const GOV_AGENT_SUGGESTIONS = [
  '¿Quién es el representante legal de Termoencogibles?',
  '¿Qué contratos debe aprobar la Junta Directiva?',
  '¿Cada cuánto sesiona el Comité de Auditoría?',
  '¿Dónde está constituida Ternova Empaques México?',
];

/* ===========================================================================
   CONTRATOS SUSCRITOS — repositorio de Transacciones
   Alimenta el apartado "Contratos suscritos" y al Asistente IA de contratos.
   Datos mockeados; reemplazar por el repositorio real (SharePoint legal).
   =========================================================================== */
const CONTRACTS = [
  {
    id: 'CTR-2026-089', title: 'Contrato de suministro de resina PET', type: 'Suministro', cls: 't',
    counterparty: 'Petroquímica del Istmo, S.A.', jurisdiction: 'Guatemala',
    value: 'US$ 1,250,000 / año', term: '3 años', signed: '02 Jun 2026', expires: '01 Jun 2029', status: 'vigente',
    parties: 'Termoencogibles, S.A. de C.V. (comprador) y Petroquímica del Istmo, S.A. (proveedor).',
    commercial: 'Precio por tonelada indexado al índice PET regional con revisión trimestral; volumen mínimo de 400 t/trimestre; pago a 45 días fecha factura; entregas DAP planta San Salvador (Incoterms 2020).',
    termination: 'Cualquiera de las partes puede terminar anticipadamente con aviso escrito de 90 días. Terminación inmediata por incumplimiento material no subsanado en 30 días o por insolvencia.',
    penalties: 'Penalidad por incumplimiento de volumen mínimo del 8% del valor no comprado. Mora en pagos: 1.5% mensual. Incumplimiento de entrega: US$ 5,000 por día de retraso, tope 10% del pedido.',
  },
  {
    id: 'CTR-2026-074', title: 'Contrato de servicios logísticos', type: 'Servicios', cls: 't',
    counterparty: 'TransCarga Centroamérica, S.A.', jurisdiction: 'El Salvador',
    value: 'US$ 320,000 / año', term: '2 años', signed: '18 Abr 2026', expires: '17 Abr 2028', status: 'vigente',
    parties: 'Ternova Empaques (contratante) y TransCarga Centroamérica, S.A. (operador logístico).',
    commercial: 'Tarifa por ruta según anexo A; facturación mensual; pago a 30 días; SLA de entrega del 97% on-time; ajuste anual por combustible topado al 6%.',
    termination: 'Terminación sin causa con 60 días de aviso. Terminación por causa ante 3 incumplimientos de SLA en un trimestre.',
    penalties: 'Descuento del 5% de la factura mensual por SLA inferior al 90%. Penalidad de US$ 2,000 por pérdida o daño de carga imputable al operador.',
  },
  {
    id: 'CTR-2025-311', title: 'Contrato de arrendamiento nave industrial', type: 'Arrendamiento', cls: 't',
    counterparty: 'Inmobiliaria Zona Franca, S.A.', jurisdiction: 'Costa Rica',
    value: 'US$ 14,500 / mes', term: '5 años', signed: '01 Nov 2025', expires: '31 Oct 2030', status: 'vigente',
    parties: 'Inversiones Ternova Costa Rica, S.A. (arrendatario) e Inmobiliaria Zona Franca, S.A. (arrendador).',
    commercial: 'Renta mensual con incremento anual del 3%; depósito de 2 meses; mantenimiento estructural a cargo del arrendador; servicios y mejoras a cargo del arrendatario.',
    termination: 'El arrendatario puede terminar anticipadamente a partir del año 3 con aviso de 6 meses. Salida antes del año 3 obliga a pagar 4 rentas como indemnización.',
    penalties: 'Mora en renta: 2% mensual más intereses legales. Terminación anticipada indebida: pérdida del depósito más 4 mensualidades.',
  },
  {
    id: 'CTR-2025-268', title: 'Acuerdo marco de distribución', type: 'Distribución', cls: 't',
    counterparty: 'Distribuidora Norte, S. de R.L.', jurisdiction: 'México',
    value: 'Comisión 12% s/ventas', term: '3 años', signed: '15 Sep 2025', expires: '14 Sep 2028', status: 'vigente',
    parties: 'Ternova Empaques México, S. de R.L. de C.V. (proveedor) y Distribuidora Norte, S. de R.L. (distribuidor).',
    commercial: 'Distribución no exclusiva en el norte de México; comisión del 12% sobre ventas netas; metas trimestrales en anexo B; territorio y precios sujetos a lista oficial.',
    termination: 'Terminación con 90 días de aviso. El incumplimiento de metas durante 2 trimestres consecutivos faculta la terminación por causa.',
    penalties: 'Pérdida de comisión sobre pedidos no cumplidos. Cláusula de no competencia por 12 meses posterior a la terminación; su violación conlleva daños liquidados de US$ 50,000.',
  },
  {
    id: 'CTR-2025-197', title: 'Contrato de licencia de software ERP', type: 'Licencia / TI', cls: 't',
    counterparty: 'Soluciones Cloud LATAM, S.A.', jurisdiction: 'Regional',
    value: 'US$ 96,000 / año', term: '2 años', signed: '10 Jul 2025', expires: '09 Jul 2027', status: 'por-vencer',
    parties: 'Grupo Ternova, S.A. (licenciatario) y Soluciones Cloud LATAM, S.A. (licenciante).',
    commercial: 'Suscripción SaaS por 250 usuarios; pago anual anticipado; soporte 24/7 con SLA de 99.5% de disponibilidad; datos alojados en región y respaldo diario.',
    termination: 'Renovación automática anual salvo aviso de no renovación con 60 días de anticipación. Terminación por brecha de seguridad grave o incumplimiento de SLA sostenido.',
    penalties: 'Crédito de servicio del 10% por mes con disponibilidad bajo el 99%. Uso por encima de usuarios licenciados: cargo retroactivo más 15%.',
  },
  {
    id: 'CTR-2024-402', title: 'Contrato de maquila de empaque', type: 'Manufactura', cls: 't',
    counterparty: 'Empaques Solutions, S.A.', jurisdiction: 'Honduras',
    value: 'US$ 540,000 / año', term: '18 meses', signed: '20 Dic 2024', expires: '19 Jun 2026', status: 'terminado',
    parties: 'Termoencogibles, S.A. de C.V. (contratante) y Empaques Solutions, S.A. (maquilador).',
    commercial: 'Producción por orden de compra; precio por millar según especificación; exclusividad de línea; propiedad intelectual del diseño retenida por Termoencogibles.',
    termination: 'Terminó por vencimiento del plazo el 19 Jun 2026; no se renovó. Contemplaba salida anticipada con 120 días de aviso.',
    penalties: 'Penalidad por defectos superiores al 2% del lote: reposición más 10%. Confidencialidad indefinida; su violación genera daños liquidados de US$ 75,000.',
  },
];
const CONTRACT_STATUS = {
  'vigente':   { txt: 'Vigente', cls: 's-done', icon: 'ti-circle-check' },
  'por-vencer':{ txt: 'Por vencer', cls: 's-rev', icon: 'ti-clock' },
  'terminado': { txt: 'Terminado', cls: 's-urg', icon: 'ti-circle-x' },
};

/* System prompt del Asistente IA de contratos (Transacciones) */
function txAgentSystem() {
  const c = CONTRACTS.map(x =>
    `• ${x.id} — ${x.title} (${x.type}) · ${x.status}\n  - Partes: ${x.parties}\n  - Jurisdicción: ${x.jurisdiction}. Valor: ${x.value}. Plazo: ${x.term}. Firmado: ${x.signed}. Vence: ${x.expires}.\n  - Condiciones comerciales: ${x.commercial}\n  - Terminación anticipada: ${x.termination}\n  - Penalidades: ${x.penalties}`
  ).join('\n\n');
  return `Eres el Asistente de Contratos del Portal Legal de Grupo Ternova, en el área de Transacciones. Ayudas al cliente interno a entender los contratos suscritos SIN que tenga que abrir los documentos.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con la información del REPOSITORIO DE CONTRATOS de abajo. Nunca inventes cifras, fechas, partes ni cláusulas.
2. Cuando resumas un contrato, cubre de forma breve y ordenada: (a) Partes, (b) Condiciones comerciales, (c) Terminación anticipada, (d) Penalidades. Usa viñetas cortas con esos rótulos en negritas.
3. Si preguntan por un contrato o dato que no está en el repositorio, dilo: "No encuentro ese contrato en el repositorio. Verifica el código o solicita el documento al equipo legal." No especules.
4. Si la pregunta es puntual (p. ej. solo penalidades), responde solo eso; no vuelques todo el contrato.
5. Menciona el código del contrato (CTR-…) al inicio de la respuesta.
6. Sé conciso, responde en español. Das información de referencia, no asesoría legal; no interpretas cláusulas más allá de lo escrito.
7. Formato: usa rótulos en **negrita** y viñetas con "•". No uses encabezados Markdown (#).

REPOSITORIO DE CONTRATOS SUSCRITOS:
${c}`;
}
const TX_AGENT_SUGGESTIONS = [
  'Resume el contrato CTR-2026-089',
  '¿Qué penalidades tiene el contrato logístico con TransCarga?',
  '¿Cómo es la terminación anticipada del arrendamiento en Costa Rica?',
  '¿Qué contratos están por vencer?',
];

/* ===========================================================================
   DATOS — Tableros, administración, historial de cambios
   =========================================================================== */

/* Historial de cambios sobre documentación (semilla; se va llenando en vivo) */
let CHANGES = [
  { action: 'edit', doc: 'Política de gestión de riesgos v3.2', area: 'Riesgo y compliance', note: 'Actualización del apartado de riesgo regulatorio MX.', who: 'Ana Salgado', role: 'Gerente', color: '#5B2A86', when: 'Hoy · 09:20' },
  { action: 'new',  doc: 'NDA Estándar v2', area: 'Transacciones', note: 'Nueva versión bilingüe ES/EN publicada.', who: 'Luis Mendoza', role: 'Abogado', color: '#1F7A4D', when: 'Ayer · 17:45' },
  { action: 'del',  doc: 'Contrato de servicios v2 (obsoleto)', area: 'Transacciones', note: 'Reemplazado por la versión v3.', who: 'Luis Mendoza', role: 'Abogado', color: '#1F7A4D', when: 'Ayer · 17:30' },
  { action: 'edit', doc: 'POL-004 · Política de protección de datos', area: 'Governance', note: 'Revisión 5 · ajuste por nueva normativa RGPD-MX.', who: 'Ana Salgado', role: 'Gerente', color: '#5B2A86', when: '06 Jun · 11:10' },
  { action: 'new',  doc: 'Calendario regulatorio 2026', area: 'Riesgo y compliance', note: 'Carga inicial de fechas para las 5 jurisdicciones.', who: 'Diego Paz', role: 'Admin', color: '#B5780A', when: '04 Jun · 08:05' },
  { action: 'edit', doc: 'Guía de ética empresarial', area: 'Educación legal', note: 'Corrección de erratas y nuevos ejemplos.', who: 'Luis Mendoza', role: 'Abogado', color: '#1F7A4D', when: '02 Jun · 15:22' },
];
const CHANGE_META = {
  new:  { txt: 'Publicado', icon: 'ti-plus', cls: 's-done' },
  edit: { txt: 'Actualizado', icon: 'ti-pencil', cls: 's-rev' },
  del:  { txt: 'Eliminado', icon: 'ti-trash', cls: 's-urg' },
};

/* Tableros (dashboards) */
const DASH = {
  kpis: [
    { l: 'Solicitudes (90 días)', v: '144', d: '+12% vs. trimestre previo', cls: 'up', icon: 'ti-file-stack' },
    { l: 'Cumplimiento SLA', v: '94%', d: 'Meta: 90%', cls: 'up', icon: 'ti-gauge' },
    { l: 'Tiempo medio de resolución', v: '3.8 d.h.', d: '-0.6 d.h. vs. mayo', cls: 'up', icon: 'ti-clock-hour-4' },
    { l: 'Solicitudes activas', v: '48', d: '3 en riesgo de SLA', cls: 'warn', icon: 'ti-progress' },
  ],
  /* Solicitudes por macroproceso legal */
  byMacro: [
    { label: 'Legal Ops', n: 26, cls: 'a' },
    { label: 'Riesgos y compliance', n: 38, cls: 'r' },
    { label: 'Gobernanza', n: 5, cls: 'g' },
    { label: 'Transacciones', n: 44, cls: 't' },
    { label: 'Litigios', n: 19, cls: 'l' },
    { label: 'Educación legal', n: 12, cls: 'e' },
  ],
  /* Solicitudes por proceso legal (desglose dentro de cada macroproceso) */
  byProcess: [
    { label: 'Revisión y redacción de contratos', n: 29, macro: 'Transacciones', color: 'var(--ct)' },
    { label: 'Análisis de riesgo legal', n: 21, macro: 'Riesgos y compliance', color: 'var(--cr)' },
    { label: 'Gestión de litigios y audiencias', n: 13, macro: 'Litigios', color: 'var(--cl)' },
    { label: 'Compliance regulatorio y licencias', n: 17, macro: 'Riesgos y compliance', color: 'var(--cr)' },
    { label: 'Gestión y asignación de solicitudes', n: 16, macro: 'Legal Ops', color: 'var(--ca)' },
    { label: 'Terminación y renovación contractual', n: 15, macro: 'Transacciones', color: 'var(--ct)' },
    { label: 'Capacitación y certificación', n: 12, macro: 'Educación legal', color: 'var(--ce)' },
    { label: 'Presupuesto y control de gasto legal', n: 10, macro: 'Legal Ops', color: 'var(--ca)' },
    { label: 'Arbitraje y ADR', n: 6, macro: 'Litigios', color: 'var(--cl)' },
    { label: 'Actas, comités y aprobaciones', n: 5, macro: 'Gobernanza', color: 'var(--cg)' },
  ],
  /* Solicitudes por área operativa demandante */
  byOrg: [
    { label: 'Comercial y Ventas', n: 32, color: 'var(--ca)' },
    { label: 'Operaciones y Planta', n: 27, color: 'var(--ct)' },
    { label: 'Finanzas y Administración', n: 21, color: 'var(--ce)' },
    { label: 'Recursos Humanos', n: 18, color: 'var(--cg)' },
    { label: 'Compras y Cadena de Suministro', n: 15, color: 'var(--cl)' },
    { label: 'Sistema de Gestión (SGI)', n: 13, color: 'var(--cr)' },
    { label: 'Tecnología y Sistemas', n: 10, color: 'var(--brand-2)' },
    { label: 'Dirección General', n: 8, color: 'var(--mut)' },
  ],
  byStatus: [
    { label: 'Entregadas', n: 96, color: '#1F7A4D' },
    { label: 'En revisión', n: 28, color: '#B5780A' },
    { label: 'Recibidas', n: 14, color: '#1B5E96' },
    { label: 'Urgentes', n: 6, color: '#C0392B' },
  ],
  trend: [
    { m: 'Ene', n: 38 }, { m: 'Feb', n: 41 }, { m: 'Mar', n: 47 },
    { m: 'Abr', n: 44 }, { m: 'May', n: 52 }, { m: 'Jun', n: 31 },
  ],
  slaByArea: [
    { label: 'Riesgo y compliance', pct: 92 },
    { label: 'Asesoría legal', pct: 96 },
    { label: 'Transacciones', pct: 89 },
    { label: 'Litigio y arbitraje', pct: 84 },
    { label: 'Educación legal', pct: 99 },
    { label: 'Governance', pct: 100 },
  ],
};

/* Administración — usuarios */
const USERS = [
  { name: 'Valeria Ortiz', email: 'v.ortiz@ternova.group',  role: 'req', title: 'CEO', area: 'Dirección General', st: 'on', last: 'Hoy · 07:10', junta: true },
  { name: 'Camila Ríos',   email: 'c.rios@ternova.group',    role: 'req', area: 'Comercial',        st: 'on',  last: 'Hoy · 08:15' },
  { name: 'Luis Mendoza',  email: 'l.mendoza@ternova.group', role: 'law', area: 'Legal · Contratos', st: 'on',  last: 'Hoy · 09:40' },
  { name: 'Roberto Castro',email: 'r.castro@ternova.group',  role: 'law', area: 'Legal · Litigio',   st: 'on',  last: 'Hoy · 07:55' },
  { name: 'María Flores',  email: 'm.flores@ternova.group',  role: 'law', area: 'Legal · Contratos', st: 'on',  last: 'Ayer · 18:02' },
  { name: 'Ana Salgado',   email: 'a.salgado@ternova.group', role: 'mgr', area: 'Legal',             st: 'on',  last: 'Hoy · 09:42', junta: true },
  { name: 'Diego Paz',     email: 'd.paz@ternova.group',     role: 'adm', area: 'TI · Legal Ops',    st: 'on',  last: 'Hoy · 06:30' },
  { name: 'Ricardo Solís', email: 'r.solis@ternova.group',   role: 'req', title: 'Director', area: 'Junta Directiva', st: 'on', last: 'Ayer · 15:40', junta: true },
  { name: 'Paola Vargas',  email: 'p.vargas@ternova.group',  role: 'req', area: 'Finanzas',          st: 'on',  last: 'Ayer · 16:20' },
  { name: 'Jorge Méndez',  email: 'j.mendez@ternova.group',  role: 'req', area: 'Operaciones',       st: 'off', last: '12 May · 10:11' },
];

/* Administración — política de permisos (matriz rol × capacidad) */
const PERM_MATRIX = [
  { cap: 'Ver la cadencia de reuniones del área',     req: 0, law: 1, mgr: 1, adm: 1 },
  { cap: 'Ver y dar seguimiento al presupuesto',      req: 0, law: 0, mgr: 1, adm: 1 },
  { cap: 'Aprobar solicitudes de presupuesto',        req: 0, law: 0, mgr: 1, adm: 0 },
  { cap: 'Autoservicio y solicitar servicios',       req: 1, law: 1, mgr: 1, adm: 1 },
  { cap: 'Ver mis solicitudes',                       req: 1, law: 1, mgr: 1, adm: 1 },
  { cap: 'Bandeja — solo mis casos asignados',        req: 0, law: 1, mgr: 1, adm: 1 },
  { cap: 'Bandeja — carga y SLA del equipo',          req: 0, law: 0, mgr: 1, adm: 1 },
  { cap: 'Asignar solicitudes / cambiar urgencia',    req: 0, law: 0, mgr: 1, adm: 0 },
  { cap: 'Editar / eliminar documentación',           req: 0, law: 1, mgr: 1, adm: 1 },
  { cap: 'Historial de cambios',                      req: 0, law: 1, mgr: 1, adm: 1 },
  { cap: 'Tableros (dashboards)',                     req: 0, law: 0, mgr: 1, adm: 1 },
  { cap: 'Registro de auditoría',                     req: 0, law: 0, mgr: 1, adm: 1 },
  { cap: 'Administración del portal',                 req: 0, law: 0, mgr: 0, adm: 1 },
];

/* Administración — integraciones */
const INTEGRATIONS = [
  { name: 'Microsoft 365 (SSO)', meta: 'Inicio de sesión corporativo', st: 'on', icon: 'ti-brand-windows' },
  { name: 'Firma digital', meta: 'DocuSign · contratos y actas', st: 'on', icon: 'ti-signature' },
  { name: 'SharePoint legal', meta: 'Repositorio documental', st: 'on', icon: 'ti-folder' },
  { name: 'Power BI', meta: 'Exportación de tableros', st: 'off', icon: 'ti-chart-dots' },
];
const JURISDICTIONS = ['Guatemala', 'Honduras', 'El Salvador', 'Costa Rica', 'México', 'Panamá', 'Nicaragua', 'Vietnam', 'Islas Británicas'];


/* ===========================================================================
   CADENCIA DE REUNIONES — rituales daily / weekly / monthly del equipo legal
   Datos mockeados; sincronizar con Microsoft 365 (Outlook / Teams) en producción.
   =========================================================================== */
const CADENCE = [
  {
    key: 'daily', label: 'Daily', badge: 'Diaria', icon: 'ti-sun-high', color: 'var(--ce)',
    name: 'Daily stand-up legal', when: 'Lun a Vie · 8:30 – 8:45', dur: '15 min', mode: 'Teams',
    lead: 'Ana Salgado · Gerente legal',
    who: ['A. Salgado', 'L. Mendoza', 'R. Castro', 'M. Flores'],
    purpose: 'Sincronizar el día: qué vence hoy, qué está bloqueado y quién necesita apoyo.',
    agenda: [
      { t: '4 min', x: 'Solicitudes que vencen hoy y SLA en riesgo' },
      { t: '5 min', x: 'Ronda por abogado: avance, bloqueo, apoyo requerido' },
      { t: '3 min', x: 'Asignación de entrantes urgentes de la cola' },
      { t: '3 min', x: 'Compromisos del día y cierre' },
    ],
    outputs: ['Prioridades del día definidas', 'Bloqueos escalados al Gerente legal', 'Entrantes urgentes asignados'],
    rule: 'Si un tema toma más de 5 minutos, sale del daily y se agenda aparte.',
  },
  {
    key: 'weekly', label: 'Weekly', badge: 'Semanal', icon: 'ti-calendar-week', color: 'var(--ca)',
    name: 'Weekly de operación legal', when: 'Lunes · 9:00 – 10:00', dur: '60 min', mode: 'Sala Legal + Teams',
    lead: 'Ana Salgado · Gerente legal',
    who: ['A. Salgado', 'L. Mendoza', 'R. Castro', 'M. Flores', 'D. Paz'],
    purpose: 'Revisar la operación de la semana: carga por abogado, cumplimiento de SLA, contratos en firma y riesgos abiertos.',
    agenda: [
      { t: '10 min', x: 'Cumplimiento de SLA de la semana previa' },
      { t: '15 min', x: 'Balance de carga y reasignaciones' },
      { t: '15 min', x: 'Contratos en negociación y en firma' },
      { t: '10 min', x: 'Alertas regulatorias y vencimientos ≤ 30 días' },
      { t: '10 min', x: 'Acuerdos, responsables y fechas' },
    ],
    outputs: ['Carga rebalanceada para la semana', 'Plan de acción de alertas SLA', 'Acuerdos con responsable y fecha'],
    rule: 'Se cierra con acuerdos escritos; sin responsable y fecha no es acuerdo.',
  },
  {
    key: 'monthly', label: 'Monthly', badge: 'Mensual', icon: 'ti-calendar-stats', color: 'var(--cg)',
    name: 'Monthly de desempeño y presupuesto', when: 'Primer jueves · 14:00 – 15:30', dur: '90 min', mode: 'Sala Junta + Teams',
    lead: 'Ana Salgado · Gerente legal · con Dirección General',
    who: ['V. Ortiz', 'A. Salgado', 'D. Paz', 'L. Mendoza'],
    purpose: 'Rendir cuentas del mes: indicadores del portal, ejecución presupuestaria, litigios materiales y decisiones que requieren Dirección.',
    agenda: [
      { t: '20 min', x: 'Tableros del mes: volumen, SLA, autoservicio' },
      { t: '25 min', x: 'Ejecución del presupuesto legal y desvíos' },
      { t: '20 min', x: 'Litigios materiales y provisiones contables' },
      { t: '15 min', x: 'Iniciativas y proyectos legales del trimestre' },
      { t: '10 min', x: 'Decisiones y escalamientos a la Junta' },
    ],
    outputs: ['Acta mensual firmada', 'Ajustes al presupuesto aprobados', 'Escalamientos a la Junta Directiva'],
    rule: 'La minuta se publica en Governance dentro de las 48 horas siguientes.',
  },
];
const CADENCE_NEXT = [
  { date: '29 Jul 2026 · 8:30', rit: 'daily',   topic: 'Vencimientos del día y cola de entrantes', lead: 'A. Salgado', st: 'agendada' },
  { date: '30 Jul 2026 · 8:30', rit: 'daily',   topic: 'Vencimientos del día y cola de entrantes', lead: 'A. Salgado', st: 'agendada' },
  { date: '03 Ago 2026 · 9:00', rit: 'weekly',  topic: 'Cierre de julio: SLA, carga y contratos en firma', lead: 'A. Salgado', st: 'agendada' },
  { date: '06 Ago 2026 · 14:00', rit: 'monthly', topic: 'Desempeño de julio y ejecución presupuestaria', lead: 'A. Salgado', st: 'preparacion' },
  { date: '10 Ago 2026 · 9:00', rit: 'weekly',  topic: 'Alertas regulatorias GT y MX', lead: 'A. Salgado', st: 'agendada' },
];
const CADENCE_PAST = [
  { date: '27 Jul 2026', rit: 'daily',   topic: 'Prioridades del día', mins: 'Minuta breve en Teams', st: 'realizada' },
  { date: '27 Jul 2026', rit: 'weekly',  topic: 'Rebalanceo de carga y contratos en firma', mins: 'Minuta MIN-W-30', st: 'realizada' },
  { date: '02 Jul 2026', rit: 'monthly', topic: 'Desempeño de junio y presupuesto H1', mins: 'Acta MIN-M-06', st: 'realizada' },
];
const CAD_ST = {
  agendada:    { txt: 'Agendada', cls: 's-recv', icon: 'ti-calendar' },
  preparacion: { txt: 'En preparación', cls: 's-rev', icon: 'ti-clipboard-list' },
  realizada:   { txt: 'Realizada', cls: 's-done', icon: 'ti-check' },
};
/* ── BRIEF DEL DAILY — base de la reunión de 8:30 del Gerente legal ──
   Pendientes que deben quedar cerrados el mismo día, propios y del equipo. */
const DAILY_BRIEF = {
  date: 'Martes 28 de julio de 2026', hora: '8:30 a.m.', prep: 'Revisa el brief antes de las 8:25',
  mine: [
    { id: 'D1', txt: 'Asignar SOL-2026-244 y SOL-2026-243 de la cola de entrantes', type: 'Asignación', due: 'Hoy', sla: 'crit' },
    { id: 'D2', txt: 'Aprobar PRE-2026-041 — anticipo de honorarios litigio HN ($14,000)', type: 'Aprobación', due: 'Hoy', sla: 'crit' },
    { id: 'D3', txt: 'Revisar y firmar el informe de riesgo de SOL-2026-238', type: 'Revisión', due: 'Hoy', sla: 'warn' },
    { id: 'D4', txt: 'Rebalancear la carga de R. Castro (90%) — acuerdo ACU-2026-101', type: 'Acuerdo', due: 'Hoy', sla: 'warn' },
    { id: 'D5', txt: 'Confirmar con R. Castro el plan de renovación de licencia GT', type: 'Seguimiento', due: 'Hoy', sla: 'crit' },
    { id: 'D6', txt: 'Consolidar cifras de julio para el monthly del 6 de agosto', type: 'Preparación', due: 'Esta semana', sla: 'ok' },
  ],
  team: [
    { who: 'L. Mendoza', load: '8 casos activos', items: [
      { id: 'T1', txt: 'Cerrar negociación de CTR-2026-091 con TransCarga', due: 'Hoy', sla: 'crit' },
      { id: 'T2', txt: 'Entregar revisión de contrato externo SOL-2026-241', due: 'Hoy', sla: 'crit' },
      { id: 'T3', txt: 'Borrador de contrato a medida SOL-2026-239', due: '2 días', sla: 'ok' },
    ] },
    { who: 'R. Castro', load: '9 casos activos · sobrecargado', items: [
      { id: 'T4', txt: 'Estrategia de defensa judicial SOL-2026-240', due: '< 24h', sla: 'crit' },
      { id: 'T5', txt: 'Plan de renovación de licencia de operación GT', due: 'Hoy', sla: 'crit', blocked: 'Espera constancia fiscal de Finanzas' },
    ] },
    { who: 'M. Flores', load: '3 casos activos', items: [
      { id: 'T6', txt: 'Cerrar terminación contractual SOL-2026-233', due: '5 días', sla: 'ok' },
      { id: 'T7', txt: 'Subir comprobantes de tasas de registro (MOV-2026-307)', due: 'Hoy', sla: 'warn' },
    ] },
    { who: 'D. Paz', load: 'Soporte y administración', items: [
      { id: 'T8', txt: 'Publicar minuta MIN-M-06 en Governance', due: 'Hoy', sla: 'ok' },
    ] },
  ],
  focus: [
    'Vencen hoy: 4 solicitudes con SLA crítico (SOL-2026-241, 240, 244, 238).',
    'Bloqueo abierto: R. Castro espera constancia fiscal de Finanzas para la licencia GT.',
    'Cola sin asignar: 5 solicitudes entrantes, 2 con SLA menor a 48 horas.',
    'Presupuesto: 3 solicitudes por aprobar ($25,700) y ejecución 4 puntos sobre el ritmo del año.',
  ],
};

/* Acuerdos y compromisos originados en la cadencia */
let COMMITMENTS = [
  { id: 'ACU-2026-104', txt: 'Cerrar la negociación de CTR-2026-091 con TransCarga', rit: 'weekly', who: 'L. Mendoza', due: '31 Jul 2026', st: 'curso' },
  { id: 'ACU-2026-103', txt: 'Presentar plan de renovación de licencia de operación GT', rit: 'weekly', who: 'R. Castro', due: '30 Jul 2026', st: 'riesgo' },
  { id: 'ACU-2026-102', txt: 'Actualizar la matriz de aprobaciones con los nuevos umbrales', rit: 'monthly', who: 'A. Salgado', due: '05 Ago 2026', st: 'curso' },
  { id: 'ACU-2026-101', txt: 'Reasignar 2 casos de R. Castro para bajar su carga a 70%', rit: 'daily', who: 'A. Salgado', due: '28 Jul 2026', st: 'cumplido' },
  { id: 'ACU-2026-099', txt: 'Publicar minuta MIN-M-06 en Governance', rit: 'monthly', who: 'D. Paz', due: '04 Jul 2026', st: 'cumplido' },
];
const COM_ST = {
  curso:    { txt: 'En curso', cls: 's-rev', icon: 'ti-progress' },
  riesgo:   { txt: 'En riesgo', cls: 's-urg', icon: 'ti-alert-triangle' },
  cumplido: { txt: 'Cumplido', cls: 's-done', icon: 'ti-check' },
};

/* ===========================================================================
   PRESUPUESTO LEGAL — gestión y seguimiento de la ejecución anual
   Datos mockeados; integrar con el ERP financiero en producción.
   =========================================================================== */
/* Presupuesto de OPERACIÓN del área legal (gasto recurrente) */
const BUDGET = {
  year: 2026, cur: 'US$', total: 480000, pace: 58, // % del año transcurrido al 28 Jul
  rubros: [
    { code: 'BL-01', name: 'Honorarios de abogados externos', plan: 180000, exec: 121400, commit: 22000, owner: 'A. Salgado', color: 'var(--ct)' },
    { code: 'BL-02', name: 'Litigios y provisiones judiciales', plan: 96000, exec: 61800, commit: 15000, owner: 'R. Castro', color: 'var(--cr)' },
    { code: 'BL-03', name: 'Tasas, registros y licencias', plan: 54000, exec: 34900, commit: 4200, owner: 'M. Flores', color: 'var(--ca)' },
    { code: 'BL-04', name: 'Compliance y auditorías regulatorias', plan: 48000, exec: 21600, commit: 6000, owner: 'D. Paz', color: 'var(--ce)' },
    { code: 'BL-05', name: 'Capacitación y certificaciones', plan: 36000, exec: 13400, commit: 2500, owner: 'L. Mendoza', color: 'var(--cg)' },
    { code: 'BL-06', name: 'Tecnología legal (CLM, firma, portal)', plan: 66000, exec: 44700, commit: 9800, owner: 'D. Paz', color: 'var(--cl)' },
  ],
  months: [
    { m: 'Ene', plan: 40000, real: 37200 }, { m: 'Feb', plan: 40000, real: 41500 },
    { m: 'Mar', plan: 40000, real: 38900 }, { m: 'Abr', plan: 40000, real: 44200 },
    { m: 'May', plan: 40000, real: 39600 }, { m: 'Jun', plan: 40000, real: 47100 },
    { m: 'Jul', plan: 40000, real: 49300 }, { m: 'Ago', plan: 40000, real: null },
    { m: 'Sep', plan: 40000, real: null }, { m: 'Oct', plan: 40000, real: null },
    { m: 'Nov', plan: 40000, real: null }, { m: 'Dic', plan: 40000, real: null },
  ],
};
/* Presupuesto de PROYECTOS ESTRATÉGICOS — una línea por proyecto del portafolio LPM */
const BUDGET_PRJ = { year: 2026, cur: 'US$', pace: 58 };
let PRJ_MOVES = [
  { id: 'MPY-2026-064', date: '23 Jul 2026', concept: 'Asesoría externa para plantillas de suministro', prj: 'PRY-2026-01', amount: 9800, prov: 'Arriaga & Asociados', st: 'pagado' },
  { id: 'MPY-2026-061', date: '18 Jul 2026', concept: 'Consultoría de selección de CLM', prj: 'PRY-2026-02', amount: 7500, prov: 'LegalTech Advisors', st: 'pagado' },
  { id: 'MPY-2026-058', date: '11 Jul 2026', concept: 'Auditoría de protección de datos MX', prj: 'PRY-2026-03', amount: 9600, prov: 'DataComply', st: 'comprometido' },
  { id: 'MPY-2026-055', date: '07 Jul 2026', concept: 'Opinión fiscal preliminar reestructura CR', prj: 'PRY-2026-04', amount: 3400, prov: 'Fiscal Partners CR', st: 'pagado' },
  { id: 'MPY-2026-050', date: '30 Jun 2026', concept: 'Producción de materiales del Código de Ética', prj: 'PRY-2026-05', amount: 6200, prov: 'Estudio Gráfico', st: 'pagado' },
];
/* Solicitudes de incremento presupuestario de proyectos */
let PRJ_BUDGET_REQS = [
  { id: 'INC-2026-012', prj: 'PRY-2026-02', concept: 'Incremento por migración de contratos históricos al CLM', amount: 12000, from: 'A. Salgado', date: '26 Jul 2026' },
  { id: 'INC-2026-011', prj: 'PRY-2026-03', concept: 'Escrito de subsanación y representación ante el regulador MX', amount: 6500, from: 'D. Paz', date: '24 Jul 2026' },
];

let BUDGET_MOVES = [
  { id: 'MOV-2026-318', date: '24 Jul 2026', concept: 'Honorarios firma externa — arbitraje EXP-2026-012', rubro: 'BL-02', amount: 18500, prov: 'Arriaga & Asociados', st: 'pagado' },
  { id: 'MOV-2026-315', date: '21 Jul 2026', concept: 'Renovación licencia CLM anual', rubro: 'BL-06', amount: 12400, prov: 'ContractWorks', st: 'pagado' },
  { id: 'MOV-2026-311', date: '17 Jul 2026', concept: 'Due diligence M&A — asesoría externa MX', rubro: 'BL-01', amount: 26800, prov: 'Grupo Legal Reforma', st: 'pagado' },
  { id: 'MOV-2026-307', date: '14 Jul 2026', concept: 'Tasas de registro de marca (3 clases)', rubro: 'BL-03', amount: 4300, prov: 'Registro de la Propiedad GT', st: 'pagado' },
  { id: 'MOV-2026-302', date: '09 Jul 2026', concept: 'Auditoría de protección de datos MX', rubro: 'BL-04', amount: 9600, prov: 'DataComply', st: 'comprometido' },
  { id: 'MOV-2026-298', date: '03 Jul 2026', concept: 'Certificación de compliance — 4 abogados', rubro: 'BL-05', amount: 5200, prov: 'ICA Institute', st: 'pagado' },
];
const MOV_ST = {
  pagado:       { txt: 'Pagado', cls: 's-done', icon: 'ti-circle-check' },
  comprometido: { txt: 'Comprometido', cls: 's-rev', icon: 'ti-clock' },
  revision:     { txt: 'En revisión', cls: 's-recv', icon: 'ti-eye' },
};
/* Solicitudes de presupuesto pendientes de aprobación del Gerente legal */
let BUDGET_REQS = [
  { id: 'PRE-2026-041', concept: 'Anticipo de honorarios — litigio laboral HN', rubro: 'BL-02', amount: 14000, from: 'R. Castro', date: '27 Jul 2026' },
  { id: 'PRE-2026-040', concept: 'Opinión fiscal externa reestructura CR', rubro: 'BL-01', amount: 8500, from: 'L. Mendoza', date: '25 Jul 2026' },
  { id: 'PRE-2026-039', concept: 'Taller de contratación para Comercial', rubro: 'BL-05', amount: 3200, from: 'M. Flores', date: '23 Jul 2026' },
];


/* ===========================================================================
   CUADRO DE AUTORIDADES PARA CONTRATOS
   Fuente: 26.5.5-SGS · Cuadro de Autoridades Corporativo V1 (Flexible Holdings).
   Rige las aprobaciones de contratos del Grupo por tipo y monto total.
   Excluye contratos de deuda, CAPEX y adquisición de activos.
   =========================================================================== */
const AUTH_SOURCE = '26.5.5-SGS · Cuadro de Autoridades Corporativo V1';
const AUTH_LEVELS = {
  GN:  { code: 'GN',    name: 'Gerente de área',                  short: 'Gerencia',      order: 1 },
  VPD: { code: 'VP/D',  name: 'Vicepresidencia / Dirección de área', short: 'VP / Dirección', order: 2 },
  CFO: { code: 'CFO',   name: 'Dirección de Finanzas',            short: 'CFO',           order: 3 },
  CEO: { code: 'CEO',   name: 'Director Ejecutivo',               short: 'CEO',           order: 4 },
  JD:  { code: 'JD',    name: 'Junta Directiva',                  short: 'Junta Directiva', order: 5 },
};
/* tiers: límite máximo de aprobación de cada nivel (valor total del contrato) */
const AUTH_TYPES = [
  { id: 'log', name: 'Logísticos, comerciales y de consignación de inventarios',
    tiers: [{ lvl: 'GN', max: 25000 }, { lvl: 'VPD', max: 50000 }, { lvl: 'CFO', max: 100000 }, { lvl: 'CEO', max: 300000 }, { lvl: 'JD', max: Infinity }] },
  { id: 'alq', name: 'Alquileres y arrendamientos',
    tiers: [{ lvl: 'GN', max: 25000 }, { lvl: 'VPD', max: 50000 }, { lvl: 'CFO', max: 100000 }, { lvl: 'CEO', max: 300000 }, { lvl: 'JD', max: Infinity }] },
  { id: 'srv', name: 'Servicios (honorarios, auditorías, consultorías) y otros servicios',
    tiers: [{ lvl: 'GN', max: 15000 }, { lvl: 'VPD', max: 30000 }, { lvl: 'CFO', max: 100000 }, { lvl: 'CEO', max: 300000 }, { lvl: 'JD', max: Infinity }],
    note: 'Todo contrato no contemplado expresamente en el cuadro sigue este flujo, siempre que esté incluido en el presupuesto anual.' },
  { id: 'presup', name: 'Contratos que superan el presupuesto anual',
    tiers: [{ lvl: 'VPD', max: 30000 }, { lvl: 'CFO', max: 100000 }, { lvl: 'CEO', max: 300000 }, { lvl: 'JD', max: Infinity }],
    forceJD: true, note: 'Sin delegación a Gerencia. Todo lo que supere el presupuesto global de la compañía requiere aprobación de la Junta Directiva.' },
  { id: 're-in', name: 'Real estate · dentro del presupuesto aprobado por la Junta (Anexo 1)',
    tiers: [{ lvl: 'CFO', max: Infinity }], committee: true,
    note: 'Construcción, diseño y servicios profesionales de proyectos inmobiliarios. El Comité de Contratos recomienda, el FCM revisa y VP/D propone.' },
  { id: 're-out', name: 'Real estate · fuera del presupuesto del proyecto (Anexo 1)',
    tiers: [{ lvl: 'CFO', max: 50000 }, { lvl: 'CEO', max: 300000 }, { lvl: 'JD', max: Infinity }], committee: true,
    note: 'El Anexo 1 prevalece para operaciones inmobiliarias dentro de su alcance.' },
];
/* Condiciones que alteran la cadena de aprobación, sin importar el monto */
const AUTH_FLAGS = [
  { id: 'unlimited', label: 'Responsabilidad ilimitada, indemnidades materiales o condiciones fuera de estándar',
    sev: 'crit', txt: 'Requiere aprobación de CFO y CEO sin importar el monto del contrato.' },
  { id: 'offBudget', label: 'Erogación dentro del presupuesto global pero no contemplada expresamente',
    sev: 'warn', txt: 'Escalamiento automático de al menos un nivel adicional de aprobación.' },
  { id: 'overBudget', label: 'Supera el presupuesto global de la compañía',
    sev: 'crit', txt: 'Aprobación obligatoria de la Junta Directiva, cualquiera sea el monto.' },
  { id: 'nda', label: 'Implica divulgar información confidencial a la contraparte',
    sev: 'info', txt: 'El gestor debe validar con Legal la suscripción de un NDA antes de divulgar información.' },
  { id: 'excluded', label: 'Es contrato de deuda, CAPEX o adquisición de activos',
    sev: 'warn', txt: 'Fuera del alcance del cuadro de contratos: aplica el cuadro de CAPEX / Estructura de Capital.' },
];
const AUTH_RULES = [
  'Los montos se calculan sobre el valor total del contrato, salvo disposición expresa en contrario.',
  'El área Legal debe revisar y validar todos los contratos del Grupo antes de la firma.',
  'No está permitida la fragmentación de contratos u órdenes para reducir niveles de aprobación: es falta grave al Código de Ética.',
  'Los contratos no contemplados expresamente siguen el flujo de contratos por servicios.',
  'Se excluyen los contratos de deuda, CAPEX y adquisición de activos, regidos por sus propios cuadros.',
];


/* ===========================================================================
   PROYECTOS ESTRATÉGICOS — gestionados bajo Legal Project Management (LPM)
   Cinco etapas con criterios de entrada, entregables y gate de salida.
   =========================================================================== */
const LPM_STAGES = [
  { id: 'intake', name: 'Intake y definición', short: 'Definición', icon: 'ti-target-arrow', color: 'var(--ca)',
    goal: 'Delimitar el problema legal, el alcance y el valor esperado antes de comprometer recursos.',
    inputs: ['Solicitud del sponsor con caso de negocio', 'Jurisdicciones y áreas involucradas'],
    deliverables: ['Acta de constitución del proyecto (charter)', 'Alcance, supuestos y exclusiones', 'Sponsor y líder legal designados'],
    gate: ['Charter firmado por el sponsor', 'Alcance y exclusiones documentados', 'Presupuesto preliminar estimado', 'Riesgos iniciales identificados'] },
  { id: 'plan', name: 'Planificación', short: 'Planificación', icon: 'ti-list-check', color: 'var(--ct)',
    goal: 'Construir el plan de trabajo, la matriz de responsabilidades y el presupuesto del proyecto.',
    inputs: ['Charter aprobado', 'Disponibilidad del equipo legal'],
    deliverables: ['Plan de trabajo con hitos y fechas', 'Matriz RACI y equipo asignado', 'Presupuesto y proveedores externos'],
    gate: ['Plan de hitos aprobado', 'RACI validada con las áreas', 'Presupuesto aprobado conforme al cuadro de autoridades', 'Plan de gestión de riesgos definido'] },
  { id: 'exec', name: 'Ejecución', short: 'Ejecución', icon: 'ti-player-play', color: 'var(--ce)',
    goal: 'Producir los entregables legales del proyecto con seguimiento semanal de avance y desvíos.',
    inputs: ['Plan aprobado', 'Insumos de las áreas operativas'],
    deliverables: ['Entregables legales del alcance', 'Reporte de avance en el weekly', 'Registro de cambios de alcance'],
    gate: ['Entregables completos según alcance', 'Cambios de alcance documentados y aprobados', 'Presupuesto ejecutado dentro del rango', 'Sin riesgos críticos abiertos'] },
  { id: 'qc', name: 'Control y calidad', short: 'Control', icon: 'ti-shield-check', color: 'var(--cg)',
    goal: 'Verificar calidad jurídica, consistencia documental y cumplimiento antes del cierre.',
    inputs: ['Entregables terminados', 'Criterios de aceptación del sponsor'],
    deliverables: ['Revisión de calidad legal (peer review)', 'Validación de compliance y firmas', 'Aceptación formal del sponsor'],
    gate: ['Peer review sin observaciones abiertas', 'Aprobaciones y firmas completas', 'Aceptación escrita del sponsor'] },
  { id: 'close', name: 'Cierre y lecciones', short: 'Cierre', icon: 'ti-flag-check', color: 'var(--cl)',
    goal: 'Cerrar formalmente, medir resultados y capitalizar el aprendizaje en plantillas y políticas.',
    inputs: ['Aceptación del sponsor', 'Cifras finales de presupuesto'],
    deliverables: ['Informe de cierre con métricas', 'Lecciones aprendidas y activos reutilizables', 'Archivo documental en el repositorio'],
    gate: ['Informe de cierre publicado', 'Lecciones aprendidas registradas', 'Documentación archivada y trazable'] },
];
const PRJ_HEALTH = {
  ok:   { txt: 'En curso', cls: 's-done', icon: 'ti-circle-check' },
  warn: { txt: 'Con desvío', cls: 's-rev', icon: 'ti-alert-circle' },
  crit: { txt: 'En riesgo', cls: 's-urg', icon: 'ti-alert-triangle' },
};
const MS_ST = { done: 'Cumplido', curso: 'En curso', pend: 'Pendiente', late: 'Atrasado' };
let PROJECTS = [
  { id: 'PRY-2026-01', name: 'Estandarización de contratos de suministro regional', stage: 'exec', health: 'ok', progress: 62,
    sponsor: 'Valeria Ortiz · CEO', lead: 'L. Mendoza', team: ['L. Mendoza', 'M. Flores', 'Comercial', 'Compras'],
    start: '02 Feb 2026', target: '30 Sep 2026', juris: 'GT · SV · HN · CR', budget: { plan: 48000, used: 27600 },
    objective: 'Unificar en cinco plantillas preaprobadas los contratos de suministro del grupo y reducir el tiempo de firma de 18 a 7 días hábiles.',
    milestones: [
      { name: 'Inventario de contratos vigentes', date: '13 Mar 2026', st: 'done' },
      { name: 'Plantillas maestras aprobadas por Legal', date: '29 May 2026', st: 'done' },
      { name: 'Piloto con 3 proveedores clave', date: '14 Ago 2026', st: 'curso' },
      { name: 'Despliegue regional y capacitación', date: '30 Sep 2026', st: 'pend' },
    ],
    deliverables: [{ n: '5 plantillas maestras bilingües', st: 'done' }, { n: 'Guía de negociación por cláusula', st: 'curso' }, { n: 'Capacitación a Comercial y Compras', st: 'pend' }],
    risks: [{ txt: 'Resistencia de proveedores a cláusulas de indemnidad', sev: 'warn', mit: 'Paquete de concesiones preaprobado por CFO' },
            { txt: 'Dependencia del CLM para el despliegue', sev: 'warn', mit: 'Plan B: despliegue manual con control de versiones' }],
    gateDone: ['Entregables completos según alcance'] },
  { id: 'PRY-2026-02', name: 'Implementación de CLM (gestión del ciclo de vida contractual)', stage: 'plan', health: 'warn', progress: 28,
    sponsor: 'Diego Paz · Admin del portal', lead: 'A. Salgado', team: ['A. Salgado', 'D. Paz', 'TI', 'Finanzas'],
    start: '05 May 2026', target: '15 Dic 2026', juris: 'Regional', budget: { plan: 66000, used: 12800 },
    objective: 'Implantar el CLM corporativo integrado al portal legal, con repositorio único, alertas de vencimiento y flujo de aprobaciones conforme al cuadro de autoridades.',
    milestones: [
      { name: 'Definición de requerimientos y RFP', date: '19 Jun 2026', st: 'done' },
      { name: 'Selección de proveedor y contrato', date: '31 Jul 2026', st: 'late' },
      { name: 'Configuración y migración de contratos', date: '30 Oct 2026', st: 'pend' },
      { name: 'Salida a producción', date: '15 Dic 2026', st: 'pend' },
    ],
    deliverables: [{ n: 'Requerimientos funcionales firmados', st: 'done' }, { n: 'Contrato con el proveedor CLM', st: 'curso' }, { n: 'Plan de migración documental', st: 'pend' }],
    risks: [{ txt: 'Contrato del proveedor supera $100,000 y requiere CEO', sev: 'crit', mit: 'Aprobación en la agenda del monthly de agosto' },
            { txt: 'Calidad de metadatos de contratos históricos', sev: 'warn', mit: 'Depuración previa con Finanzas' }],
    gateDone: ['Plan de hitos aprobado'] },
  { id: 'PRY-2026-03', name: 'Cumplimiento de protección de datos MX y CR', stage: 'exec', health: 'crit', progress: 45,
    sponsor: 'Ana Salgado · Gerente legal', lead: 'D. Paz', team: ['D. Paz', 'R. Castro', 'TI', 'RRHH'],
    start: '16 Mar 2026', target: '31 Ago 2026', juris: 'México · Costa Rica', budget: { plan: 34000, used: 21600 },
    objective: 'Cerrar las brechas de la declaración de protección de datos y dejar operando el registro de tratamientos y el procedimiento de derechos de titulares.',
    milestones: [
      { name: 'Diagnóstico de brechas por país', date: '30 Abr 2026', st: 'done' },
      { name: 'Registro de tratamientos y avisos', date: '30 Jun 2026', st: 'done' },
      { name: 'Declaración regulatoria MX', date: '14 Jun 2026', st: 'late' },
      { name: 'Auditoría interna de cierre', date: '31 Ago 2026', st: 'pend' },
    ],
    deliverables: [{ n: 'Registro de tratamientos por sociedad', st: 'done' }, { n: 'Procedimiento de derechos de titulares', st: 'curso' }, { n: 'Informe de auditoría de cumplimiento', st: 'pend' }],
    risks: [{ txt: 'Declaración MX vencida el 14 Jun — riesgo de multa', sev: 'crit', mit: 'Presentación extemporánea con escrito de subsanación' },
            { txt: 'Falta de responsable de datos designado en CR', sev: 'warn', mit: 'Designación en el monthly de agosto' }],
    gateDone: [] },
  { id: 'PRY-2026-04', name: 'Reestructura societaria Costa Rica', stage: 'intake', health: 'ok', progress: 12,
    sponsor: 'Valeria Ortiz · CEO', lead: 'A. Salgado', team: ['A. Salgado', 'Finanzas', 'Fiscal externo'],
    start: '14 Jul 2026', target: '28 Feb 2027', juris: 'Costa Rica', budget: { plan: 52000, used: 3400 },
    objective: 'Evaluar y ejecutar la reorganización de las sociedades en Costa Rica para simplificar la estructura y optimizar la carga administrativa.',
    milestones: [
      { name: 'Caso de negocio y charter', date: '08 Ago 2026', st: 'curso' },
      { name: 'Opinión fiscal y legal externa', date: '30 Sep 2026', st: 'pend' },
      { name: 'Aprobación de la Junta Directiva', date: '31 Oct 2026', st: 'pend' },
      { name: 'Ejecución registral', date: '28 Feb 2027', st: 'pend' },
    ],
    deliverables: [{ n: 'Charter con alcance y exclusiones', st: 'curso' }, { n: 'Opinión fiscal comparada', st: 'pend' }, { n: 'Plan de ejecución registral', st: 'pend' }],
    risks: [{ txt: 'Requiere aprobación de Junta Directiva (+$300,000 en activos)', sev: 'warn', mit: 'Agendado como escalamiento en el monthly' }],
    gateDone: ['Sponsor y líder legal designados'] },
  { id: 'PRY-2026-05', name: 'Programa de compliance y Código de Ética 2027', stage: 'qc', health: 'ok', progress: 84,
    sponsor: 'Ana Salgado · Gerente legal', lead: 'M. Flores', team: ['M. Flores', 'L. Mendoza', 'RRHH', 'Sistema de Gestión'],
    start: '12 Ene 2026', target: '31 Ago 2026', juris: 'Regional', budget: { plan: 28000, used: 24100 },
    objective: 'Actualizar el Código de Ética y desplegar el programa anual de compliance con certificación del 100% del personal administrativo.',
    milestones: [
      { name: 'Nuevo Código de Ética redactado', date: '27 Mar 2026', st: 'done' },
      { name: 'Aprobación de la Junta Directiva', date: '21 May 2026', st: 'done' },
      { name: 'Capacitación y certificación', date: '31 Jul 2026', st: 'done' },
      { name: 'Peer review y aceptación del sponsor', date: '20 Ago 2026', st: 'curso' },
    ],
    deliverables: [{ n: 'Código de Ética 2027 publicado', st: 'done' }, { n: 'Certificación de 412 colaboradores', st: 'done' }, { n: 'Informe de aceptación del sponsor', st: 'curso' }],
    risks: [{ txt: '18 colaboradores pendientes de certificar en filiales', sev: 'warn', mit: 'Sesión de recuperación el 12 de agosto' }],
    gateDone: ['Peer review sin observaciones abiertas'] },
  { id: 'PRY-2026-06', name: 'Renovación del marco de licencias de operación GT', stage: 'close', health: 'ok', progress: 96,
    sponsor: 'Ana Salgado · Gerente legal', lead: 'R. Castro', team: ['R. Castro', 'Operaciones', 'Sistema de Gestión'],
    start: '09 Feb 2026', target: '15 Ago 2026', juris: 'Guatemala', budget: { plan: 19000, used: 17800 },
    objective: 'Renovar las licencias de operación de planta y dejar un calendario regulatorio con alertas automáticas en el portal.',
    milestones: [
      { name: 'Expediente de renovación presentado', date: '28 Abr 2026', st: 'done' },
      { name: 'Licencias otorgadas', date: '10 Jun 2026', st: 'done' },
      { name: 'Calendario regulatorio en el portal', date: '31 Jul 2026', st: 'done' },
      { name: 'Informe de cierre y lecciones', date: '15 Ago 2026', st: 'curso' },
    ],
    deliverables: [{ n: 'Licencias vigentes 2026–2029', st: 'done' }, { n: 'Calendario de alertas regulatorias', st: 'done' }, { n: 'Informe de cierre con métricas', st: 'curso' }],
    risks: [{ txt: 'Sin riesgos abiertos', sev: 'ok', mit: 'Monitoreo por calendario regulatorio' }],
    gateDone: ['Lecciones aprendidas registradas'] },
];
