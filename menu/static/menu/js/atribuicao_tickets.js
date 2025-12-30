/* ===== ATRIBUIÇÃO DE TICKETS - JAVASCRIPT CORRIGIDO ===== */

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    DEBOUNCE_DELAY: 300,
    AUTO_REFRESH_INTERVAL: 60000,
};

// ===== FUNÇÃO DE USUÁRIO ATUAL =====
function getCurrentUser() {
    if (window.CURRENT_USER) {
        return window.CURRENT_USER;
    }
    
    console.warn('⚠️ CURRENT_USER não definido!');
    return null;
}

// ===== SISTEMA DE PERMISSÕES =====
const Permissions = {
    isAdmin() {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    },
    
    canAssignToOthers() {
        return this.isAdmin();
    },
    
    canRemoveAssignment(ticketTechnicianId) {
        const user = getCurrentUser();
        if (!user) return false;
        
        if (this.isAdmin()) return true;
        return ticketTechnicianId === user.id;
    }
};

// ===== ESTADO GLOBAL =====
const AppState = {
    tickets: [],
    technicians: [],
    filteredTickets: [],
    currentTicketId: null,
    filters: {
        status: '',
        priority: '',
        technician: '',
        search: ''
    },
    isLoading: false,
    autoRefreshInterval: null
};

// ===== DADOS MOCK (agora funcionais) =====
let MOCK_TICKETS = [
    {
        id: 'TKT-001',
        title: 'Conexão de Internet Instável',
        description: 'Cliente relata queda de conexão intermitente na rede',
        client: 'Empresa ABC Ltda',
        priority: 'alto',
        status: 'aberto',
        date: '2025-12-20',
        technician: null,
        escalation: 'n1',
        history: []
    },
    {
        id: 'TKT-002',
        title: 'Impressora HP não imprime em cores',
        description: 'Cartuchos de cor não estão sendo reconhecidos pelo sistema',
        client: 'Empresa XYZ Consultoria',
        priority: 'medio',
        status: 'aberto',
        date: '2025-12-20',
        technician: null,
        escalation: 'n1',
        history: []
    },
    {
        id: 'TKT-003',
        title: 'Renovação de Licença de Software',
        description: 'Licença do software de gestão expira em 2 dias',
        client: 'Empresa DEF Industries',
        priority: 'alto',
        status: 'em_progresso',
        date: '2025-12-19',
        technician: 'maria_santos',
        escalation: 'n2',
        history: ['Criado em 19/12/2025', 'Atribuído a Maria Santos em 19/12/2025']
    },
    {
        id: 'TKT-004',
        title: 'Computador Reinicia Aleatoriamente',
        description: 'Máquina congela e reinicia sem motivo aparente',
        client: 'Empresa GHI Services',
        priority: 'alto',
        status: 'aberto',
        date: '2025-12-20',
        technician: null,
        escalation: 'n1',
        history: []
    },
    {
        id: 'TKT-005',
        title: 'Email não sincroniza no Outlook',
        description: 'Cliente não consegue sincronizar emails da conta corporativa',
        client: 'Empresa JKL Partners',
        priority: 'medio',
        status: 'aguardando',
        date: '2025-12-20',
        technician: 'carlos_oliveira',
        escalation: 'n1',
        history: ['Criado em 20/12/2025', 'Atribuído a Carlos Oliveira em 20/12/2025']
    },
    {
        id: 'TKT-006',
        title: 'Backup Automático Falha',
        description: 'Sistema de backup não está completando as rotinas de 21:00',
        client: 'Empresa MNO Solutions',
        priority: 'alto',
        status: 'em_progresso',
        date: '2025-12-18',
        technician: 'ana_costa',
        escalation: 'n3',
        history: ['Criado em 18/12/2025', 'Escalado para Nível 3 em 19/12/2025']
    },
    {
        id: 'TKT-007',
        title: 'Erro 403 ao Acessar Compartilhado',
        description: 'Usuário sem permissão de acesso ao servidor compartilhado',
        client: 'Empresa PQR Tech',
        priority: 'medio',
        status: 'fechado',
        date: '2025-12-15',
        technician: null,
        escalation: 'n1',
        history: ['Criado em 15/12/2025', 'Resolvido em 16/12/2025', 'Ticket fechado em 20/12/2025']
    },
    {
        id: 'TKT-008',
        title: 'Instalação do Windows 11',
        description: 'Necessário instalar Windows 11 em novo computador',
        client: 'Empresa STU Corporation',
        priority: 'baixo',
        status: 'aberto',
        date: '2025-12-20',
        technician: null,
        escalation: 'n1',
        history: []
    }
];

