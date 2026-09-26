/* ==========================================================================
   Red Pericial — Punto de entrada
   Orden de carga (todos con defer):
   data/content.js → js/config.js → components → theme → navigation →
   scroll → animations → interactions → forms → seo → main
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});
  const html = document.documentElement;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  RP.motion = Boolean(window.RP_CONFIG && window.RP_CONFIG.animations) && !reduced.matches;
  html.classList.toggle("motion-ok", RP.motion);

  const safe = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`[RP] Error en ${name}:`, err);
    }
  };

  const boot = () => {
    safe("components", () => RP.components.mount());
    safe("theme", () => RP.theme.init());
    safe("navigation", () => RP.navigation.init());
    safe("interactions", () => RP.interactions.init());
    safe("forms", () => RP.forms.init());
    safe("seo", () => RP.seo.init());
    safe("animations", () => RP.animations.init());
    safe("scroll", () => RP.scroll.init());
    html.classList.add("is-ready");
  };

  // Si el usuario cambia la preferencia de movimiento, recargar el estado
  reduced.addEventListener("change", () => location.reload());

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // Red de seguridad: si algo falla, nunca dejar contenido oculto
  window.addEventListener("error", () => html.classList.remove("motion-ok"));
})();
