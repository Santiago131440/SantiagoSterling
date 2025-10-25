/* ---------------------------
   Data & Utilities
   --------------------------- */
const cities = [
  { id:'bogota', name:'Bogotá', dept:'bogota', x:410, y:260, pop:8_000_000 },
  { id:'medellin', name:'Medellín', dept:'antioquia', x:340, y:200, pop:2_500_000 },
  { id:'cali', name:'Cali', dept:'valle', x:300, y:320, pop:2_200_000 },
  { id:'barranquilla', name:'Barranquilla', dept:'atlantic', x:620, y:150, pop:1_200_000 },
  { id:'cartagena', name:'Cartagena', dept:'bolivar', x:620, y:190, pop:1_000_000 },
  { id:'bucaramanga', name:'Bucaramanga', dept:'santander', x:500, y:160, pop:600_000 },
  { id:'pereira', name:'Pereira', dept:'risaralda', x:360, y:300, pop:450_000 }
];

// Deterministic pseudo random generator (seeded)
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const rand = mulberry32(123456);

/* Generate fake metric data per city */
function generateCityData(city, months=12) {
  const base = Math.round(city.pop / 1000);
  let arr = [];
  for (let i=0;i<months;i++){
    const jitter = Math.round((rand()-0.5)*base*0.2);
    arr.push(Math.max(0, base + jitter + Math.round(Math.sin(i/2)*base*0.12)));
  }
  return arr;
}

/* global state */
const state = {
  metric: 'revenue',
  month: null,
  selectedCity: null,
};

/* create a dataset map */
const cityDatasets = {};
cities.forEach(c => cityDatasets[c.id] = generateCityData(c, 12));

/* Months labels */
const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

/* ---------------------------
   Chart Initialization
   --------------------------- */

/* Sales Chart (big) */
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
  type: 'bar',
  data: {
    labels: months,
    datasets: [{
      label: 'Ventas (k)',
      data: Array.from({length:12}, (_,i)=> Math.round( (rand()*6 + 4) * 1000 )),
      backgroundColor: 'rgba(34,197,94,0.9)',
      borderRadius: 8,
      barPercentage: 0.6
    }]
  },
  options: {
    responsive:true,
    plugins: { legend: { display:false } },
    scales: {
      y: { beginAtZero:true, ticks: { callback: v=> v>=1000? (v/1000)+'k' : v } }
    }
  }
});

/* Mini spark */
const miniCtx = document.getElementById('miniSpark').getContext('2d');
const miniSpark = new Chart(miniCtx, {
  type: 'line',
  data: { labels: months.slice(0,7), datasets: [{ data: months.slice(0,7).map(()=> Math.round(rand()*20+10)), fill:true, tension:0.4 }]},
  options: { responsive:true, plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}}}
});

/* Small Charts */
function makeSmallChart(elemId, type, data, opts){
  const ctx = document.getElementById(elemId).getContext('2d');
  return new Chart(ctx, {
    type,
    data,
    options: Object.assign({responsive:true, plugins:{legend:{display:false}}}, opts||{})
  });
}

const ordersChart = makeSmallChart('ordersChart', 'doughnut', {
  labels:['Online','Store'],
  datasets:[{data:[65,35], backgroundColor:['rgba(34,197,94,0.9)','rgba(147,197,253,0.9)']}]
});

const catChart = makeSmallChart('catChart','pie', {
  labels:['Retail','Services','Wholesale'],
  datasets:[{data:[45,30,25]}]
});

const growthChart = makeSmallChart('growthChart','line', {
  labels: months.slice(0,7),
  datasets:[{data: months.slice(0,7).map(()=> Math.round(rand()*200+80)), fill:true }]
});

const marginChart = makeSmallChart('marginChart','bar', {
  labels:['Q1','Q2','Q3','Q4'],
  datasets:[{data:[12,15,10,18]}]
});

/* Footer charts */
const monthlyOrders = makeSmallChart('monthlyOrders','bar', {
  labels: months,
  datasets:[{data: Array.from({length:12}, ()=> Math.round(rand()*600+200)), backgroundColor:'rgba(99,102,241,0.9)'}]
});

const deptChart = makeSmallChart('deptChart','polarArea', {
  labels:['Bogotá','Antioquia','Valle','Atlántico','Bolívar'],
  datasets:[{data:[45,25,15,8,7]}]
});

const sentimentChart = makeSmallChart('sentimentChart','doughnut', {
  labels:['Positiva','Neutral','Negativa'],
  datasets:[{data:[55,30,15]}]
});

/* ---------------------------
   Map Rendering & Interaction
   --------------------------- */

const cityLayer = document.getElementById('cities');

function renderCities(filterDept='all'){
  cityLayer.innerHTML = '';
  cities.forEach(c=>{
    if (filterDept !== 'all' && c.dept !== filterDept) return;
    // circle group
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('transform', `translate(${c.x},${c.y})`);
    g.setAttribute('data-id', c.id);
    g.innerHTML = `
      <circle class="city-dot" r="8" fill="#16a34a" stroke="#0d7a3d" stroke-width="2"></circle>
      <circle r="18" fill="rgba(16,185,129,0.07)"></circle>
    `;
    g.style.pointerEvents = 'auto';
    g.addEventListener('mouseenter', ()=> showTooltip(c));
    g.addEventListener('mouseleave', hideTooltip);
    g.addEventListener('click', ()=> selectCity(c));
    cityLayer.appendChild(g);
  });
}

