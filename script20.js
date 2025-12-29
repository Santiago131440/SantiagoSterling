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
          <img src="https://cdn.pixabay.com/photo/2025/11/10/21/55/sunset-9949027_1280.jpg" alt="${title}" class="w-full h-44 object-cover rounded" />
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
            1) Santiago Sterling
            2) Hola mundo
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
