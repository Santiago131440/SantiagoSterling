/* ==========================================================================
   Red Pericial — Configuración centralizada
   Comportamiento del sitio (no contenido). Modifique aquí sin tocar el resto.
   ========================================================================== */

window.RP_CONFIG = {
  /* WhatsApp: número en formato internacional, solo dígitos, sin "+".
     Ejemplo: "000000000000". Vacío = el CTA se muestra como pendiente. */
  whatsappNumber: "",
  whatsappMessage: "Hola, quisiera solicitar una consulta con Red Pericial.",

  /* Animaciones globales. false = sitio estático (también se respeta
     automáticamente prefers-reduced-motion del sistema). */
  animations: true,

  /* Efectos individuales */
  effects: {
    heroNetwork: true, // faro + haz de luz + red animada en el hero
    horizontalServices: true, // scroll horizontal fijado en desktop
    parallax: true,
    wordReveal: true, // texto que se ilumina con el scroll
    hideHeaderOnScroll: true,
  },

  /* Muestra etiquetas "Por confirmar" junto al contenido pendiente.
     Poner en false al publicar con contenido real. */
  showPlaceholderBadges: true,

  /* Formulario de contacto.
     endpoint: URL que recibe un POST JSON (API propia, Formspree, CRM, etc.).
     Si está vacío, el formulario funciona en modo demostración (no envía). */
  forms: {
    endpoint: "",
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeoutMs: 12000,
  },

  /* SEO */
  seo: {
    // Emite JSON-LD solo con datos marcados como listos (ready / no placeholder)
    emitStructuredData: true,
  },

  storageKeys: {
    theme: "rp-theme",
  },
};
