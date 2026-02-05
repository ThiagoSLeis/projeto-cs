/* ===== AUTORIZAÇÃO DE USUÁRIOS - JAVASCRIPT ===== */

// ===== VARIÁVEIS GLOBAIS =====
let usuariosData = [];
let usuariosFiltrados = [];
let actionConfirm = null;
// ===== DADOS MOCK (Substitua por chamada AJAX ao Django) =====
function getMockUsuarios() {
    return [
        {
            id: 1,
            nome: 'João Silva',
            email: 'joao.silva@example.com',
            departamento: 'TI',
            telefone: '(11) 98765-4321',
            dataCadastro: '2024-12-15',
            status: 'pendente'
        },
        {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria.santos@example.com',
            departamento: 'RH',
            telefone: '(11) 91234-5678',
            dataCadastro: '2024-12-14',
            status: 'pendente'
        },
        {
            id: 3,
            nome: 'Carlos Oliveira',
            email: 'carlos.oliveira@example.com',
            departamento: 'Financeiro',
            telefone: '(11) 99876-5432',
            dataCadastro: '2024-12-13',
            status: 'aprovado'
        },
        {
            id: 4,
            nome: 'Ana Costa',
            email: 'ana.costa@example.com',
            departamento: 'Marketing',
            telefone: '(11) 97654-3210',
            dataCadastro: '2024-12-12',
            status: 'rejeitado'
        },
        {
            id: 5,
            nome: 'Pedro Ferreira',
            email: 'pedro.ferreira@example.com',
            departamento: 'Operações',
            telefone: '(11) 96543-2109',
            dataCadastro: '2024-12-11',
            status: 'pendente'
        }
    ];
}

// ===== CARREGAR USUÁRIOS =====
function carregarUsuarios() {
    try {
        // TODO: Substitua por chamada AJAX real
        // fetch('/api/usuarios/nao-autorizados/')
        //     .then(response => response.json())
        //     .then(data => {
        //         usuariosData = data;
        //         aplicarFiltros();
        //     })
        //     .catch(error => console.error('Erro ao carregar usuários:', error));

        // Por enquanto, usar dados mock
        usuariosData = getMockUsuarios();
        aplicarFiltros();
        console.log('✓ Usuários carregados:', usuariosData);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        mostrarNotificacao('Erro ao carregar usuários', 'error');
    }
}

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    usuariosFiltrados = usuariosData.filter(usuario => {
        const matchSearch = 
            usuario.nome.toLowerCase().includes(searchTerm) ||
            usuario.email.toLowerCase().includes(searchTerm) ||
            usuario.departamento.toLowerCase().includes(searchTerm);

        const matchStatus = !statusFilter || usuario.status === statusFilter;

        return matchSearch && matchStatus;
    });

    renderizarTabela();
    atualizarEstatisticas();
}

