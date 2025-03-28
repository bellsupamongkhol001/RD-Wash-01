let cachedData = [];

async function loadReport() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  const res = await fetch('/api/wash');
  let data = await res.json();

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    data = data.filter(w => {
      const washDate = new Date(w.startDate);
      return washDate >= startDate && washDate <= endDate;
    });
  }

  cachedData = data;
  renderTable(data);
}

function renderTable(data) {
  const tbody = document.querySelector('#reportTable tbody');
  tbody.innerHTML = '';

  data.forEach(w => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${w.washCode}</td>
      <td>${w.employeeName}</td>
      <td>${w.uniformCode}</td>
      <td>${w.uniformSize}</td>
      <td>${w.uniformColor}</td>
      <td>${w.qty}</td>
      <td>${w.status}</td>
      <td>${new Date(w.startDate).toLocaleDateString()}</td>
      <td>${w.endDate ? new Date(w.endDate).toLocaleDateString() : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportCSV() {
  const rows = [
    ['Wash Code','Employee','Uniform','Size','Color','Qty','Status','Start Date','End Date'],
    ...cachedData.map(w => [
      w.washCode,
      w.employeeName,
      w.uniformCode,
      w.uniformSize,
      w.uniformColor,
      w.qty,
      w.status,
      new Date(w.startDate).toLocaleDateString(),
      w.endDate ? new Date(w.endDate).toLocaleDateString() : '-'
    ])
  ];

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wash_report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tableData = cachedData.map(w => [
    w.washCode,
    w.employeeName,
    w.uniformCode,
    w.uniformSize,
    w.uniformColor,
    w.qty,
    w.status,
    new Date(w.startDate).toLocaleDateString(),
    w.endDate ? new Date(w.endDate).toLocaleDateString() : '-'
  ]);

  doc.text('Wash Report', 14, 16);
  doc.autoTable({
    startY: 20,
    head: [['Wash Code','Employee','Uniform','Size','Color','Qty','Status','Start','End']],
    body: tableData,
    styles: { fontSize: 8 }
  });

  doc.save('wash_report.pdf');
}