const MOCK_TECHNICIANS = [
    { id: 'admin', name: 'Administrador', active: true },
    { id: 'maria_santos', name: 'Maria Santos', active: true },
    { id: 'carlos_oliveira', name: 'Carlos Oliveira', active: true },
    { id: 'ana_costa', name: 'Ana Costa', active: true }
];

// ===== SERVIÇOS DE API (CORRIGIDO PARA FUNCIONAR LOCALMENTE) =====
const API = {
    getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    },

    async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCsrfToken(),
            },
            credentials: 'same-origin',
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async listTickets(filters = {}) {
        // MOCK FUNCIONAL - Retorna cópia dos dados
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    success: true,
                    data: JSON.parse(JSON.stringify(MOCK_TICKETS))
                });
            }, 300);
        });
    },

    async assignTicket(ticketId, data) {
        // MOCK FUNCIONAL - Realmente atribui o ticket
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
                
                if (!ticket) {
                    reject(new Error('Ticket não encontrado'));
                    return;
                }
                
                // ATRIBUIR O TICKET
                const oldTechnician = ticket.technician;
                ticket.technician = data.technician;
                ticket.escalation = data.escalation;
                
                // ATUALIZAR HISTÓRICO
                const timestamp = new Date().toLocaleDateString('pt-BR') + ' às ' + 
                                new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                const techName = MOCK_TECHNICIANS.find(t => t.id === data.technician)?.name || data.technician;
                const oldTechName = oldTechnician ? 
                    MOCK_TECHNICIANS.find(t => t.id === oldTechnician)?.name : null;
                
                const historyEntry = oldTechName 
                    ? `Reatribuído para ${techName} (anterior: ${oldTechName}) em ${timestamp}`
                    : `Atribuído para ${techName} em ${timestamp}`;
                
                if (!ticket.history) ticket.history = [];
                ticket.history.push(historyEntry);
                
                if (data.observations) {
                    ticket.history.push(`Observação: ${data.observations}`);
                }
                
                console.log('✅ Ticket atribuído com sucesso:', ticket);
                
                resolve({
                    success: true,
                    message: 'Ticket atribuído com sucesso'
                });
            }, 300);
        });
    },

    async removeAssignment(ticketId) {
        // MOCK FUNCIONAL - Realmente remove a atribuição
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
                
                if (!ticket) {
                    reject(new Error('Ticket não encontrado'));
                    return;
                }
                
                if (!ticket.technician) {
                    reject(new Error('Ticket não possui atribuição'));
                    return;
                }
                
                // REMOVER ATRIBUIÇÃO
                const timestamp = new Date().toLocaleDateString('pt-BR') + ' às ' + 
                                new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                const techName = MOCK_TECHNICIANS.find(t => t.id === ticket.technician)?.name || ticket.technician;
                
                if (!ticket.history) ticket.history = [];
                ticket.history.push(`Atribuição removida (era ${techName}) em ${timestamp}`);
                
                ticket.technician = null;
                
                console.log('✅ Atribuição removida com sucesso:', ticket);
                
                resolve({
                    success: true,
                    message: 'Atribuição removida com sucesso'
                });
            }, 300);
        });
    },

    async listTechnicians() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    success: true,
                    data: JSON.parse(JSON.stringify(MOCK_TECHNICIANS))
                });
            }, 200);
        });
    }
};

// ===== UTILITÁRIOS =====
const Utils = {
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    },

    formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    getPriorityIcon(priority) {
        const icons = { 'alto': '🔴', 'medio': '🟡', 'baixo': '🟢' };
        return icons[priority] || '⚪';
    },

    getStatusIcon(status) {
        const icons = {
            'aberto': '🔴',
            'em_progresso': '🟡',
            'aguardando': '🟠',
            'fechado': '🟢'
        };
        return icons[status] || '⚪';
    },

    getStatusText(status) {
        const texts = {
            'aberto': 'Aberto',
            'em_progresso': 'Em Andamento',
            'aguardando': 'Aguardando',
            'fechado': 'Concluído'
        };
        return texts[status] || status;
    },

    getEscalationLevel(level) {
        const levels = {
            'n1': 'Nível 1 - Suporte Básico',
            'n2': 'Nível 2 - Suporte Avançado',
            'n3': 'Nível 3 - Especialista'
        };
        return levels[level] || level;
    }
};