// ===== RENDERIZAR TABELA =====
function renderizarTabela() {
    const tbody = document.getElementById('usuariosTableBody');
    const emptyState = document.getElementById('emptyState');

    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = usuariosFiltrados.map(usuario => `
        <tr>
            <td><strong>${usuario.nome}</strong></td>
            <td>${usuario.email}</td>
            <td>${usuario.departamento}</td>
            <td>${formatarData(usuario.dataCadastro)}</td>
            <td>
                <span class="status-badge ${usuario.status}">
                    ${traduzirStatus(usuario.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-sm btn-view" onclick="abrirDetalhes(${usuario.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    ${usuario.status === 'pendente' ? `
                        <button class="btn-sm btn-approve" onclick="confirmarAprovacao(${usuario.id})">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                        <button class="btn-sm btn-reject" onclick="confirmarRejeicao(${usuario.id})">
                            <i class="fas fa-times"></i> Rejeitar
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== ABRIR DETALHES DO USUÁRIO =====
function abrirDetalhes(usuarioId) {
    const usuario = usuariosData.find(u => u.id === usuarioId);
    if (!usuario) return;

    document.getElementById('detailName').textContent = usuario.nome;
    document.getElementById('detailEmail').textContent = usuario.email;
    document.getElementById('detailDepartment').textContent = usuario.departamento;
    document.getElementById('detailPhone').textContent = usuario.telefone;
    document.getElementById('detailDate').textContent = formatarData(usuario.dataCadastro);
    document.getElementById('detailStatus').innerHTML = `
        <span class="status-badge ${usuario.status}">
            ${traduzirStatus(usuario.status)}
        </span>
    `;

    const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    modal.show();
}

// ===== CONFIRMAR APROVAÇÃO =====
function confirmarAprovacao(usuarioId) {
    const usuario = usuariosData.find(u => u.id === usuarioId);
    if (!usuario) return;

    document.getElementById('confirmTitle').textContent = 'Aprovar Usuário';
    document.getElementById('confirmMessage').textContent = 
        `Tem certeza que deseja aprovar ${usuario.nome}? O usuário receberá um e-mail de confirmação.`;

    actionConfirm = () => {
        aprovarUsuario(usuarioId);
    };

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// ===== CONFIRMAR REJEIÇÃO =====
function confirmarRejeicao(usuarioId) {
    const usuario = usuariosData.find(u => u.id === usuarioId);
    if (!usuario) return;

    document.getElementById('confirmTitle').textContent = 'Rejeitar Usuário';
    document.getElementById('confirmMessage').textContent = 
        `Tem certeza que deseja rejeitar ${usuario.nome}? O usuário será notificado sobre a decisão.`;

    actionConfirm = () => {
        rejeitarUsuario(usuarioId);
    };

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// ===== APROVAR USUÁRIO =====
function aprovarUsuario(usuarioId) {
    try {
        // TODO: Substituir por chamada AJAX real
        // fetch(`/api/usuarios/${usuarioId}/aprovar/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': getCookie('csrftoken')
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     const usuario = usuariosData.find(u => u.id === usuarioId);
        //     usuario.status = 'aprovado';
        //     aplicarFiltros();
        //     fecharModalConfirmacao();
        //     mostrarNotificacao(`${usuario.nome} foi aprovado com sucesso!`, 'success');
        // })
        // .catch(error => {
        //     console.error('Erro ao aprovar usuário:', error);
        //     mostrarNotificacao('Erro ao aprovar usuário', 'error');
        // });

        // Mock implementation
        const usuario = usuariosData.find(u => u.id === usuarioId);
        usuario.status = 'aprovado';
        aplicarFiltros();
        fecharModalConfirmacao();
        mostrarNotificacao(`${usuario.nome} foi aprovado com sucesso!`, 'success');
        console.log('✓ Usuário aprovado:', usuario);
    } catch (error) {
        console.error('Erro ao aprovar usuário:', error);
        mostrarNotificacao('Erro ao aprovar usuário', 'error');
    }
}

// ===== REJEITAR USUÁRIO =====
function rejeitarUsuario(usuarioId) {
    try {
        // TODO: Substituir por chamada AJAX real
        // fetch(`/api/usuarios/${usuarioId}/rejeitar/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': getCookie('csrftoken')
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     const usuario = usuariosData.find(u => u.id === usuarioId);
        //     usuario.status = 'rejeitado';
        //     aplicarFiltros();
        //     fecharModalConfirmacao();
        //     mostrarNotificacao(`${usuario.nome} foi rejeitado com sucesso!`, 'success');
        // })
        // .catch(error => {
        //     console.error('Erro ao rejeitar usuário:', error);
        //     mostrarNotificacao('Erro ao rejeitar usuário', 'error');
        // });

        // Mock implementation
        const usuario = usuariosData.find(u => u.id === usuarioId);
        usuario.status = 'rejeitado';
        aplicarFiltros();
        fecharModalConfirmacao();
        mostrarNotificacao(`${usuario.nome} foi rejeitado com sucesso!`, 'success');
        console.log('✓ Usuário rejeitado:', usuario);
    } catch (error) {
        console.error('Erro ao rejeitar usuário:', error);
        mostrarNotificacao('Erro ao rejeitar usuário', 'error');
    }
}

// ===== ATUALIZAR ESTATÍSTICAS =====
function atualizarEstatisticas() {
    const countPending = usuariosData.filter(u => u.status === 'pendente').length;
    const countApproved = usuariosData.filter(u => u.status === 'aprovado').length;
    const countRejected = usuariosData.filter(u => u.status === 'rejeitado').length;

    document.getElementById('countPending').textContent = countPending;
    document.getElementById('countApproved').textContent = countApproved;
    document.getElementById('countRejected').textContent = countRejected;
}

// ===== FECHAR MODAL DE CONFIRMAÇÃO =====
function fecharModalConfirmacao() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    if (modal) modal.hide();
}

// ===== FORMATAR DATA =====
function formatarData(data) {
    const date = new Date(data);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}

// ===== TRADUZIR STATUS =====
function traduzirStatus(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'aprovado': 'Aprovado',
        'rejeitado': 'Rejeitado'
    };
    return statusMap[status] || status;
}

// ===== MOSTRAR NOTIFICAÇÃO =====
function mostrarNotificacao(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    const titles = {
        'success': '✓ Sucesso',
        'error': '✗ Erro',
        'info': 'ℹ Informação'
    };

    toastTitle.textContent = titles[type] || 'Notificação';
    toastMessage.textContent = message;

    // Remover classes de tipo anteriores
    toast.classList.remove('bg-success', 'bg-danger', 'bg-info');
    
    if (type === 'success') {
        toast.classList.add('bg-success', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-danger', 'text-white');
    }

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// ===== OBTER COOKIE CSRF (Para Django) =====
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Filtro de busca
    document.getElementById('searchInput').addEventListener('input', aplicarFiltros);

    // Filtro de status
    document.getElementById('statusFilter').addEventListener('change', aplicarFiltros);

    // Botão de atualizar
    document.getElementById('btnRefresh').addEventListener('click', () => {
        carregarUsuarios();
        mostrarNotificacao('Lista atualizada com sucesso!', 'success');
    });

    // Botão de confirmação do modal
    document.getElementById('confirmBtn').addEventListener('click', () => {
        if (actionConfirm) {
            actionConfirm();
        }
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Inicializando tela de autorização de usuários...');
    setupEventListeners();
    carregarUsuarios();
    console.log('✓ Tela de autorização inicializada!');
});