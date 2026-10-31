document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("medicoesChart").getContext("2d");

  // Dados do gráfico simulando as medições
  const data = {
    labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    datasets: [
      {
        label: "Umidade (%)",
        data: [18.2, 18.5, 18.3, 18.1, 18.4, 18.6, 18.5],
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3
      },
      {
        label: "Saturação (%)",
        data: [65.0, 65.5, 65.2, 65.3, 65.8, 65.1, 65.3],
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3
      }
    ]
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            boxWidth: 8,
            usePointStyle: true,
            font: { size: 11 }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: function (value) {
              return value + "%";
            }
          },
          grid: {
            color: "#f1f5f9"
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  };

  new Chart(ctx, config);
});