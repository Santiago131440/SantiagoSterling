
  <script>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  const ctx = document.getElementById('miniChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Santiago Sterling - 2020', 'Santiago Sterling - 2021', 'Santiago Sterling - 2022', 'Santiago Sterling - 2023', 'Santiago Sterling - 2024', 'Santiago Sterling - 2025'],
      datasets: [{
        label: 'Curva de aprendizaje',
        data: [10, 15, 8, 20, 18, 25],
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.2)',
        tension: 0.5,
        fill: true
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
</script>

<script>
  function openModal(src) {
    document.getElementById("modalImage").src = src;
    document.getElementById("imageModal").classList.remove("hidden");
  }
  function closeModal() {
    document.getElementById("imageModal").classList.add("hidden");
  }
</script>




    <script>
        // Inicialización cuando la página carga
        document.addEventListener('DOMContentLoaded', function() {
            initializeTimeline();
        });

        // Función para inicializar el timeline con animaciones secuenciales
        function initializeTimeline() {
            const jobCards = document.querySelectorAll('.job-card');
            
            jobCards.forEach((card, index) => {
                const delay = parseInt(card.dataset.delay) || (index * 200);
                
                setTimeout(() => {
                    card.classList.add('visible');
                }, delay);
            });
        }

        // Función para expandir/contraer tarjetas de trabajo
        function toggleJobCard(element) {
            // Encontrar la tarjeta padre
            const jobCard = element.closest('article');
            const card = jobCard.querySelector('.liquid-card');
            
            // Toggle de la clase expanded
            card.classList.toggle('card-expanded');
            
            // Efecto en el punto del timeline
            const timelineDot = jobCard.querySelector('.timeline-dot');
            if (card.classList.contains('card-expanded')) {
                timelineDot.style.transform = 'scale(1.3)';
                timelineDot.style.boxShadow = '0 0 25px rgba(251, 146, 60, 0.8)';
            } else {
                timelineDot.style.transform = 'scale(1)';
                timelineDot.style.boxShadow = 'none';
            }
        }

        // Efectos interactivos para iconos flotantes
        document.querySelectorAll('.floating-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Efecto de explosión temporal
                this.style.transform = 'scale(1.8) rotate(360deg)';
                this.style.filter = 'drop-shadow(0 0 30px rgba(251, 146, 60, 1))';
                
                // Resetear después de la animación
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.filter = '';
                }, 800);
            });
        });

        // Efecto de paralaje sutil en el mouse
        document.addEventListener('mousemove', function(e) {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            
            document.querySelectorAll('.floating-icon').forEach((icon, index) => {
                const multiplier = (index + 1) * 0.5;
                const translateX = mouseX * 20 * multiplier;
                const translateY = mouseY * 20 * multiplier;
                
                icon.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        });

        // Auto-expansión al scroll (Intersection Observer)
        const observerOptions = {
            threshold: 0.6,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target.querySelector('.liquid-card');
                    setTimeout(() => {
                        if (!card.classList.contains('card-expanded')) {
                            toggleJobCard(entry.target.querySelector('.timeline-dot'));
                        }
                    }, 800);
                }
            });
        }, observerOptions);

        // Observar todas las tarjetas de trabajo
        document.querySelectorAll('.job-card').forEach(card => {
            observer.observe(card);
        });
    </script>

    <script>
  // Guardamos todas las imágenes y asociamos el título del proyecto
  const allImages = [];
  document.querySelectorAll("#projects article").forEach(article => {
    const projectTitle = article.querySelector("h4").innerText; // título del proyecto
    article.querySelectorAll(".carousel img").forEach(img => {
      allImages.push({
        src: img.src,
        title: projectTitle
      });
      // Redefinimos el onclick para que sepa el título
      img.setAttribute("onclick", `openModal('${img.src}')`);
    });
  });

  let currentIndex = 0;

  // Abrir modal
  function openModal(src) {
    currentIndex = allImages.findIndex(item => item.src === src);
    const modal = document.getElementById("imageModal");
    document.getElementById("modalImage").src = allImages[currentIndex].src;
    document.getElementById("modalTitle").innerText = allImages[currentIndex].title;
    modal.classList.remove("hidden");
  }

  // Cerrar modal
  function closeModal() {
    document.getElementById("imageModal").classList.add("hidden");
  }

  // Imagen anterior
  function prevImage() {
    currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    document.getElementById("modalImage").src = allImages[currentIndex].src;
    document.getElementById("modalTitle").innerText = allImages[currentIndex].title;
  }

  // Imagen siguiente
  function nextImage() {
    currentIndex = (currentIndex + 1) % allImages.length;
    document.getElementById("modalImage").src = allImages[currentIndex].src;
    document.getElementById("modalTitle").innerText = allImages[currentIndex].title;
  }

  // Navegación con teclado
  document.addEventListener("keydown", function(e) {
    if (!document.getElementById("imageModal").classList.contains("hidden")) {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeModal();
    }
  });
</script>

<script>
  const toggleBtn = document.getElementById("toggleCursos");
  const extraCursos = document.getElementById("cursos-extra");

  toggleBtn.addEventListener("click", () => {
    if (extraCursos.classList.contains("hidden")) {
      extraCursos.classList.remove("hidden");
      toggleBtn.textContent = "Ocultar";
    } else {
      extraCursos.classList.add("hidden");
      toggleBtn.textContent = "Ver más";
      document.getElementById("cursos").scrollIntoView({ behavior: "smooth" });
    }
  });
</script>


<!-- JS PARA CAMBIO DE TABS -->
<script>
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      contents.forEach(c => c.classList.add('hidden'));
      buttons.forEach(b => b.classList.remove('bg-orange-500', 'text-white'));

      document.getElementById(target).classList.remove('hidden');
      btn.classList.add('bg-orange-500', 'text-white');
    });
  });

  if (buttons.length > 0) {
    buttons[0].click();
  }
</script>

<!-- Estilos extra para móviles -->
<style>
  .animate-fade {
    animation: fadeIn 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  /* Ocultar scroll bar en móviles */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>

<script>
    function mostrarModal() {
      const overlay = document.getElementById('modalOverlay');
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Evita desplazamiento del fondo
    }

    function cerrarModal() {
      const overlay = document.getElementById('modalOverlay');
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restaura desplazamiento
    }

    // Cerrar al hacer clic fuera del cuadro
    window.onclick = function(event) {
      const overlay = document.getElementById('modalOverlay');
      const modal = document.getElementById('modalBox');
      if (event.target === overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };

    // Asegura que el modal siempre quede centrado si se redimensiona la ventana
    window.addEventListener('resize', function() {
      const overlay = document.getElementById('modalOverlay');
      if (overlay.style.display === 'flex') {
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
      }
    });
  </script>