// ===== GERENCIAMENTO DE UI ===== 
const UI = {
    showLoading(show = true) {
        const loadingEl = document.getElementById('loadingState');
        const gridEl = document.getElementById('ticketsGrid');
        
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
        if (gridEl) {
            gridEl.style.opacity = show ? '0.5' : '1';
            gridEl.style.pointerEvents = show ? 'none' : 'auto';
        }
        
        AppState.isLoading = show;
    },

    updateStats() {
        const tickets = AppState.tickets;
        
        document.getElementById('totalTickets').textContent = tickets.length;
        document.getElementById('abertosCount').textContent = tickets.filter(t => t.status === 'aberto').length;
        document.getElementById('progrisoCount').textContent = tickets.filter(t => t.status === 'em_progresso').length;
        document.getElementById('aguardandoCount').textContent = tickets.filter(t => t.status === 'aguardando').length;
        document.getElementById('fechadosCount').textContent = tickets.filter(t => t.status === 'fechado').length;
    },

    updateUserInfo() {
        const el = document.getElementById('userInfoHeader');
        if (el) {
            const user = getCurrentUser();
            if (user) {
                const roleText = Permissions.isAdmin() ? 'Administrador' : 'Técnico';
                const roleIcon = Permissions.isAdmin() ? 'fa-user-shield' : 'fa-user';
                const roleColor = Permissions.isAdmin() ? '#dc3545' : '#00A6FF';
                
                el.innerHTML = `
                    <span style="color: ${roleColor}; font-weight: 600;">
                        <i class="fas ${roleIcon}"></i> ${roleText}: ${user.name}
                    </span>
                `;
            }
        }
    },

    renderTickets(tickets) {
        const grid = document.getElementById('ticketsGrid');
        
        if (!grid) return;
        
        if (tickets.length === 0) {
            grid.innerHTML = this.renderEmptyState();
            return;
        }

        grid.innerHTML = tickets.map(ticket => this.renderTicketCard(ticket)).join('');
    },

    renderTicketCard(ticket) {
        const currentUser = getCurrentUser();
        const isAdmin = Permissions.isAdmin();
        const techName = ticket.technician ? 
            AppState.technicians.find(t => t.id === ticket.technician)?.name || 'Desconhecido' : 
            null;

        // ===== LÓGICA DOS BOTÕES BASEADA EM PERMISSÕES =====
        let actionButtons = '';
        
        if (isAdmin) {
            // ADMIN: pode atribuir/reatribuir e remover
            actionButtons = `
                <button class="btn-ticket btn-assign" 
                        onclick="TicketManager.openAttributionModal('${ticket.id}')"
                        title="${techName ? 'Reatribuir ticket' : 'Atribuir ticket'}">
                    <i class="fas fa-user-cog"></i> ${techName ? 'Reatribuir' : 'Atribuir'}
                </button>
                ${techName ? `
                    <button class="btn-ticket btn-remove" 
                            onclick="TicketManager.removeAttribution('${ticket.id}')"
                            title="Remover atribuição">
                        <i class="fas fa-user-minus"></i> Remover
                    </button>
                ` : ''}
            `;
        } else {
            // FUNCIONÁRIO
            if (!techName) {
                // Ticket não atribuído: pode assumir
                actionButtons = `
                    <button class="btn-ticket btn-assume" 
                            onclick="TicketManager.autoAssignToMe('${ticket.id}')"
                            title="Assumir este ticket">
                        <i class="fas fa-hand-paper"></i> Assumir
                    </button>
                `;
            } else if (ticket.technician === currentUser.id) {
                // Ticket é dele: pode devolver
                actionButtons = `
                    <button class="btn-ticket btn-return" 
                            onclick="TicketManager.removeAttribution('${ticket.id}')"
                            title="Devolver este ticket">
                        <i class="fas fa-undo"></i> Devolver
                    </button>
                `;
            }
        }

        return `
            <div class="ticket-card">
                <div class="ticket-header">
                    <span class="ticket-id">${ticket.id}</span>
                    <div class="ticket-badges">
                        <span class="badge-priority priority-${ticket.priority}" 
                              title="Prioridade: ${Utils.capitalizeFirst(ticket.priority)}">
                            ${Utils.getPriorityIcon(ticket.priority)} ${Utils.capitalizeFirst(ticket.priority)}
                        </span>
                        <span class="badge-status status-${ticket.status}"
                              title="Status: ${Utils.getStatusText(ticket.status)}">
                            ${Utils.getStatusIcon(ticket.status)} ${Utils.getStatusText(ticket.status)}
                        </span>
                    </div>
                </div>

                <h3 class="ticket-title">${Utils.escapeHtml(ticket.title)}</h3>
                <p class="ticket-description">${Utils.escapeHtml(ticket.description)}</p>

                <div class="ticket-meta">
                    <div class="meta-item">
                        <span class="meta-label"><i class="fas fa-building"></i> Cliente</span>
                        <span class="meta-value">${Utils.escapeHtml(ticket.client)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label"><i class="fas fa-calendar"></i> Data</span>
                        <span class="meta-value">${Utils.formatDate(ticket.date)}</span>
                    </div>
                </div>

                <div class="technician-info">
                    <div class="technician-label">
                        <i class="fas fa-user-tie"></i> Técnico Responsável
                    </div>
                    <div class="technician-name">
                        ${techName ? 
                            `<i class="fas fa-check-circle" style="color: var(--success-green);"></i> ${techName}
                             ${ticket.technician === currentUser.id ? '<span style="color: var(--primary-blue); font-size: 0.85em; font-weight: 700;">(Você)</span>' : ''}` : 
                            `<span class="technician-empty">
                                <i class="fas fa-exclamation-circle"></i> Não atribuído
                            </span>`
                        }
                    </div>
                </div>

                <div class="technician-info" style="border-left-color: var(--warning-yellow);">
                    <div class="technician-label">
                        <i class="fas fa-layer-group"></i> Nível de Escalonamento
                    </div>
                    <div class="technician-name">${Utils.getEscalationLevel(ticket.escalation)}</div>
                </div>

                <div class="ticket-actions">
                    ${actionButtons}
                    <button class="btn-ticket btn-history" 
                            onclick="TicketManager.viewHistory('${ticket.id}')"
                            title="Ver histórico completo">
                        <i class="fas fa-history"></i> Histórico
                    </button>
                </div>
            </div>
        `;
    },

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                <h3 class="empty-title">Nenhum Ticket Encontrado</h3>
                <p class="empty-text">Tente ajustar seus filtros ou pesquisa para encontrar tickets</p>
                <button class="btn-action btn-clear" onclick="FilterManager.clearFilters()">
                    <i class="fas fa-eraser"></i> Limpar Filtros
                </button>
            </div>
        `;
    },

    loadTechnicians() {
        const filterSelect = document.getElementById('filterTechnician');
        const modalSelect = document.getElementById('modalTechnician');
        
        const options = AppState.technicians
            .filter(tech => tech.active)
            .map(tech => `<option value="${tech.id}">${tech.name}</option>`)
            .join('');
        
        if (filterSelect) {
            const defaultOptions = Array.from(filterSelect.querySelectorAll('option[value=""], option[value="nao_atribuido"]'));
            filterSelect.innerHTML = '';
            defaultOptions.forEach(opt => filterSelect.appendChild(opt));
            filterSelect.insertAdjacentHTML('beforeend', options);
        }
        
        if (modalSelect) {
            const defaultOption = modalSelect.querySelector('option[value=""]');
            modalSelect.innerHTML = '';
            if (defaultOption) modalSelect.appendChild(defaultOption.cloneNode(true));
            modalSelect.insertAdjacentHTML('beforeend', options);
        }
    }
};

// ===== GERENCIAMENTO DE FILTROS =====
const FilterManager = {
    applyFilters() {
        const tickets = AppState.tickets;
        const filters = AppState.filters;

        AppState.filteredTickets = tickets.filter(ticket => {
            const statusMatch = !filters.status || ticket.status === filters.status;
            const priorityMatch = !filters.priority || ticket.priority === filters.priority;
            
            let technicianMatch = true;
            if (filters.technician === 'nao_atribuido') {
                technicianMatch = !ticket.technician;
            } else if (filters.technician) {
                technicianMatch = ticket.technician === filters.technician;
            }
            
            const searchLower = filters.search.toLowerCase();
            const searchMatch = !searchLower || (
                ticket.id.toLowerCase().includes(searchLower) ||
                ticket.title.toLowerCase().includes(searchLower) ||
                ticket.client.toLowerCase().includes(searchLower) ||
                ticket.description.toLowerCase().includes(searchLower)
            );

            return statusMatch && priorityMatch && technicianMatch && searchMatch;
        });

        UI.renderTickets(AppState.filteredTickets);
    },

    updateFilters() {
        AppState.filters = {
            status: document.getElementById('filterStatus').value,
            priority: document.getElementById('filterPriority').value,
            technician: document.getElementById('filterTechnician').value,
            search: document.getElementById('searchInput').value
        };
        
        this.applyFilters();
    },

    clearFilters() {
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterPriority').value = '';
        document.getElementById('filterTechnician').value = '';
        document.getElementById('searchInput').value = '';
        
        this.updateFilters();
        
        Notifications.show('Filtros limpos com sucesso', 'info');
    }
};

// ===== GERENCIAMENTO DE TICKETS (CORRIGIDO) =====
const TicketManager = {
    async loadTickets() {
        try {
            UI.showLoading(true);
            
            const response = await API.listTickets(AppState.filters);
            AppState.tickets = response.data || [];
            
            FilterManager.applyFilters();
            UI.updateStats();
            
            console.log('✅ Tickets carregados:', AppState.tickets.length);
            
        } catch (error) {
            console.error('❌ Erro ao carregar tickets:', error);
            Notifications.show('Erro ao carregar tickets. Tente novamente.', 'danger');
        } finally {
            UI.showLoading(false);
        }
    },

    autoAssignToMe(ticketId) {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            Notifications.show('Erro: usuário não identificado', 'danger');
            return;
        }

        const ticket = AppState.tickets.find(t => t.id === ticketId);
        if (!ticket) {
            Notifications.show('Ticket não encontrado', 'danger');
            return;
        }
        
        if (ticket.technician) {
            if (ticket.technician === currentUser.id) {
                Notifications.show('Este ticket já está atribuído a você', 'info');
            } else {
                const techName = AppState.technicians.find(t => t.id === ticket.technician)?.name;
                Notifications.show(`Este ticket já está atribuído para ${techName}`, 'warning');
            }
            return;
        }

        // Usar a API para atribuir
        this.openAttributionModal(ticketId);
    },

    openAttributionModal(ticketId) {
        const ticket = AppState.tickets.find(t => t.id === ticketId);
        if (!ticket) {
            Notifications.show('Ticket não encontrado', 'danger');
            return;
        }
        
        const currentUser = getCurrentUser();
        const isAdmin = Permissions.isAdmin();
        
        AppState.currentTicketId = ticketId;
        
        document.getElementById('modalTicketId').value = ticketId;
        document.getElementById('modalTicketTitle').value = ticket.title;
        
        const technicianSelect = document.getElementById('modalTechnician');
        const modalLabel = document.getElementById('attributionModalLabel');
        
        if (!isAdmin) {
            technicianSelect.value = currentUser.id;
            technicianSelect.disabled = true;
            technicianSelect.style.backgroundColor = 'var(--bg-light)';
            technicianSelect.style.cursor = 'not-allowed';
            
            modalLabel.innerHTML = '<i class="fas fa-hand-paper"></i> Assumir Ticket';
            
            let helpText = document.getElementById('technicianHelpText');
            if (!helpText) {
                helpText = document.createElement('small');
                helpText.id = 'technicianHelpText';
                helpText.className = 'form-text text-muted';
                helpText.style.marginTop = '0.5rem';
                helpText.style.display = 'block';
                helpText.style.color = 'var(--text-light)';
                helpText.innerHTML = '<i class="fas fa-info-circle"></i> Você só pode atribuir tickets para si mesmo';
                technicianSelect.parentElement.appendChild(helpText);
            }
        } else {
            technicianSelect.value = ticket.technician || '';
            technicianSelect.disabled = false;
            technicianSelect.style.backgroundColor = '';
            technicianSelect.style.cursor = '';
            
            modalLabel.innerHTML = '<i class="fas fa-user-check"></i> Atribuir Ticket';
            
            const helpText = document.getElementById('technicianHelpText');
            if (helpText) helpText.remove();
        }
        
        document.getElementById('modalEscalation').value = ticket.escalation || 'n1';
        document.getElementById('modalObservations').value = '';
        
        const form = document.getElementById('attributionForm');
        form.classList.remove('was-validated');
        
        const modal = new bootstrap.Modal(document.getElementById('attributionModal'));
        modal.show();
    },

    async confirmAttribution(event) {
        event.preventDefault();
        
        const form = event.currentTarget;
        
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        const technician = document.getElementById('modalTechnician').value;
        const escalation = document.getElementById('modalEscalation').value;
        const observations = document.getElementById('modalObservations').value;

        if (!technician) {
            Notifications.show('Por favor, selecione um técnico!', 'danger');
            return;
        }

        try {
            UI.showLoading(true);
            
            console.log('📤 Atribuindo ticket:', AppState.currentTicketId, 'para:', technician);
            
            // CHAMAR A API PARA ATRIBUIR
            await API.assignTicket(AppState.currentTicketId, {
                technician,
                escalation,
                observations
            });

            // FECHAR MODAL
            const modalElement = document.getElementById('attributionModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            
            // RECARREGAR TICKETS
            await this.loadTickets();
            
            const techName = AppState.technicians.find(t => t.id === technician)?.name || technician;
            Notifications.show(`✓ Ticket ${AppState.currentTicketId} atribuído a ${techName} com sucesso!`, 'success');
            
        } catch (error) {
            console.error('❌ Erro ao atribuir ticket:', error);
            Notifications.show('Erro ao atribuir ticket. Tente novamente.', 'danger');
        } finally {
            UI.showLoading(false);
        }
    },

    async removeAttribution(ticketId) {
        const ticket = AppState.tickets.find(t => t.id === ticketId);
        if (!ticket || !ticket.technician) {
            Notifications.show('Ticket não possui atribuição', 'info');
            return;
        }
        
        if (!Permissions.canRemoveAssignment(ticket.technician)) {
            Notifications.show('Você não tem permissão para remover esta atribuição', 'danger');
            return;
        }
        
        const currentUser = getCurrentUser();
        const isOwn = ticket.technician === currentUser.id;
        const confirmMessage = isOwn 
            ? 'Tem certeza que deseja devolver este ticket?' 
            : 'Tem certeza que deseja remover a atribuição deste ticket?';
        
        if (!confirm(confirmMessage)) return;
        
        try {
            UI.showLoading(true);
            
            console.log('📤 Removendo atribuição do ticket:', ticketId);
            
            // CHAMAR A API PARA REMOVER
            await API.removeAssignment(ticketId);
            
            // RECARREGAR TICKETS
            await this.loadTickets();
            
            const successMessage = isOwn 
                ? `✓ Ticket ${ticketId} devolvido com sucesso` 
                : `✓ Atribuição removida do ticket ${ticketId}`;
            
            Notifications.show(successMessage, 'success');
            
        } catch (error) {
            console.error('❌ Erro ao remover atribuição:', error);
            Notifications.show('Erro ao remover atribuição. Tente novamente.', 'danger');
        } finally {
            UI.showLoading(false);
        }
    },

    viewHistory(ticketId) {
        const ticket = AppState.tickets.find(t => t.id === ticketId);
        if (!ticket) {
            Notifications.show('Ticket não encontrado', 'danger');
            return;
        }
        
        document.getElementById('historyTicketId').textContent = ticketId;
        
        const historyContent = document.getElementById('historyContent');
        
        if (!ticket.history || ticket.history.length === 0) {
            historyContent.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-info-circle"></i>
                    <p>Nenhum histórico disponível para este ticket.</p>
                </div>
            `;
        } else {
            historyContent.innerHTML = ticket.history.map((entry, index) => `
                <div class="history-item">
                    <div class="history-marker"></div>
                    <div class="history-content">
                        <div class="history-text">${Utils.escapeHtml(entry)}</div>
                    </div>
                </div>
            `).join('');
        }
        
        const modal = new bootstrap.Modal(document.getElementById('historyModal'));
        modal.show();
    }
};

