/* ==========================================================================
   Red Pericial — Contenido centralizado
   --------------------------------------------------------------------------
   Todo el contenido editable del sitio vive aquí. Al migrar a React/Next.js
   este archivo se convierte directamente en JSON o en respuestas de un CMS.

   CONVENCIÓN DE PLACEHOLDERS
   - Texto entre corchetes  → "[POR DEFINIR]", "[DATOS DEL CLIENTE]"
   - confirmed: false       → servicio/área aún no validado por el cliente
   - demo: true             → cifra o elemento de demostración
   - ready: false           → no se publica en datos estructurados (SEO)
   Rutas de imágenes: relativas a la raíz del proyecto.
   ========================================================================== */

window.RP_CONTENT = {
  site: {
    name: "Red Pericial",
    // Reemplace por el dominio definitivo (buscar "redpericial.example" en todo el proyecto)
    url: "https://redpericial.example",
    tagline: "Luz sobre los hechos.",
    description:
      "Red Pericial integra abogados y profesionales periciales en una sola red para iluminar cada caso con criterio jurídico y prueba técnica.",
    email: "[correo@dominio-del-cliente]",
    phone: "[TELÉFONO POR DEFINIR]",
    phoneHref: "", // Ej.: "+000000000000" (sin espacios)
    address: "[DIRECCIÓN POR DEFINIR]",
    city: "[CIUDAD POR DEFINIR]",
    hours: "[HORARIO DE ATENCIÓN POR DEFINIR]",
    mapsUrl: "", // URL de Google Maps cuando el cliente la proporcione
    logo: "assets/logo/logo.svg",
    social: [
      { label: "LinkedIn", url: "" },
      { label: "Instagram", url: "" },
      { label: "Facebook", url: "" },
    ],
  },

  /* ---- Navegación principal ---- */
  nav: [
    { id: "inicio", label: "Inicio", href: "index.html" },
    { id: "nosotros", label: "Nosotros", href: "pages/nosotros.html" },
    { id: "servicios", label: "Servicios", href: "pages/servicios.html" },
    { id: "equipo", label: "Equipo", href: "pages/equipo.html" },
    { id: "experiencia", label: "Experiencia", href: "pages/experiencia.html" },
    { id: "blog", label: "Actualidad", href: "pages/blog.html" },
    { id: "contacto", label: "Contacto", href: "pages/contacto.html" },
  ],

  navSecondary: [
    { id: "areas", label: "Áreas de práctica", href: "pages/areas.html" },
    { id: "metodologia", label: "Metodología", href: "pages/metodologia.html" },
    { id: "faq", label: "Preguntas frecuentes", href: "pages/faq.html" },
  ],

  legal: [
    { label: "Política de privacidad", href: "legal/privacidad.html" },
    { label: "Tratamiento de datos", href: "legal/tratamiento-datos.html" },
    { label: "Términos y condiciones", href: "legal/terminos.html" },
  ],

  /* ---- Servicios ----
     Para agregar un servicio: copie un objeto, cambie id/number/textos/imagen.
     featured: true → aparece en el recorrido horizontal de Inicio. */
  services: [
    {
      id: "derecho-civil",
      number: "01",
      title: "Derecho civil",
      summary: "Protección jurídica para personas y organizaciones en sus relaciones patrimoniales, contractuales y de responsabilidad.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio, alcance, tipos de asuntos atendidos y forma de trabajo.",
      benefit: "Decisiones respaldadas por un análisis jurídico y probatorio integral.",
      image: { src: "assets/images/services/civil.svg", alt: "Composición abstracta de círculos concéntricos (imagen provisional)" },
      featured: true,
      confirmed: false,
    },
    {
      id: "derecho-comercial",
      number: "02",
      title: "Derecho comercial",
      summary: "Acompañamiento en controversias, contratos y relaciones entre empresas, con soporte técnico cuando los hechos lo exigen.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Controversias comerciales analizadas con evidencia, no con suposiciones.",
      image: { src: "assets/images/services/comercial.svg", alt: "Retícula con línea de tendencia (imagen provisional)" },
      featured: true,
      confirmed: false,
    },
    {
      id: "peritajes",
      number: "03",
      title: "Peritajes",
      summary: "Dictámenes técnicos elaborados con rigor metodológico para sustentar hechos ante autoridades y jueces.",
      description: "[CONTENIDO POR DEFINIR] Tipos de peritaje disponibles, disciplinas y profesionales vinculados.",
      benefit: "Hechos complejos traducidos a pruebas claras y verificables.",
      image: { src: "assets/images/services/peritajes.svg", alt: "Curvas de nivel con lente de precisión (imagen provisional)" },
      featured: true,
      confirmed: false,
    },
    {
      id: "derecho-laboral",
      number: "04",
      title: "Derecho laboral",
      summary: "Asesoría y representación en relaciones laborales, tanto para empleadores como para trabajadores.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Prevención y resolución de conflictos laborales con criterio técnico.",
      image: { src: "assets/images/services/laboral.svg", alt: "Ritmo de líneas verticales (imagen provisional)" },
      featured: true,
      confirmed: false,
    },
    {
      id: "derecho-empresarial",
      number: "05",
      title: "Derecho empresarial",
      summary: "Estructuración, gobierno y protección jurídica de organizaciones en cada etapa de su crecimiento.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Una base jurídica sólida para crecer con menos riesgo.",
      image: { src: "assets/images/services/empresarial.svg", alt: "Líneas horizontales escalonadas (imagen provisional)" },
      featured: true,
      confirmed: false,
    },
    {
      id: "consultoria-juridica",
      number: "06",
      title: "Consultoría jurídica",
      summary: "Análisis preventivo y estratégico para anticipar riesgos antes de que se conviertan en litigios.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Claridad jurídica antes de tomar decisiones críticas.",
      image: { src: "assets/images/services/consultoria.svg", alt: "Red de nodos conectados (imagen provisional)" },
      featured: true,
      confirmed: false,
    },
    {
      id: "derecho-familia",
      number: "07",
      title: "Derecho de familia",
      summary: "Acompañamiento cercano y reservado en asuntos familiares y patrimoniales.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Procesos sensibles gestionados con discreción y precisión.",
      image: { src: "assets/images/services/familia.svg", alt: "Dos círculos superpuestos (imagen provisional)" },
      featured: false,
      confirmed: false,
    },
    {
      id: "derecho-administrativo",
      number: "08",
      title: "Derecho administrativo",
      summary: "Actuaciones frente a entidades públicas, contratación estatal y procedimientos administrativos.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Interlocución técnica y oportuna con la administración.",
      image: { src: "assets/images/services/administrativo.svg", alt: "Secuencia de arcos (imagen provisional)" },
      featured: false,
      confirmed: false,
    },
    {
      id: "derecho-penal",
      number: "09",
      title: "Derecho penal",
      summary: "Defensa y representación con soporte técnico-pericial en cada etapa del proceso.",
      description: "[CONTENIDO POR DEFINIR] Descripción ampliada del servicio.",
      benefit: "Estrategias de defensa construidas sobre evidencia.",
      image: { src: "assets/images/services/penal.svg", alt: "Contornos con retícula de enfoque (imagen provisional)" },
      featured: false,
      confirmed: false,
    },
  ],

  /* ---- Áreas de práctica ---- */
  areas: [
    { id: "civil", title: "Derecho civil", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "comercial", title: "Derecho comercial", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "laboral", title: "Derecho laboral", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "familia", title: "Derecho de familia", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "empresarial", title: "Derecho empresarial", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "administrativo", title: "Derecho administrativo", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "penal", title: "Derecho penal", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "inmobiliario", title: "Derecho inmobiliario", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "contractual", title: "Derecho contractual", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "peritajes", title: "Peritajes", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
    { id: "consultoria", title: "Consultoría jurídica", summary: "[DESCRIPCIÓN BREVE POR DEFINIR]", confirmed: false },
  ],

  /* ---- Equipo ----
     Para agregar un profesional: copie un objeto y complete los campos.
     ready: true → se publica también como Schema.org/Person. */
  team: [
    {
      id: "profesional-01",
      name: "[Nombre del profesional 01]",
      role: "[Cargo]",
      specialty: "[Especialidad]",
      education: "[Formación académica]",
      experience: "[Años / trayectoria]",
      areas: ["[Área 1]", "[Área 2]"],
      bio: "[PERFIL PROFESIONAL POR DEFINIR] Resumen de trayectoria, enfoque de trabajo y casos representativos autorizados.",
      photo: { src: "assets/images/team/retrato-01.svg", alt: "Retrato pendiente del profesional 01" },
      linkedin: "",
      ready: false,
    },
    {
      id: "profesional-02",
      name: "[Nombre del profesional 02]",
      role: "[Cargo]",
      specialty: "[Especialidad]",
      education: "[Formación académica]",
      experience: "[Años / trayectoria]",
      areas: ["[Área 1]"],
      bio: "[PERFIL PROFESIONAL POR DEFINIR]",
      photo: { src: "assets/images/team/retrato-02.svg", alt: "Retrato pendiente del profesional 02" },
      linkedin: "",
      ready: false,
    },
    {
      id: "profesional-03",
      name: "[Nombre del profesional 03]",
      role: "[Cargo]",
      specialty: "[Especialidad pericial]",
      education: "[Formación académica]",
      experience: "[Años / trayectoria]",
      areas: ["[Área 1]"],
      bio: "[PERFIL PROFESIONAL POR DEFINIR]",
      photo: { src: "assets/images/team/retrato-03.svg", alt: "Retrato pendiente del profesional 03" },
      linkedin: "",
      ready: false,
    },
    {
      id: "profesional-04",
      name: "[Nombre del profesional 04]",
      role: "[Cargo]",
      specialty: "[Especialidad]",
      education: "[Formación académica]",
      experience: "[Años / trayectoria]",
      areas: ["[Área 1]"],
      bio: "[PERFIL PROFESIONAL POR DEFINIR]",
      photo: { src: "assets/images/team/retrato-04.svg", alt: "Retrato pendiente del profesional 04" },
      linkedin: "",
      ready: false,
    },
  ],

  /* ---- Indicadores (DEMOSTRACIÓN — reemplazar por cifras reales) ---- */
  stats: [
    { value: 15, prefix: "+", suffix: "", label: "Años de experiencia", demo: true },
    { value: 500, prefix: "+", suffix: "", label: "Casos atendidos", demo: true },
    { value: 20, prefix: "+", suffix: "", label: "Especialidades", demo: true },
  ],

  /* ---- Casos (estructura; sin datos reales) ---- */
  cases: [
    { id: "caso-01", title: "[Caso representativo 01]", sector: "[Sector]", challenge: "[Desafío del cliente]", approach: "[Enfoque jurídico y pericial]", result: "[Resultado autorizado para publicación]" },
    { id: "caso-02", title: "[Caso representativo 02]", sector: "[Sector]", challenge: "[Desafío del cliente]", approach: "[Enfoque jurídico y pericial]", result: "[Resultado autorizado para publicación]" },
    { id: "caso-03", title: "[Caso representativo 03]", sector: "[Sector]", challenge: "[Desafío del cliente]", approach: "[Enfoque jurídico y pericial]", result: "[Resultado autorizado para publicación]" },
  ],

  /* ---- Metodología ---- */
  methodology: [
    {
      title: "Escuchamos",
      text: "Entendemos el caso desde la perspectiva del cliente: hechos, documentos, expectativas y urgencias.",
      points: ["Reunión inicial confidencial", "Revisión preliminar de documentos"],
    },
    {
      title: "Analizamos",
      text: "Cruzamos el análisis jurídico con la lectura técnica de los hechos para identificar fortalezas, riesgos y vacíos probatorios.",
      points: ["Diagnóstico jurídico", "Evaluación de necesidades periciales"],
    },
    {
      title: "Diseñamos la estrategia",
      text: "Definimos una ruta clara, con escenarios, tiempos estimados y el equipo de profesionales adecuado para cada frente.",
      points: ["Ruta de actuación", "Equipo asignado"],
    },
    {
      title: "Actuamos",
      text: "Ejecutamos con precisión: actuaciones jurídicas, dictámenes y representación coordinados bajo un mismo criterio.",
      points: ["Actuaciones y representación", "Dictámenes técnicos"],
    },
    {
      title: "Acompañamos",
      text: "Mantenemos al cliente informado en cada etapa y seguimos presentes hasta el cierre del caso.",
      points: ["Informes de avance", "Seguimiento posterior"],
    },
  ],

  /* ---- Compromisos (principios de trabajo, no afirmaciones de resultados) ---- */
  commitments: [
    { title: "Confidencialidad", note: "En cada etapa" },
    { title: "Rigor técnico", note: "Metodología verificable" },
    { title: "Comunicación clara", note: "Sin tecnicismos innecesarios" },
    { title: "Un solo criterio", note: "Jurídico y pericial" },
  ],

  /* ---- Testimonios (NO inventar: requieren aprobación del cliente) ---- */
  testimonials: [
    { quote: "Testimonio pendiente de aprobación del cliente.", author: "[Nombre del cliente]", role: "[Cargo / Empresa]", ready: false },
    { quote: "Testimonio pendiente de aprobación del cliente.", author: "[Nombre del cliente]", role: "[Cargo / Empresa]", ready: false },
  ],

  /* ---- Artículos ----
     Para agregar un artículo: copie un objeto con un id único. La página
     pages/articulo.html?id=<id> lo renderiza automáticamente. */
  articles: [
    {
      id: "controversia-contractual",
      title: "¿Qué hacer ante una controversia contractual?",
      category: "Derecho comercial",
      date: "2026-09-01",
      readTime: 5,
      excerpt: "Pasos iniciales para proteger su posición cuando un contrato no se cumple como se pactó.",
      image: { src: "assets/images/blog/articulo-01.svg", alt: "Imagen provisional del artículo" },
      body: [
        "[ARTÍCULO DE EJEMPLO — CONTENIDO POR DEFINIR]",
        "Este espacio está preparado para el contenido editorial de Red Pericial. Cada artículo admite párrafos, subtítulos y listas.",
        "## Subtítulo de ejemplo",
        "Texto de ejemplo para visualizar la jerarquía tipográfica del artículo.",
      ],
      example: true,
    },
    {
      id: "que-es-un-dictamen-pericial",
      title: "Qué es un dictamen pericial y cuándo lo necesita",
      category: "Peritajes",
      date: "2026-08-18",
      readTime: 6,
      excerpt: "Una guía clara sobre el papel de la prueba técnica en un proceso.",
      image: { src: "assets/images/blog/articulo-02.svg", alt: "Imagen provisional del artículo" },
      body: ["[ARTÍCULO DE EJEMPLO — CONTENIDO POR DEFINIR]"],
      example: true,
    },
    {
      id: "riesgos-juridicos-empresa",
      title: "Cinco riesgos jurídicos que toda empresa debería revisar cada año",
      category: "Derecho empresarial",
      date: "2026-08-04",
      readTime: 4,
      excerpt: "Una lista de verificación preventiva para equipos directivos.",
      image: { src: "assets/images/blog/articulo-03.svg", alt: "Imagen provisional del artículo" },
      body: ["[ARTÍCULO DE EJEMPLO — CONTENIDO POR DEFINIR]"],
      example: true,
    },
  ],

  /* ---- Preguntas frecuentes ---- */
  faq: [
    {
      q: "¿Qué es un peritaje y para qué sirve?",
      a: "Es un análisis técnico realizado por un profesional experto en una disciplina específica, que permite explicar hechos complejos ante una autoridad. [RESPUESTA A VALIDAR POR EL CLIENTE]",
      ready: false,
    },
    { q: "¿Cómo es la primera consulta?", a: "[RESPUESTA POR DEFINIR] Modalidad, duración y documentos recomendados.", ready: false },
    { q: "¿Atienden a personas y a empresas?", a: "[RESPUESTA POR DEFINIR]", ready: false },
    { q: "¿Cuánto tiempo toma un proceso?", a: "[RESPUESTA POR DEFINIR] Depende de la naturaleza del caso; se recomienda explicar los factores que influyen.", ready: false },
    { q: "¿Cómo se definen los honorarios?", a: "[RESPUESTA POR DEFINIR]", ready: false },
    { q: "¿La información que comparto es confidencial?", a: "[RESPUESTA POR DEFINIR] Describir la política de confidencialidad de la firma.", ready: false },
  ],

  /* ---- Formulario de contacto ---- */
  inquiryTypes: [
    "Consulta jurídica",
    "Solicitud de peritaje",
    "Asesoría empresarial",
    "Representación en proceso",
    "Otro",
  ],
};
