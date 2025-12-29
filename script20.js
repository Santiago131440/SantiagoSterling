/*Ventana de experiencia laboral */
/* ===============================
   MODAL ESTILO macOS - PROJECTS
================================ */

const projectData = {
  project1: {
    title: "Cosmoagro S.A.",
    role: "Analista de Producción",
    cover: "https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/cosmoagro_cover.jpg?raw=true",
    logo: "https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/cosmoagro_logo.jpg?raw=true",
    description: `
      Optimización de procesos productivos mediante análisis de indicadores,
      control de calidad y mejora continua en planta industrial.
    `,
    responsibilities: [
      "Análisis de KPIs de producción",
      "Optimización de flujos operativos",
      "Control de inventarios",
      "Automatización de reportes",
      "Mejoras Lean Manufacturing"
    ],
    tech: ["Excel Avanzado", "Power BI", "Python", "Lean", "Indicadores KPI"],
    impact: [
      "Reducción de reprocesos",
      "Mejora en eficiencia operativa",
      "Mayor visibilidad de datos",
      "Optimización de tiempos"
    ]
  }
};

/* Abrir modal */
document.querySelectorAll(".viewProject").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.projectId || "project1";
    openMacModal(projectData[id]);
  });
});

/* Crear modal */
function openMacModal(data) {
  if (!data) return;

  // Eliminar modal previo
  const old = document.getElementById("macProjectModal");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "macProjectModal";
  modal.className = `
    fixed inset-0 z-50 flex items-center justify-center
    bg-black/50 backdrop-blur-sm
    opacity-0 transition-opacity duration-300
  `;

  modal.innerHTML = `
    <div
      class="
        relative w-[95%] max-w-5xl max-h-[90vh]
        bg-gradient-to-br from-stone-100 to-stone-200
        rounded-2xl shadow-2xl
        scale-90 opacity-0
        transition-all duration-300 ease-out
        flex flex-col
      "
      id="macWindow"
    >
      <!-- Barra superior macOS -->
      <div class="flex items-center px-4 py-2 bg-stone-200 rounded-t-2xl border-b border-black/10">
        <div class="flex gap-2">
          <button id="closeMacModal" class="w-3 h-3 bg-red-500 rounded-full"></button>
          <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span class="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <h3 class="mx-auto font-semibold text-slate-700 text-sm">
          ${data.title}
        </h3>
      </div>

      <!-- Contenido -->
      <div class="overflow-y-auto p-6 space-y-6">
        <!-- Imagen principal -->
        <div class="relative">
          <img src="${data.cover}" class="w-full h-64 object-cover rounded-xl shadow-md">
          <img src="${data.logo}"
               class="w-24 h-24 rounded-full border-4 border-white shadow-xl
                      absolute -bottom-8 left-6 bg-white">
        </div>

        <!-- Info -->
        <div class="mt-10">
          <h4 class="text-xl font-bold text-emerald-600">${data.role}</h4>
          <p class="text-slate-700 mt-2 leading-relaxed">
            ${data.description}
          </p>
        </div>

        <!-- Grid -->
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h5 class="font-semibold text-slate-800 mb-2">Responsabilidades</h5>
            <ul class="list-disc list-inside text-slate-700 space-y-1">
              ${data.responsibilities.map(i => `<li>${i}</li>`).join("")}
            </ul>
          </div>

          <div>
            <h5 class="font-semibold text-slate-800 mb-2">Impacto</h5>
            <ul class="list-disc list-inside text-slate-700 space-y-1">
              ${data.impact.map(i => `<li>${i}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Tech -->
        <div>
          <h5 class="font-semibold text-slate-800 mb-2">Tecnologías</h5>
          <div class="flex flex-wrap gap-2">
            ${data.tech.map(t => `
              <span class="px-3 py-1 rounded-full bg-white shadow text-sm text-slate-700">
                ${t}
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animación entrada
  requestAnimationFrame(() => {
    modal.classList.remove("opacity-0");
    modal.querySelector("#macWindow").classList.remove("scale-90", "opacity-0");
  });

  // Cerrar
  modal.addEventListener("click", e => {
    if (e.target === modal) closeMacModal();
  });

  document.getElementById("closeMacModal").addEventListener("click", closeMacModal);
  document.addEventListener("keydown", escClose);
}

/* Cerrar modal */
function closeMacModal() {
  const modal = document.getElementById("macProjectModal");
  if (!modal) return;

  const win = modal.querySelector("#macWindow");
  win.classList.add("scale-90", "opacity-0");
  modal.classList.add("opacity-0");

  setTimeout(() => modal.remove(), 300);
  document.removeEventListener("keydown", escClose);
}

function escClose(e) {
  if (e.key === "Escape") closeMacModal();
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
  function openModal(src) {
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

  // CÓDIGO DE HABILIDADES

  // Obtener todos los botones de pestañas y contenidos
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Función para mostrar una pestaña específica
function showTab(targetId) {
  // Ocultar todos los contenidos
  tabContents.forEach(content => {
    content.classList.add('hidden');
  });
  
  // Remover estado activo de todos los botones
  tabButtons.forEach(btn => {
    btn.classList.remove;
    btn.classList.add;
  });
  
  // Mostrar el contenido seleccionado
  const targetContent = document.getElementById(targetId);
  if (targetContent) {
    targetContent.classList.remove('hidden');
  }
  
  // Activar el botón seleccionado
  const activeButton = document.querySelector(`[data-target="${targetId}"]`);
  if (activeButton) {
    activeButton.classList.remove;
    activeButton.classList.add;
  }
}

// Agregar event listeners a los botones
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-target');
    showTab(target);
  });
});

// Mostrar la primera pestaña por defecto al cargar
if (tabButtons.length > 0) {
  const firstTarget = tabButtons[0].getAttribute('data-target');
  showTab(firstTarget);
}


//CODIGO SOBRE HABILIDADES

  const tabs = document.querySelectorAll(".tab-btn");
  const titleBar = document.getElementById("mac-window-title");

  const titles = {
    lenguajes: "Lenguajes de Programación",
    frameworks: "Frameworks y Desarrollo",
    complementarias: "Habilidades Complementarias",
    soft: "Habilidades Sociales"
  };

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");

      // Cambiar el título dinámicamente
      titleBar.textContent = titles[target] || "Skills & Tech Stack";
    });
  });


// CODGIDO SOBRE APPS DE ICONOS EN HABILIDADES

document.querySelectorAll(".app-mac").forEach(app => {
  app.addEventListener("click", () => {
    const target = app.dataset.app;
    document.querySelector("#modal-" + target).classList.remove("hidden");
  });
});

/* Cerrar clic fuera */
document.addEventListener("click", (e) => {
  document.querySelectorAll(".modal-mac").forEach(modal => {
    if (!modal.contains(e.target) && !e.target.closest(".app-mac")) {
      modal.classList.add("hidden");
    }
  });
});


  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

  const videos = document.querySelectorAll('.hero-video');
  let current = 0;

  setInterval(() => {
    videos[current].classList.replace('opacity-100','opacity-0');
    current = (current + 1) % videos.length;
    videos[current].classList.replace('opacity-0','opacity-100');
  }, 8000);





