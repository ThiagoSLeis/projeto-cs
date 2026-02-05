// ===== PAINEL DE RELATÓRIOS DE ATENDIMENTO =====

let chartStatus, chartDepartamento, chartPrioridade, chartTendencia;

document.addEventListener('DOMContentLoaded', function() {
    inicializarGraficos();
    setupFiltros();
    console.log('✓ Painel de Relatórios carregado!');
});
// ===== INICIALIZAR GRÁFICOS =====
function inicializarGraficos() {
    // Gráfico 1: Status
    const ctxStatus = document.getElementById('chartStatus').getContext('2d');
    chartStatus = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: ['Resolvido', 'Em Andamento', 'Pendente', 'Aberto'],
            datasets: [{
                data: [287, 42, 13, 0],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6c757d'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });

    // Gráfico 2: Departamento
    const ctxDepartamento = document.getElementById('chartDepartamento').getContext('2d');
    chartDepartamento = new Chart(ctxDepartamento, {
        type: 'bar',
        data: {
            labels: ['TI', 'Financeiro', 'RH', 'Vendas', 'Admin'],
            datasets: [{
                label: 'Chamados',
                data: [98, 67, 45, 89, 43],
                backgroundColor: '#00A6FF',
                borderColor: '#0056b3',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(200, 200, 200, 0.1)' }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });

    // Gráfico 3: Prioridade
    const ctxPrioridade = document.getElementById('chartPrioridade').getContext('2d');
    chartPrioridade = new Chart(ctxPrioridade, {
        type: 'bar',
        data: {
            labels: ['Baixa', 'Normal', 'Alta', 'Urgente'],
            datasets: [{
                label: 'Quantidade',
                data: [87, 158, 75, 22],
                backgroundColor: ['#6c757d', '#28a745', '#ffc107', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Gráfico 4: Tendência Diária
    const ctxTendencia = document.getElementById('chartTendencia').getContext('2d');
    chartTendencia = new Chart(ctxTendencia, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            datasets: [{
                label: 'Chamados Abertos',
                data: [45, 52, 48, 61, 55, 28, 15],
                borderColor: '#00A6FF',
                backgroundColor: 'rgba(0, 166, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#00A6FF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// ===== SETUP FILTROS =====
function setupFiltros() {
    const filtros = ['filtro-periodo', 'filtro-status', 'filtro-departamento', 'filtro-prioridade'];
    
    filtros.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('change', function() {
                if (this.id === 'filtro-periodo' && this.value === 'custom') {
                    mostrarSeletorData();
                }
            });
        }
    });
}

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
    const periodo = document.getElementById('filtro-periodo').value;
    const status = document.getElementById('filtro-status').value;
    const departamento = document.getElementById('filtro-departamento').value;
    const prioridade = document.getElementById('filtro-prioridade').value;

    console.log('Filtros aplicados:', { periodo, status, departamento, prioridade });
    
    // Aqui você faria uma requisição AJAX para o servidor
    // e atualizaria os gráficos e dados
    alert('Filtros aplicados com sucesso!');
}

// ===== LIMPAR FILTROS =====
function limparFiltros() {
    document.getElementById('filtro-periodo').value = '7dias';
    document.getElementById('filtro-status').value = '';
    document.getElementById('filtro-departamento').value = '';
    document.getElementById('filtro-prioridade').value = '';
    
    console.log('Filtros limpos');
    alert('Filtros limpos!');
}

// ===== EXPORTAR RELATÓRIO =====
function exportarRelatorio() {
    alert('Exportando relatório em PDF... (Integração com backend necessária)');
    // Aqui você faria a integração com uma biblioteca como jsPDF
}

// ===== MOSTRAR SELETOR DE DATA =====
function mostrarSeletorData() {
    const dataInicio = prompt('Data inicial (DD/MM/YYYY):');
    const dataFim = prompt('Data final (DD/MM/YYYY):');
    
    if (dataInicio && dataFim) {
        console.log(`Período personalizado: ${dataInicio} a ${dataFim}`);
    }
}