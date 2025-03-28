document.addEventListener('DOMContentLoaded', () => {
    fetchWashData();
  });
  
  async function fetchWashData() {
    const res = await fetch('/api/wash');
    const data = await res.json();
  
    const total = data.length;
    const inWashing = data.filter(w => w.status === 'In Washing').length;
    const completed = data.filter(w => w.status === 'Completed').length;
  
    document.getElementById('totalWash').innerText = total;
    document.getElementById('inWashingCount').innerText = inWashing;
    document.getElementById('completedCount').innerText = completed;
  
    renderStatusChart(inWashing, completed);
    renderDepartmentChart(data);
  }
  
  function renderStatusChart(inWashing, completed) {
    const ctx = document.getElementById('washStatusChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['In Washing', 'Completed'],
        datasets: [{
          data: [inWashing, completed],
          backgroundColor: ['#f0ad4e', '#5cb85c'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  function renderDepartmentChart(data) {
    const deptMap = {};
    data.forEach(w => {
      if (!deptMap[w.department]) deptMap[w.department] = 0;
      deptMap[w.department]++;
    });
  
    const labels = Object.keys(deptMap);
    const values = Object.values(deptMap);
  
    const ctx = document.getElementById('washByDeptChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Wash Jobs by Department',
          data: values,
          backgroundColor: '#3a6ea5'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  