// Dados simulados para cada talude da Fazenda Boa Vista
const taludesData = {
  talude1: {
    nome: "Talude 01 (Norte)",
    sensor: "Sensor LoRa-01",
    status: "NORMAL",
    statusClass: "green",
    icon: "check",
    headline: "Condições dentro da faixa de referência.",
    subtext: "Estabilidade mantida. Nível de água e inclinação normais.",
    umidade: "18,5%",
    saturacao: "65,3%",
    chartUmidade: [18.2, 18.5, 18.3, 18.1, 18.4, 18.6, 18.5],
    chartSaturacao: [65.0, 65.5, 65.2, 65.3, 65.8, 65.1, 65.3]
  },
  talude2: {
    nome: "Talude 02 (Sul)",
    sensor: "Sensor LoRa-02",
    status: "ATENÇÃO",
    statusClass: "yellow",
    icon: "alert-triangle",
    headline: "Elevação no teor de umidade do solo.",
    subtext: "Aumento de saturação detectado após chuvas. Monitoramento intensificado.",
    umidade: "34,2%",
    saturacao: "82,7%",
    chartUmidade: [22.0, 25.4, 28.1, 31.0, 33.5, 34.0, 34.2],
    chartSaturacao: [68.0, 71.2, 74.5, 78.0, 80.2, 81.9, 82.7]
  },
  talude3: {
    nome: "Talude 03 (Leste)",
    sensor: "Sensor LoRa-03",
    status: "ALERTA",
    statusClass: "red",
    icon: "alert-octagon",
    headline: "Risco elevado de instabilidade!",
    subtext: "Micro-deslocamento detectado no inclinômetro + saturação crítica do solo (>90%).",
    umidade: "48,9%",
    saturacao: "94,1%",
    chartUmidade: [30.1, 35.0, 41.2, 44.5, 46.8, 48.0, 48.9],
    chartSaturacao: [75.0, 82.0, 88.4, 91.0, 92.8, 93.5, 94.1]
  },
  talude4: {
    nome: "Talude 04 (Oeste)",
    sensor: "Sensor LoRa-04",
    status: "NORMAL",
    statusClass: "green",
    icon: "check",
    headline: "Condições dentro da faixa de referência.",
    subtext: "Solo drenado e ângulos de inclinação sem alterações.",
    umidade: "15,1%",
    saturacao: "58,4%",
    chartUmidade: [15.5, 15.3, 15.2, 15.1, 15.4, 15.2, 15.1],
    chartSaturacao: [59.0, 58.8, 58.6, 58.5, 58.7, 58.5, 58.4]
  }
};

let chartInstance = null;

document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons();
  initChart();
  
  // Evento ao mudar o seletor de Taludes
  const selector = document.getElementById("talude-selector");
  if (selector) {
    selector.addEventListener("change", function (e) {
      updateDashboard(e.target.value);
    });
  }
});

function initChart() {
  const ctx = document.getElementById("medicoesChart").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
      datasets: [
        {
          label: "Umidade (%)",
          data: taludesData.talude1.chartUmidade,
          borderColor: "#2563eb",
          backgroundColor: "#2563eb",
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3
        },
        {
          label: "Saturação (%)",
          data: taludesData.talude1.chartSaturacao,
          borderColor: "#f59e0b",
          backgroundColor: "#f59e0b",
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", align: "end", labels: { usePointStyle: true } }
      },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + "%" } }
      }
    }
  });
}

function updateDashboard(taludeKey) {
  const data = taludesData[taludeKey];

  // 1. Atualiza Banner de Status
  const titleEl = document.getElementById("status-title");
  titleEl.innerText = data.status;
  titleEl.className = `status-title ${data.statusClass}`;

  const iconBox = document.getElementById("banner-icon");
  iconBox.className = `status-icon ${data.statusClass}`;
  
  // Troca ícone no banner
  const lucideIcon = document.getElementById("banner-lucide-icon");
  lucideIcon.setAttribute("data-lucide", data.icon);

  document.getElementById("status-headline").innerText = data.headline;
  document.getElementById("status-subtext").innerText = data.subtext;

  // 2. Atualiza Cards de Valores
  document.getElementById("val-umidade").innerText = data.umidade;
  document.getElementById("val-saturacao").innerText = data.saturacao;

  const badgeU = document.getElementById("badge-umidade");
  badgeU.innerText = data.status === "NORMAL" ? "Normal" : data.status;
  badgeU.className = `badge-status ${data.statusClass}`;

  const badgeS = document.getElementById("badge-saturacao");
  badgeS.innerText = data.status === "NORMAL" ? "Normal" : data.status;
  badgeS.className = `badge-status ${data.statusClass}`;

  // 3. Atualiza Informações Laterais
  document.getElementById("sensor-id").innerText = data.sensor;
  document.getElementById("chart-talude-name").innerText = data.nome;

  // 4. Atualiza Gráfico
  chartInstance.data.datasets[0].data = data.chartUmidade;
  chartInstance.data.datasets[1].data = data.chartSaturacao;
  chartInstance.update();

  // Recria os ícones Lucide atualizados
  lucide.createIcons();
}