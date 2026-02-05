/**
 * Citiesoft - Gestão de Atribuição de Tickets
 * Integração Real com Django & MySQL
 */

const API_ENDPOINTS = {
    tickets: '/menu/api/tickets/', 
    atribuir: '/menu/api/atribuir/',
};

let ticketsData = [];
// Gerenciador de Interface (UI)
const UI = {
    loadTechnicians() {
        const selects = ['filterTechnician', 'modalTechnician'];
        // Adicione aqui os técnicos conforme aparecem no seu sistema
        const technicians = [
            { id: '1', name: 'Administrador' },
            { id: '2', name: 'Suporte Nivel 1' }
        ];

        selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            
            while (select.options.length > 1) select.remove(1);
            
            technicians.forEach(tech => {
                const option = new Option(tech.name, tech.id);
                select.add(option);
            });
        });
    },

    updateStats(tickets) {
        document.getElementById('totalTickets').textContent = tickets.length;
        document.getElementById('abertosCount').textContent = tickets.filter(t => t.status === 'aberto').length;
        document.getElementById('progrisoCount').textContent = tickets.filter(t => t.status === 'em_progresso' || t.status === 'em_andamento').length;
        document.getElementById('aguardandoCount').textContent = tickets.filter(t => t.status === 'aguardando').length;
        document.getElementById('fechadosCount').textContent = tickets.filter(t => t.status === 'fechado' || t.status === 'concluido').length;
    }
};

// Gerenciador de Tickets
const TicketManager = {
    async loadTickets() {
        const loading = document.getElementById('loadingState');
        const grid = document.getElementById('ticketsGrid');
        
        if (loading) loading.style.display = 'flex';
        grid.style.opacity = '0.5';

        try {
            const response = await fetch(API_ENDPOINTS.tickets);
            if (!response.ok) throw new Error('Erro na rede');
            
            ticketsData = await response.json();
            
            this.renderTickets(ticketsData);
            UI.updateStats(ticketsData);
        } catch (error) {
            console.error('Erro ao carregar tickets:', error);
            grid.innerHTML = `<div class="alert alert-danger">Erro ao carregar dados: ${error.message}</div>`;
        } finally {
            if (loading) loading.style.display = 'none';
            grid.style.opacity = '1';
        }
    },

    renderTickets(tickets) {
        const grid = document.getElementById('ticketsGrid');
        grid.innerHTML = '';

        if (tickets.length === 0) {
            grid.innerHTML = '<div class="no-results">Nenhum ticket encontrado.</div>';
            return;
        }

        tickets.forEach(ticket => {
            const card = document.createElement('div');
            // Mapeia prioridade para classes CSS (alto, medio, baixo)
            card.className = `ticket-card priority-${ticket.priority}`;
            
            const techName = ticket.technician ? ticket.technician : 'Não Atribuído';

            card.innerHTML = `
                <div class="ticket-header">
                    <span class="ticket-id">#${ticket.id}</span>
                    <span class="status-badge status-${ticket.status}">${ticket.status.replace('_', ' ')}</span>
                </div>
                <div class="ticket-body">
                    <h3 class="ticket-title">${ticket.title}</h3>
                    <p class="ticket-info"><i class="fas fa-building"></i> ${ticket.customer}</p>
                    <p class="ticket-info"><i class="fas fa-user-tie"></i> Técnico: <strong>${techName}</strong></p>
                    <p class="ticket-info"><i class="fas fa-calendar-alt"></i> Criado em: ${ticket.createdAt}</p>
                </div>
                <div class="ticket-actions">
                    <button class="btn-ticket btn-assign" onclick="TicketManager.openAttributionModal('${ticket.id}', '${ticket.title}')">
                        <i class="fas fa-user-plus"></i> Atribuir
                    </button>
                    <a href="/menu/chamados/chat/${ticket.id}/" class="btn-ticket btn-chat">
                        <i class="fas fa-comments"></i> Dúvidas
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    openAttributionModal(id, title) {
        document.getElementById('modalTicketId').value = id;
        document.getElementById('modalTicketTitle').value = title;
        const modalElement = document.getElementById('attributionModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    },

    async confirmAttribution(event) {
        if (event) event.preventDefault();
        
        const ticketId = document.getElementById('modalTicketId').value;
        const technicianId = document.getElementById('modalTechnician').value;
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

        if (!technicianId) {
            alert('Por favor, selecione um técnico.');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.atribuir, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    tecnico_id: technicianId
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById('attributionModal'));
                modalInstance.hide();
                alert('✅ ' + result.message);
                this.loadTickets();
            } else {
                alert('❌ Erro: ' + result.message);
            }
        } catch (error) {
            alert('Erro de comunicação com o servidor.');
        }
    }
};

// Gerenciador de Filtros (Ajustado com os parâmetros que você passou)
const FilterManager = {
    updateFilters() {
        const status = document.getElementById('filterStatus').value;
        const priority = document.getElementById('filterPriority').value;
        const technician = document.getElementById('filterTechnician').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

        const filtered = ticketsData.filter(ticket => {
            // 1. Filtro de Status (converte 'em_progresso' para bater com o banco se necessário)
            const matchesStatus = !status || ticket.status === status;
            
            // 2. Filtro de Prioridade (alto, medio, baixo)
            const matchesPriority = !priority || ticket.priority === priority;
            
            // 3. Filtro de Técnico (Busca pelo nome ou ID do técnico atribuído)
            const matchesTech = !technician || 
                (ticket.technician && (ticket.technician === technician || ticket.technician_id == technician));

            // 4. Busca Textual (Título ou Cliente) - NÃO PRECISA SER EXATO
            const matchesSearch = !searchTerm || 
                ticket.title.toLowerCase().includes(searchTerm) || 
                ticket.customer.toLowerCase().includes(searchTerm);

            return matchesStatus && matchesPriority && matchesTech && matchesSearch;
        });

        TicketManager.renderTickets(filtered);
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    UI.loadTechnicians();
    TicketManager.loadTickets();

    // Eventos de Filtro e Pesquisa
    document.getElementById('searchInput')?.addEventListener('input', () => FilterManager.updateFilters());
    document.getElementById('filterStatus')?.addEventListener('change', () => FilterManager.updateFilters());
    document.getElementById('filterPriority')?.addEventListener('change', () => FilterManager.updateFilters());
    document.getElementById('filterTechnician')?.addEventListener('change', () => FilterManager.updateFilters());

    document.getElementById('attributionForm')?.addEventListener('submit', (e) => {
        TicketManager.confirmAttribution(e);
    });
});