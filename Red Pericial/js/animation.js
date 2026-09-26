/* ==========================================================================
   Animaciones
   - Reveal progresivo con IntersectionObserver
   - Contadores numéricos
   - Hero: el faro proyecta un haz que ilumina la red (canvas + SVG)
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});

  /* ---------------- Reveal ---------------- */
  const initReveal = () => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!RP.motion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
  };

  /* ---------------- Contadores ---------------- */
  const initCounters = () => {
    const els = document.querySelectorAll("[data-count]");
    if (!RP.motion || !("IntersectionObserver" in window)) return;
    const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const run = (el) => {
      const end = Number(el.dataset.count) || 0;
      const dur = 1600;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * ease(t)).toLocaleString("es");
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          run(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    els.forEach((el) => {
      el.textContent = "0";
      io.observe(el);
    });
  };

  /* ---------------- Faro: haz de luz sobre la red (canvas) ----------------
     El haz nace en la lámpara del faro ([data-lamp]), barre lentamente el
     hero, sigue suavemente al puntero en desktop e ilumina los nodos de la
     red que quedan dentro del cono. Con movimiento reducido: un solo cuadro. */
  const heroBeacon = (canvas, host) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, nodes = [], raf = 0, visible = true;
    let lamp = { x: 0, y: 0 };
    let rgbText = "11,11,15", rgbAccent = "29,78,216", rgbBeam = "29,78,216", beamAlpha = 0.14;
    const pointer = { x: -9999, y: -9999, active: false };
    const LINK = 150;
    const HALF = 0.2; // semiapertura del cono (rad)
    let angle = Math.PI * 0.94; // dirección actual del haz (hacia la izquierda)
    const t0 = performance.now();

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      rgbText = cs.getPropertyValue("--rgb-text").trim() || rgbText;
      rgbAccent = cs.getPropertyValue("--rgb-accent").trim() || rgbAccent;
      rgbBeam = cs.getPropertyValue("--rgb-beam").trim() || rgbAccent;
      beamAlpha = parseFloat(cs.getPropertyValue("--beam-alpha")) || beamAlpha;
    };

    const locateLamp = () => {
      const el = host && host.querySelector("[data-lamp]");
      if (!el) { lamp = { x: w * 0.8, y: h * 0.3 }; return; }
      const cr = canvas.getBoundingClientRect();
      const lr = el.getBoundingClientRect();
      lamp = { x: lr.left - cr.left + lr.width / 2, y: lr.top - cr.top + lr.height / 2 };
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      locateLamp();
      const count = Math.max(26, Math.min(90, Math.round((w * h) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.9,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1 + Math.random() * 1.1,
        glow: 0,
      }));
    };

    /** Intensidad 0..1 de un punto dentro del haz (centro del cono = 1) */
    const beamAt = (x, y) => {
      const dx = x - lamp.x, dy = y - lamp.y;
      let d = Math.atan2(dy, dx) - angle;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      const k = 1 - Math.abs(d) / HALF;
      return k > 0 ? k : 0;
    };

    const targetAngle = (now) => {
      // Barrido pendular lento entre ~150° y ~205° (hacia el texto)
      const base = Math.PI + Math.sin((now - t0) / 4200) * 0.42 - 0.08;
      if (!pointer.active || pointer.x > lamp.x - 40) return base;
      const toPointer = Math.atan2(pointer.y - lamp.y, pointer.x - lamp.x);
      return base * 0.35 + toPointer * 0.65;
    };

    const drawBeam = () => {
      const len = Math.hypot(w, h) * 1.1;
      const g = ctx.createRadialGradient(lamp.x, lamp.y, 0, lamp.x, lamp.y, len * 0.75);
      g.addColorStop(0, `rgba(${rgbBeam},${(beamAlpha * 2.2).toFixed(3)})`);
      g.addColorStop(0.35, `rgba(${rgbBeam},${beamAlpha.toFixed(3)})`);
      g.addColorStop(1, `rgba(${rgbBeam},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(lamp.x, lamp.y);
      ctx.arc(lamp.x, lamp.y, len, angle - HALF, angle + HALF);
      ctx.closePath();
      ctx.fill();
      // Núcleo más brillante del haz
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(lamp.x, lamp.y);
      ctx.arc(lamp.x, lamp.y, len, angle - HALF * 0.35, angle + HALF * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      // Resplandor de la lámpara
      const halo = ctx.createRadialGradient(lamp.x, lamp.y, 0, lamp.x, lamp.y, 60);
      halo.addColorStop(0, `rgba(${rgbBeam},${(beamAlpha * 3.5).toFixed(3)})`);
      halo.addColorStop(1, `rgba(${rgbBeam},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y, 60, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now, animate) => {
      if (animate) {
        const target = targetAngle(now);
        angle += (target - angle) * 0.04;
      }
      ctx.clearRect(0, 0, w, h);
      drawBeam();

      for (const n of nodes) {
        if (animate) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
        }
        const k = beamAt(n.x, n.y);
        // La luz "enciende" el nodo y se apaga con suavidad
        n.glow = animate ? Math.max(k, n.glow * 0.965) : k;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > LINK) continue;
          const lit = Math.min(a.glow, b.glow);
          const base = (1 - d / LINK) * 0.13;
          ctx.strokeStyle = `rgba(${rgbText},${base.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (lit > 0.02) {
            ctx.strokeStyle = `rgba(${rgbAccent},${((1 - d / LINK) * 0.8 * lit).toFixed(3)})`;
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${rgbText},0.38)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.glow > 0.02) {
          ctx.fillStyle = `rgba(${rgbAccent},${(0.95 * n.glow).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 1.2 * n.glow, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now) => {
      locateLamp(); // el faro tiene parallax: la lámpara se mueve con el scroll
      draw(now, true);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    readColors();
    resize();
    window.addEventListener("load", () => { locateLamp(); if (!RP.motion) draw(0, false); });
    document.addEventListener("rp:themechange", () => { readColors(); if (!RP.motion) draw(0, false); });

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { resize(); if (!RP.motion) draw(0, false); }, 150);
    });

    if (!RP.motion) { draw(0, false); return; }

    const hero = canvas.parentElement;
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    });
    hero.addEventListener("pointerleave", () => { pointer.active = false; });

    // Pausar cuando no está visible (rendimiento y batería)
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    raf = requestAnimationFrame(loop);
  };

  const initHero = () => {
    const host = document.querySelector("[data-lighthouse]");
    if (host) host.insertAdjacentHTML("afterbegin", RP.utils.lighthouseArt("hero__lighthouse-art"));
    const canvas = document.querySelector("[data-network]");
    if (canvas && window.RP_CONFIG.effects.heroNetwork) heroBeacon(canvas, host);

    const ready = () => document.documentElement.classList.add("is-loaded");
    if (document.fonts && document.fonts.ready) {
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]).then(ready);
    } else ready();
  };

  const init = () => {
    initHero();
    initReveal();
    initCounters();
  };

  RP.animations = { init };
})();
