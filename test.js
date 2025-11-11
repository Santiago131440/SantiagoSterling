tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glass: '0 10px 40px rgba(0,0,0,0.15)'
      },
      colors: {
        glass: {
          light: 'rgba(255,255,255,0.6)',
          dark: 'rgba(13,16,23,0.55)'
        }
      },
      backdropBlur: { '18': '18px' },
      keyframes: {
        float: { '0%,100%': {transform:'translateY(0px)'}, '50%': {transform:'translateY(-14px)'} },
        fadein: {'0%': {opacity:0, transform:'translateY(16px) scale(.98)'}, '100%': {opacity:1, transform:'translateY(0) scale(1)'}}
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        fadein: 'fadein .7s ease forwards'
      }
    }
  }
}

  <script>
    // =====================
    // Estado del tema (modo día/noche) con persistencia
    // =====================
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(mode){
      if(mode === 'dark'){
        root.classList.add('dark');
        root.setAttribute('data-theme','dark');
        themeIcon.textContent = '🌙';
      }else{
        root.classList.remove('dark');
        root.setAttribute('data-theme','light');
        themeIcon.textContent = '🌞';
      }
      localStorage.setItem('quiz-theme', mode);
    }

    // Inicialización de tema
    (()=>{
      const saved = localStorage.getItem('quiz-theme');
      if(saved){ applyTheme(saved) } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
      }
    })();

    themeToggle.addEventListener('click', ()=>{
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
    });

    // =====================
    // Navegación suave entre preguntas + progreso
    // =====================
    const navBtns = document.querySelectorAll('.navBtn');
    const startBtns = document.querySelectorAll('.startBtn');
    const progressBar = document.getElementById('progressBar');

    function goto(hash){
      const el = document.querySelector(hash);
      if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
    }

    startBtns.forEach(b=> b.addEventListener('click', e=>{
      // noop: anchor already points to #q-1; keep for symmetry
    }));

    navBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const next = btn.getAttribute('data-next');
        const prev = btn.getAttribute('data-prev');
        goto(next || prev);
      });
    });

    // Progreso basado en preguntas respondidas
    const total = 10;
    const answers = {}; // { q1: 'b', ... }

    function updateProgress(){
      const answered = Object.keys(answers).length;
      const pct = Math.round((answered/total)*100);
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', pct);
    }

    // Registrar respuesta al hacer clic
    document.querySelectorAll('input[type=radio]').forEach(input=>{
      input.addEventListener('change', (e)=>{
        const name = e.target.name; // q1, q2...
        answers[name] = e.target.value;
        updateProgress();
      });
    });

    // =====================
    // Mostrar elementos al entrar al viewport
    // =====================
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('in'); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el=> io.observe(el));

    // =====================
    // Corrección de respuestas y resultados
    // =====================
    const key = {
      q1:'b', q2:'b', q3:'b', q4:'c', q5:'a', q6:'b', q7:'c', q8:'b', q9:'c', q10:'a'
    };

    function computeScore(){
      let score = 0; const detail = [];
      for(const q of Object.keys(key)){
        const correct = key[q];
        const user = answers[q] || null;
        const ok = user === correct;
        if(ok) score++;
        detail.push({ q, user, correct, ok });
      }
      return { score, detail };
    }

    function renderResults(){
      const { score, detail } = computeScore();
      const scoreText = document.getElementById('scoreText');
      const detalle = document.getElementById('detalle');
      scoreText.textContent = `Revisemos tu puntuación: ${score} / ${total}`;
      detalle.innerHTML = '';
      detail.forEach(({q,user,correct,ok})=>{
        const n = q.replace('q','');
        const row = document.createElement('div');
        row.className = `glass rounded-2xl p-3 flex items-center justify-between ${ok? 'ring-1 ring-emerald-400/60' : 'ring-1 ring-rose-400/60'}`;
        row.innerHTML = `<div class="font-medium">Pregunta ${n}</div>
                         <div class="text-sm">Tu respuesta: <span class="font-semibold">${user? user.toUpperCase() : '—'}</span></div>
                         <div class="text-sm">Respuesta correcta: <span class="font-semibold">${correct.toUpperCase()}</span></div>`;
        detalle.appendChild(row);
      });
    }

    document.getElementById('finishBtn').addEventListener('click', ()=>{
      // Validar que todas están respondidas
      const answered = Object.keys(answers).length;
      if(answered < total){
        const firstMissing = Object.keys(key).find(k=> !answers[k]);
        alert('Responde todas las preguntas antes de finalizar.');
        if(firstMissing){
          goto(`#${firstMissing.replace('q','q-')}`);
        }
        return;
      }
      renderResults();
      goto('#resultados');
    });

    document.getElementById('retryBtn').addEventListener('click', ()=>{
      // Limpiar respuestas
      Object.keys(answers).forEach(k=> delete answers[k]);
      document.querySelectorAll('input[type=radio]').forEach(i=> i.checked = false);
      updateProgress();
    });

    // Descargar respuestas como JSON
    document.getElementById('downloadBtn').addEventListener('click', ()=>{
      const payload = { fecha: new Date().toISOString(), respuestas: answers };
      const blob = new Blob([JSON.stringify(payload,null,2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'respuestas-quiz.json';
      document.body.appendChild(a); a.click();
      URL.revokeObjectURL(url); a.remove();
    });

    // Botón guía: desplaza por secciones con una pequeña animación
    document.getElementById('scrollGuide').addEventListener('click', ()=>{
      const ids = Array.from({length:10}, (_,i)=> `#q-${i+1}`);
      let i = 0;
      const step = ()=>{
        if(i >= ids.length) return; goto(ids[i++]); setTimeout(step, 400);
      };
      step();
    });
  </script>

  
  <script>
    // Cambio de color de las respuestas
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function () {
      // Quitar selección previa en este grupo
      const groupName = this.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        r.parentElement.classList.remove('selected');
      });
      // Marcar la opción clickeada
      this.parentElement.classList.add('selected');
    });
  });
</script>

<script>
  // Recuperar datos del usuario guardados en el formulario inicial
  const userData = JSON.parse(localStorage.getItem('quizUserData'));
  if (userData && userData.name) {
    document.getElementById('userName').textContent = userData.name;
  } else {
    document.getElementById('userName').textContent = "Participante";
  }
</script>
