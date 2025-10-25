 const database = {
    2024: {
      norte: {
        ventas: 5200000, productos: 12800, clientes: 4200, conversion: 35,
        monthly:[5200000,480000,450000,540000,560000,470000,600000,520000,500000,490000],
        productosData:[25000,28000,24000,29000,32000],
        categorias:[40,25,20,15],
        detalle: generateDetalle('norte',2024)
      },
      centro: {
        ventas: 4700000, productos: 11500, clientes: 3800, conversion: 32,
        monthly:[420000,430000,450000,480000,520000,460000,500000,470000,440000,430000],
        productosData:[22000,26000,21000,25000,28000],
        categorias:[30,30,25,15],
        detalle: generateDetalle('centro',2024)
      },
      sur: {
        ventas: 3950000, productos: 9600, clientes: 3100, conversion: 28,
        monthly:[350000,360000,340000,380000,420000,400000,430000,420000,410000,370000],
        productosData:[18000,21000,19000,20000,18000],
        categorias:[25,35,25,15],
        detalle: generateDetalle('sur',2024)
      }
    },
    2023: {
      norte: {
        ventas: 4600000, productos: 11000, clientes: 4000, conversion: 30,
        monthly:[420000,390000,400000,420000,460000,420000,480000,450000,430000,420000],
        productosData:[21000,24000,20000,23000,26000],
        categorias:[35,25,25,15],
        detalle: generateDetalle('norte',2023)
      },
      centro: {
        ventas: 4200000, productos: 10200, clientes: 3500, conversion: 28,
        monthly:[380000,390000,400000,420000,440000,410000,450000,430000,410000,400000],
        productosData:[1900,2300,2000,2200,2500],
        categorias:[30,30,25,15],
        detalle: generateDetalle('centro',2023)
      },
      sur: {
        ventas: 3600000, productos: 8800, clientes: 2800, conversion: 25,
        monthly:[320000,330000,310000,350000,380000,360000,390000,370000,360000,350000],
        productosData:[1600,1900,1700,1800,1600],
        categorias:[25,35,25,15],
        detalle: generateDetalle('sur',2023)
      }
    }
  };

  function generateDetalle(region, year){
    const prods = ['Prod A','Prod B','Prod C','Prod D','Prod E'];
    const categorias = ['A','B','C','C','B'];
    const rows = [];
    for(let m=1;m<=10;m++){
      for(let i=0;i<prods.length;i++){
        const unidades = Math.floor(Math.random()*15000)+200;
        const venta = unidades * (Math.floor(Math.random()*500)+20);
        rows.push({producto:prods[i], unidades, categoria: categorias[i], region, mes: m, venta});
      }
    }
    return rows;
  }

  const lineCtx = document.getElementById('lineChart');
  const barCtx = document.getElementById('barChart');
  const pieCtx = document.getElementById('pieChart');

  const lineChart = new Chart(lineCtx, {
    type:'line',
    data:{labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct'],
      datasets:[{label:'Ventas', data:[], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.25)', fill:true, tension:0.4}]},
    options:{plugins:{legend:{labels:{color:'#fff'}}},scales:{x:{ticks:{color:'#fff'}},y:{ticks:{color:'#fff'}}}}
  });

  const barChart = new Chart(barCtx, {
    type:'bar',
    data:{labels:['Prod A','Prod B','Prod C','Prod D','Prod E'], datasets:[{label:'Unidades', data:[], backgroundColor:['#3b82f6','#a855f7','#10b981','#ef4444','#fbbf24']}]},
    options:{plugins:{legend:{labels:{color:'#fff'}}},scales:{x:{ticks:{color:'#fff'}},y:{ticks:{color:'#fff'}}}}
  });

  const pieChart = new Chart(pieCtx, {
    type:'doughnut',
    data:{labels:['Cat A','Cat B','Cat C','Cat D'], datasets:[{data:[], backgroundColor:['#3b82f6','#a855f7','#10b981','#fbbf24']}]},
    options:{plugins:{legend:{labels:{color:'#fff'}, position:'bottom'}}}
  });

  const yearFilter = document.getElementById('yearFilter');
  const regionFilter = document.getElementById('regionFilter');
  const categoryFilter = document.getElementById('categoryFilter');

  const totalVentasEl = document.getElementById('totalVentas');
  const productosVendidosEl = document.getElementById('productosVendidos');
  const clientesActivosEl = document.getElementById('clientesActivos');
  const tasaConversionEl = document.getElementById('tasaConversion');

  const detailTableBody = document.querySelector('#detailTable tbody');
  const dashboardArea = document.getElementById('dashboardArea');

  let lastCaptureDataUrl = null;

  function applyFiltersAndAggregate(){
    const year = yearFilter.value;
    const region = regionFilter.value;
    const category = categoryFilter.value;

    const regionesList = (region === 'todas') ? Object.keys(database[year]) : [region];

    let ventasSum = 0, productosSum = 0, clientesSum = 0, conversionSum = 0;
    const detalleFiltrado = [];

    regionesList.forEach(r => {
      const block = database[year][r];
      ventasSum += block.ventas;
      productosSum += block.productos;
      clientesSum += block.clientes;
      conversionSum += block.conversion;

      block.detalle.forEach(row=>{
        if(category === 'todas' || row.categoria === category) detalleFiltrado.push({...row, year, region: r});
      });
    });

    const conversionAvg = Math.round(conversionSum / regionesList.length);

    totalVentasEl.textContent = `$${ventasSum.toLocaleString()}`;
    productosVendidosEl.textContent = productosSum.toLocaleString();
    clientesActivosEl.textContent = clientesSum.toLocaleString();
    tasaConversionEl.textContent = `${conversionAvg}%`;

    detailTableBody.innerHTML = '';
    detalleFiltrado.slice(0,200).forEach(r=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.producto}</td><td>${r.unidades.toLocaleString()}</td><td>${r.categoria}</td><td>${r.region}</td><td>${r.mes}</td><td>$${r.venta.toLocaleString()}</td>`;
      detailTableBody.appendChild(tr);
    });

    const sampleRegion = regionesList[0];
    const block = database[year][sampleRegion];

    lineChart.data.datasets[0].data = block.monthly.slice();
    barChart.data.datasets[0].data = block.productosData.slice();
    pieChart.data.datasets[0].data = block.categorias.slice();

    lineChart.update(); barChart.update(); pieChart.update();

    return {
      year, region, category,
      metrics: { ventas: ventasSum, productos: productosSum, clientes: clientesSum, conversion: conversionAvg },
      detail: detalleFiltrado
    };
  }

  [yearFilter, regionFilter, categoryFilter].forEach(el => el.addEventListener('change', ()=>{ applyFiltersAndAggregate(); }));


  applyFiltersAndAggregate();

  async function captureDashboard(){

    const opts = { scale: 2, useCORS:true, backgroundColor: null };
    const canvas = await html2canvas(dashboardArea, opts);
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    lastCaptureDataUrl = dataUrl;
    return dataUrl;
  }

  document.getElementById('exportPdfBtn').addEventListener('click', async ()=>{
    try {
      const { jsPDF } = window.jspdf;
      const data = applyFiltersAndAggregate();
      const imgData = await captureDashboard();

      const pdf = new jsPDF({orientation:'landscape', unit:'pt', format:'a4'});

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const img = new Image();
      img.src = imgData;
      img.onload = function(){
        const imgW = pageW - 40;
        const ratio = img.width / img.height;
        const imgH = imgW / ratio;
        pdf.addImage(imgData, 'PNG', 20, 20, imgW, imgH);

        pdf.setFontSize(12);
        pdf.setTextColor(0,0,0);
        const startY = imgH + 40;
        let y = startY;
        pdf.setFontSize(14);
        pdf.text(`Resumen (Año: ${data.year} · Región: ${data.region} · Categoría: ${data.category})`, 20, y);
        y += 20;
        pdf.setFontSize(11);
        pdf.text(`Total Ventas: $${data.metrics.ventas.toLocaleString()}`, 20, y); y+=16;
        pdf.text(`Productos Vendidos: ${data.metrics.productos.toLocaleString()}`, 20, y); y+=16;
        pdf.text(`Clientes Activos: ${data.metrics.clientes.toLocaleString()}`, 20, y); y+=16;
        pdf.text(`Tasa de Conversión: ${data.metrics.conversion}%`, 20, y); y+=24;

        const headers = ['Producto','Unidades','Categoria','Region','Mes','Venta'];
        const rows = data.detail.slice(0,10).map(r => [r.producto, r.unidades, r.categoria, r.region, r.mes, `$${r.venta.toLocaleString()}`]);

        let tx = 20;
        y += 6;
        pdf.setFontSize(10);
        pdf.text(headers.join(' | '), tx, y); y+=12;
        rows.forEach(row => { pdf.text(row.join(' | '), tx, y); y+=10; });

        const filename = `Reporte_Dashboard_${data.year}_${data.region}_${data.category}.pdf`;
        pdf.save(filename);
      };
    } catch (err) {
      console.error(err);
      alert('Error generando PDF: ' + err.message);
    }
  });

  document.getElementById('downloadImageBtn').addEventListener('click', async ()=>{
    try {
      const dataUrl = await captureDashboard();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Dashboard_${Date.now()}.png`;
      a.click();
    } catch(err){
      console.error(err);
      alert('No se pudo capturar la imagen: ' + err.message);
    }
  });

  document.getElementById('exportExcelBtn').addEventListener('click', async ()=>{
    try {
      const data = applyFiltersAndAggregate();

      const resumen = [
        {Campo:'Año', Valor: data.year},
        {Campo:'Región', Valor: data.region},
        {Campo:'Categoría', Valor: data.category},
        {Campo:'Total Ventas', Valor: data.metrics.ventas},
        {Campo:'Productos Vendidos', Valor: data.metrics.productos},
        {Campo:'Clientes Activos', Valor: data.metrics.clientes},
        {Campo:'Tasa de Conversión (%)', Valor: data.metrics.conversion}
      ];

      const detalleRows = data.detail.map(r => ({
        Producto: r.producto,
        Unidades: r.unidades,
        Categoria: r.categoria,
        Region: r.region,
        Mes: r.mes,
        Venta: r.venta
      }));

      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet(resumen, {header:['Campo','Valor']});
      XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

      const ws2 = XLSX.utils.json_to_sheet(detalleRows.slice(0,1000));
      XLSX.utils.book_append_sheet(wb, ws2, 'Detalle');

      const imgDataUrl = await captureDashboard();
      const ws3 = XLSX.utils.aoa_to_sheet([['Imagen (abra el archivo PNG generado)'],[imgDataUrl]]);
      XLSX.utils.book_append_sheet(wb, ws3, 'Imagen');

      const wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
      const blob = new Blob([wbout], {type:'application/octet-stream'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fname = `Reporte_Dashboard_${data.year}_${data.region}_${data.category}.xlsx`;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);

      const imgLink = document.createElement('a');
      imgLink.href = imgDataUrl;
      imgLink.download = `Dashboard_${Date.now()}.png`;
      imgLink.click();

    } catch (err) {
      console.error(err);
      alert('Error exportando Excel: ' + err.message);
    }
  });