// =====================
// Tema claro/oscuro con persistencia
// =====================
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(mode) {
  if (mode === 'dark') {
    root.classList.add('dark');
    themeIcon.textContent = '🌙';
  } else {
    root.classList.remove('dark');
    themeIcon.textContent = '🌞';
  }
  localStorage.setItem('quiz-theme', mode);
}

(() => {
  const saved = localStorage.getItem('quiz-theme');
  if (saved) applyTheme(saved);
  else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
})();

themeToggle.addEventListener('click', () => {
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
});

// =====================
// Navegación y progreso
// =====================
const progressBar = document.getElementById('progressBar');
const total = 10;
const answers = {};

function goto(hash) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('.navBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    goto(btn.dataset.next || btn.dataset.prev);
  });
});

function updateProgress() {
  const pct = Math.round((Object.keys(answers).length / total) * 100);
  progressBar.style.width = pct + '%';
}

// =====================
// Registro de respuestas
// =====================
document.querySelectorAll('input[type=radio]').forEach(input => {
  input.addEventListener('change', e => {
    answers[e.target.name] = e.target.value;
    updateProgress();

    // Cambiar color de selección
    const group = e.target.name;
    document.querySelectorAll(`input[name="${group}"]`).forEach(r => r.parentElement.classList.remove('selected'));
    e.target.parentElement.classList.add('selected');
  });
});

// =====================
// Mostrar elementos al hacer scroll
// =====================
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// =====================
// Resultados
// =====================
const key = { q1:'b', q2:'b', q3:'b', q4:'c', q5:'a', q6:'b', q7:'c', q8:'b', q9:'c', q10:'a' };

function computeScore() {
  let score = 0; const detail = [];
  for (const q in key) {
    const user = answers[q];
    const ok = user === key[q];
    if (ok) score++;
    detail.push({ q, user, correct: key[q], ok });
  }
  return { score, detail };
}

function renderResults() {
  const { score, detail } = computeScore();
  const scoreText = document.getElementById('scoreText');
  const detalle = document.getElementById('detalle');
  scoreText.textContent = `Revisemos tu puntuación: ${score} / ${total}`;
  detalle.innerHTML = '';
  detail.forEach(({ q, user, correct, ok }) => {
    const n = q.replace('q','');
    detalle.innerHTML += `
      <div class="glass rounded-2xl p-3 flex justify-between ${ok ? 'ring-emerald-400/60' : 'ring-rose-400/60'}">
        <div>Pregunta ${n}</div>
        <div>Tu: <b>${user ? user.toUpperCase() : '—'}</b></div>
        <div>Correcta: <b>${correct.toUpperCase()}</b></div>
      </div>`;
  });
}

document.getElementById('finishBtn').addEventListener('click', () => {
  if (Object.keys(answers).length < total) return alert("Responde todas las preguntas.");
  renderResults();
  goto('#resultados');
});

document.getElementById('retryBtn').addEventListener('click', () => {
  for (const k in answers) delete answers[k];
  document.querySelectorAll('input[type=radio]').forEach(i => i.checked = false);
  updateProgress();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ fecha: new Date(), respuestas: answers }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'respuestas-quiz.json';
  a.click();
});

// =====================
// Botón guía
// =====================
document.getElementById('scrollGuide').addEventListener('click', () => {
  const ids = Array.from({ length: total }, (_, i) => `#q-${i + 1}`);
  let i = 0;
  const step = () => { if (i >= ids.length) return; goto(ids[i++]); setTimeout(step, 400); };
  step();
});

// =====================
// Nombre del usuario
// =====================
const userData = JSON.parse(localStorage.getItem('quizUserData'));
document.getElementById('userName').textContent = userData?.name || "Participante";
