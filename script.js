import { database, ref, onValue } from "./firebase.js";

// Função para injetar os dados de demonstração assim que a página carregar
function carregarDadosDemonstracao() {
    const humidityEl = document.getElementById("humidityValue");
    const saturationEl = document.getElementById("saturationValue");
    const lastUpdateEl = document.getElementById("lastUpdate");
    const textConnectionEl = document.getElementById("textConnection");
    const dotConnectionEl = document.getElementById("dotConnection");

    if (humidityEl) humidityEl.textContent = "18.5";
    if (saturationEl) saturationEl.textContent = "52.3";
    
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (lastUpdateEl) lastUpdateEl.textContent = horaAtual + " (Modo Demonstrativo)";
    
    if (textConnectionEl) textConnectionEl.textContent = "Conectado via IoT";
    if (dotConnectionEl) dotConnectionEl.style.background = "#10b981";
    
    // Define o farol como seguro por defeito na demonstração
    if (typeof simularFarol === 'function') {
        simularFarol('verde');
    }
}

// Executa a demonstração ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosDemonstracao();
});

// Inicialização do Gráfico (Chart.js)
const canvasElement = document.getElementById('monitoringChart');
let monitoringChart = null;

if (canvasElement) {
    const ctx = canvasElement.getContext('2d');
    monitoringChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            datasets: [
                {
                    label: 'Umidade Estimada (%)',
                    data: [16.2, 16.8, 17.1, 17.5, 18.0, 18.2, 18.5],
                    borderColor: '#176b87',
                    backgroundColor: 'rgba(23, 107, 135, 0.1)',
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#176b87'
                },
                {
                    label: 'Grau de Saturação Sr (%)',
                    data: [45.0, 47.2, 48.0, 49.5, 50.8, 51.5, 52.3],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) { return value + '%'; }
                    }
                }
            }
        }
    });
}

// ESCUTA EM TEMPO REAL NO FIREBASE
const monitoramentoRef = ref(database, "monitoramento");

onValue(monitoramentoRef, (snapshot) => {
    if (snapshot.exists()) {
        const dados = snapshot.val();
        const adcBruto = dados.leitura_bruta || dados.adc || dados.ADC;

        if (adcBruto !== undefined) {
            const umidadeCalculada = ((adcBruto / 4095) * 100).toFixed(1);
            const saturacaoCalculada = (umidadeCalculada * 0.85).toFixed(1);

            const humidityEl = document.getElementById("humidityValue");
            const saturationEl = document.getElementById("saturationValue");
            const lastUpdateEl = document.getElementById("lastUpdate");

            if (humidityEl) humidityEl.textContent = umidadeCalculada;
            if (saturationEl) saturationEl.textContent = saturacaoCalculada;

            const agora = new Date().toLocaleTimeString('pt-BR');
            if (lastUpdateEl) lastUpdateEl.textContent = agora;

            if (monitoringChart) {
                if (monitoringChart.data.labels.length >= 8) {
                    monitoringChart.data.labels.shift();
                    monitoringChart.data.datasets[0].data.shift();
                    monitoringChart.data.datasets[1].data.shift();
                }
                
                monitoringChart.data.labels.push(agora.slice(0, 5));
                monitoringChart.data.datasets[0].data.push(Number(umidadeCalculada));
                monitoringChart.data.datasets[1].data.push(Number(saturacaoCalculada));
                monitoringChart.update();
            }

            if (typeof simularFarol === 'function') {
                if (saturacaoCalculada >= 85) {
                    simularFarol('vermelho');
                } else if (saturacaoCalculada >= 60) {
                    simularFarol('amarelo');
                } else {
                    simularFarol('verde');
                }
            }
        }
    }
});