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
          <img src="https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/fc1e5970-f268-455b-8649-b1468a2109c5.png?raw=true" alt="${title}" class="w-full h-44 object-cover rounded text-white" />
        </div>
        <div>
          <h4 class="font-semibold">${title}</h4>
          <p class="text-slate-300 mt-2">Resumen ejecutivo: Descripción breve del proyecto, objetivos y rol desempeñado.</p>
          <div class="mt-3">
            <h5 class="text-sm font-medium">Impacto:</h5>
            <ul class="list-disc list-inside text-slate-200 mt-2">
              <li>Aumento de conversión</li>
              <li>Optimización de flujo</li>
              <li>Mejoras de accesibilidad</li>
            </ul>
          </div>
          <div class="mt-3">
            <h5 class="text-sm font-medium">Tecnologías</h5>
            <div class="flex gap-2 mt-2">
              <span class="px-6 py-0 rounded rounded-full bg-white/5">React</span>
              <span class="px-6 py-0 rounded rounded-full bg-white/5">Tailwind</span>
              <span class="px-6 py-0 rounded rounded-full bg-white/5">Figma</span>
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
      link.download = "CV-Santiago Sterling.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  function generateSimpleCV() {
    return `CV - Santiago Sterling\nRol: Desarrollador de software\nUbicación: Cali, Colombia\nContacto: santisterling@gmail.com\n\nResumen:\nTecnólogo en Análisis y Desarrollo de Software y en Gestión de Producción Industrial, con más de ocho años de experiencia en plantas de manufactura. Mi perfil combina la eficiencia industrial con la innovación tecnológica, aplicando desarrollo de software, automatización y análisis de datos para optimizar procesos y crear soluciones escalables. Cuento con formación en frontend y backend (HTML, CSS, JavaScript, React, Node.js, Python, Django, entre otros) y en metodologías industriales como Lean Manufacturing, Kaizen y control de inventarios. Me interesa especializarme en inteligencia artificial aplicada a la industria y en el desarrollo de soluciones que integren la Industria 4.0 con tecnologías digitales inteligentes.\n\nHabilidades:\n- React, Next.js, Tailwind\n- Figma, Prototipado\n- Accessibilidad\n\nProyectos destacados:\n- Dashboards\n- Reproductor Musical\n- Test de preguntas\n`;
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

const text = "Transformo problemas en software funcional.";
const typingElement = document.getElementById("typingText");
let index = 0;
let isDeleting = false;

function typeEffect() {
  if (!isDeleting && index < text.length) {
    typingElement.textContent += text.charAt(index);
    index++;
    setTimeout(typeEffect, 100);
  } 
  else if (isDeleting && index > 0) {
    typingElement.textContent = text.substring(0, index - 1);
    index--;
    setTimeout(typeEffect, 60);
  } 
  else {
    isDeleting = !isDeleting;
    setTimeout(typeEffect, 1500);
  }
}

// Espera unos segundos antes de iniciar
setTimeout(typeEffect, 2000);


  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card-item");

  // Activar por defecto "Todos"
  document.querySelector('.filter-btn[data-category="all"]')
          .classList.add("active");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      // Cambiar estado visual del botón
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;

      cards.forEach(card => {
        // Ocultar con transición
        card.classList.add("card-hide");

        setTimeout(() => {
          if (category === "all" || card.dataset.category === category) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }

          // Mostrar con animación suave
          setTimeout(() => {
            if (card.style.display === "block") {
              card.classList.remove("card-hide");
            }
          }, 20);

        }, 300);
      });

    });
  });

//CODIGO PARA EL CARRUSEL DE IMAGENES//
  function openModalImagenes(src) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
    modal.onclick = () => modal.remove();
    
    const img = document.createElement('img');
    img.src = src;
    img.className = 'max-w-full max-h-full rounded-lg';
    
    modal.appendChild(img);
    document.body.appendChild(modal);
  }

