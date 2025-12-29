(() => {
  "use strict";

  // =========================
  // Simple helpers
  // =========================
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // =========================
  // Year update
  // =========================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================
  // Mobile menu
  // =========================
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

  // =========================
  // Reveal on scroll
  // =========================
  const reveals = $$(
    ".reveal, section, .projectCard, .card-3d, .testimonial"
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach(el => observer.observe(el));

  // =========================
  // Fancy programmatic reveal
  // =========================
  $$(".projectCard").forEach((c, idx) => {
    c.style.transitionDelay = `${idx * 60}ms`;
    c.classList.add("reveal");
  });

  // =========================
  // Project modal
  // =========================
  const modal = $("#projectModal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");

  $$(".viewProject").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title || "Proyecto";
      openProjectModal(title);
    });
  });

  $("#closeModal")?.addEventListener("click", closeProjectModal);

  modal?.addEventListener("click", e => {
    if (e.target === modal) closeProjectModal();
  });

  function openProjectModal(title) {
    if (!modal) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = generateProjectContent(title);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");

    $$(".reveal").forEach(x => x.classList.remove("visible"));
    setTimeout(() => {
      $$(".reveal").forEach(x => x.classList.add("visible"));
    }, 50);
  }

  function closeProjectModal() {
    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");
  }

  function generateProjectContent(title) {
    const content = `
      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <img
            src="https://cdn.pixabay.com/photo/2025/11/10/21/55/sunset-9949027_1280.jpg"
            alt="${title}"
            class=
