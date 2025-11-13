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

    // playlist inicial (tracks de ejemplo públicos)
    let tracks = [
      {title:'Happy Together', artist:'The Turtles', src:'https://www.youtube.com/watch?v=G_JVf84vfBQ&list=RDG_JVf84vfBQ&start_radio=1'},
      {title:'SoundHelix Song 2', artist:'SoundHelix', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'},
      {title:'SoundHelix Song 3', artist:'SoundHelix', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'}
    ];

    let current = 0;
    let isPlaying = false;

    // Render playlist
    function renderPlaylist(){
      playlistEl.innerHTML = '';
      tracks.forEach((t,i) => {
        const el = document.createElement('div');
        el.className = 'track' + (i===current ? ' active' : '');
        el.dataset.index = i;
        el.innerHTML = `<div style="width:12px;text-align:center">${i+1}</div>
                        <div class="meta">
                          <div class="title">${escapeHtml(t.title || 'Sin título')}</div>
                          <div class="artist">${escapeHtml(t.artist || 'Desconocido')}</div>
                        </div>
                        <div style="width:60px;text-align:right;color:var(--muted);font-size:13px">${t.file ? 'local' : 'online'}</div>`;
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

    // Load current track metadata to UI and audio src
    function loadTrack(index = 0){
      if (!tracks.length) return;
      current = Math.max(0, Math.min(index, tracks.length - 1));
      audio.src = tracks[current].src;
      nowTitle.textContent = tracks[current].title || 'Sin título';
      nowArtist.textContent = tracks[current].artist || 'Desconocido';
      nowIndex.textContent = `${current+1} / ${tracks.length}`;
      cover.textContent = tracks[current].title ? tracks[current].title.split(' ')[0] : 'Carátula';
      highlightActive();
      // intentar cargar metadata de duración
      audio.load();
    }

    function play(){
      audio.play().then(()=> {
        isPlaying = true;
        playBtn.textContent = '⏸';
        playBtn.setAttribute('aria-pressed','true');
      }).catch(e => {
        console.warn('No se pudo reproducir automáticamente:', e);
      });
    }
    function pause(){
      audio.pause();
      isPlaying = false;
      playBtn.textContent = '▶️';
      playBtn.setAttribute('aria-pressed','false');
    }

    playBtn.addEventListener('click', () => {
      if (!audio.src) loadTrack(current);
      if (isPlaying) pause(); else play();
    });
    prevBtn.addEventListener('click', () => {
      if (tracks.length === 0) return;
      current = (current - 1 + tracks.length) % tracks.length;
      loadTrack(current);
      play();
    });
    nextBtn.addEventListener('click', () => {
      if (tracks.length === 0) return;
      current = (current + 1) % tracks.length;
      loadTrack(current);
      play();
    });

    // Progress updates
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration || isNaN(audio.duration)) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = pct + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    });

    // seek by click or keyboard
    function seekTo(clientX){
      const rect = progressBar.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const pct = x / rect.width;
      if (audio.duration) audio.currentTime = pct * audio.duration;
    }
    progressBar.addEventListener('click', (e) => seekTo(e.clientX));
    progressBar.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
    });

    // when track ends -> next
    audio.addEventListener('ended', () => {
      current = (current + 1) % tracks.length;
      loadTrack(current);
      play();
    });

    // volume
    volumeEl.addEventListener('input', () => {
      audio.volume = parseFloat(volumeEl.value);
    });

    // load duration when metadata loaded
    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration || 0);
    });

    // keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); if (isPlaying) pause(); else play(); }
      if (e.code === 'ArrowRight') { e.preventDefault(); nextBtn.click(); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
    });

    // Add local files (drag & drop + file input)
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');

    dropArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (ev)=> {
      const files = Array.from(ev.target.files);
      addFiles(files);
      fileInput.value = '';
    });

    // drag events
    ['dragenter','dragover'].forEach(evt => {
      dropArea.addEventListener(evt, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropArea.classList.add('dragover');
      });
    });
    ['dragleave','drop'].forEach(evt => {
      dropArea.addEventListener(evt, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropArea.classList.remove('dragover');
      });
    });
    dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = Array.from(dt.files).filter(f => f.type.startsWith('audio/'));
      addFiles(files);
    });

    function addFiles(files){
      files.forEach(f => {
        const url = URL.createObjectURL(f);
        tracks.push({title:f.name.replace(/\.[^/.]+$/, ""), artist: 'Local', src: url, file: true});
      });
      renderPlaylist();
      // if first addition and nothing loaded, load first
      if (!audio.src && tracks.length) loadTrack(0);
    }

    // helper: format seconds to M:SS
    function formatTime(sec){
      if (!sec || isNaN(sec)) return '0:00';
      const s = Math.floor(sec % 60).toString().padStart(2,'0');
      const m = Math.floor(sec/60);
      return `${m}:${s}`;
    }

    // simple escape to avoid HTML injection in titles
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // init
    renderPlaylist();
    loadTrack(0);

    // Optional: release object URLs when page unloads
    window.addEventListener('beforeunload', () => {
      tracks.filter(t => t.file && t.src.startsWith('blob:')).forEach(t => URL.revokeObjectURL(t.src));
    });
