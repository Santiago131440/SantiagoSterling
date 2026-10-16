(() => {
  "use strict";

  /* ==========================================================================
     CONFIGURACIÓN Y UTILIDADES
     ========================================================================== */
  const LINKEDIN_URL = "https://www.linkedin.com/in/santisterling/";
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  // Suavizado independiente de los FPS
  const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));

  const DEVICON = "https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/";

  // Bloqueo de scroll con contador para que varios diálogos no se pisen
  let scrollLocks = 0;
  const lockScroll = () => {
    if (scrollLocks++ === 0) document.body.style.overflow = "hidden";
  };
  const unlockScroll = () => {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (scrollLocks === 0) document.body.style.overflow = "";
  };

  // Quita la indentación del HTML a textos multilínea
  const dedent = (text) =>
    String(text)
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  /* ==========================================================================
     PILA DE DIÁLOGOS: ESC cierra el superior y el foco queda atrapado en él
     ========================================================================== */
  const dialogStack = [];
  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const pushDialog = (container, close) => dialogStack.push({ container, close });
  const popDialog = (container) => {
    const i = dialogStack.findIndex((d) => d.container === container);
    if (i > -1) dialogStack.splice(i, 1);
  };

  document.addEventListener("keydown", (e) => {
    const top = dialogStack[dialogStack.length - 1];
    if (!top) return;
    if (e.key === "Escape") {
      e.preventDefault();
      top.close();
      return;
    }
    if (e.key !== "Tab") return;
    const items = $$(FOCUSABLE, top.container).filter((n) => n.offsetParent !== null);
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !top.container.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ==========================================================================
     ACTIVACIÓN POR TECLADO de elementos con role="button" que no son <button>
     ========================================================================== */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const target = e.target.closest('[role="button"]:not(button), [role="link"]:not(a)');
    if (!target || target !== e.target) return;
    e.preventDefault();
    target.click();
  });

  /* ==========================================================================
     NAVEGACIÓN GLOBAL
     ========================================================================== */
  (function initGlobalNav() {
    const nav = $("#globalNav");
    const toggle = $("#menuToggle");
    const menu = $("#mobileMenu");
    if (!nav) return;

    // La cápsula de vidrio se vuelve oscura sobre secciones oscuras (como en Tahoe)
    const zones = $$("main > section, .site-footer");
    const isDark = (s) => /\b(tone-dark|tone-graphite|hero|dev-section)\b/.test(s.className);
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      const probe = (nav.querySelector(".nav-inner") || nav).getBoundingClientRect();
      const y = probe.top + probe.height / 2;
      const zone = zones.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= y && r.bottom > y;
      });
      nav.classList.toggle("is-on-dark", !!zone && isDark(zone));
    };
    onScroll();
    window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });

    // Menú móvil a pantalla completa
    if (toggle && menu) {
      let open = false;
      let hideTimer;

      const close = (restoreFocus = true) => {
        if (!open) return;
        open = false;
        clearTimeout(hideTimer);
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
        menu.classList.remove("is-open");
        nav.classList.remove("menu-open");
        popDialog(nav);
        unlockScroll();
        hideTimer = setTimeout(() => { menu.hidden = true; }, reducedMotion ? 0 : 400);
        if (restoreFocus) toggle.focus();
      };

      const openMenu = () => {
        open = true;
        clearTimeout(hideTimer);
        menu.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Cerrar menú");
        nav.classList.add("menu-open");
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("is-open")));
        pushDialog(nav, () => close());
        lockScroll();
      };

      toggle.addEventListener("click", () => (open ? close() : openMenu()));
      $$("a", menu).forEach((link) => link.addEventListener("click", () => close(false)));
      window.addEventListener("resize", () => {
        if (open && window.innerWidth >= 1024) close(false);
      }, { passive: true });
    }

    // Indicador de sección activa
    const links = $$(".nav-link");
    const sections = links
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const setActive = (id) => {
      links.forEach((link) => {
        if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));

    // Por encima de la primera sección no hay ninguna activa
    const hero = $("#top");
    if (hero) {
      new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(""); },
        { rootMargin: "-45% 0px -50% 0px" }
      ).observe(hero);
    }
  })();

  /* Navbar heredado (otras páginas con #menu-toggle / #mobile-menu) */
  (function initLegacyNavbar() {
    const toggle = $("#menu-toggle");
    const menu = $("#mobile-menu");
    if (!toggle || !menu) return;
    let isOpen = false;
    const setOpen = (state) => {
      isOpen = state;
      toggle.setAttribute("aria-expanded", String(state));
      menu.classList.toggle("hidden", !state);
      menu.classList.toggle("flex", state);
    };
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!isOpen);
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  })();

  /* ==========================================================================
     REVELADO AL ENTRAR EN PANTALLA (.reveal → .visible)
     ========================================================================== */
  (function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    // Al terminar la entrada se retira .reveal: así la tarjeta queda libre para
    // inclinarse, flotar o moverse sin heredar la transición lenta de 0.9 s.
    const settle = (node) => {
      node.classList.add("is-inview");
      if (reducedMotion) return;
      const done = () => node.classList.remove("reveal", "visible");
      const delay = parseFloat(getComputedStyle(node).transitionDelay) || 0;
      setTimeout(done, 950 + delay * 1000);
    };

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => { item.classList.add("visible"); settle(item); });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          settle(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((item) => observer.observe(item));
  })();

  /* ==========================================================================
     PROGRESO DE LECTURA (barra bajo la navegación)
     ========================================================================== */
  (function initScrollProgress() {
    const bar = $("#scrollProgress");
    if (!bar) return;
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(window.scrollY / max, 0, 1) : 0})`;
    };
    window.addEventListener("scroll", () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ==========================================================================
     SOBRE MÍ: la segunda parte de la frase se ilumina palabra a palabra
     ========================================================================== */
  (function initStatement() {
    const target = $(".statement span");
    if (!target) return;
    const words = target.textContent.trim().split(/\s+/);
    target.replaceChildren(...words.flatMap((word, i) => {
      const w = el("span", "w", word);
      return i < words.length - 1 ? [w, document.createTextNode(" ")] : [w];
    }));
    const nodes = $$(".w", target);
    if (reducedMotion) { nodes.forEach((n) => n.classList.add("is-lit")); return; }

    let queued = false;
    const update = () => {
      queued = false;
      const r = target.getBoundingClientRect();
      const vh = window.innerHeight;
      // Empieza cuando la frase entra por abajo y termina hacia el centro
      const progress = clamp((vh * 0.88 - r.top) / (vh * 0.5), 0, 1);
      const lit = Math.round(progress * nodes.length);
      nodes.forEach((n, i) => n.classList.toggle("is-lit", i < lit));
    };
    window.addEventListener("scroll", () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ==========================================================================
     CIFRAS QUE CUENTAN AL ENTRAR EN PANTALLA (9+, 6, 5, 10x)
     ========================================================================== */
  (function initCounters() {
    const items = $$(".stat-number, .stat-value").filter((n) => /^\d/.test(n.textContent.trim()));
    if (!items.length || reducedMotion || !("IntersectionObserver" in window)) return;

    const run = (node) => {
      const final = node.textContent.trim();
      const [, num, suffix] = final.match(/^(\d+)(.*)$/);
      const to = Number(num);
      const counter = el("span", null, "0" + suffix);
      counter.setAttribute("aria-hidden", "true");
      node.replaceChildren(counter, el("span", "sr-only", final));
      const start = performance.now();
      const duration = 1400 + to * 20;
      const tick = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo
        counter.textContent = Math.round(eased * to) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else counter.textContent = final;
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.6 });
    items.forEach((n) => io.observe(n));
  })();

  /* ==========================================================================
     LUZ QUE SIGUE AL CURSOR en superficies
     ========================================================================== */
  (function initSpotlight() {
    if (!finePointer) return;
    const surfaces = $$(".tile, .summary-stat, .finder, .contact-card, .chip-stats, .strategy, .preview-card, .site .nav-inner");
    surfaces.forEach((node) => {
      node.classList.add("spotlight");
      node.addEventListener("pointermove", (e) => {
        const r = node.getBoundingClientRect();
        node.style.setProperty("--mx", `${e.clientX - r.left}px`);
        node.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  })();

  /* ==========================================================================
     INCLINACIÓN 3D con reflejo (experiencia, galería y vistas previas)
     ========================================================================== */
  (function initTilt() {
    if (!finePointer || reducedMotion) return;
    const cards = $$(".experiencia-card, .preview-card"); // Competencias queda fija
    const MAX = 6; // grados

    cards.forEach((card) => {
      card.classList.add("tilt");
      const shine = el("span", "tilt-shine");
      shine.setAttribute("aria-hidden", "true");
      card.appendChild(shine);
      let frame = 0;

      card.addEventListener("pointermove", (e) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;   // 0..1
          const y = (e.clientY - r.top) / r.height;   // 0..1
          card.classList.add("is-tilting");
          card.style.setProperty("--ry", `${(x - 0.5) * MAX * 2}deg`);
          card.style.setProperty("--rx", `${(0.5 - y) * MAX * 2}deg`);
          card.style.setProperty("--px", (x - 0.5) * 2);
          card.style.setProperty("--py", (y - 0.5) * 2);
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);
        });
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frame);
        card.classList.remove("is-tilting");
        ["--rx", "--ry", "--px", "--py"].forEach((v) => card.style.removeProperty(v));
      });
    });
  })();

  /* ==========================================================================
     BOTONES MAGNÉTICOS
     ========================================================================== */
  (function initMagnetic() {
    if (!finePointer || reducedMotion) return;
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--tx", `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
        btn.style.setProperty("--ty", `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.removeProperty("--tx");
        btn.style.removeProperty("--ty");
      });
    });
  })();

  /* ==========================================================================
     DETALLES: índice para cascadas y parallax de la luna
     ========================================================================== */
  $$(".finder-list li").forEach((li, i) => li.style.setProperty("--i", i));

  (function initMoonParallax() {
    const section = $(".vision-section");
    const moon = $(".vision-moon");
    if (!section || !moon || reducedMotion) return;
    let queued = false;
    const update = () => {
      queued = false;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1); // 0 entra · 1 sale
      moon.style.setProperty("--moon-y", `${(0.5 - p) * 140}px`);
      moon.style.setProperty("--moon-r", `${(p - 0.5) * 10}deg`);
    };
    window.addEventListener("scroll", () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ==========================================================================
     HERO: VIDEO DE FONDO
     Aparece con un fundido cuando empieza a reproducirse, se pausa fuera de
     pantalla y con la pestaña oculta, respeta "reducir movimiento" y ofrece
     un botón de pausa (WCAG 2.2.2). Si el archivo no carga, queda el degradado.
     ========================================================================== */
  (function initHeroVideo() {
    const hero = $("#top");
    const video = $("#heroVideo");
    const toggle = $("#heroVideoToggle");
    if (!hero || !video) return;

    let userPaused = reducedMotion;
    let inView = true;

    const fail = () => {
      hero.classList.add("hero--no-video");
      if (toggle) toggle.hidden = true;
    };
    // El error se dispara en el último <source> cuando ninguno sirve
    const sources = $$("source", video);
    sources[sources.length - 1]?.addEventListener("error", fail);
    video.addEventListener("error", fail);

    video.addEventListener("playing", () => {
      hero.classList.add("is-video-ready");
      if (toggle) toggle.hidden = false;
    }, { once: true });

    const sync = () => {
      const shouldPlay = !userPaused && inView && !document.hidden;
      if (shouldPlay && video.paused) video.play().catch(() => {});
      if (!shouldPlay && !video.paused) video.pause();
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(userPaused));
        toggle.setAttribute("aria-label", userPaused ? "Reproducir video de fondo" : "Pausar video de fondo");
      }
    };

    if (reducedMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      // Muestra el primer cuadro como imagen fija
      video.addEventListener("loadeddata", () => {
        hero.classList.add("is-video-ready");
        if (toggle) toggle.hidden = false;
      }, { once: true });
    }

    toggle?.addEventListener("click", () => {
      userPaused = !userPaused;
      sync();
    });

    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 }).observe(hero);
    document.addEventListener("visibilitychange", sync);
    sync();
  })();

  /* Liquid Glass: la refracción del fondo con filtro SVG solo se renderiza
     bien en navegadores Chromium; los demás conservan el desenfoque. */
  (function initLiquidGlass() {
    const brands = navigator.userAgentData?.brands || [];
    const chromium = brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
    if (chromium && !reducedMotion) document.documentElement.classList.add("lg-refract");
  })();

  /* ==========================================================================
     BARRA DE DESPLAZAMIENTO SUPERPUESTA (macOS Tahoe)
     Sustituye la barra nativa de la página solo con mouse/trackpad.
     El desplazamiento sigue siendo nativo (rueda, teclado, táctil);
     la barra solo lo refleja y permite arrastrar o saltar por páginas.
     ========================================================================== */
  (function initOverlayScrollbar() {
    if (!finePointer) return;
    const root = document.documentElement;
    root.classList.add("has-overlay-scroll");

    const rail = el("div", "os-rail");
    rail.setAttribute("aria-hidden", "true");
    const thumb = el("div", "os-thumb");
    rail.appendChild(thumb);
    document.body.appendChild(rail);

    let hideTimer = 0;
    let dragging = false;
    let startY = 0;
    let startScroll = 0;

    const metrics = () => {
      const railH = rail.clientHeight;
      const docH = root.scrollHeight;
      const vh = window.innerHeight;
      const th = Math.max(36, railH * (vh / docH));
      return { maxTop: Math.max(1, railH - th), maxScroll: docH - vh, th };
    };

    const update = () => {
      const m = metrics();
      rail.hidden = m.maxScroll <= 0;
      if (rail.hidden) return;
      thumb.style.height = `${m.th}px`;
      thumb.style.transform = `translateY(${(clamp(window.scrollY / m.maxScroll, 0, 1) * m.maxTop).toFixed(1)}px)`;
    };

    const show = () => {
      rail.classList.add("is-visible");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dragging) rail.classList.remove("is-visible");
      }, 1000);
    };

    window.addEventListener("scroll", () => { requestAnimationFrame(update); show(); }, { passive: true });
    window.addEventListener("resize", () => requestAnimationFrame(update), { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(() => requestAnimationFrame(update)).observe(document.body);

    // Arrastrar el pulgar
    thumb.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      startScroll = window.scrollY;
      thumb.setPointerCapture(e.pointerId);
      rail.classList.add("is-dragging");
      root.style.scrollBehavior = "auto";
    });
    thumb.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const m = metrics();
      window.scrollTo(0, startScroll + (e.clientY - startY) * (m.maxScroll / m.maxTop));
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      root.style.scrollBehavior = "";
      show();
    };
    thumb.addEventListener("pointerup", endDrag);
    thumb.addEventListener("pointercancel", endDrag);

    // Clic en la pista: avanza o retrocede una pantalla
    rail.addEventListener("pointerdown", (e) => {
      if (e.target !== rail) return;
      const r = thumb.getBoundingClientRect();
      window.scrollBy({ top: (e.clientY < r.top ? -1 : 1) * window.innerHeight * 0.9, behavior: reducedMotion ? "auto" : "smooth" });
    });

    update();
  })();

  /* Zonas internas: la barra fina se muestra mientras se desplazan */
  (function initInnerScrollbars() {
    const timers = new WeakMap();
    document.addEventListener("scroll", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      t.classList.add("is-scrolling");
      clearTimeout(timers.get(t));
      timers.set(t, setTimeout(() => t.classList.remove("is-scrolling"), 900));
    }, { capture: true, passive: true });
  })();

  /* Año del footer */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================================================
     DESCARGA DE CV (TXT)
     ========================================================================== */
  $$("#downloadCV, #downloadCV2").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = URL.createObjectURL(new Blob([generateSimpleCV()], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV-Santiago-Sterling-${new Date().getFullYear()}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  });

  function generateSimpleCV() {
    return `CV - Santiago Sterling

Nombre completo: Santiago Sterling Rivas.
Estudio: Tecnólogo en análisis y desarrollo de software, Tecnólogo en gestión de la producción industrial, Diplomado en Gerencia de Producción.
Correo electrónico: santisterling@gmail.com
Ubicación: Cali, Colombia.
LinkedIn: ${LINKEDIN_URL}
Portafolio: https://santiago131440.github.io/SantiagoSterling/

Resumen:
Tecnólogo en Análisis y Desarrollo de Software y en Gestión de la Producción Industrial, con 9 años de experiencia en plantas de manufactura. Mi perfil combina la eficiencia industrial con la innovación tecnológica, aplicando desarrollo de software, automatización y análisis de datos para optimizar procesos y crear soluciones escalables. Cuento con formación en frontend y backend (HTML, CSS, JavaScript, React, Node.js, Python, Django, PostgreSQL, entre otros) y en metodologías industriales como Lean Manufacturing, Kaizen, TPM y 5S, además de análisis de datos, informes corporativos y control de inventarios. Me interesa especializarme en inteligencia artificial aplicada a la industria y en soluciones que integren la Industria 4.0 con tecnologías digitales inteligentes.

Habilidades:
- HTML, CSS, JavaScript, Python, Django, React, Node.js, Next.js, Tailwind, PostgreSQL, MySQL.
- Excel avanzado, macros (VBA), Power BI, Power Query, DAX, Figma, Photoshop, Illustrator.
- Desarrollo de software funcional y mantenible: programación orientada a objetos (POO), estructuras de datos, algoritmos, manejo de errores y modularización.
- Análisis de requerimientos: levantamiento de necesidades, requerimientos funcionales y no funcionales, casos de uso y modelado de procesos.
- Modelado: UML (casos de uso, clases y secuencia), historias de usuario y diagramas de flujo.
- Diseño responsive, manipulación del DOM y diseño de interfaces claras para el usuario.
- APIs REST y autenticación básica.

Conocimientos:
- Diseño de bases de datos relacionales, normalización, consultas SQL y CRUD.
- Metodologías industriales para optimización de recursos.
- Metodologías de trabajo eficiente en entornos corporativos en crecimiento.

Proyectos destacados:
- Sterling Music Player
- Restaurante La Kolina
`;
  }

  /* ==========================================================================
     VENTANAS macOS TAHOE (Formación, aviso de datos y Competencias)
     Mismo lenguaje visual que la ventana de Experiencia. Tres modos:
     · switch: la barra lateral cambia la página (carpetas, categorías)
     · scroll: la barra lateral salta a secciones de una sola página
     · plain : sin barra lateral (contenido suelto vía openModal)
     ========================================================================== */
  const mwSvg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const MW_TRAFFIC = `
    <button type="button" class="tl tl-close" data-mw="close" aria-label="Cerrar ventana">${mwSvg('<path d="M8 8l8 8M16 8l-8 8"/>')}</button>
    <button type="button" class="tl tl-min" data-mw="min" aria-label="Minimizar ventana">${mwSvg('<path d="M7 12h10"/>')}</button>
    <button type="button" class="tl tl-zoom" data-mw="zoom" aria-label="Ampliar ventana" aria-pressed="false">${mwSvg('<path d="M8 15V8h7M16 9v7H9"/>')}</button>`;

  class MacWindow {
    constructor(id) {
      this.id = id;
      this.cfg = null;
      this.mode = "plain";
      this.key = null;
      this.isOpen = false;
      this.returnFocus = null;
      this.build();
      this.bind();
    }

    build() {
      const root = document.createElement("div");
      root.id = this.id;
      root.className = "experience-modal mw-generic";
      root.setAttribute("aria-hidden", "true");
      root.innerHTML = `
        <div class="modal-overlay" data-mw="close"></div>
        <div class="modal-content mac-window" role="dialog" aria-modal="true" aria-labelledby="${this.id}-title" tabindex="-1">
          <aside class="mw-sidebar">
            <div class="mw-traffic">${MW_TRAFFIC}</div>
            <div class="mw-identity">
              <div class="mw-app-icon" aria-hidden="true"></div>
              <div class="mw-identity-text"><p class="modal-title"></p><p class="modal-duration"></p></div>
            </div>
            <p class="mw-sidebar-label"></p>
            <nav class="mw-nav"></nav>
            <p class="mw-sidebar-foot"></p>
          </aside>
          <div class="mw-main">
            <header class="mw-toolbar">
              <div class="mw-traffic mw-traffic--toolbar">${MW_TRAFFIC}</div>
              <div class="mw-capsule mw-history">
                <button type="button" class="mw-icon-btn" data-step="-1" aria-label="Anterior">${mwSvg('<path d="m14.5 5-7 7 7 7"/>')}</button>
                <span class="mw-sep" aria-hidden="true"></span>
                <button type="button" class="mw-icon-btn" data-step="1" aria-label="Siguiente">${mwSvg('<path d="m9.5 5 7 7-7 7"/>')}</button>
              </div>
              <p class="mw-toolbar-title" aria-hidden="true"></p>
            </header>
            <div class="modal-body">
              <div class="mw-page">
                <header class="mw-page-head">
                  <p class="mw-page-eyebrow"></p>
                  <h2 class="mw-page-title" id="${this.id}-title"></h2>
                  <p class="mw-page-sub"></p>
                </header>
                <div class="mw-page-content"></div>
              </div>
            </div>
            <footer class="mw-pathbar" aria-hidden="true"></footer>
          </div>
        </div>`;
      document.body.appendChild(root);
      this.root = root;
      this.win = $(".mac-window", root);
      this.body = $(".modal-body", root);
      this.nav = $(".mw-nav", root);
    }

    bind() {
      this.root.addEventListener("click", (e) => {
        const action = e.target.closest("[data-mw]")?.dataset.mw;
        if (action === "close") return this.close();
        if (action === "min") return this.minimize();
        if (action === "zoom") return this.toggleZoom();
        const step = e.target.closest("[data-step]");
        if (step) return this.step(Number(step.dataset.step));
        const item = e.target.closest(".mw-nav-item");
        if (!item) return;
        if (this.mode === "switch") this.show(item.dataset.key);
        else {
          const target = $(`[data-section="${item.dataset.key}"]`, this.body);
          if (target) this.body.scrollTo({ top: target.offsetTop - 64, behavior: reducedMotion ? "auto" : "smooth" });
        }
      });
      this.root.addEventListener("keydown", (e) => {
        if (this.mode !== "switch" || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
        if (e.target.closest(".mw-nav")) return;
        this.step(e.key === "ArrowRight" ? 1 : -1);
      });
      this.body.addEventListener("scroll", () => requestAnimationFrame(() => this.sync()), { passive: true });
    }

    open(cfg) {
      this.cfg = cfg;
      const items = cfg.items || [];
      this.mode = items.length ? cfg.mode || "switch" : "plain";
      this.win.classList.toggle("mw-plain", this.mode === "plain");
      this.win.style.setProperty("--mw-accent", cfg.accent || "#0a84ff");

      const icon = $(".mw-app-icon", this.root);
      icon.className = `mw-app-icon ${cfg.iconClass || ""}`.trim();
      icon.innerHTML = cfg.icon || "";
      $(".mw-identity .modal-title", this.root).textContent = cfg.title || "";
      $(".mw-identity .modal-duration", this.root).textContent = cfg.subtitle || "";
      $(".mw-sidebar-label", this.root).textContent = cfg.label || "";
      $(".mw-sidebar-foot", this.root).textContent = cfg.foot || "";
      this.nav.setAttribute("aria-label", cfg.label || "Secciones");
      this.nav.replaceChildren(
        ...items.map((it) => {
          const b = el("button", "mw-nav-item");
          b.type = "button";
          b.dataset.key = it.key;
          b.innerHTML = `${it.icon || ""}<span></span>`;
          b.lastElementChild.textContent = it.label;
          return b;
        })
      );
      $(".mw-history", this.root).hidden = !(this.mode === "switch" && items.length > 1);
      this.nav.scrollLeft = 0;

      if (this.mode === "switch") this.show(cfg.initial || items[0].key, false);
      else this.render(cfg.page(), false);

      if (!this.isOpen) {
        this.returnFocus = document.activeElement;
        this.isOpen = true;
        this.win.classList.remove("is-minimizing");
        this.root.classList.add("active");
        this.root.setAttribute("aria-hidden", "false");
        pushDialog(this.win, () => this.close());
        lockScroll();
      }
      this.win.focus();
    }

    show(key, animate = true) {
      this.key = key;
      this.render(this.cfg.page(key), animate);
    }

    step(dir) {
      const items = this.cfg?.items || [];
      if (this.mode !== "switch" || items.length < 2) return;
      const i = items.findIndex((it) => it.key === this.key);
      this.show(items[(i + dir + items.length) % items.length].key);
    }

    render(page, animate) {
      $(".mw-page-eyebrow", this.root).textContent = page.eyebrow || "";
      $(".mw-page-title", this.root).textContent = page.title || "";
      $(".mw-page-sub", this.root).textContent = page.sub || "";
      $(".mw-toolbar-title", this.root).textContent = page.title || "";
      const content = $(".mw-page-content", this.root);
      if (page.content instanceof Node) content.replaceChildren(page.content);
      else content.replaceChildren(el("p", "modal-text", dedent(page.content || "")));
      const path = $(".mw-pathbar", this.root);
      path.replaceChildren();
      (page.path || [page.title]).forEach((part, i) => {
        if (i) path.appendChild(document.createElement("i"));
        path.appendChild(el("span", "", part));
      });
      this.body.scrollTop = 0;
      if (animate && !reducedMotion) {
        this.body.classList.remove("is-switching");
        void this.body.offsetWidth;
        this.body.classList.add("is-switching");
      }
      this.sync();
    }

    sync() {
      const top = this.body.scrollTop;
      this.win.classList.toggle("is-scrolled", top > 8);
      let current = this.key;
      if (this.mode === "scroll") {
        const sections = $$("[data-section]", this.body);
        current = sections[0]?.dataset.section;
        sections.forEach((s) => { if (s.offsetTop - 120 <= top) current = s.dataset.section; });
        if (top + this.body.clientHeight >= this.body.scrollHeight - 4) current = sections[sections.length - 1]?.dataset.section || current;
      }
      $$(".mw-nav-item", this.nav).forEach((b) => {
        const on = b.dataset.key === current;
        b.classList.toggle("is-active", on);
        if (on) {
          b.setAttribute("aria-current", "true");
          if (this.mode === "switch") b.scrollIntoView({ block: "nearest", inline: "nearest" });
        } else b.removeAttribute("aria-current");
      });
    }

    toggleZoom() {
      const on = this.win.classList.toggle("is-zoomed");
      $$('[data-mw="zoom"]', this.root).forEach((z) => {
        z.setAttribute("aria-pressed", String(on));
        z.setAttribute("aria-label", on ? "Restaurar tamaño de la ventana" : "Ampliar ventana");
      });
    }

    minimize() {
      if (reducedMotion) return this.close();
      this.win.classList.add("is-minimizing");
      setTimeout(() => this.close(), 420);
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.root.classList.remove("active");
      this.root.setAttribute("aria-hidden", "true");
      popDialog(this.win);
      unlockScroll();
      this.returnFocus?.focus?.();
      setTimeout(() => {
        this.win.classList.remove("is-minimizing");
        if (this.win.classList.contains("is-zoomed")) this.toggleZoom();
      }, 320);
    }
  }

  const finderWindow = new MacWindow("finderWindow");
  const skillsWindow = new MacWindow("skillsWindow");

  /* API pública conservada: openModal(título, contenido) · closeModal() */
  window.openModal = function (title, content) {
    finderWindow.open({ page: () => ({ title, content, path: [title] }) });
  };
  window.closeModal = () => finderWindow.close();

  /* ==========================================================================
     FORMACIÓN: contenido de cada carpeta
     ========================================================================== */
  const FORMACION = {
    tecnologica: {
      title: "Formación tecnológica",
      items: [
        { name: "Tecnología en análisis y desarrollo de software", meta: ["Servicio Nacional de Aprendizaje (SENA)", "Estado: en curso"] },
        { name: "Tecnología en gestión de la producción industrial", meta: ["Servicio Nacional de Aprendizaje (SENA)", "Estado: culminado", "Certificación: 25 de noviembre de 2016"] }
      ]
    },
    diplomado: {
      title: "Diplomado",
      items: [
        { name: "Diplomado en Gerencia de Producción", meta: ["Servicio Nacional de Aprendizaje (SENA)", "Estado: culminado"] }
      ]
    },
    backend: {
      title: "Platzi · Backend y lógica de programación",
      items: [
        { name: "Curso de Programación Orientada a Objetos (POO)" },
        { name: "Curso Básico de Programación" },
        { name: "Curso Básico de Algoritmos y Pensamiento Lógico" }
      ]
    },
    devops: {
      title: "Platzi · DevOps y Cloud",
      items: [
        { name: "Curso de Introducción al Despliegue de Aplicaciones" },
        { name: "Curso de Introducción a AWS: Cómputo, Almacenamiento y Bases de Datos" }
      ]
    },
    frontend: {
      title: "Platzi · Frontend",
      items: [
        { name: "Curso de Frontend Developer" },
        { name: "Curso Práctico de Frontend Developer" },
        { name: "Curso Definitivo de HTML y CSS" },
        { name: "Curso Práctico de HTML y CSS" },
        { name: "Curso Práctico de Maquetación en CSS" },
        { name: "Curso Profesional de CSS Grid Layout" },
        { name: "Curso de Responsive Design: Maquetación Mobile First" },
        { name: "Curso Básico de Tailwind 2 y 3" },
        { name: "Curso de Diseño para Developers" },
        { name: "Curso de Manipulación del DOM" },
        { name: "Curso de Next.js" }
      ]
    },
    herramientas: {
      title: "Platzi · Herramientas de desarrollo",
      items: [
        { name: "Curso Profesional de Git y GitHub" },
        { name: "Curso de Introducción a la Terminal y Línea de Comandos" }
      ]
    },
    javascript: {
      title: "Platzi · JavaScript",
      items: [
        { name: "Curso Básico de JavaScript" },
        { name: "Curso Práctico de JavaScript" },
        { name: "Curso de Asincronismo con JavaScript" }
      ]
    },
    sena: {
      title: "SENA · Cursos cortos",
      items: [
        { name: "Calidad en el desarrollo de software", meta: ["Abril 2022"] },
        { name: "Metodología de la programación de sistemas informáticos", meta: ["Mayo 2022"] },
        { name: "Modelos de calidad de software", meta: ["Septiembre 2023"] },
        { name: "Procesos para software de calidad", meta: ["Diciembre 2024"] },
        { name: "Aplicación del marco de trabajo Scrum para proyectos de desarrollo de software", meta: ["Marzo 2025"] },
        { name: "Manejo de pruebas de software", meta: ["Marzo 2025"] },
        { name: "Variables y estructuras de control en Python", meta: ["Julio 2025"] }
      ]
    },
    bd: {
      title: "Platzi · Bases de datos",
      items: [{ name: "Curso de Fundamentos de Bases de Datos" }]
    },
    ingenieria: {
      title: "Platzi · Ingeniería de software",
      items: [{ name: "Fundamentos de Ingeniería de Software" }]
    },
    media: {
      title: "Educación media",
      items: [
        { name: "Bachiller técnico en informática", meta: ["Institución Educativa Ana Josefa Morales Duque", "Estado: culminado", "Certificación: 25 de noviembre de 2011"] }
      ]
    }
  };

  const SVG_NS = "http://www.w3.org/2000/svg";
  const docIcon = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "doc-icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-doc");
    svg.appendChild(use);
    return svg;
  };

  function buildFolder(folder) {
    const list = el("ul", "mw-group mw-docs");
    list.setAttribute("role", "list");
    folder.items.forEach(({ name, meta = [] }) => {
      const item = el("li", "mw-doc");
      const text = el("div");
      text.appendChild(el("p", "doc-name", name));
      if (meta.length) text.appendChild(el("p", "doc-meta", meta.join(" · ")));
      item.append(docIcon(), text);
      list.appendChild(item);
    });
    return list;
  }

  const FOLDER_ICON = '<svg class="mw-folder" viewBox="0 0 68 56" aria-hidden="true"><use href="#i-folder"/></svg>';
  const filesLabel = (n) => `${n} ${n === 1 ? "archivo" : "archivos"}`;

  function openFormacion(key) {
    const keys = Object.keys(FORMACION);
    const total = keys.reduce((sum, k) => sum + FORMACION[k].items.length, 0);
    finderWindow.open({
      icon: FOLDER_ICON,
      iconClass: "is-bare",
      title: "Formación académica",
      subtitle: `${keys.length} carpetas`,
      label: "Carpetas",
      foot: `${total} documentos en total`,
      items: keys.map((k) => ({ key: k, label: FORMACION[k].title, icon: FOLDER_ICON })),
      initial: key,
      page: (k) => ({
        eyebrow: "Carpeta",
        title: FORMACION[k].title,
        sub: filesLabel(FORMACION[k].items.length),
        content: buildFolder(FORMACION[k]),
        path: ["Formación académica", FORMACION[k].title]
      })
    });
  }

  $$(".finder-item[data-folder]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (FORMACION[btn.dataset.folder]) openFormacion(btn.dataset.folder);
    });
  });

  /* Aviso de protección de datos: una página con secciones */
  const NOTICE_SECTIONS = [
    {
      key: "confidencialidad",
      label: "Confidencialidad",
      icon: mwSvg('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
      title: "Confidencialidad y uso de la información",
      text: "La información presentada en este proyecto, correspondiente exclusivamente a los datos recopilados dentro del marco de los ejercicios y desarrollos realizados, es de carácter ficticio y se emplea únicamente con fines académicos, demostrativos y técnicos. En consecuencia, no se utilizan, almacenan ni divulgan datos reales, personales o de naturaleza confidencial."
    },
    {
      key: "datos",
      label: "Protección de datos",
      icon: mwSvg('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>'),
      title: "Protección de datos personales",
      text: "El desarrollo del proyecto se fundamenta en principios de ética, privacidad, confidencialidad y protección de la propiedad intelectual, garantizando un tratamiento responsable de la información y el cumplimiento de la normativa aplicable, en particular la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia, relacionados con la protección de datos personales, así como el Reglamento General de Protección de Datos (GDPR – Reglamento (UE) 2016/679)."
    },
    {
      key: "autor",
      label: "Propiedad intelectual",
      icon: mwSvg('<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.6a3.6 3.6 0 1 0 0 4.8"/>'),
      title: "Derechos de autor y propiedad intelectual",
      text: "De igual manera, el proyecto se acoge a las disposiciones de la Ley 23 de 1982 y la Decisión Andina 351 de 1993 en materia de derechos de autor y propiedad intelectual, reafirmando su compromiso con el uso legítimo, ético y responsable de la información y de los activos intelectuales involucrados."
    }
  ];

  function buildNotice() {
    const wrap = el("div", "mw-notes");
    NOTICE_SECTIONS.forEach((s) => {
      const card = el("section", "mw-note");
      card.dataset.section = s.key;
      card.append(el("h3", "", s.title), el("p", "", s.text));
      wrap.appendChild(card);
    });
    const sign = el("p", "mw-signature");
    sign.append(el("strong", "", "Santiago Sterling"), el("span", "", "Tecnólogo en Análisis y Desarrollo de Software"));
    wrap.appendChild(sign);
    return wrap;
  }

  function openNotice() {
    finderWindow.open({
      mode: "scroll",
      icon: mwSvg('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>'),
      iconClass: "is-shield",
      title: "Aviso legal",
      subtitle: "Protección de datos",
      label: "Secciones",
      foot: "Datos ficticios con fines académicos",
      items: NOTICE_SECTIONS.map(({ key, label, icon }) => ({ key, label, icon })),
      page: () => ({
        eyebrow: "Declaración",
        title: "Confidencialidad y protección de datos",
        sub: "Aplica a los proyectos y demostraciones de este portafolio.",
        content: buildNotice(),
        path: ["Desarrollos", "Aviso de protección de datos"]
      })
    });
  }
  $$("[data-open-notice]").forEach((btn) => btn.addEventListener("click", openNotice));

  /* ==========================================================================
     VENTANAS AUXILIARES APPLE UI (usadas en otras páginas)
     ========================================================================== */
  ["", "2", "3", "4"].forEach((suffix) => {
    const id = `appleUI${suffix}`;
    window[`openAppleUI${suffix}`] = () => {
      const node = document.getElementById(id);
      if (!node || !node.classList.contains("hidden")) return;
      node.classList.remove("hidden");
      lockScroll();
    };
    window[`closeAppleUI${suffix}`] = () => {
      const node = document.getElementById(id);
      if (!node || node.classList.contains("hidden")) return;
      node.classList.add("hidden");
      unlockScroll();
    };
  });

  /* ==========================================================================
     LANZAMIENTO EN ÓRBITA
     ========================================================================== */
  let orbitRunning = false;
  window.launchOrbit = function () {
    const overlay = document.getElementById("orbit-overlay");
    if (!overlay || orbitRunning) return;
    orbitRunning = true;
    overlay.classList.remove("active", "fade-out");
    void overlay.offsetWidth; // reinicia las animaciones CSS
    overlay.classList.add("active");

    const total = reducedMotion ? 1500 : 5000;
    setTimeout(() => overlay.classList.add("fade-out"), total - 1000);
    setTimeout(() => {
      overlay.classList.remove("active", "fade-out");
      orbitRunning = false;
    }, total);
  };
  $$("[data-launch-orbit]").forEach((btn) => btn.addEventListener("click", window.launchOrbit));

  /* ==========================================================================
     VISOR DE IMÁGENES (usado en otras páginas)
     ========================================================================== */
  let images = [];
  let currentImageIndex = 0;
  let imageModalOpen = false;

  window.openImageModal = function (imageArray, startIndex = 0) {
    images = imageArray;
    currentImageIndex = startIndex;
    if (!imageModalOpen) {
      imageModalOpen = true;
      lockScroll();
      document.addEventListener("keydown", handleImageKeys);
    }
    renderImageModal();
  };

  function renderImageModal() {
    document.getElementById("imageModal")?.remove();
    const img = images[currentImageIndex];
    if (!img) return;
    const isFirst = currentImageIndex === 0;
    const isLast = currentImageIndex === images.length - 1;

    const modal = document.createElement("div");
    modal.id = "imageModal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm";
    modal.innerHTML = `
      <div class="relative max-w-7xl w-full h-full flex items-center justify-center p-4">
        <button type="button" data-action="close" class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10" aria-label="Cerrar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <button type="button" data-action="prev" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all ${isFirst ? "opacity-50 cursor-not-allowed" : ""}" ${isFirst ? "disabled" : ""} aria-label="Imagen anterior">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <img class="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain">
        <button type="button" data-action="next" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all ${isLast ? "opacity-50 cursor-not-allowed" : ""}" ${isLast ? "disabled" : ""} aria-label="Imagen siguiente">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg">
          <p class="text-slate-300 text-sm">${currentImageIndex + 1} / ${images.length}<span class="hidden md:inline"> · Usa ← → para navegar</span> · ESC para cerrar</p>
        </div>
      </div>`;
    const imgEl = $("img", modal);
    imgEl.src = img.src;
    imgEl.alt = img.alt || "";
    modal.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "close" || e.target === modal || e.target === modal.firstElementChild) window.closeImageModal();
      else if (action === "prev") window.previousImage();
      else if (action === "next") window.nextImage();
    });
    document.body.appendChild(modal);
  }

  window.nextImage = function () {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      renderImageModal();
    }
  };
  window.previousImage = function () {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      renderImageModal();
    }
  };
  window.closeImageModal = function () {
    document.getElementById("imageModal")?.remove();
    if (!imageModalOpen) return;
    imageModalOpen = false;
    unlockScroll();
    document.removeEventListener("keydown", handleImageKeys);
  };
  function handleImageKeys(e) {
    if (e.key === "ArrowRight") window.nextImage();
    else if (e.key === "ArrowLeft") window.previousImage();
    else if (e.key === "Escape") window.closeImageModal();
  }

  /* Compatibilidad: vistas previas antiguas con data-url */
  window.expandWebPreview = function (element) {
    const url = element?.getAttribute("data-url");
    if (url) window.location.href = url;
  };

  /* ==========================================================================
     COMPETENCIAS: GALERÍA CON CONTROLES
     ========================================================================== */
  // Carruseles horizontales (Experiencia y Competencias): deslizar en móvil,
  // botones anterior/siguiente en PC. Cada .gallery controla solo su pista.
  (function initGalleries() {
    $$(".gallery").forEach((gallery) => {
      const track = $(".gallery-track", gallery);
      const paddles = $$(".paddle", gallery);
      if (!track || !paddles.length) return;

      const step = () => {
        const card = track.firstElementChild;
        if (!card) return track.clientWidth;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return card.getBoundingClientRect().width + gap;
      };

      const update = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        paddles.forEach((p) => {
          const dir = Number(p.dataset.dir);
          p.disabled = dir < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= max;
        });
      };

      paddles.forEach((p) =>
        p.addEventListener("click", () => {
          track.scrollBy({ left: Number(p.dataset.dir) * step(), behavior: reducedMotion ? "auto" : "smooth" });
        })
      );
      track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
      window.addEventListener("resize", update, { passive: true });
      update();
    });
  })();

  /* ==========================================================================
     COMPETENCIAS: MODAL DE ICONOS
     ========================================================================== */
  // icon: ruta dentro de Devicon · img: URL propia · brand: color de marca (brillo al pasar el cursor)
  // mono: logos oscuros que se invierten en modo oscuro · tile "light": fondo claro para íconos a color sobre blanco
  const CATEGORIAS = {
    lenguajes: {
      titulo: "Lenguajes de programación",
      tipo: "Lenguaje",
      items: [
        { icon: "javascript/javascript-original.svg", label: "JavaScript", brand: "#f7df1e" },
        { icon: "typescript/typescript-original.svg", label: "TypeScript", brand: "#3178c6" },
        { icon: "python/python-original.svg", label: "Python", brand: "#3776ab" },
        { icon: "csharp/csharp-original.svg", label: "C#", brand: "#9b4f96" },
        { icon: "microsoftsqlserver/microsoftsqlserver-plain.svg", label: "SQL", brand: "#cc2927" },
        { icon: "visualbasic/visualbasic-original.svg", label: "Visual Basic", brand: "#5c2d91" }
      ]
    },
    herramientas: {
      titulo: "Herramientas",
      tipo: "Herramienta",
      items: [
        { icon: "html5/html5-original.svg", label: "HTML", brand: "#e34f26" },
        { icon: "css3/css3-original.svg", label: "CSS", brand: "#1572b6" },
        { icon: "tailwindcss/tailwindcss-original.svg", label: "Tailwind", brand: "#38bdf8" },
        { icon: "react/react-original.svg", label: "React", brand: "#61dafb" },
        { icon: "nextjs/nextjs-original.svg", label: "Next.js", brand: "#ffffff" },
        { icon: "vuejs/vuejs-original.svg", label: "Vue", brand: "#42b883" },
        { icon: "angular/angular-original.svg", label: "Angular", brand: "#dd0031" },
        { icon: "nodejs/nodejs-original.svg", label: "Node.js", brand: "#5fa04e" },
        { icon: "django/django-plain.svg", label: "Django", brand: "#44b78b", mono: true },
        { icon: "fastapi/fastapi-original.svg", label: "FastAPI", brand: "#009688" },
        { icon: "dotnetcore/dotnetcore-original.svg", label: ".NET", brand: "#512bd4" },
        { icon: "postgresql/postgresql-original.svg", label: "PostgreSQL", brand: "#4169e1" },
        { icon: "mysql/mysql-original.svg", label: "MySQL", brand: "#4479a1" },
        { icon: "docker/docker-original.svg", label: "Docker", brand: "#2496ed" }
      ]
    },
    extras: {
      titulo: "Habilidades extra",
      tipo: "Habilidad",
      items: [
        { icon: "github/github-original.svg", label: "GitHub", brand: "#ffffff", mono: true },
        { icon: "git/git-original.svg", label: "Git", brand: "#f05032" },
        { icon: "wordpress/wordpress-plain.svg", label: "WordPress", brand: "#21759b", mono: true },
        { img: "https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/Logo%20de%20Excel.jpg?raw=true", label: "Excel avanzado", brand: "#217346" },
        { icon: "photoshop/photoshop-original.svg", label: "Photoshop", brand: "#31a8ff" },
        { icon: "illustrator/illustrator-plain.svg", label: "Illustrator", brand: "#ff9a00" },
        { img: "https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/Logo%20de%20Power%20BI.jpg?raw=true", label: "Power BI", brand: "#f2c811" },
        { img: "https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/Logo%20de%20DAX.jpg?raw=true", label: "DAX", brand: "#f2c811" }
      ]
    },
    interpersonal: {
      titulo: "Inteligencia interpersonal",
      tile: "light",
      items: [
        { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXrPUwJ6tW0KozNRbo0cRYNbdoiH5wln83Dg&s", label: "Trabajo en equipo" },
        { img: "https://images.seeklogo.com/logo-png/42/2/scrum-logo-png_seeklogo-428358.png", label: "Scrum" },
        { img: "https://w7.pngwing.com/pngs/921/147/png-transparent-public-relations-communication-organization-marketing-logo-las-service-industry-marketing-plan.png", label: "Comunicación" },
        { img: "https://cdn-icons-png.flaticon.com/512/860/860430.png", label: "Liderazgo" },
        { img: "https://cdn-icons-png.freepik.com/512/17772/17772810.png", label: "Responsabilidad" },
        { img: "https://cdn-icons-png.flaticon.com/512/5526/5526196.png", label: "Pensamiento crítico" },
        { img: "https://cdn-icons-png.freepik.com/512/1838/1838332.png", label: "Resolución de problemas" },
        { img: "https://cdn-icons-png.freepik.com/256/12316/12316790.png", label: "Adaptabilidad" },
        { img: "https://cdn-icons-png.freepik.com/512/18290/18290950.png", label: "Atención al detalle" }
      ]
    }
  };
  const logoSrc = (item) => (item.icon ? DEVICON + item.icon : item.img);

  function buildIconItem(item, i, tile) {
    const node = el("div", "ms-item");
    node.style.setProperty("--i", i);
    if (item.brand) node.style.setProperty("--brand", item.brand);
    const icon = el("div", "ms-icon");
    if (tile === "light") icon.classList.add("is-light");
    if (item.mono) icon.classList.add("is-mono");
    const image = document.createElement("img");
    image.src = logoSrc(item);
    image.alt = "";
    image.loading = "lazy";
    // Si el ícono remoto falla, se muestra la inicial en lugar de una imagen rota
    image.addEventListener("error", () => icon.replaceChildren(el("span", "ms-fallback", item.label.charAt(0))), { once: true });
    icon.appendChild(image);
    node.append(icon, el("span", "ms-label", item.label));
    return node;
  }

  const SKILL_ICONS = {
    lenguajes: mwSvg('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>'),
    herramientas: mwSvg('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L4 16.9 7.1 20l5.3-5.3a4 4 0 0 0 5.3-5.4l-2.4 2.4-2.6-.6-.6-2.6z"/>'),
    extras: mwSvg('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="2.5"/>'),
    interpersonal: mwSvg('<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.4"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/>')
  };

  window.abrirModalSterling = function (categoria) {
    if (!CATEGORIAS[categoria]) return;
    const keys = Object.keys(CATEGORIAS);
    const total = keys.reduce((sum, k) => sum + CATEGORIAS[k].items.length, 0);
    skillsWindow.open({
      icon: mwSvg('<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>'),
      iconClass: "is-grid",
      title: "Competencias",
      subtitle: "Metodológicas",
      label: "Categorías",
      foot: `${total} herramientas y habilidades`,
      items: keys.map((k) => ({ key: k, label: CATEGORIAS[k].titulo, icon: SKILL_ICONS[k] || "" })),
      initial: categoria,
      page: (k) => {
        const data = CATEGORIAS[k];
        const grid = el("div", "mw-app-grid");
        grid.append(...data.items.map((item, i) => buildIconItem(item, i, data.tile)));
        return {
          eyebrow: "Categoría",
          title: data.titulo,
          sub: `${data.items.length} elementos`,
          content: grid,
          path: ["Competencias", data.titulo]
        };
      }
    });
  };
  window.cerrarModalSterling = () => skillsWindow.close();

  $$(".gallery-card[data-category]").forEach((card) =>
    card.addEventListener("click", () => window.abrirModalSterling(card.dataset.category))
  );

  /* ==========================================================================
     EXPERIENCIA: MODAL CON DATOS POR EMPRESA
     Completa "achievements" con resultados medibles; si un arreglo queda
     vacío, esa sección se oculta automáticamente.
     ========================================================================== */
  const EXPERIENCE_DETAILS = {
    "Cosmoagro S.A.": {
      responsibilities: [
        "Seguimiento y análisis de indicadores KPI de producción",
        "Optimización de procesos y mejora continua de la eficiencia operativa",
        "Control de calidad y continuidad de la operación en planta"
      ],
      achievements: [],
      skills: ["Análisis de KPI", "Mejora continua", "Control de producción", "Análisis de datos"]
    },
    "Coca-Cola FEMSA": {
      responsibilities: [
        "Control de procesos productivos",
        "Mejora continua y gestión eficiente de la operación",
        "Seguimiento del cumplimiento de calidad del producto"
      ],
      achievements: [],
      skills: ["Control de procesos", "Calidad", "Mejora continua", "Productividad"]
    },
    "Cadena S.A.": {
      responsibilities: [
        "Liderazgo de equipos de producción",
        "Aseguramiento del cumplimiento del plan de producción",
        "Optimización de procesos con énfasis en calidad, seguridad y eficiencia"
      ],
      achievements: [],
      skills: ["Liderazgo", "Planeación de producción", "Seguridad industrial", "Calidad"]
    },
    "Postobón S.A.": {
      responsibilities: [
        "Optimización de flujos de trabajo",
        "Reducción de desperdicios en el proceso",
        "Análisis de datos operativos para la toma de decisiones"
      ],
      achievements: [],
      skills: ["Lean Manufacturing", "Reducción de desperdicios", "Análisis de datos"]
    },
    "Laboratorios OSA S.A.S": {
      responsibilities: [
        "Gestión de indicadores de producción",
        "Optimización de procesos productivos",
        "Estabilidad, eficiencia y calidad de la operación"
      ],
      achievements: [],
      skills: ["Gestión de indicadores", "Optimización de procesos", "Calidad"]
    },
    "Smurfit Westrock S.A.": {
      responsibilities: [
        "Seguimiento de la producción en planta",
        "Control de tiempos de proceso",
        "Mejora de la eficiencia en cada etapa productiva"
      ],
      achievements: [],
      skills: ["Control de tiempos", "Eficiencia operativa", "Seguimiento en planta"]
    }
  };

  /* Ventana estilo macOS Tahoe: barra lateral de vidrio flotante, semáforo
     funcional (cerrar, minimizar, ampliar), barra de herramientas en
     cápsulas de vidrio, navegación entre empresas y barra de ruta. */
  const ICONS = {
    summary: '<path d="M4 5h16M4 10h16M4 15h10M4 20h7"/>',
    responsibilities: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    achievements: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7"/>',
    skills: '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>'
  };
  const svgIcon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

  class ExperienceModal {
    constructor() {
      this.modal = null;
      this.content = null;
      this.body = null;
      this.cards = $$(".experiencia-card");
      this.index = 0;
      this.isOpen = false;
      this.returnFocus = null;
      this.build();
      this.bind();
    }

    build() {
      this.modal = document.createElement("div");
      this.modal.id = "experienceModal";
      this.modal.className = "experience-modal";
      this.modal.setAttribute("aria-hidden", "true");
      const navItem = (key, label) =>
        `<button type="button" class="mw-nav-item" data-target="${key}">${svgIcon(ICONS[key])}<span>${label}</span></button>`;
      this.modal.innerHTML = `
        <div class="modal-overlay" data-close></div>
        <div class="modal-content mac-window" role="dialog" aria-modal="true" aria-labelledby="expModalRole" aria-describedby="expModalDescription" tabindex="-1">
          <aside class="mw-sidebar">
            <div class="mw-traffic">
              <button type="button" class="tl tl-close" data-close aria-label="Cerrar ventana">${svgIcon('<path d="M8 8l8 8M16 8l-8 8"/>')}</button>
              <button type="button" class="tl tl-min" data-minimize aria-label="Minimizar ventana">${svgIcon('<path d="M7 12h10"/>')}</button>
              <button type="button" class="tl tl-zoom" data-zoom aria-label="Ampliar ventana" aria-pressed="false">${svgIcon('<path d="M8 15V8h7M16 9v7H9" />')}</button>
            </div>
            <div class="mw-identity">
              <div class="modal-logo-wrapper"><img id="expModalLogo" alt=""></div>
              <div class="mw-identity-text">
                <p id="expModalCompany" class="modal-title"></p>
                <p id="expModalDuration" class="modal-duration"></p>
              </div>
            </div>
            <p class="mw-sidebar-label">Contenido</p>
            <nav class="mw-nav" aria-label="Secciones de la experiencia">
              ${navItem("summary", "Resumen")}
              ${navItem("responsibilities", "Responsabilidades")}
              ${navItem("achievements", "Logros")}
              ${navItem("skills", "Habilidades")}
            </nav>
            <p class="mw-sidebar-foot"><span id="expModalCount"></span></p>
          </aside>

          <div class="mw-main">
            <header class="mw-toolbar">
              <div class="mw-capsule mw-history">
                <button type="button" class="mw-icon-btn" data-step="-1" aria-label="Experiencia anterior">${svgIcon('<path d="m14.5 5-7 7 7 7"/>')}</button>
                <span class="mw-sep" aria-hidden="true"></span>
                <button type="button" class="mw-icon-btn" data-step="1" aria-label="Experiencia siguiente">${svgIcon('<path d="m9.5 5 7 7-7 7"/>')}</button>
              </div>
              <p class="mw-toolbar-title" id="expToolbarTitle" aria-hidden="true"></p>
              <div class="mw-capsule">
                <a class="mw-capsule-link" href="${LINKEDIN_URL}" target="_blank" rel="noopener">${svgIcon('<path d="M7 17 17 7M9 7h8v8"/>')}<span>LinkedIn</span></a>
              </div>
            </header>

            <div class="modal-body">
              <div class="modal-logo-cover">
                <img id="expModalCover" alt="" class="modal-cover-image">
                <span class="mw-cover-badge" id="expModalSector"></span>
              </div>
              <div class="modal-details">
                <section class="detail-section" data-section="summary">
                  <h2 id="expModalRole" class="detail-role"></h2>
                  <p id="expModalDescription" class="detail-description"></p>
                </section>
                <section class="detail-section" data-section="responsibilities">
                  <h3 class="detail-subtitle">Responsabilidades</h3>
                  <ul class="mw-group responsibility-list"></ul>
                </section>
                <section class="detail-section" data-section="achievements">
                  <h3 class="detail-subtitle">Logros</h3>
                  <ul class="mw-group achievement-list"></ul>
                </section>
                <section class="detail-section" data-section="skills">
                  <h3 class="detail-subtitle">Habilidades aplicadas</h3>
                  <div class="skills-tags"></div>
                </section>
              </div>
            </div>

            <footer class="mw-pathbar" aria-hidden="true">
              <span>Experiencia</span><i></i><span id="expPathCompany"></span><i></i><span id="expPathRole"></span>
            </footer>
          </div>
        </div>`;
      document.body.appendChild(this.modal);
      this.content = $(".modal-content", this.modal);
      this.body = $(".modal-body", this.modal);
    }

    bind() {
      this.cards.forEach((card, i) => card.addEventListener("click", () => this.open(i)));

      this.modal.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]")) return this.close();
        if (e.target.closest("[data-minimize]")) return this.minimize();
        const zoom = e.target.closest("[data-zoom]");
        if (zoom) {
          const on = this.content.classList.toggle("is-zoomed");
          zoom.setAttribute("aria-pressed", String(on));
          zoom.setAttribute("aria-label", on ? "Restaurar tamaño de la ventana" : "Ampliar ventana");
          return;
        }
        const step = e.target.closest("[data-step]");
        if (step) return this.open((this.index + Number(step.dataset.step) + this.cards.length) % this.cards.length);
        const nav = e.target.closest(".mw-nav-item");
        if (nav) {
          const target = $(`[data-section="${nav.dataset.target}"]`, this.modal);
          this.body.scrollTo({ top: nav.dataset.target === "summary" ? 0 : target.offsetTop - 72, behavior: reducedMotion ? "auto" : "smooth" });
        }
      });

      // Flechas del teclado para pasar de empresa (fuera de campos de texto)
      this.modal.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        if (e.target.closest(".mw-nav")) return;
        this.open((this.index + (e.key === "ArrowRight" ? 1 : -1) + this.cards.length) % this.cards.length);
      });

      // Resalta en la barra lateral la sección visible y activa el borde de desplazamiento
      this.body.addEventListener("scroll", () => requestAnimationFrame(() => this.syncNav()), { passive: true });
    }

    syncNav() {
      const top = this.body.scrollTop;
      this.content.classList.toggle("is-scrolled", top > 8);
      let current = "summary";
      $$(".detail-section:not([hidden])", this.modal).forEach((s) => {
        if (s.offsetTop - 120 <= top) current = s.dataset.section;
      });
      if (top + this.body.clientHeight >= this.body.scrollHeight - 4) {
        const visible = $$(".detail-section:not([hidden])", this.modal);
        current = visible[visible.length - 1]?.dataset.section || current;
      }
      $$(".mw-nav-item", this.modal).forEach((b) => {
        const on = b.dataset.target === current;
        b.classList.toggle("is-active", on);
        if (on) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
    }

    fillList(section, items, tag, className) {
      const wrapper = $(`[data-section="${section}"]`, this.modal);
      wrapper.lastElementChild.replaceChildren(...items.map((text) => el(tag, className, text)));
      wrapper.hidden = items.length === 0;
      const nav = $(`.mw-nav-item[data-target="${section}"]`, this.modal);
      if (nav) nav.hidden = items.length === 0;
    }

    open(i) {
      const card = this.cards[i];
      if (!card) return;
      this.index = i;
      const company = card.dataset.company || $(".card-company", card)?.textContent.trim() || "";
      const role = $(".card-role", card)?.textContent.trim() || "";
      const details = EXPERIENCE_DETAILS[company] || { responsibilities: [], achievements: [], skills: [] };

      this.content.style.setProperty("--exp-accent", getComputedStyle(card).getPropertyValue("--accent-color").trim() || "#0a84ff");
      $("#expModalCompany", this.modal).textContent = company;
      $("#expModalDuration", this.modal).textContent = card.dataset.duration || "";
      $("#expModalRole", this.modal).textContent = role;
      $("#expModalDescription", this.modal).textContent = $(".card-description", card)?.textContent.trim() || "";
      $("#expModalSector", this.modal).textContent = $(".card-eyebrow", card)?.textContent.trim() || "";
      $("#expToolbarTitle", this.modal).textContent = company;
      $("#expPathCompany", this.modal).textContent = company;
      $("#expPathRole", this.modal).textContent = role;
      $("#expModalCount", this.modal).textContent = `${i + 1} de ${this.cards.length} empresas`;
      $("#expModalCover", this.modal).src = $(".cover-image", card)?.src || "";
      const logo = $("#expModalLogo", this.modal);
      logo.src = $(".card-logo", card)?.src || "";
      logo.alt = `Logo de ${company}`;

      this.fillList("responsibilities", details.responsibilities, "li");
      this.fillList("achievements", details.achievements, "li");
      this.fillList("skills", details.skills, "span", "skill-tag");
      this.body.scrollTop = 0;
      this.syncNav();

      // Transición suave al cambiar de empresa con la ventana abierta
      if (this.isOpen && !reducedMotion) {
        this.body.classList.remove("is-switching");
        void this.body.offsetWidth;
        this.body.classList.add("is-switching");
      }

      if (!this.isOpen) {
        this.returnFocus = document.activeElement;
        this.isOpen = true;
        this.content.classList.remove("is-minimizing");
        this.modal.classList.add("active");
        this.modal.setAttribute("aria-hidden", "false");
        pushDialog(this.content, () => this.close());
        lockScroll();
        this.content.focus();
      }
    }

    minimize() {
      if (reducedMotion) return this.close();
      this.content.classList.add("is-minimizing");
      setTimeout(() => this.close(), 420);
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.modal.classList.remove("active");
      this.modal.setAttribute("aria-hidden", "true");
      popDialog(this.content);
      unlockScroll();
      this.returnFocus?.focus?.();
      setTimeout(() => {
        this.content.classList.remove("is-minimizing", "is-zoomed");
        $("[data-zoom]", this.modal).setAttribute("aria-pressed", "false");
      }, 320);
    }
  }

  window.experienceModal = new ExperienceModal();

  /* Experiencia: tarjeta única + fila de logos. Al pasar o enfocar un logo
     la tarjeta muestra esa empresa; al hacer clic se abre su ventana. */
  (function initExpStage() {
    const stage = $("#expStage");
    if (!stage) return;
    const cards = $$(".experiencia-card");
    const hero = $(".exp-hero", stage);
    const img = $(".exp-hero-img", stage);
    const roleEl = $(".exp-hero-role", stage);
    const companyEl = $(".exp-hero-company", stage);
    const datesEl = $(".exp-hero-dates", stage);
    const btns = $$(".exp-logo-btn", stage);
    const canHover = window.matchMedia("(hover: hover)").matches;
    let active = 0;
    let token = 0;

    const accentOf = (card) => getComputedStyle(card).getPropertyValue("--accent-color").trim() || "#0071e3";

    const show = (i) => {
      const card = cards[i];
      if (!card || i === active) return;
      active = i;
      btns.forEach((b, j) => b.classList.toggle("is-active", j === i));

      const role = $(".card-role", card)?.textContent.trim() || "";
      const company = card.dataset.company || "";
      const src = $(".cover-image", card)?.src || "";
      const apply = () => {
        img.src = src;
        roleEl.textContent = role;
        companyEl.textContent = company;
        datesEl.textContent = card.dataset.duration || "";
        hero.setAttribute("aria-label", `Ver detalles: ${role} en ${company}`);
        stage.style.setProperty("--exp-accent", accentOf(card));
        hero.classList.remove("is-fading");
      };
      if (reducedMotion) return apply();

      const t = ++token;
      hero.classList.add("is-fading");
      const pre = new Image();
      pre.src = src;
      const ready = pre.decode ? pre.decode().catch(() => {}) : Promise.resolve();
      Promise.all([ready, new Promise((r) => setTimeout(r, 220))]).then(() => {
        if (t === token) apply();
      });
    };

    const open = (i) => window.experienceModal?.open(i);

    btns.forEach((b) => {
      const i = Number(b.dataset.index);
      b.addEventListener("click", () => { show(i); open(i); });
      b.addEventListener("focus", () => show(i));
      if (canHover) b.addEventListener("pointerenter", () => show(i));
    });
    hero.addEventListener("click", () => open(active));

    stage.style.setProperty("--exp-accent", accentOf(cards[0]));
    // Precarga discreta de las demás portadas para que el cambio sea inmediato
    const preload = () => cards.forEach((c) => { const s = $(".cover-image", c)?.src; if (s) new Image().src = s; });
    ("requestIdleCallback" in window) ? requestIdleCallback(preload) : setTimeout(preload, 1500);
  })();
})();