function showTooltip(c){
  // show small floating tooltip near cursor — but for simplicity show in cityInfo
  const info = document.getElementById('cityInfo');
  document.getElementById('cityName').innerText = c.name;
  const dataSum = cityDatasets[c.id].reduce((a,b)=>a+b,0);
  document.getElementById('cityStats').innerText = `Population: ${c.pop.toLocaleString()} · Metric sample: ${dataSum}`;
  info.classList.remove('hidden');
}

function hideTooltip(){
  // keep shown until click; simple hide
  const info = document.getElementById('cityInfo');
  info.classList.add('hidden');
}

function selectCity(c){
  state.selectedCity = c.id;
  updateModal(c);
  updateChartsForCity(c.id);
  // center visual feedback: enlarge selected dot
  document.querySelectorAll('#cities g').forEach(g=> g.querySelector('circle').setAttribute('r',8));
  const selected = document.querySelector(`#cities g[data-id="${c.id}"]`);
  if (selected) selected.querySelector('circle').setAttribute('r',12);
}

/* modal */
const modal = document.getElementById('modal');
const modalCard = document.getElementById('modalCard');
function updateModal(c){
  document.getElementById('modalTitle').innerText = c.name + ' — Detalles';
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      <div class="p-2 bg-white/80 rounded-lg">
        <div class="text-xs text-gray-500">Population</div>
        <div class="font-bold">${c.pop.toLocaleString()}</div>
      </div>
      <div class="p-2 bg-white/80 rounded-lg">
        <div class="text-xs text-gray-500">Dept</div>
        <div class="font-bold">${c.dept}</div>
      </div>
      <div class="col-span-2 mt-2">
        <div class="text-xs text-gray-500">Last 12 months (${state.metric})</div>
        <canvas id="cityMiniChart" height="80"></canvas>
      </div>
    </div>
  `;
  // show modal (simple)
  modal.style.pointerEvents = 'auto';
  modalCard.style.transform = 'translateY(0)';
  modalCard.style.opacity = '1';
  // render city mini chart
  setTimeout(()=> {
    const ctx = document.getElementById('cityMiniChart').getContext('2d');
    if (window._cityMini) window._cityMini.destroy();
    window._cityMini = new Chart(ctx, {
      type:'line',
      data: { labels: months, datasets:[{ data: cityDatasets[c.id], fill:true, tension:0.4 }]},
      options:{ plugins:{legend:{display:false}} }
    });
  }, 120);
}

/* close modal */
document.getElementById('closeModal').addEventListener('click', ()=>{
  modal.style.pointerEvents = 'none';
  modalCard.style.transform = 'translateY(6px)';
  modalCard.style.opacity = '0';
});

/* update charts when city selected */
function updateChartsForCity(cityId){
  // Example: change salesChart to show combined city value for each month
  const data = cityDatasets[cityId];
  salesChart.data.datasets[0].data = data.map(v => v * 4); // scale for visibility
  salesChart.update();

  // update footer dept chart to highlight department
  const deptLabels = deptChart.data.labels;
  deptChart.data.datasets[0].backgroundColor = deptLabels.map(lbl => lbl.toLowerCase().includes(cities.find(c=>c.id===cityId).dept.split(' ')[0]) ? 'rgba(34,197,94,0.9)' : 'rgba(209,213,219,0.9)');
  deptChart.update();
}

/* Initial render */
renderCities();

/* Department filter behavior */
document.getElementById('deptFilter').addEventListener('change', (e)=>{
  renderCities(e.target.value);
});

/* Metric filter */
document.getElementById('metricSelect').addEventListener('change', (e)=>{
  state.metric = e.target.value;
  // Just update some numbers and charts (fake)
  document.getElementById('totalCustomers').innerText = Math.round(18000 + rand()*12000).toLocaleString();
  document.getElementById('profitTotal').innerText = `$${(40000 + rand()*40000).toFixed(2)}`;
  // refresh sales chart colors
  salesChart.data.datasets[0].backgroundColor = state.metric === 'revenue' ? 'rgba(34,197,94,0.9)' : 'rgba(99,102,241,0.9)';
  salesChart.update();
});

/* Reset filters */
document.getElementById('resetFilters').addEventListener('click', ()=>{
  document.getElementById('deptFilter').value = 'all';
  document.getElementById('metricSelect').value = 'revenue';
  renderCities('all');
  salesChart.data.datasets[0].data = Array.from({length:12}, ()=> Math.round(rand()*9000+1000));
  salesChart.update();
});

/* Quick event button */
document.getElementById('quickEventBtn').addEventListener('click', ()=>{
  alert('Joining Business Sprint (simulado).');
});

/* Buttons month/week */
document.getElementById('btnWeek').addEventListener('click', ()=>{
  salesChart.config.type = 'line';
  salesChart.update();
});
document.getElementById('btnMonth').addEventListener('click', ()=>{
  salesChart.config.type = 'bar';
  salesChart.update();
});

/* Quick selection on load */
setTimeout(()=> {
  selectCity(cities[0]);
}, 700);

/* Make small charts interactive on click */
['ordersChart','catChart','growthChart','marginChart'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', ()=> alert('Interactive mini-chart clicked (simulado).'));
});

/* Responsive: redraw cities on resize to ensure viewBox scaling correct */
window.addEventListener('resize', ()=> {
  // re-render to ensure circles are visible after resize
  const deptFilter = document.getElementById('deptFilter').value;
  renderCities(deptFilter);
});