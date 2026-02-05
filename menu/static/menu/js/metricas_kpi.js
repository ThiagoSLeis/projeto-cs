/* ===== MÉTRICAS KPI - JAVASCRIPT ===== */

// Atualizar data
function updateCurrentDate() {
    const el = document.getElementById('currentDate');
    if (el) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.textContent = new Date().toLocaleDateString('pt-BR', options);
    }
}

// Cores para gráficos
const colors = {
    primary: '#00A6FF',
    darkBlue: '#0056b3',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#333'
};

// Configuração global do Chart.js
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";

// ===== GRÁFICO 1: TICKETS POR STATUS =====
function createChartStatus() {
    const ctx = document.getElementById('chartStatus');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Aberto', 'Em Progresso', 'Aguardando', 'Fechado'],
            datasets: [{
                label: 'Quantidade de Tickets',
                data: [42, 28, 15, 523],
                backgroundColor: [
                    '#dc3545',
                    '#ffc107',
                    '#ff9800',
                    '#28a745'
                ],
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: [
                    '#a02830',
                    '#e0a800',
                    '#e68900',
                    '#1e7e34'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ===== GRÁFICO 2: DISTRIBUIÇÃO POR PRIORIDADE =====
function createChartPriority() {
    const ctx = document.getElementById('chartPriority');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Alto', 'Médio', 'Baixo'],
            datasets: [{
                data: [165, 245, 113],
                backgroundColor: [
                    '#dc3545',
                    '#ffc107',
                    '#28a745'
                ],
                borderColor: ['white', 'white', 'white'],
                borderWidth: 3,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICO 3: TENDÊNCIA (ÚLTIMOS 7 DIAS) =====
function createChartTrend() {
    const ctx = document.getElementById('chartTrend');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    label: 'Tickets Criados',
                    data: [45, 52, 38, 61, 55, 28, 15],
                    borderColor: '#00A6FF',
                    backgroundColor: 'rgba(0, 166, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#00A6FF',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    hoverPointRadius: 8
                },
                {
                    label: 'Tickets Resolvidos',
                    data: [38, 48, 42, 55, 52, 25, 12],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    hoverPointRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Página de Métricas KPI carregada com sucesso!');
    
    updateCurrentDate();
    createChartStatus();
    createChartPriority();
    createChartTrend();

    // Filtros
    const filterPeriod = document.getElementById('filterPeriod');
    const filterDepartment = document.getElementById('filterDepartment');

    if (filterPeriod) {
        filterPeriod.addEventListener('change', function() {
            console.log('Período alterado para:', this.value);
            // Aqui você poderia fazer uma chamada à API para atualizar os dados
        });
    }

    if (filterDepartment) {
        filterDepartment.addEventListener('change', function() {
            console.log('Departamento alterado para:', this.value);
            // Aqui você poderia fazer uma chamada à API para atualizar os dados
        });
    }
});