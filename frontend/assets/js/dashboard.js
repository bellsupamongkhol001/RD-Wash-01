document.addEventListener('DOMContentLoaded', () => {
  fetchWashData();
});

async function fetchWashData() {
  const res = await fetch('/api/wash');
  const data = await res.json();

  const total = data.length;
  const waiting = data.filter(w => w.status === 'waiting send wash').length;
  const inWashing = data.filter(w => w.status === 'washing').length;
  const completed = data.filter(w => w.status === 'completed').length;

  document.getElementById('totalWash').innerText = total;
  document.getElementById('waitingCount').innerText = waiting;
  document.getElementById('inWashingCount').innerText = inWashing;
  document.getElementById('completedCount').innerText = completed;

  renderStatusChart(waiting, inWashing, completed);
  renderDepartmentChart(data);
}

function renderStatusChart(waiting, inWashing, completed) {
  const ctx = document.getElementById('washStatusChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Waiting', 'In Washing', 'Completed'],
      datasets: [{
        data: [waiting, inWashing, completed],
        backgroundColor: ['#f39c12', '#f0ad4e', '#5cb85c'],
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
    const dept = w.department || 'Unknown';
    if (!deptMap[dept]) deptMap[dept] = 0;
    deptMap[dept]++;
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
