
(() => {
  "use strict";

  // ==================================================================================
  // FUNCIONES AUXILIARES
  // ==================================================================================
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // ==================================================================================
  // NAVBAR MOBILE
  // ==================================================================================
  (function() {
    const menuToggle = $('#menu-toggle');
    const mobileMenu = $('#mobile-menu');
    const nav = $('.apple-nav');
    
    if (!menuToggle || !mobileMenu) {
      console.error('No se encontraron los elementos del menú');
      return;
    }

    let isOpen = false;

    // Toggle del menú
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      isOpen = !isOpen;
      
      if (isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    function openMenu() {
      // Mostrar menú
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      
      // Aplicar estilos de transición
      mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-10px)';
      
      // Animar entrada
      setTimeout(() => {
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'translateY(0)';
      }, 10);
      
      // Cambiar icono a X
      menuToggle.innerHTML = '×';
      menuToggle.style.fontSize = '28px';
      
      // Agregar backdrop blur
      nav.style.transition = 'all 0.3s ease';
      nav.style.backdropFilter = 'blur(10px)';
      nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }

    function closeMenu() {
      // Animar salida
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      }, 300);
      
      // Cambiar icono a +
      menuToggle.innerHTML = '<i class="fi fi-sr-add"></i>';
      if (menuToggle.querySelector('i')) {
        menuToggle.querySelector('i').style.fontSize = '32px';
      }
      
      // Restaurar backdrop
      nav.style.backdropFilter = '';
      nav.style.backgroundColor = '';
    }

    // Cerrar menú al hacer clic en un enlace móvil
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        closeMenu();
        isOpen = false;
        
        setTimeout(() => {
          if (targetId && targetId !== '#') {
            const targetElement = $(targetId);
            if (targetElement) {
              const navHeight = nav.offsetHeight;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = targetPosition - navHeight - 20;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        }, 350);
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (isOpen && !nav.contains(e.target)) {
        closeMenu();
        isOpen = false;
      }
    });

    // Cerrar menú al redimensionar a desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768 && isOpen) {
          closeMenu();
          isOpen = false;
        }
      }, 250);
    });

    // Feedback táctil para móviles
    menuToggle.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.transition = 'transform 0.1s ease';
    });

    menuToggle.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  })();

  // ==================================================================================
  // ACTUALIZAR AÑO EN FOOTER
  // ==================================================================================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==================================================================================
  // REVEAL ON SCROLL
  // ==================================================================================
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

  // Programmatic reveal para project cards
  $$(".projectCard").forEach((c, idx) => {
    c.style.transitionDelay = `${idx * 60}ms`;
    c.classList.add("reveal");
  });

  // ==================================================================================
  // FORMULARIO DE CONTACTO
  // ==================================================================================
  const contactForm = $("#contactForm");
  const sendBtn = $("#sendBtn");
  const formStatus = $("#formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formStatus.textContent = "";
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());
      
      // Validación básica
      if (!payload.name || !payload.email || !payload.message) {
        formStatus.textContent = "Por favor completa los campos requeridos.";
        formStatus.style.color = "tomato";
        return;
      }

      // Mostrar loader
      const loader = document.createElement("span");
      loader.className = "loader";
      sendBtn.disabled = true;
      sendBtn.appendChild(loader);
      formStatus.textContent = "Enviando mensaje...";
      formStatus.style.color = "#cbd5e1";

      try {
        // Simulación de envío
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
        if (Math.random() < 0.96) resolve(true);
        else reject(new Error("network"));
      }, ms);
    });
  }

  // ==================================================================================
  // DESCARGA DE CV EN TXT
  // ==================================================================================
  const downloadCV = $("#downloadCV");
  const downloadCV2 = $("#downloadCV2");
  
  [downloadCV, downloadCV2].forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const cvText = generateSimpleCV();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([cvText], { type: "text/plain" }));
      link.download = "CV-Santiago-Sterling-2026.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  function generateSimpleCV() {
    return `CV - Santiago Sterling
Rol: Desarrollador de software
Ubicación: Cali, Colombia
Contacto: santisterling@gmail.com

Resumen:
Tecnólogo en Análisis y Desarrollo de Software y en Gestión de Producción Industrial, con más de ocho años de experiencia en plantas de manufactura. Mi perfil combina la eficiencia industrial con la innovación tecnológica, aplicando desarrollo de software, automatización y análisis de datos para optimizar procesos y crear soluciones escalables. Cuento con formación en frontend y backend (HTML, CSS, JavaScript, React, Node.js, Python, Django, entre otros) y en metodologías industriales como Lean Manufacturing, Kaizen y control de inventarios. Me interesa especializarme en inteligencia artificial aplicada a la industria y en el desarrollo de soluciones que integren la Industria 4.0 con tecnologías digitales inteligentes.

Habilidades:
- React, Next.js, Tailwind
- Figma, Prototipado
- Accessibilidad

Proyectos destacados:
- Sterling Music Player
- Red Pericial (Landing Page)
- Restaurante la Kolina
`;
  }

  // ==================================================================================
  // MODAL MAC OS - SISTEMA MEJORADO
  // ==================================================================================
  const macModal = $('#macModal');
  const modalTitle = $('#modalTitle');
  const modalContent = $('#modalContent');
  const modalImage = $('#modalImage');
  const closeModalBtn = $('#closeModalBtn');

  // Función para abrir el modal
  window.openModal = function(title, content, imageSrc = '') {
    if (!macModal) return;
    
    // Configurar contenido
    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.textContent = content;
    
    // Configurar imagen si existe
    if (modalImage) {
      if (imageSrc) {
        modalImage.src = imageSrc;
        modalImage.classList.remove('hidden');
      } else {
        modalImage.classList.add('hidden');
      }
    }
    
    // Mostrar modal
    macModal.classList.remove('hidden');
    macModal.classList.add('flex');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  };

  // Función para cerrar el modal
  window.closeModal = function() {
    if (!macModal) return;
    
    macModal.classList.add('hidden');
    macModal.classList.remove('flex');
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };

  // Cerrar modal al hacer clic en el botón rojo
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Cerrar modal al hacer clic fuera del contenido
  if (macModal) {
    macModal.addEventListener('click', function(e) {
      if (e.target === macModal) {
        closeModal();
      }
    });
  }

  // Cerrar modal con la tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && macModal && !macModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // ==================================================================================
  // FUNCIONES DE VENTANAS AUXILIARES (Apple UI)
  // ==================================================================================
  window.openAppleUI = function() {
    const appleUI = document.getElementById("appleUI");
    if (appleUI) {
      appleUI.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeAppleUI = function() {
    const appleUI = document.getElementById("appleUI");
    if (appleUI) {
      appleUI.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  window.openAppleUI2 = function() {
    const appleUI2 = document.getElementById("appleUI2");
    if (appleUI2) {
      appleUI2.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeAppleUI2 = function() {
    const appleUI2 = document.getElementById("appleUI2");
    if (appleUI2) {
      appleUI2.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  window.openAppleUI3 = function() {
    const appleUI3 = document.getElementById("appleUI3");
    if (appleUI3) {
      appleUI3.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeAppleUI3 = function() {
    const appleUI3 = document.getElementById("appleUI3");
    if (appleUI3) {
      appleUI3.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  window.openAppleUI4 = function() {
    const appleUI4 = document.getElementById("appleUI4");
    if (appleUI4) {
      appleUI4.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeAppleUI4 = function() {
    const appleUI4 = document.getElementById("appleUI4");
    if (appleUI4) {
      appleUI4.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  // ==================================================================================
  // FUNCIÓN DE LANZAMIENTO DE ÓRBITA
  // ==================================================================================
  window.launchOrbit = function() {
    const overlay = document.getElementById("orbit-overlay");
    if (!overlay) return;

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
  };

  // ==================================================================================
  // CARRUSEL DE HABILIDADES
  // ==================================================================================
  (function initCarousel() {
    const carousel = document.getElementById("carousel");
    const cards = document.querySelectorAll(".card");
    const dotsContainer = document.getElementById("dots");

    if (!carousel || !cards.length || !dotsContainer) return;

    let index = 0;
    const total = cards.length;

    // Crear dots
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

    // Loop infinito
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
  })();

  // ==================================================================================
  // VENTANA DRAGGABLE (COMPETENCIAS)
  // ==================================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const windowEl = document.querySelector('.apple-window');
    const headerEl = document.querySelector('.apple-header');
    const overlayEl = document.querySelector('.apple-overlay');

    if (!windowEl || !headerEl) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // Drag & Drop
    headerEl.addEventListener('mousedown', e => {
      isDragging = true;
      offsetX = e.clientX - windowEl.offsetLeft;
      offsetY = e.clientY - windowEl.offsetTop;
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      windowEl.style.left = `${e.clientX - offsetX}px`;
      windowEl.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Botones MacOS
    const redBtn = document.querySelector('.dot.red');
    const yellowBtn = document.querySelector('.dot.yellow');

    if (redBtn && overlayEl) {
      redBtn.onclick = () => {
        windowEl.classList.add('closing');
        setTimeout(() => overlayEl.remove(), 300);
      };
    }

    if (yellowBtn && overlayEl) {
      yellowBtn.onclick = () => {
        windowEl.classList.add('minimizing');
        setTimeout(() => overlayEl.remove(), 350);
      };
    }
  });

  // ==================================================================================
  // VISOR DE IMÁGENES MODAL
  // ==================================================================================
  let images = [];
  let currentImageIndex = 0;

  window.openImageModal = function(imageArray, startIndex = 0) {
    images = imageArray;
    currentImageIndex = startIndex;
    showModalImage();
  };

  function showModalImage() {
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('imageModal');
    if (existingModal) existingModal.remove();

    // Crear nuevo modal
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm';
    
    modal.innerHTML = `
      <div class="relative max-w-7xl w-full h-full flex items-center justify-center p-4">
        <!-- Botón cerrar -->
        <button 
          onclick="closeImageModal()" 
          class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm z-10"
          aria-label="Cerrar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

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

        <!-- Indicadores de navegación -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p class="text-slate-300 text-sm">
            ${currentImageIndex + 1} / ${images.length} | 
            <span class="hidden md:inline">Usa ← → para navegar | </span>
            ESC para cerrar
          </p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic en el fondo
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeImageModal();
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', handleKeyPress);
  }

  window.nextImage = function() {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      showModalImage();
    }
  };

  window.previousImage = function() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      showModalImage();
    }
  };

  window.closeImageModal = function() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.remove();
    document.removeEventListener('keydown', handleKeyPress);
  };

  function handleKeyPress(e) {
    switch(e.key) {
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        previousImage();
        break;
      case 'Escape':
        closeImageModal();
        break;
    }
  }
})();


// ------------------------------- DESARROLLOS E INNOVACIONES ------------------------
  function expandWebPreview(element) {
    const url = element.getAttribute('data-url');

    if (!url) return;

    // Abre en la misma pestaña
    window.location.href = url;

    // Si prefieres abrir en nueva pestaña, usa esta línea en su lugar:
    // window.open(url, '_blank', 'noopener,noreferrer');
  }