// ===== SISTEMA DE NOTIFICAÇÕES =====
const Notifications = {
    show(message, type = 'success') {
        const alertDiv = document.createElement('div');
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'danger' ? 'fa-exclamation-circle' :
                     type === 'info' ? 'fa-info-circle' : 'fa-exclamation-triangle';
        const title = type === 'success' ? 'Sucesso!' : 
                      type === 'danger' ? 'Erro!' :
                      type === 'info' ? 'Informação' : 'Atenção!';
        
        alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-notification`;
        alertDiv.setAttribute('role', 'alert');
        
        const bgColor = type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 
                        type === 'danger' ? 'rgba(220, 53, 69, 0.1)' :
                        type === 'info' ? 'rgba(0, 166, 255, 0.1)' : 'rgba(255, 193, 7, 0.1)';
        const borderColor = type === 'success' ? '#28a745' : 
                           type === 'danger' ? '#dc3545' :
                           type === 'info' ? '#00A6FF' : '#ffc107';
        
        alertDiv.style.backgroundColor = bgColor;
        alertDiv.style.borderLeft = `4px solid ${borderColor}`;
        
        alertDiv.innerHTML = `
            <strong><i class="fas ${icon}"></i> ${title}</strong> ${Utils.escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('hide');
            setTimeout(() => alertDiv.remove(), 300);
        }, 4000);
    }
};

