    const SITES = [
      { id: 's1', name: 'Luis Díaz Statics', url: 'https://santiago131440.github.io/SantiagoSterling/Dashboard2.html' },
      { id: 's2', name: 'Red Pericial', url: 'https://santiago131440.github.io/SantiagoSterling/producto.html' },
      { id: 's3', name: 'Music Blog', url: 'https://santiago131440.github.io/SantiagoSterling/Music.html' },
      { id: 's4', name: 'Test', url: 'https://santiago131440.github.io/SantiagoSterling/registro.html' },
      { id: 's5', name: 'Dashboard', url: 'https://santiago131440.github.io/SantiagoSterling/Dashboard3.html' },
      { id: 's6', name: 'Pagina prueba', url: 'https://santiago131440.github.io/SantiagoSterling/Dashboard1.html' },
      { id: 's7', name: 'Restaurante', url: 'https://santiago131440.github.io/SantiagoSterling/Restaurante.html' },
      { id: 's8', name: 'ProyectoApp', url: 'https://github.com/Santiago131440/SantiagoSterling/blob/main/proyectoApp.html' },
    ];

    // Elementos
    const deviceFrame = document.getElementById('deviceFrame');
    const btnMobile = document.getElementById('btnMobile');
    const btnDesktop = document.getElementById('btnDesktop');
    const zoomInput = document.getElementById('zoom');
    const rotLeft = document.getElementById('rotLeft');
    const rotRight = document.getElementById('rotRight');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const openOriginal = document.getElementById('openOriginal');
    const gallery = document.getElementById('gallery');
    const previewFrame = document.getElementById('previewFrame');
    const miniIframe = document.getElementById('miniIframe');

    // Estado
    let currentSite = SITES[0];
    let currentZoom = 1.0;
    let currentRotate = 0; // degrees

    // Inicializar galería y thumbs
    function buildGallery(){
      gallery.innerHTML = '';
      thumbList.innerHTML = '';
      SITES.forEach((s, i) => {
        // thumb in top control bar
        const t = document.createElement('div');
        t.className = 'thumb';
        t.dataset.site = s.id;
        t.title = s.name;
        const img = document.createElement('img');
        // quick preview image using service (if CORS block, falls back to svg)
        img.src = 'https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/Captura%20de%20pantalla%202025-11-26%20172007.jpg?raw=true' + encodeURIComponent(s.url);
        img.alt = s.name;
        img.onerror = () => {
          // fallback to a generated canvas-like placeholder image
          img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/Captura%20de%20pantalla%202025-11-26%20171931.jpg?raw=true' width='400' height='240'><rect width='100%' height='100%' fill='#0b1220'/><text x='50%' y='50%' fill='#fd7a00ff' font-family='Arial' font-size='20' dominant-baseline='middle' text-anchor='middle'>${s.name}</text></svg>`);
        };
        t.appendChild(img);
        t.addEventListener('click', ()=> selectSite(s.id));
        gallery.appendChild(t);

        // small thumb list
        const small = t.cloneNode(true);
        small.addEventListener('click', ()=> selectSite(s.id));
        thumbList.appendChild(small);
      });

      // activar primera
      setActiveThumb(currentSite.id);
    }

    function setActiveThumb(siteId){
      gallery.querySelectorAll('.thumb, #thumbList .thumb').forEach(el=>{
        el.classList.toggle('active', el.dataset.site === siteId);
      });
    }

    function selectSite(siteId){
      const site = SITES.find(x=>x.id === siteId);
      if(!site) return;
      currentSite = site;
      // actualizar iframe src
      // Nota: algunos sitios bloquean embebido con X-Frame-Options -> si ocurre, iframe mostrará bloqueo
      miniIframe.src = site.url;
      setActiveThumb(siteId);
      // actualizar botones
      openOriginal.dataset.url = site.url;
      openAllSites.dataset.url = site.url;
    }

    // Device toggles
    btnMobile.addEventListener('click', ()=>{
      deviceFrame.classList.remove('device-desktop');
      deviceFrame.classList.add('device-mobile');
      btnMobile.setAttribute('aria-pressed','true');
      btnDesktop.setAttribute('aria-pressed','false');
    });
    btnDesktop.addEventListener('click', ()=>{
      deviceFrame.classList.remove('device-mobile');
      deviceFrame.classList.add('device-desktop');
      btnDesktop.setAttribute('aria-pressed','true');
      btnMobile.setAttribute('aria-pressed','false');
    });

    // Zoom control: map 50-150 to scale 0.5-1.5
    zoomInput.addEventListener('input', (e)=>{
      const v = Number(e.target.value);
      currentZoom = v / 100;
      applyTransform();
    });

    // Rotation
    rotLeft.addEventListener('click', ()=>{ currentRotate = (currentRotate - 90) % 360; applyTransform(); });
    rotRight.addEventListener('click', ()=>{ currentRotate = (currentRotate + 90) % 360; applyTransform(); });

    function applyTransform(){
      // Use CSS transform: scale + rotate
      previewFrame.style.transform = `scale(${currentZoom}) rotate(${currentRotate}deg)`;
      // For mobile small devices we keep transform-origin center
      previewFrame.style.transformOrigin = 'center center';
    }

    // Fullscreen with animated transition
    fullscreenBtn.addEventListener('click', async ()=>{
      const container = deviceFrame;
      // animate scale up (CSS handles smoothness)
      container.classList.add('will-fullscreen');
      const enterFs = async () => {
        try {
          if (container.requestFullscreen) await container.requestFullscreen();
          else if (container.webkitRequestFullscreen) await container.webkitRequestFullscreen();
          // add a class for style (some user agents change styles in FS)
          container.classList.add('is-fullscreen');
        } catch(err){
          // Fallback: emulate a centered overlay by adding class and high z-index
          container.classList.add('is-fullscreen');
        }
      };
      // little stagger for visual effect
      container.style.transition = 'all 340ms cubic-bezier(.22,.9,.3,1)';
      setTimeout(enterFs, 80);
    });

    // Exit fullscreen cleanup
    document.addEventListener('fullscreenchange', ()=>{
      const container = deviceFrame;
      if (!document.fullscreenElement) {
        // exited
        container.classList.remove('is-fullscreen');
      } else {
        container.classList.add('is-fullscreen');
      }
    });

    // Open original in new tab
    openOriginal.addEventListener('click', ()=>{
      const url = currentSite?.url || miniIframe.src;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    // Keyboard accessibility: +/- zoom, r to rotate right, l rotate left, f fullscreen
    document.addEventListener('keydown', (e)=>{
      if (e.key === '+' || e.key === '=') { zoomInput.value = Math.min(150, Number(zoomInput.value) + 10); zoomInput.dispatchEvent(new Event('input')); }
      if (e.key === '-') { zoomInput.value = Math.max(50, Number(zoomInput.value) - 10); zoomInput.dispatchEvent(new Event('input')); }
      if (e.key.toLowerCase() === 'r') { rotRight.click(); }
      if (e.key.toLowerCase() === 'l') { rotLeft.click(); }
      if (e.key.toLowerCase() === 'f') { fullscreenBtn.click(); }
    });

    // init
    buildGallery();
    selectSite(currentSite.id);
    applyTransform();

    // Touch: double tap to open original (mobile convenience)
    let lastTap = 0;
    previewFrame.addEventListener('touchend', (e)=>{
      const now = Date.now();
      if(now - lastTap < 300){
        // double tap
        openOriginal.click();
      }
      lastTap = now;
    });


    //---------------------Código de NavBar-----------------//
        const buttons = document.querySelectorAll('.filter-menu button');
    const indicator = document.querySelector('.indicator');

    function updateIndicator(el) {
      indicator.style.width = el.offsetWidth + 'px';
      indicator.style.left = el.offsetLeft + 'px';
    }

    // Inicializamos indicador en el primer botón activo
    const activeButton = document.querySelector('.filter-menu button.active');
    updateIndicator(activeButton);

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateIndicator(button);
      });
    });

    window.addEventListener('resize', () => {
      const current = document.querySelector('.filter-menu button.active');
      updateIndicator(current);
    });

    // Note about CORS / X-Frame-Options:
    // - algunos sitios (ej: google, muchas apps) bloquean ser embebidos en iframe.
    // - si ves un mensaje de bloqueo, considera usar una URL clonada o una captura/preview generada del sitio.

