/* ===== ANIMATE VALUE ===== */
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        obj.textContent = Math.floor(current);
    }, 16);
}
/* ===== INITIALIZE CHARTS ===== */
function initializeCharts() {
    const ctxAtivos = document.getElementById('ativosChart');
    if (ctxAtivos) {
        new Chart(ctxAtivos.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Ativos', 'Em Manutenção', 'Desativados'],
                datasets: [{
                    data: [198, 15, 34],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 12,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    const ctxTickets = document.getElementById('ticketsChart');
    if (ctxTickets) {
        new Chart(ctxTickets.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Baixa', 'Normal', 'Alta', 'Urgente'],
                datasets: [{
                    label: 'Tickets',
                    data: [8, 15, 7, 4],
                    backgroundColor: ['#28a745', '#00A6FF', '#ffc107', '#dc3545'],
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
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 5 }
                    }
                }
            }
        });
    }
}

/* ===== POPULATE TABLES ===== */
function populateTables() {
    const ticketsData = [
        { id: '#1234', titulo: 'Impressora não funciona', solicitante: 'João Silva', prioridade: 'Alta', status: 'Aberto', data: '03/11/2025' },
        { id: '#1233', titulo: 'Acesso à rede lento', solicitante: 'Maria Santos', prioridade: 'Normal', status: 'Em Andamento', data: '03/11/2025' },
        { id: '#1232', titulo: 'Software travando', solicitante: 'Pedro Costa', prioridade: 'Urgente', status: 'Aberto', data: '02/11/2025' },
        { id: '#1231', titulo: 'Solicitar novo mouse', solicitante: 'Ana Lima', prioridade: 'Baixa', status: 'Resolvido', data: '02/11/2025' }
    ];

    const ticketsTable = document.getElementById('ticketsTable');
    if (ticketsTable) {
        ticketsData.forEach(ticket => {
            const priorityClass = ticket.prioridade === 'Urgente' ? 'danger' : 
                                  ticket.prioridade === 'Alta' ? 'warning' : 
                                  ticket.prioridade === 'Normal' ? 'info' : 'success';
            
            const statusClass = ticket.status === 'Resolvido' ? 'success' : 
                               ticket.status === 'Em Andamento' ? 'warning' : 'danger';

            const row = `
                <tr>
                    <td><strong>${ticket.id}</strong></td>
                    <td>${ticket.titulo}</td>
                    <td>${ticket.solicitante}</td>
                    <td><span class="status-badge ${priorityClass}">${ticket.prioridade}</span></td>
                    <td><span class="status-badge ${statusClass}">${ticket.status}</span></td>
                    <td>${ticket.data}</td>
                </tr>
            `;
            ticketsTable.innerHTML += row;
        });
    }

    const ativosData = [
        { patrimonio: 'NB-2025-001', tipo: 'Notebook', departamento: 'TI', status: 'Ativo' },
        { patrimonio: 'DT-2025-045', tipo: 'Desktop', departamento: 'Financeiro', status: 'Ativo' },
        { patrimonio: 'MN-2025-012', tipo: 'Monitor', departamento: 'RH', status: 'Ativo' },
        { patrimonio: 'NB-2024-089', tipo: 'Notebook', departamento: 'Vendas', status: 'Manutenção' }
    ];

    const ativosTable = document.getElementById('ativosTable');
    if (ativosTable) {
        ativosData.forEach(ativo => {
            const statusClass = ativo.status === 'Ativo' ? 'success' : 'warning';
            const row = `
                <tr>
                    <td><strong>${ativo.patrimonio}</strong></td>
                    <td>${ativo.tipo}</td>
                    <td>${ativo.departamento}</td>
                    <td><span class="status-badge ${statusClass}">${ativo.status}</span></td>
                </tr>
            `;
            ativosTable.innerHTML += row;
        });
    }

    const contratosData = [
        { id: 'CT-2025-001', fornecedor: 'TechSoft Ltda', vencimento: '15/01/2025', status: 'Vencido' },
        { id: 'CT-2025-002', fornecedor: 'CloudServe Inc', vencimento: '28/01/2025', status: 'Crítico' },
        { id: 'CT-2024-089', fornecedor: 'DataCenter Pro', vencimento: '10/02/2025', status: 'Ativo' },
        { id: 'CT-2024-078', fornecedor: 'NetWork Solutions', vencimento: '05/03/2025', status: 'Ativo' }
    ];

    const contratosTable = document.getElementById('contratosTable');
    if (contratosTable) {
        contratosData.forEach(contrato => {
            let statusClass = 'success';
            if (contrato.status === 'Vencido' || contrato.status === 'Crítico') statusClass = 'danger';
            else if (contrato.status === 'Ativo') statusClass = 'success';

            const row = `
                <tr>
                    <td><strong>${contrato.id}</strong></td>
                    <td>${contrato.fornecedor}</td>
                    <td>${contrato.vencimento}</td>
                    <td><span class="status-badge ${statusClass}">${contrato.status}</span></td>
                </tr>
            `;
            contratosTable.innerHTML += row;
        });
    }
}

/* ===== INITIALIZE HOME PAGE ===== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando Dashboard Citiesoft...');
    
    // initializeBase() já foi executado pelo citiesoft_base.js automaticamente
    
    // Animate counters
    animateValue('activosCount', 0, 247, 1500);
    animateValue('ativosManutencaoCount', 0, 15, 1500);
    animateValue('usuariosCount', 0, 89, 1500);

    // Initialize charts
    initializeCharts();
    
    // Populate tables
    populateTables();
    
    console.log('✓ Dashboard inicializado com sucesso!');
});