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
      { name: 'Acta Junta Directiva — Mar 2026', meta: 'Aprobada · 12 Mar 2026', tag: 'Confidencial', icon: 'ti-file-description' },
      { name: 'Acta Comité Riesgos — May 2026', meta: 'Aprobada · 28 May 2026', tag: 'Restringida', icon: 'ti-file-description' },
      { name: 'Acta Comité Auditoría — May 2026', meta: 'Pendiente firma · 30 May 2026', tag: 'Pendiente', icon: 'ti-file-description' },
      { name: 'Acta Comité Cumplimiento — Abr 2026', meta: 'Aprobada · 15 Abr 2026', tag: 'Confidencial', icon: 'ti-file-description' },
    ],
    policies: [
      { name: 'POL-001 · Código de ética y conducta', meta: 'Rev. 3 · Ene 2026', tag: 'Vigente', icon: 'ti-shield-check' },
      { name: 'POL-002 · Política anticorrupción (FCPA)', meta: 'Rev. 2 · Nov 2025', tag: 'Vigente', icon: 'ti-shield-check' },
      { name: 'POL-003 · Política de conflicto de interés', meta: 'Rev. 4 · Feb 2026', tag: 'Vigente', icon: 'ti-shield-check' },
      { name: 'POL-004 · Política de protección de datos', meta: 'Rev. 5 · Mar 2026', tag: 'Vigente', icon: 'ti-shield-check' },
      { name: 'POL-005 · Política de operaciones con partes relacionadas', meta: 'Rev. 1 · Oct 2025', tag: 'Vigente', icon: 'ti-shield-check' },
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
    { code: '03.1', name: 'Revisión de contrato externo', sla: '3–7 d.h.', st: 'g', resp: 'Abogado de contratos', del: 'Contrato con redline y lista de cláusulas a negociar.', ins: ['Contrato en versión editable', 'Contexto de negociación', 'Monto y plazo'], restr: false },
    { code: '03.2', name: 'Negociación de contrato complejo', sla: '7–20 d.h.', st: 'r', resp: 'Abogado Senior / Gerente Legal', del: 'Contrato negociado + resumen ejecutivo de términos.', ins: ['Posición comercial documentada', 'Redline inicial', 'Deal-breakers y concesiones'], restr: false },
    { code: '03.3', name: 'Redacción de contrato a medida', sla: '5–10 d.h.', st: 'a', resp: 'Abogado de contratos', del: 'Contrato desde cero listo para contraparte.', ins: ['Brief: partes y objeto', 'Obligaciones y precio', 'Plazo y penalidades'], restr: false },
    { code: '03.4', name: 'Terminación contractual', sla: '3–5 d.h.', st: 'g', resp: 'Abogado de contratos', del: 'Carta de terminación, liquidación o finiquito.', ins: ['Contrato original', 'Causa de terminación documentada', 'Comunicaciones previas'], restr: false },
    { code: '03.5', name: 'Estructuración de joint ventures', sla: '15–30 d.h.', st: 'r', resp: 'Equipo Legal M&A', del: 'Termsheet, LOI o convenio de JV.', ins: ['Modelo de negocio conjunto', 'Estructura propuesta', 'Aportaciones y jurisdicción'], restr: true, who: 'Solo Dirección General o Desarrollo de negocios' },
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
  tx: { cls: 't', icon: 'ti-file-text', title: 'Gestión de transacciones', sub: 'Plantillas preaprobadas, seguimiento de firmas y revisión con abogado.', tabs: ['templates', 'timeline', 'svcs', 'faq'] },
  lit: { cls: 'l', icon: 'ti-gavel', title: 'Litigio y arbitraje', sub: 'Expedientes, calendario de audiencias, provisiones y defensa judicial.', tabs: ['docs', 'calendar', 'svcs', 'faq'] },
  edu: { cls: 'e', icon: 'ti-school', title: 'Educación legal', sub: 'Cursos, certificaciones, materiales y programas de capacitación.', tabs: ['courses', 'certs', 'materials', 'svcs', 'faq'] },
  gov: { cls: 'g', icon: 'ti-building-bank', title: 'Governance', sub: 'Marco corporativo, comités, matriz de aprobaciones, políticas y actas.', tabs: ['docs', 'matrix', 'committees', 'policies', 'actas', 'faq'] },
};

const TAB_LABELS = {
  docs: 'Documentos', checklist: 'Autoevaluación', svcs: 'Servicios', faq: 'Preguntas frecuentes',
  templates: 'Plantillas', timeline: 'Mi contrato', calendar: 'Audiencias', courses: 'Cursos',
  certs: 'Mis certificaciones', materials: 'Materiales', matrix: 'Matriz de aprobaciones',
  committees: 'Comités', policies: 'Políticas', actas: 'Actas',
};

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
  byArea: [
    { label: 'Riesgo', n: 38, cls: 'r' },
    { label: 'Asesoría', n: 26, cls: 'a' },
    { label: 'Transacciones', n: 44, cls: 't' },
    { label: 'Litigio', n: 19, cls: 'l' },
    { label: 'Educación', n: 12, cls: 'e' },
    { label: 'Governance', n: 5, cls: 'g' },
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
  { name: 'Camila Ríos',   email: 'c.rios@ternova.group',    role: 'req', area: 'Comercial',        st: 'on',  last: 'Hoy · 08:15' },
  { name: 'Luis Mendoza',  email: 'l.mendoza@ternova.group', role: 'law', area: 'Legal · Contratos', st: 'on',  last: 'Hoy · 09:40' },
  { name: 'Roberto Castro',email: 'r.castro@ternova.group',  role: 'law', area: 'Legal · Litigio',   st: 'on',  last: 'Hoy · 07:55' },
  { name: 'María Flores',  email: 'm.flores@ternova.group',  role: 'law', area: 'Legal · Contratos', st: 'on',  last: 'Ayer · 18:02' },
  { name: 'Ana Salgado',   email: 'a.salgado@ternova.group', role: 'mgr', area: 'Legal',             st: 'on',  last: 'Hoy · 09:42' },
  { name: 'Diego Paz',     email: 'd.paz@ternova.group',     role: 'adm', area: 'TI · Legal Ops',    st: 'on',  last: 'Hoy · 06:30' },
  { name: 'Paola Vargas',  email: 'p.vargas@ternova.group',  role: 'req', area: 'Finanzas',          st: 'on',  last: 'Ayer · 16:20' },
  { name: 'Jorge Méndez',  email: 'j.mendez@ternova.group',  role: 'req', area: 'Operaciones',       st: 'off', last: '12 May · 10:11' },
];

/* Administración — política de permisos (matriz rol × capacidad) */
const PERM_MATRIX = [
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
const JURISDICTIONS = ['Guatemala', 'Honduras', 'El Salvador', 'Costa Rica', 'México'];
