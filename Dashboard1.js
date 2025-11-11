// Animaciones de scroll reveal simples
(function(){
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  reveals.forEach(r=>io.observe(r));
})();

// Galería: click para abrir modal
(function(){
  const gallery = document.querySelector('.gallery');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');

  if(gallery){
    gallery.addEventListener('click', (e)=>{
      const t = e.target.closest('img');
      if(!t) return;
      const src = t.getAttribute('data-large') || t.src;
      modalImg.src = src;
      modal.classList.add('open');
    });
  }
  modal.addEventListener('click', ()=>{ modal.classList.remove('open'); modalImg.src = '' });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ modal.classList.remove('open'); modalImg.src=''} });
})();

// Envío de formulario (demo)
function handleContact(e){
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  console.info('Enviando contacto', Object.fromEntries(fd.entries()));
  alert('Gracias! Tu mensaje fue recibido (simulado).');
  form.reset();
}

// Toggle de modo oscuro/claro
function toggleTheme(){
  const body = document.body;
  if(body.dataset.theme==='dark'){
    body.dataset.theme='';
    document.documentElement.style.setProperty('--accent','#3b00ff');
  } else {
    body.dataset.theme='dark';
    document.documentElement.style.setProperty('--accent','#0b0b0b');
  }
}

// Cambiar color de links del header al hacer scroll
(function(){
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(a=>a.style.color='rgba(255,255,255,0.95)');
  const hero = document.querySelector('.hero');
  const observer = new IntersectionObserver((entries)=>{
    const entry = entries[0];
    if(!entry.isIntersecting){
      navLinks.forEach(a=>{ a.style.color='var(--black)'; });
    } else {
      navLinks.forEach(a=>{ a.style.color='rgba(255,255,255,0.95)'; });
    }
  },{threshold:0.1});
  if(hero) observer.observe(hero);
})();