//TECLAS DE NAVEGACIÓN Y TITULOS DE IMAGENES
  let currentImageIndex = 0;
  let images = [];

  function openModal(src) {
    // Obtener todas las imágenes del carrusel
    images = Array.from(document.querySelectorAll('.carousel img')).map(img => ({
      src: img.src,
      alt: img.alt
    }));
    
    // Encontrar el índice de la imagen clickeada
    currentImageIndex = images.findIndex(img => img.src === src);
    
    showModalImage();
  }

  function showModalImage() {
    // Eliminar modal anterior si existe
    const existingModal = document.getElementById('imageModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4';
    
    modal.innerHTML = `
      <div class="relative max-w-6xl w-full h-full flex flex-col items-center justify-center">
        <!-- Botón cerrar -->
        <button 
          onclick="closeModal()" 
          class="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-10 bg-black/50 rounded-full p-2 backdrop-blur-sm"
          aria-label="Cerrar"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Título -->
        <div class="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
          <h3 class="text-white font-semibold text-lg">${images[currentImageIndex].alt}</h3>
          <p class="text-slate-300 text-sm">${currentImageIndex + 1} / ${images.length}</p>
        </div>

        <!-- Botón anterior -->
        <button 
          onclick="previousImage()" 
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
          ${currentImageIndex === 0 ? 'disabled' : ''}
          aria-label="Imagen anterior"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Imagen -->
        <img 
          src="${images[currentImageIndex].src}" 
          alt="${images[currentImageIndex].alt}"
          class="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain"
        >

        <!-- Botón siguiente -->
        <button 
          onclick="nextImage()" 
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm ${currentImageIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}"
          ${currentImageIndex === images.length - 1 ? 'disabled' : ''}
          aria-label="Imagen siguiente"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Indicadores de navegación con teclado -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p class="text-slate-300 text-sm">Si estás en PC usa ← → para navegar | ESC para cerrar</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic en el fondo
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', handleKeyPress);
  }

  function nextImage() {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      showModalImage();
    }
  }

  function previousImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      showModalImage();
    }
  }

  function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.remove();
    document.removeEventListener('keydown', handleKeyPress);
  }

  function handleKeyPress(e) {
    switch(e.key) {
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        previousImage();
        break;
      case 'Escape':
        closeModal();
        break;
    }
  }


/* FUNCIÓN DE ESTUDIOS REALIZADOS - CURSOS REALIZADOS */
function openModal(title, content) {
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalContent').innerText = content;
  document.getElementById('macModal').style.display = 'flex';

  // Cerrar modal al hacer click fuera del contenido
  document.getElementById('macModal').onclick = function (e) {
    if (e.target === this) {
      closeModal();
    }
  };
}

/*FUNCIÓN DE NAVE ESPACIAL EN ORBITA, EN LA PARTA DE VISION ACADEMICA */


function launchOrbit() {
  const overlay = document.getElementById("orbit-overlay");

  overlay.classList.add("active");

  // Reiniciar animaciones
  overlay.innerHTML = overlay.innerHTML;

  // Desvanecer automáticamente
  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 4000);

  // Limpiar estado
  setTimeout(() => {
    overlay.classList.remove("active", "fade-out");
  }, 5000);
}


/* FUNCIÓN CARRUSEL DE HABILIDADES - ESTILO APPLE TV */

const carousel = document.getElementById("carousel");
const cards = document.querySelectorAll(".card");
const dotsContainer = document.getElementById("dots");

let index = 0;
const total = cards.length;

/* create dots */
cards.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.onclick = () => moveTo(i);
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateDots() {
  dots.forEach(d => d.classList.remove("active"));
  dots[index % total].classList.add("active");
}

function moveTo(i) {
  index = i;
  const offset = cards[0].offsetWidth + 24;
  carousel.style.transform = `translateX(${-offset * index}px)`;
  updateDots();
}

/* infinite loop */
setInterval(() => {
  index++;
  carousel.style.transition = "transform 0.9s cubic-bezier(.22,.61,.36,1)";
  moveTo(index);

  if (index === total) {
    setTimeout(() => {
      carousel.style.transition = "none";
      index = 0;
      moveTo(index);
    }, 900);
  }
}, 6000);

updateDots();
