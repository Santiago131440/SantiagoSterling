/* ==========================================================================
   Navegación
   - Menú móvil accesible: aria-expanded, inert, Escape, trampa de foco,
     bloqueo de scroll compatible con iOS y cierre al seleccionar un enlace.
   - Estado del navbar durante el scroll (vidrio / ocultar al bajar).
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});

  let header, toggle, menu;
  let isOpen = false;
  let lockedY = 0;

  /* ---- Bloqueo de scroll (robusto en iOS Safari) ---- */
  const lockScroll = () => {
    lockedY = window.scrollY;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    Object.assign(document.body.style, {
      position: "fixed",
      top: `-${lockedY}px`,
      left: "0",
      right: "0",
      width: "100%",
      paddingRight: sbw ? `${sbw}px` : "",
    });
  };

  const unlockScroll = () => {
    Object.assign(document.body.style, { position: "", top: "", left: "", right: "", width: "", paddingRight: "" });
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, lockedY);
    html.style.scrollBehavior = prev;
  };

  const focusables = () =>
    [toggle, ...menu.querySelectorAll("a[href], button:not([disabled])")].filter((el) => el.offsetParent !== null || el === toggle);

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    lockScroll();
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    menu.classList.add("is-open");
    header.classList.add("menu-open");
    header.classList.remove("is-hidden");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    const first = menu.querySelector("a");
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("inert", "");
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    unlockScroll();
    if (restoreFocus) toggle.focus({ preventScroll: true });
  };

  const onKeydown = (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      const els = focusables();
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onMenuClick = (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    const target = href.startsWith("#") ? document.querySelector(href) : null;
    if (target) {
      e.preventDefault();
      close({ restoreFocus: false });
      requestAnimationFrame(() => target.scrollIntoView({ behavior: RP.motion ? "smooth" : "auto" }));
    } else {
      close({ restoreFocus: false });
    }
  };

  /* ---- Estado del header con el scroll ---- */
  let lastY = 0;
  const updateHeader = (y) => {
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 12);
    const cfg = window.RP_CONFIG.effects;
    if (!cfg.hideHeaderOnScroll || isOpen || header.contains(document.activeElement)) {
      header.classList.remove("is-hidden");
    } else {
      const delta = y - lastY;
      if (y > 480 && delta > 6) header.classList.add("is-hidden");
      else if (delta < -6 || y < 480) header.classList.remove("is-hidden");
    }
    lastY = y;
  };

  const init = () => {
    header = document.querySelector("[data-header]");
    toggle = document.querySelector("[data-menu-toggle]");
    menu = document.querySelector("[data-mobile-menu]");
    if (!header || !toggle || !menu) return;

    toggle.addEventListener("click", () => (isOpen ? close() : open()));
    menu.addEventListener("click", onMenuClick);
    document.addEventListener("keydown", onKeydown);

    // Cerrar si se pasa a desktop con el menú abierto
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) close({ restoreFocus: false });
    });

    // Mostrar el header al recibir foco por teclado
    header.addEventListener("focusin", () => header.classList.remove("is-hidden"));

    updateHeader(window.scrollY);
  };

  RP.navigation = { init, open, close, updateHeader, get isOpen() { return isOpen; } };
})();
