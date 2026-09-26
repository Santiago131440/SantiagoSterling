/* ==========================================================================
   Tema claro / oscuro
   - Estado inicial: preferencia guardada → preferencia del sistema.
     (Aplicado antes del primer pintado por el script inline del <head>.)
   - Persistencia en localStorage (con try/catch: puede estar bloqueado).
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});
  const KEY = () => (window.RP_CONFIG && window.RP_CONFIG.storageKeys.theme) || "rp-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const read = () => {
    try { return localStorage.getItem(KEY()); } catch (e) { return null; }
  };
  const write = (v) => {
    try { localStorage.setItem(KEY(), v); } catch (e) { /* almacenamiento no disponible */ }
  };

  const current = () => document.documentElement.getAttribute("data-theme") || (media.matches ? "dark" : "light");

  const apply = (theme) => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0c" : "#fbfbfd");
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const next = theme === "dark" ? "claro" : "oscuro";
      btn.setAttribute("aria-label", `Activar modo ${next}`);
      btn.setAttribute("aria-pressed", String(theme === "dark"));
    });
    document.dispatchEvent(new CustomEvent("rp:themechange", { detail: { theme } }));
  };

  const init = () => {
    apply(read() || current());

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-theme-toggle]");
      if (!btn) return;
      const next = current() === "dark" ? "light" : "dark";
      write(next);
      apply(next);
    });

    // Si el usuario no eligió manualmente, seguir los cambios del sistema
    media.addEventListener("change", (e) => {
      if (!read()) apply(e.matches ? "dark" : "light");
    });
  };

  RP.theme = { init, apply, current };
})();
