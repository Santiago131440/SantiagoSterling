/**
 * RED PERICIAL HOSPITALARIA — main.js
 * Senior Frontend · GSAP ScrollTrigger · Canvas Particles
 * Full cinematic experience with storytelling scroll
 */

'use strict';

/* ════════════════════════════════════════════
   WAIT FOR GSAP
════════════════════════════════════════════ */
function waitFor(check, cb, interval = 30) {
  const id = setInterval(() => { if (check()) { clearInterval(id); cb(); } }, interval);
}

waitFor(() => typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined', () => {
  gsap.registerPlugin(ScrollTrigger);
  App.init();
});

/* ════════════════════════════════════════════
   APP
════════════════════════════════════════════ */
const App = {
  init() {
    this.loader();
    this.cursor();
    this.nav();
    this.heroCanvas();
    this.heroAnimate();
    this.scrollReveal();
    this.parallax();
    this.counters();
    this.tabs();
    this.flowConnectors();
    this.ctaCanvas();
    this.serviceHover();
    this.strip();
  },

  /* ── LOADER ──────────────────────────────── */
  loader() {
    const loader = document.getElementById('loader');
    const fill   = document.getElementById('loaderFill');
    if (!loader || !fill) return;

    let progress = 0;
    const increment = () => {
      progress += Math.random() * 18 + 6;
      if (progress > 100) progress = 100;
      fill.style.width = progress + '%';
      if (progress < 100) {
        setTimeout(increment, 80 + Math.random() * 100);
      } else {
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          App.heroAnimate();
        }, 300);
      }
    };

    document.body.style.overflow = 'hidden';
    setTimeout(increment, 200);
  },

  /* ── CUSTOM CURSOR ───────────────────────── */
  cursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    const dot  = cursor.querySelector('.cursor__dot');
    const ring = cursor.querySelector('.cursor__ring');

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      raf = requestAnimationFrame(animRing);
    };
    animRing();

    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

    document.querySelectorAll('a, button, .pillar-item, .bgrid__card, .svc, .q-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  },

  /* ── NAVBAR ──────────────────────────────── */
  nav() {
    const nav    = document.getElementById('nav');
    const burger = document.getElementById('burger');
    const menu   = document.getElementById('mobileMenu');
    if (!nav) return;

    ScrollTrigger.create({
      start: 'top -80',
      onToggle: ({ isActive }) => nav.classList.toggle('scrolled', isActive),
    });

    if (burger && menu) {
      burger.addEventListener('click', () => {
        menu.classList.toggle('open');
        const spans = burger.querySelectorAll('span');
        const open  = menu.classList.contains('open');
        spans[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)'  : '';
        spans[1].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
      });
      menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          menu.classList.remove('open');
          burger.querySelectorAll('span').forEach(s => s.style.transform = '');
        });
      });
    }
  },

  /* ── HERO CANVAS — Particle Field ───────── */
  heroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    const NUM = 90;

    class Particle {
      constructor() { this.reset(true); }
      reset(fresh) {
        this.x  = Math.random() * W;
        this.y  = fresh ? Math.random() * H : H + 10;
        this.r  = Math.random() * 1.2 + 0.3;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.15;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.life  = 0;
        this.maxLife = Math.random() * 300 + 200;
        const palette = ['#C8A96E','#922020','#FDFAF6'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++;
        const t = this.life / this.maxLife;
        this.alpha = t < 0.2 ? t / 0.2 * 0.5 : t > 0.8 ? (1 - t) / 0.2 * 0.5 : 0.5;
        if (this.life > this.maxLife || this.y < -10) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < NUM; i++) particles.push(new Particle());

    // Draw connecting lines between close particles
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = '#C8A96E';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    };
    loop();

    // Mouse interaction
    let mouse = { x: W / 2, y: H / 2 };
    canvas.parentElement.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      particles.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          p.x += dx / dist * 1.5;
          p.y += dy / dist * 1.5;
        }
      });
    });
  },

  /* ── HERO ANIMATIONS ─────────────────────── */
  heroAnimate() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl
      .to('.hero__eyebrow', { opacity: 1, duration: 1, delay: 0.2 })
      .to('#hw1', { opacity: 1, y: 0, skewY: 0, duration: 1.2 }, '-=0.4')
      .to('#hw2', { opacity: 1, y: 0, skewY: 0, duration: 1.2 }, '-=0.9')
      .to('#hw3', { opacity: 1, y: 0, skewY: 0, duration: 1.2 }, '-=0.9')
      .to('#heroSub',     { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to('#heroActions', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to(['.c1','.c2','.c3'], {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.6)'
      }, '-=0.5');
  },

  /* ── SCROLL REVEAL ───────────────────────── */
  scrollReveal() {
    gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Staggered grids
    ['.bgrid__card', '.q-item', '.pillar-item', '.svc'].forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    });

    // Morphcard 3D entrance
    const mc = document.querySelector('.morphcard');
    if (mc) {
      gsap.fromTo(mc,
        { opacity: 0, rotateY: -20, rotateX: 10, scale: 0.9 },
        {
          opacity: 1, rotateY: 0, rotateX: 0, scale: 1,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: mc, start: 'top 85%' }
        }
      );
    }

    // Law card slide from right
    const lc = document.querySelector('.lawcard');
    if (lc) {
      gsap.fromTo(lc,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: lc, start: 'top 85%' }
        }
      );
    }

    // CTA title character by character feel
    const ctaTitle = document.querySelector('.s-cta__title');
    if (ctaTitle) {
      gsap.fromTo(ctaTitle,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: ctaTitle, start: 'top 88%' }
        }
      );
    }

    // Section big word
    const bgWord = document.querySelector('.s-who__bg-word');
    if (bgWord) {
      gsap.fromTo(bgWord,
        { opacity: 0, scale: 1.2 },
        {
          opacity: 1, scale: 1,
          duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: bgWord, start: 'top bottom' }
        }
      );
    }
  },

  /* ── PARALLAX SCRUB ──────────────────────── */
  parallax() {
    // Hero content lifts on scroll
    gsap.to('.hero__content', {
      y: -100, ease: 'none',
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1,
      }
    });

    // Chips drift
    gsap.to('.c1', {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
    gsap.to('.c2', {
      y: -40, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
    });
    gsap.to('.c3', {
      y: -80, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    // BG word parallax
    gsap.to('.s-who__bg-word', {
      y: -80, ease: 'none',
      scrollTrigger: {
        trigger: '.s-who', start: 'top bottom', end: 'bottom top', scrub: 2,
      }
    });

    // Section glows move
    gsap.to('.g1', {
      y: -100, x: 60, ease: 'none',
      scrollTrigger: { trigger: '.s-benefits', start: 'top bottom', end: 'bottom top', scrub: 2 }
    });
    gsap.to('.g2', {
      y: 80, x: -40, ease: 'none',
      scrollTrigger: { trigger: '.s-benefits', start: 'top bottom', end: 'bottom top', scrub: 3 }
    });

    // BG grid drift
    gsap.to('.s-problem__bg-grid', {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: '.s-problem', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });

    // Service orbs rotation
    gsap.utils.toArray('.svc__orb').forEach((el, i) => {
      gsap.to(el, {
        rotate: (i % 2 === 0 ? 20 : -20), ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.svc'), start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });
  },

  /* ── COUNTERS ────────────────────────────── */
  counters() {
    document.querySelectorAll('.counter__num[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';

      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power3.out',
            onUpdate() {
              el.textContent = prefix + Math.round(obj.val).toLocaleString('es-CO') + suffix;
            },
            onComplete() {
              el.textContent = prefix + target.toLocaleString('es-CO') + suffix;
            }
          });
        }
      });
    });
  },

  /* ── TABS ────────────────────────────────── */
  tabs() {
    const tabs  = document.querySelectorAll('.btab');
    const panes = document.querySelectorAll('.btabs__pane');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const pane = document.querySelector(`.btabs__pane[data-pane="${key}"]`);
        if (pane) {
          pane.classList.add('active');
          // Re-animate cards in new pane
          const cards = pane.querySelectorAll('.bgrid__card');
          gsap.fromTo(cards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
          );
        }
      });
    });
  },

  /* ── FLOW CONNECTORS ─────────────────────── */
  flowConnectors() {
    document.querySelectorAll('.flow__connector').forEach((el, i) => {
      gsap.to(el, {
        height: '100%',
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  },

  /* ── CTA CANVAS ──────────────────────────── */
  ctaCanvas() {
    const canvas = document.getElementById('ctaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    const RINGS = 6;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.004;

      for (let i = 0; i < RINGS; i++) {
        const pct   = i / RINGS;
        const r     = (100 + i * 70) + Math.sin(t + i * 0.8) * 20;
        const alpha = 0.03 + pct * 0.02;

        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.5, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,169,110,${alpha})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // Rotating cross
      const cx = W * 0.5, cy = H * 0.5;
      const size = 80;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.5);
      ctx.strokeStyle = 'rgba(200,169,110,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
      ctx.moveTo(0, -size); ctx.lineTo(0, size);
      ctx.stroke();
      ctx.restore();

      requestAnimationFrame(loop);
    };
    loop();
  },

  /* ── SERVICE ITEM 3D HOVER ───────────────── */
  serviceHover() {
    document.querySelectorAll('.svc').forEach(item => {
      item.addEventListener('mousemove', e => {
        const rect = item.getBoundingClientRect();
        const rx = ((e.clientX - rect.left) / rect.width  - 0.5) * 5;
        const ry = ((e.clientY - rect.top)  / rect.height - 0.5) * 5;
        gsap.to(item, {
          rotateX: -ry, rotateY: rx,
          duration: 0.5, ease: 'power1.out',
          transformPerspective: 1000,
        });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power2.out' });
      });
    });

    // Pillar items magnetic
    document.querySelectorAll('.pillar-item').forEach(item => {
      item.addEventListener('mousemove', e => {
        const rect = item.getBoundingClientRect();
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        gsap.to(item, { rotateY: ry, duration: 0.4, ease: 'power1.out', transformPerspective: 600 });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { rotateY: 0, duration: 0.5, ease: 'power2.out' });
      });
    });
  },

  /* ── STRIP ───────────────────────────────── */
  strip() {
    const inner = document.querySelector('.strip__inner');
    if (!inner) return;
    inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  },
};
