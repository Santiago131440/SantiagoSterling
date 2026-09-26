/* ==========================================================================
   Experiencia de scroll
   Un único bucle requestAnimationFrame por evento de scroll alimenta:
   - Indicador de progreso
   - Estado del navbar
   - Parallax sutil         [data-parallax="0.12"]
   - Texto palabra a palabra [data-words]
   - Parallax del faro      [data-lighthouse]
   - Scroll horizontal fijado [data-hscroll]
   La metodología (sticky storytelling) usa IntersectionObserver.
   Todo se desactiva con prefers-reduced-motion o RP_CONFIG.animations = false.
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  let progressBar;
  let parallaxEls = [];
  let wordBlocks = [];
  let lens;
  let hsections = [];
  let ticking = false;
  let vh = window.innerHeight;

  /* ---------------- Palabra a palabra ---------------- */
  const splitWords = (el) => {
    // Conserva <span class="hl"> internos
    const walk = (node) => {
      const frag = document.createDocumentFragment();
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else {
              const s = document.createElement("span");
              s.className = "word";
              s.textContent = part;
              frag.appendChild(s);
            }
          });
        } else if (child.nodeType === 1) {
          const clone = child.cloneNode(false);
          clone.appendChild(walk(child));
          frag.appendChild(clone);
        }
      });
      return frag;
    };
    const label = el.textContent.trim().replace(/\s+/g, " ");
    const frag = walk(el);
    el.textContent = "";
    el.appendChild(frag);
    el.setAttribute("aria-label", label);
    el.querySelectorAll(".word").forEach((w) => w.setAttribute("aria-hidden", "true"));
    return [...el.querySelectorAll(".word")];
  };

  const updateWords = () => {
    wordBlocks.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      // 0 cuando el bloque entra por abajo (85%), 1 cuando llega al 35%
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.5), 0, 1);
      const lit = p * words.length;
      words.forEach((w, i) => {
        const o = clamp(lit - i, 0, 1);
        w.style.setProperty("--o", (0.16 + o * 0.84).toFixed(3));
      });
    });
  };

  /* ---------------- Parallax ---------------- */
  const updateParallax = () => {
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0) scale(1.12)`;
    });
  };

  /* ---------------- Faro ---------------- */
  const updateLens = (y) => {
    if (!lens || y > vh * 1.5) return;
    // El faro se hunde levemente en el horizonte al hacer scroll (parallax)
    lens.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
  };

  /* ---------------- Horizontal fijado ---------------- */
  const desktop = window.matchMedia("(min-width: 1024px)");

  const setupHorizontal = () => {
    hsections.forEach((h) => {
      const enable = RP.motion && desktop.matches && window.RP_CONFIG.effects.horizontalServices;
      h.section.classList.toggle("is-pinned", enable);
      h.enabled = enable;
      if (!enable) {
        h.section.style.height = "";
        h.track.style.transform = "";
        return;
      }
      h.track.style.transform = "";
      h.distance = Math.max(0, h.track.scrollWidth - window.innerWidth);
      h.section.style.height = `${h.distance + window.innerHeight}px`;
    });
  };

  const updateHorizontal = () => {
    hsections.forEach((h) => {
      if (!h.enabled) return;
      const r = h.section.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh || 1), 0, 1);
      h.track.style.transform = `translate3d(${(-p * h.distance).toFixed(1)}px,0,0)`;
      if (h.counter) {
        const idx = Math.min(h.total, Math.floor(p * h.total) + 1);
        h.counter.textContent = `${String(idx).padStart(2, "0")} / ${String(h.total).padStart(2, "0")}`;
      }
    });
  };

  /* ---------------- Bucle ---------------- */
  const frame = () => {
    ticking = false;
    const y = window.scrollY;
    if (RP.navigation && RP.navigation.isOpen) return;

    const max = document.documentElement.scrollHeight - vh;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    if (RP.navigation) RP.navigation.updateHeader(y);

    if (!RP.motion) return;
    updateParallax();
    updateWords();
    updateLens(y);
    updateHorizontal();
  };

  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };

  /* ---------------- Metodología (sticky storytelling) ---------------- */
  const initMethod = () => {
    document.querySelectorAll("[data-method]").forEach((root) => {
      const steps = [...root.querySelectorAll("[data-step]")];
      const current = root.querySelector("[data-method-current]");
      const title = root.querySelector("[data-method-title]");
      const bar = root.querySelector("[data-method-bar]");
      const setActive = (i) => {
        steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
        if (current) current.textContent = String(i + 1).padStart(2, "0");
        if (title) title.textContent = steps[i].querySelector("h3").textContent;
        if (bar) bar.style.transform = `scaleX(${(i + 1) / steps.length})`;
      };
      if (!("IntersectionObserver" in window)) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(Number(e.target.dataset.step));
          });
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      steps.forEach((s) => io.observe(s));
    });
  };

  const init = () => {
    progressBar = document.querySelector("[data-progress]");
    lens = document.querySelector("[data-lighthouse] .lighthouse");

    if (RP.motion) {
      if (window.RP_CONFIG.effects.parallax) parallaxEls = [...document.querySelectorAll("[data-parallax]")];
      if (window.RP_CONFIG.effects.wordReveal)
        wordBlocks = [...document.querySelectorAll("[data-words]")].map((el) => ({ el, words: splitWords(el) }));
    }

    hsections = [...document.querySelectorAll("[data-hscroll]")].map((section) => {
      const track = section.querySelector("[data-hscroll-track]");
      return {
        section,
        track,
        counter: section.querySelector("[data-hscroll-counter]"),
        total: track ? track.children.length : 0,
        distance: 0,
        enabled: false,
      };
    }).filter((h) => h.track);

    setupHorizontal();
    initMethod();

    window.addEventListener("scroll", request, { passive: true });
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        vh = window.innerHeight;
        setupHorizontal();
        request();
      }, 150);
    });
    desktop.addEventListener("change", () => { setupHorizontal(); request(); });
    // Recalcular cuando carguen fuentes/imágenes
    window.addEventListener("load", () => { setupHorizontal(); request(); });
    frame();
  };

  RP.scroll = { init, refresh: () => { setupHorizontal(); request(); } };
})();