// ===== AUTO-REFRESH (OPCIONAL) =====
const AutoRefresh = {
    start() {
        if (AppState.autoRefreshInterval) {
            this.stop();
        }
        
        AppState.autoRefreshInterval = setInterval(() => {
            console.log('🔄 Auto-refresh: Atualizando tickets...');
            TicketManager.loadTickets();
        }, CONFIG.AUTO_REFRESH_INTERVAL);
    },

    stop() {
        if (AppState.autoRefreshInterval) {
            clearInterval(AppState.autoRefreshInterval);
            AppState.autoRefreshInterval = null;
        }
    }
};

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Filtros
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const filterTechnician = document.getElementById('filterTechnician');
    const searchInput = document.getElementById('searchInput');
    
    if (filterStatus) filterStatus.addEventListener('change', () => FilterManager.updateFilters());
    if (filterPriority) filterPriority.addEventListener('change', () => FilterManager.updateFilters());
    if (filterTechnician) filterTechnician.addEventListener('change', () => FilterManager.updateFilters());
    
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(() => {
            FilterManager.updateFilters();
        }, CONFIG.DEBOUNCE_DELAY));
    }
    
    // Botões de ação
    const btnClearFilters = document.getElementById('btnClearFilters');
    const btnRefresh = document.getElementById('btnRefresh');
    
    if (btnClearFilters) btnClearFilters.addEventListener('click', () => FilterManager.clearFilters());
    if (btnRefresh) btnRefresh.addEventListener('click', () => TicketManager.loadTickets());
    
    // Formulário de atribuição
    const attributionForm = document.getElementById('attributionForm');
    if (attributionForm) {
        attributionForm.addEventListener('submit', (e) => TicketManager.confirmAttribution(e));
    }
    
    // Contador de caracteres
    const modalObservations = document.getElementById('modalObservations');
    const charCount = document.getElementById('charCount');
    if (modalObservations && charCount) {
        modalObservations.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // Limpar validação ao fechar modal
    const attributionModal = document.getElementById('attributionModal');
    if (attributionModal) {
        attributionModal.addEventListener('hidden.bs.modal', function() {
            const form = document.getElementById('attributionForm');
            if (form) form.classList.remove('was-validated');
            
            const helpText = document.getElementById('technicianHelpText');
            if (helpText) helpText.remove();
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Sistema de Atribuição de Tickets iniciado');
    console.log('👤 Usuário atual:', getCurrentUser());
    
    try {
        // Atualizar informações do usuário
        UI.updateUserInfo();
        
        // Carregar técnicos
        const techResponse = await API.listTechnicians();
        AppState.technicians = techResponse.data || MOCK_TECHNICIANS;
        UI.loadTechnicians();
        
        // Carregar tickets iniciais
        await TicketManager.loadTickets();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('✅ Sistema inicializado com sucesso!');
        Notifications.show('Sistema carregado com sucesso', 'success');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        Notifications.show('Erro ao inicializar o sistema. Recarregue a página.', 'danger');
    }
});

// ===== CLEANUP AO SAIR =====
window.addEventListener('beforeunload', function() {
    AutoRefresh.stop();
});

console.log('✅ Sistema de Atribuição de Tickets carregado completamente');