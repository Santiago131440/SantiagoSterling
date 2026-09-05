
const nav=document.querySelector('.navbar');
const menu=document.querySelector('.menu-btn');
const links=document.querySelector('.nav-links');
const topBtn=document.querySelector('.backtop');

window.addEventListener('scroll',()=>{
  nav?.classList.toggle('scrolled',window.scrollY>20);
  topBtn?.classList.toggle('show',window.scrollY>500);
});
menu?.addEventListener('click',()=>links?.classList.toggle('open'));
links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
topBtn?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('form[data-demo]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=form.querySelector('button');
    const old=btn.textContent; btn.textContent='Mensaje preparado ✓';
    setTimeout(()=>btn.textContent=old,2200); form.reset();
  });
});
