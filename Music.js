  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressBarFill');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const volumeEl = document.getElementById('volume');
  const playlistEl = document.getElementById('playlist');
  const nowTitle = document.getElementById('nowTitle');
  const nowArtist = document.getElementById('nowArtist');
  const nowIndex = document.getElementById('nowIndex');
  const cover = document.getElementById('cover');

  let youtubePlayer;
  let isYouTube = false;

  // playlist inicial
  let tracks = [
    { title:'SoundHelix Song 1', artist:'SoundHelix', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', type:'mp3' },
    { title:'SoundHelix Song 2', artist:'SoundHelix', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', type:'mp3' },
    { title:'Lalala', artist:'Y2K, bbno$', src:'https://www.youtube.com/watch?v=N2Y2vQ-1m7M&list=RDN2Y2vQ-1m7M&start_radio=1', type:'youtube' },
    { title:'Music Sessions #0/66', artist:'Daddy Yankee & BZRP', src:'https://www.youtube.com/watch?v=qNw8ejrI0nM&list=RDqNw8ejrI0nM&start_radio=1', type:'youtube' },
    { title:'Bohemian Rhapsody (Official Video Remastered)', artist:'Queen', src:'https://www.youtube.com/watch?v=fJ9rUzIMcZQ&list=RDfJ9rUzIMcZQ&start_radio=1', type:'youtube' },
    { title:'Clasicos del reggaeton', artist:'Fuego Latino Mix', src:'https://www.youtube.com/watch?v=_dwNUgEf38g&list=RD_dwNUgEf38g&start_radio=1', type:'youtube' },
    { title:'Nostalgia', artist:'Ángel Canales', src:'https://www.youtube.com/watch?v=nvdnJLtlCkM&list=RDnvdnJLtlCkM&start_radio=1', type:'youtube' },
    { title:'Las Tumbas', artist:'Ismael Rivera', src:'https://www.youtube.com/watch?v=LbN2azLxRYE&list=RDLbN2azLxRYE&start_radio=1', type:'youtube' },
    { title:'Tomorrowland 2012', artist:'Tomorrowland', src:'https://www.youtube.com/watch?v=UWb5Qc-fBvk', type:'youtube' },
    { title:'MIX MERENGUE CLÁSICO BAILABLE | ÉXITOS DE SIEMPRE', artist:'Dj Bravo', src:'https://www.youtube.com/watch?v=8pWBmHM5ux4&list=RD8pWBmHM5ux4&start_radio=1', type:'youtube' },
 
  ];

  let current = 0;
  let isPlaying = false;

  // Cargar API YouTube
  function loadYouTubeAPI(){
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }
  loadYouTubeAPI();

  // Render playlist
  function renderPlaylist(){
    playlistEl.innerHTML = '';
    tracks.forEach((t,i) => {
      const el = document.createElement('div');
      el.className = 'track' + (i===current ? ' active' : '');
      el.dataset.index = i;
      el.innerHTML = `
        <div style="width:12px;text-align:center">${i+1}</div>
        <div class="meta">
          <div class="title">${escapeHtml(t.title || 'Sin título')}</div>
          <div class="artist">${escapeHtml(t.artist || 'Desconocido')}</div>
        </div>
        <div style="width:60px;text-align:right;color:var(--muted);font-size:13px">${t.type === 'youtube' ? 'YouTube' : (t.file ? 'local' : 'online')}</div>`;
      el.addEventListener('click', () => {
        loadTrack(i);
        play();
      });
      playlistEl.appendChild(el);
    });
    nowIndex.textContent = `${current+1} / ${tracks.length}`;
    highlightActive();
  }

  function highlightActive(){
    [...playlistEl.children].forEach((c, idx) => {
      c.classList.toggle('active', idx === current);
    });
  }

  // Cargar pista
  function loadTrack(index = 0){
    if (!tracks.length) return;
    current = Math.max(0, Math.min(index, tracks.length - 1));
    const t = tracks[current];
    nowTitle.textContent = t.title || 'Sin título';
    nowArtist.textContent = t.artist || 'Desconocido';
    nowIndex.textContent = `${current+1} / ${tracks.length}`;
    cover.textContent = t.title ? t.title.split(' ')[0] : 'Carátula';
    highlightActive();

    // Si es YouTube
    if (t.src.includes("youtube.com") || t.src.includes("youtu.be")){
      isYouTube = true;
      audio.pause();
      const videoId = extractYouTubeID(t.src);
      if (!youtubePlayer){
        createYouTubePlayer(videoId);
      } else {
        youtubePlayer.loadVideoById(videoId);
      }
    } else {
      isYouTube = false;
      if (youtubePlayer) youtubePlayer.stopVideo();
      audio.src = t.src;
      audio.load();
    }
  }

  function play(){
    if (isYouTube){
      youtubePlayer && youtubePlayer.playVideo();
      isPlaying = true;
      playBtn.textContent = '⏸';
    } else {
      audio.play().then(()=>{
        isPlaying = true;
        playBtn.textContent = '⏸';
      }).catch(e=>console.warn(e));
    }
  }

  function pause(){
    if (isYouTube){
      youtubePlayer && youtubePlayer.pauseVideo();
    } else {
      audio.pause();
    }
    isPlaying = false;
    playBtn.textContent = '▶';
  }

  playBtn.addEventListener('click', () => {
    if (!tracks.length) return;
    if (!isPlaying) play(); else pause();
  });

  prevBtn.addEventListener('click', () => {
    if (!tracks.length) return;
    current = (current - 1 + tracks.length) % tracks.length;
    loadTrack(current);
    play();
  });
  nextBtn.addEventListener('click', () => {
    if (!tracks.length) return;
    current = (current + 1) % tracks.length;
    loadTrack(current);
    play();
  });

  // Eventos para audio
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || isNaN(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    nextBtn.click();
  });

  // Volumen
  volumeEl.addEventListener('input', () => {
    const v = parseFloat(volumeEl.value);
    audio.volume = v;
    if (youtubePlayer) youtubePlayer.setVolume(v * 100);
  });

  // Seek
  progressBar.addEventListener('click', (e) => {
    if (isYouTube) return; // no soporta seek manual aquí
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (audio.duration) audio.currentTime = pct * audio.duration;
  });

  // Archivos locales (igual que antes)
  const fileInput = document.getElementById('fileInput');
  const dropArea = document.getElementById('dropArea');
  dropArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (ev)=> {
    const files = Array.from(ev.target.files);
    addFiles(files);
    fileInput.value = '';
  });
  ['dragenter','dragover'].forEach(evt => {
    dropArea.addEventListener(evt, (e) => { e.preventDefault(); dropArea.classList.add('dragover'); });
  });
  ['dragleave','drop'].forEach(evt => {
    dropArea.addEventListener(evt, (e) => { e.preventDefault(); dropArea.classList.remove('dragover'); });
  });
  dropArea.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
    addFiles(files);
  });

  function addFiles(files){
    files.forEach(f => {
      const url = URL.createObjectURL(f);
      tracks.push({title:f.name.replace(/\.[^/.]+$/, ""), artist:'Local', src:url, file:true, type:'mp3'});
    });
    renderPlaylist();
    if (!audio.src && tracks.length) loadTrack(0);
  }

  // Formato tiempo
  function formatTime(sec){
    if (!sec || isNaN(sec)) return '0:00';
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    const m = Math.floor(sec/60);
    return `${m}:${s}`;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Funciones YouTube
  function extractYouTubeID(url){
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function createYouTubePlayer(videoId){
    const div = document.createElement('div');
    div.id = 'ytplayer';
    div.style.display = 'none';
    document.body.appendChild(div);

    youtubePlayer = new YT.Player('ytplayer', {
      height: '0',
      width: '0',
      videoId: videoId,
      playerVars: { autoplay: 1 },
      events: {
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) nextBtn.click();
        }
      }
    });
  }

  // Inicializar
  renderPlaylist();
  loadTrack(0);
  
  //BARRA DE BUSQUEDA

  const searchInput = document.getElementById("searchInput");
  const playlist = document.getElementById("playlist");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    const tracks = playlist.children;

    Array.from(tracks).forEach(track => {
      // Intenta obtener el título desde data-title o texto visible
      const title =
        track.dataset.title ||
        track.textContent ||
        "";

      const match = title.toLowerCase().includes(query);

      track.style.display = match ? "" : "none";
    });
  });
