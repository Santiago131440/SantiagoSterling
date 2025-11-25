/* script.js - lógica interactiva y animaciones
   Funcionalidades:
   - Menú móvil
   - Reveal on scroll (IntersectionObserver)
   - Filtro de proyectos
   - Modal de proyecto con contenido dinámico
   - Simulación de envío de formulario (loader + validación)
   - Descarga de CV (simulado)
   - Pequeña animación canvas para hero (fallback)
*/

(() => {
  "use strict";

  // Simple helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Year update
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile menu */
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("block");
    });
  }

  /* Reveal on scroll */
  const reveals = $$(".reveal, section, .projectCard, .card-3d, .testimonial");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  /* Fancy programmatic reveal for project cards */
  $$(".projectCard").forEach((c, idx) => {
    c.style.transitionDelay = `${idx * 60}ms`;
    c.classList.add("reveal");
  });

  /* Project filter */
  const filterBtns = $$(".filterBtn");
  const projectsGrid = $("#projectsGrid");
  if (filterBtns.length && projectsGrid) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        $$(".filterBtn").forEach(b => b.classList.remove("bg-gold", "text-black"));
        btn.classList.add("bg-gold", "text-black");

        $$(".projectCard").forEach(card => {
          const cat = card.dataset.category || "all";
          if (filter === "all" || filter === cat) {
            card.style.display = "block";
            setTimeout(() => { card.classList.remove("hidden"); }, 20);
          } else {
            card.style.display = "none";
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  /* Project modal (dynamic content) */
  const modal = $("#projectModal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");
  $$(".viewProject").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const title = btn.dataset.title || "Proyecto";
      openProjectModal(title);
    });
  });

  $("#closeModal")?.addEventListener("click", closeProjectModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeProjectModal(); });

  function openProjectModal(title) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = generateProjectContent(title);
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
    // attach reveal observer for inside content
    $$(".reveal").forEach(x => x.classList.remove("visible"));
    setTimeout(() => { $$(".reveal").forEach(x => x.classList.add("visible")); }, 50);
  }
  function closeProjectModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");
  }

  function generateProjectContent(title) {
    // dynamic rich content (example)
    const content = `
      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <img src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" alt="${title}" class="w-full h-44 object-cover rounded" />
        </div>
        <div>
          <h4 class="font-semibold">${title}</h4>
          <p class="text-slate-300 mt-2">Resumen ejecutivo: Descripción breve del proyecto, objetivos y rol desempeñado.</p>
          <div class="mt-3">
            <h5 class="text-sm font-medium">Impacto</h5>
            <ul class="list-disc list-inside text-slate-200 mt-2">
              <li>Aumento de conversión</li>
              <li>Optimización de flujo</li>
              <li>Mejoras de accesibilidad</li>
            </ul>
          </div>
          <div class="mt-3">
            <h5 class="text-sm font-medium">Tecnologías</h5>
            <div class="flex gap-2 mt-2">
              <span class="px-2 py-1 rounded bg-white/5">React</span>
              <span class="px-2 py-1 rounded bg-white/5">Tailwind</span>
              <span class="px-2 py-1 rounded bg-white/5">Figma</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 reveal">
        <details class="bg-white/5 p-3 rounded">
          <summary class="font-medium">Ver procedimiento detallado</summary>
          <div class="mt-3 code-style">
            // pasos (ejemplo)
            1) Investigación → entrevistas y métricas
            2) Diseño → wireframes y prototipos
            3) Desarrollo → componentes reutilizables
            4) Validación → tests con usuarios
          </div>
        </details>
      </div>
    `;
    return content;
  }

  /* CONTACT FORM interaction (simulate backend / EmailJS integration) */
  const contactForm = $("#contactForm");
  const sendBtn = $("#sendBtn");
  const formStatus = $("#formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formStatus.textContent = "";
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());
      // basic validation
      if (!payload.name || !payload.email || !payload.message) {
        formStatus.textContent = "Por favor completa los campos requeridos.";
        formStatus.style.color = "tomato";
        return;
      }

      // show loader
      const loader = document.createElement("span");
      loader.className = "loader";
      sendBtn.disabled = true;
      sendBtn.appendChild(loader);
      formStatus.textContent = "Enviando mensaje...";
      formStatus.style.color = "#cbd5e1";

      try {
        // Simulación de envío (aquí conectarías EmailJS o API)
        await fakeNetworkRequest(1100 + Math.random() * 1200);
        formStatus.textContent = "Mensaje enviado. Responderé en 24-48 horas.";
        formStatus.style.color = "limegreen";
        contactForm.reset();
      } catch (err) {
        console.error(err);
        formStatus.textContent = "Error al enviar. Intenta de nuevo más tarde.";
        formStatus.style.color = "tomato";
      } finally {
        sendBtn.disabled = false;
        loader.remove();
      }
    });
  }

  function fakeNetworkRequest(ms = 1000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // simulate occasional failures
        if (Math.random() < 0.96) resolve(true);
        else reject(new Error("network"));
      }, ms);
    });
  }

  /* Download CV (simulate) */
  const downloadCV = $("#downloadCV");
  const downloadCV2 = $("#downloadCV2");
  [downloadCV, downloadCV2].forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // generate a simple text CV and download
      const cvText = generateSimpleCV();
      const blob = new Blob([cvText], { type: "application/pdf" });
      // Fallback to text file to avoid PDF generation complexity
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([cvText], { type: "text/plain" }));
      link.download = "CV-[Tu-Nombre].txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  function generateSimpleCV() {
    return `CV - [Tu Nombre]\nRol: Frontend Engineer / UX Designer\nUbicación: Cali, Colombia\nContacto: hola@[tudominio].com\n\nResumen:\nDesarrollador enfocado en UX...\n\nHabilidades:\n- React, Next.js, Tailwind\n- Figma, Prototipado\n- Accessibilidad\n\nProyectos destacados:\n- Dashboard Agro\n- Reproductor Musical\n- Landing Legal\n`;
  }

  /* Small canvas animation in hero (if needed) */
  function initMiniCanvas() {
    // create a small floating canvas background if canvas available
    const hero = $("#hero");
    if (!hero) return;
    const canvas = document.createElement("canvas");
    canvas.width = 300; canvas.height = 160;
    canvas.style.position = "absolute";
    canvas.style.right = "2rem";
    canvas.style.top = "2rem";
    canvas.style.opacity = "0.07";
    hero.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let t = 0;

    function loop() {
      t += 0.01;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<5;i++){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,223,132,${0.08 + 0.02*Math.sin(t+i)})`;
        ctx.lineWidth = 2;
        const y = 80 + Math.sin(t*2 + i) * 28;
        ctx.moveTo(0, y); ctx.bezierCurveTo(70, y-30, 230, y+30, 300, y);
        ctx.stroke();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }
  // init canvas after small delay to avoid layout blocking
  setTimeout(initMiniCanvas, 600);

  /* Keyboard accessibility for project cards: Enter opens modal */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
  $$(".projectCard").forEach((c) => {
    c.setAttribute("tabindex", "0");
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const title = c.querySelector("h3")?.textContent || "Proyecto";
        openProjectModal(title);
      }
    });
  });

  /* Small analytics-like logger for recruiter impression (local) */
  try {
    const impressKey = "visited_portfolio";
    if (!localStorage.getItem(impressKey)) {
      localStorage.setItem(impressKey, JSON.stringify({ ts: Date.now() }));
      console.info("First visit - welcome recruiter!");
    }
  } catch (err) { /* ignore */ }

  /* Initialize default filter 'all' */
  (function initDefaultFilter() {
    const defaultBtn = document.querySelector(".filterBtn[data-filter='all']");
    defaultBtn?.click();
  })();

  // Expose small API for tests
  window._portfolio = {
    openProjectModal,
    closeProjectModal,
    generateSimpleCV,
  };

})();
