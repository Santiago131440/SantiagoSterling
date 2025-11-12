// Tabla de datos
const sample = [
  {name:'2025/2026', cat:'Bayern Munich', stock:12, sales:7},
  {name:'2024/2025', cat:'Liverpool', stock:50, sales:17},
  {name:'2023/2024', cat:'Liverpool', stock:51, sales:13},
  {name:'2022/2023', cat:'Liverpool', stock:21, sales:5},
  {name:'2021/2022', cat:'Liverpool', stock:26, sales:6},
  {name:'2021/2022', cat:'Porto', stock:28, sales:16},
  {name:'2020/2021', cat:'Porto FC.', stock:47, sales:11},
  {name:'2019/2020', cat:'Porto FC.', stock:50, sales:14},
  {name:'2018/2019', cat:'Junior FC.', stock:24, sales:3},
  {name:'2017/2018', cat:'Junior FC.', stock:59, sales:16},
  {name:'2016/2017', cat:'Junior FC.', stock:23, sales:1},
  {name:'2016/2017', cat:'Barranquilla FC.', stock:21, sales:1},
  {name:'2015/2016', cat:'Barranquilla FC.', stock:21, sales:2},
];

const tbody = document.getElementById('products');
function renderRows(items){
  tbody.innerHTML = '';
  items.forEach((it, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${it.name}</strong><div class='small'>${it.cat}</div></td>
      <td class='small'>${it.cat}</td>
      <td>${it.stock}</td>
      <td>${it.sales}</td>
      <td><button class='btn ghost' onclick='showDetail(${idx})'>Ver</button></td>
    `;
    tbody.appendChild(tr);
  });
}
renderRows(sample);

function showDetail(i){
  const item = sample[i];
  alert(item.name + " — Partidos Jugados: " + item.stock + " — Goles: " + item.sales);
}

// Datos gráficos
const lineData = {
  labels: ['15/16', '16/17', '16/17', '17/18', '18/19', '19/20', '20/21', '21/22', '21/22', '22/23', '23/24', '24/25', '25/26'],
  values: [10, 5, 4, 27, 13, 28, 23, 57, 23, 24, 25, 34, 58]
};

const barData = {
  labels: ['Centros', 'Precisión', 'Voleas', 'Definición', 'Pases cortos', 'Potencia', 'Resistencia', 'Tiros lejanos', 'Salto', 'Fuerza'],
  values: [76, 71, 81, 83, 77, 85, 87, 81, 84, 69]
};

const radarData = {
  labels: ['Ritmo', 'Tiro', 'Pase', 'Regate', 'Defensa', 'Físico'],
  values: [90, 76, 76, 88, 54, 82]
};

Chart.defaults.font.family = 'Inter';
Chart.defaults.color = '#444';
Chart.defaults.plugins.legend.display = false;

// LINE CHART
new Chart(document.getElementById('chartLine'), {
  type: 'line',
  data: {
    labels: lineData.labels,
    datasets: [{
      data: lineData.values,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(34,193,195,0.15)',
      borderColor: 'rgba(34,193,195,1)',
      pointBackgroundColor: '#22c1c3'
    }]
  },
  options: { responsive:true, maintainAspectRatio:false }
});

// BAR CHART
new Chart(document.getElementById('chartBar'), {
  type: 'bar',
  data: {
    labels: barData.labels,
    datasets: [{
      data: barData.values,
      backgroundColor: 'rgba(34,193,195,0.7)',
      borderRadius: 8
    }]
  },
  options: { responsive:true, maintainAspectRatio:false }
});

// RADAR CHART
new Chart(document.getElementById('chartRadar'), {
  type: 'radar',
  data: {
    labels: radarData.labels,
    datasets: [{
      data: radarData.values,
      fill: true,
      backgroundColor: 'rgba(34,193,195,0.15)',
      borderColor: 'rgba(34,193,195,0.9)',
      pointBackgroundColor: '#22c1c3'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(0,0,0,0.05)' },
        grid: { color: 'rgba(0,0,0,0.05)' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: { color: '#444', font: { size: 12 } }
      }
    }
  }
});

// Exportar CSV
document.getElementById('btnExport').addEventListener('click', ()=>{
  const csv = [ ['Temporada','Equipo','Partidos','Goles'], ...sample.map(s=>[s.name,s.cat,s.stock,s.sales]) ]
  .map(r=> r.map(c=>`"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'luis_diaz_trayectoria.csv'; a.click();
  URL.revokeObjectURL(url);
});

// Botón de acción
document.getElementById('btnQuick').addEventListener('click', () => { 
  // Redirige a index.html
  window.location.href = 'index.html#projects';
});




