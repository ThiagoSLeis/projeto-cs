/* ===== PESSOAS ATIVAS - JAVASCRIPT ===== */

// ===== VARIÁVEIS GLOBAIS =====
let pessoasData = [];
let pessoasFiltradas = [];
let actionConfirm = null;
// ===== DADOS MOCK (Substitua por chamada AJAX ao Django) =====
function getMockPessoas() {
    return [
        {
            id: 1,
            nome: 'João Silva',
            email: 'joao.silva@example.com',
            tipo: 'funcionario',
            departamento: 'TI',
            empresa: null,
            ativo: true,
            data_criacao: '2024-11-01',
            ultimo_acesso: '2024-12-18 10:30:00',
            total_acessos: 156
        },
        {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria.santos@example.com',
            tipo: 'funcionario',
            departamento: 'RH',
            empresa: null,
            ativo: true,
            data_criacao: '2024-10-15',
            ultimo_acesso: '2024-12-18 14:45:00',
            total_acessos: 203
        },
        {
            id: 3,
            nome: 'Carlos Oliveira',
            email: 'carlos.oliveira@example.com',
            tipo: 'cliente',
            departamento: null,
            empresa: 'Tech Solutions',
            ativo: true,
            data_criacao: '2024-09-20',
            ultimo_acesso: '2024-12-17 16:20:00',
            total_acessos: 87
        },
        {
            id: 4,
            nome: 'Ana Costa',
            email: 'ana.costa@example.com',
            tipo: 'funcionario',
            departamento: 'Marketing',
            empresa: null,
            ativo: true,
            data_criacao: '2024-08-10',
            ultimo_acesso: '2024-12-18 09:15:00',
            total_acessos: 341
        },
        {
            id: 5,
            nome: 'Pedro Ferreira',
            email: 'pedro.ferreira@example.com',
            tipo: 'cliente',
            departamento: null,
            empresa: 'Digital Services',
            ativo: false,
            data_criacao: '2024-07-05',
            ultimo_acesso: '2024-12-10 11:00:00',
            total_acessos: 45
        },
        {
            id: 6,
            nome: 'Lucas Mendes',
            email: 'lucas.mendes@example.com',
            tipo: 'funcionario',
            departamento: 'Financeiro',
            empresa: null,
            ativo: true,
            data_criacao: '2024-06-15',
            ultimo_acesso: '2024-12-18 15:00:00',
            total_acessos: 278
        },
        {
            id: 7,
            nome: 'Juliana Rocha',
            email: 'juliana.rocha@example.com',
            tipo: 'cliente',
            departamento: null,
            empresa: 'Innovation Corp',
            ativo: true,
            data_criacao: '2024-12-01',
            ultimo_acesso: '2024-12-18 13:30:00',
            total_acessos: 12
        },
        {
            id: 8,
            nome: 'Roberto Lima',
            email: 'roberto.lima@example.com',
            tipo: 'funcionario',
            departamento: 'Operações',
            empresa: null,
            ativo: true,
            data_criacao: '2024-05-20',
            ultimo_acesso: '2024-12-18 08:45:00',
            total_acessos: 412
        }
    ];
}

// ===== CARREGAR PESSOAS =====
function carregarPessoas() {
    try {
        // TODO: Substitua por chamada AJAX real
        // fetch('/api/pessoas/ativas/')
        //     .then(response => response.json())
        //     .then(data => {
        //         pessoasData = data;
        //         aplicarFiltros();
        //     })
        //     .catch(error => console.error('Erro ao carregar pessoas:', error));

        // Por enquanto, usar dados mock
        pessoasData = getMockPessoas();
        aplicarFiltros();
        console.log('✓ Pessoas carregadas:', pessoasData);
    } catch (error) {
        console.error('Erro ao carregar pessoas:', error);
        mostrarNotificacao('Erro ao carregar pessoas', 'error');
    }
}

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tipoFilter = document.getElementById('tipoFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    pessoasFiltradas = pessoasData.filter(pessoa => {
        const matchSearch = 
            pessoa.nome.toLowerCase().includes(searchTerm) ||
            pessoa.email.toLowerCase().includes(searchTerm);

        const matchTipo = !tipoFilter || pessoa.tipo === tipoFilter;

        const matchStatus = !statusFilter || 
            (statusFilter === 'ativo' && pessoa.ativo) ||
            (statusFilter === 'inativo' && !pessoa.ativo);

        return matchSearch && matchTipo && matchStatus;
    });

    renderizarTabelas();
    atualizarEstatisticas();
}

// ===== RENDERIZAR TABELAS =====
function renderizarTabelas() {
    // Separar dados por tipo e status
    const funcionarios = pessoasFiltradas.filter(p => p.tipo === 'funcionario');
    const clientes = pessoasFiltradas.filter(p => p.tipo === 'cliente');
    const online = pessoasFiltradas.filter(p => isOnline(p));

    // Renderizar Todos
    renderizarTabela('#todosTableBody', '#todosEmpty', pessoasFiltradas, 'completo');

    // Renderizar Funcionários
    renderizarTabela('#funcionariosTableBody', '#funcionariosEmpty', funcionarios, 'funcionario');

    // Renderizar Clientes
    renderizarTabela('#clientesTableBody', '#clientesEmpty', clientes, 'cliente');

    // Renderizar Online
    renderizarTabela('#onlineTableBody', '#onlineEmpty', online, 'completo');
}

function renderizarTabela(tableBodySelector, emptySelector, dados, tipo) {
    const tbody = document.querySelector(tableBodySelector);
    const empty = document.querySelector(emptySelector);

    if (dados.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

    tbody.innerHTML = dados.map(pessoa => {
        const depto = pessoa.departamento || pessoa.empresa || '-';
        const ultimoAcesso = formatarData(pessoa.ultimo_acesso);
        const statusClass = pessoa.ativo ? 'ativo' : 'inativo';
        const statusText = pessoa.ativo ? 'Ativo' : 'Inativo';
        const tipoClass = pessoa.tipo === 'funcionario' ? 'funcionario' : 'cliente';
        const tipoText = pessoa.tipo === 'funcionario' ? 'Funcionário' : 'Cliente';

        let html = `
            <tr>
                <td><strong>${pessoa.nome}</strong></td>
                <td>${pessoa.email}</td>
        `;

        // Coluna tipo (só mostra em Todos e Online)
        if (tipo === 'completo') {
            html += `
                <td>
                    <span class="tipo-badge ${tipoClass}">${tipoText}</span>
                </td>
            `;
        }

        // Coluna departamento/empresa
        html += `<td>${depto}</td>`;

        // Coluna último acesso
        html += `<td>${ultimoAcesso}</td>`;

        // Coluna status
        html += `
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm btn-view" onclick="abrirDetalhes(${pessoa.id})">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                        <button class="btn-sm btn-edit" onclick="abrirEdicao(${pessoa.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        ${pessoa.ativo ? `
                            <button class="btn-sm btn-desativar" onclick="confirmarDesativacao(${pessoa.id})">
                                <i class="fas fa-ban"></i> Desativar
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;

        return html;
    }).join('');
}

// ===== VERIFICAR SE ESTÁ ONLINE =====
function isOnline(pessoa) {
    // Considerar online se acessou nos últimos 15 minutos
    const ultimoAcesso = new Date(pessoa.ultimo_acesso);
    const agora = new Date();
    const diferencaMs = agora - ultimoAcesso;
    const diferenca15min = 15 * 60 * 1000;

    return diferencaMs < diferenca15min && pessoa.ativo;
}

// ===== ABRIR DETALHES DA PESSOA =====
function abrirDetalhes(pessoaId) {
    const pessoa = pessoasData.find(p => p.id === pessoaId);
    if (!pessoa) return;

    const tipoText = pessoa.tipo === 'funcionario' ? 'Funcionário' : 'Cliente';
    const tipoClass = pessoa.tipo === 'funcionario' ? 'funcionario' : 'cliente';
    const statusText = pessoa.ativo ? 'Ativo' : 'Inativo';
    const statusClass = pessoa.ativo ? 'ativo' : 'inativo';
    const depto = pessoa.departamento || pessoa.empresa || 'N/A';

    document.getElementById('detailName').textContent = pessoa.nome;
    document.getElementById('detailEmail').textContent = pessoa.email;
    document.getElementById('detailTipo').innerHTML = `
        <span class="tipo-badge ${tipoClass}">${tipoText}</span>
    `;
    document.getElementById('detailDepto').textContent = depto;
    document.getElementById('detailFirstAccess').textContent = formatarData(pessoa.data_criacao);
    document.getElementById('detailLastAccess').textContent = formatarData(pessoa.ultimo_acesso);
    document.getElementById('detailStatus').innerHTML = `
        <span class="status-badge ${statusClass}">${statusText}</span>
    `;
    document.getElementById('detailTotalAcessos').textContent = pessoa.total_acessos;

    const modal = new bootstrap.Modal(document.getElementById('pessoaDetailsModal'));
    modal.show();
}

// ===== ABRIR EDIÇÃO (Placeholder) =====
function abrirEdicao(pessoaId) {
    const pessoa = pessoasData.find(p => p.id === pessoaId);
    if (!pessoa) return;

    mostrarNotificacao(`Edição de ${pessoa.nome} (Implementar página de edição)`, 'info');
    // TODO: Redirecionar para página de edição
}

// ===== CONFIRMAR DESATIVAÇÃO =====
function confirmarDesativacao(pessoaId) {
    const pessoa = pessoasData.find(p => p.id === pessoaId);
    if (!pessoa) return;

    document.getElementById('confirmTitle').textContent = 'Desativar Pessoa';
    document.getElementById('confirmMessage').textContent = 
        `Tem certeza que deseja desativar ${pessoa.nome}? Ela não poderá acessar o sistema.`;

    actionConfirm = () => {
        desativarPessoa(pessoaId);
    };

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// ===== DESATIVAR PESSOA =====
function desativarPessoa(pessoaId) {
    try {
        // TODO: Substituir por chamada AJAX real
        // fetch(`/api/pessoas/${pessoaId}/desativar/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': getCookie('csrftoken')
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     const pessoa = pessoasData.find(p => p.id === pessoaId);
        //     pessoa.ativo = false;
        //     aplicarFiltros();
        //     fecharModalConfirmacao();
        //     mostrarNotificacao(`${pessoa.nome} foi desativado com sucesso!`, 'success');
        // })
        // .catch(error => {
        //     console.error('Erro ao desativar pessoa:', error);
        //     mostrarNotificacao('Erro ao desativar pessoa', 'error');
        // });

        // Mock implementation
        const pessoa = pessoasData.find(p => p.id === pessoaId);
        pessoa.ativo = false;
        aplicarFiltros();
        fecharModalConfirmacao();
        mostrarNotificacao(`${pessoa.nome} foi desativado com sucesso!`, 'success');
        console.log('✓ Pessoa desativada:', pessoa);
    } catch (error) {
        console.error('Erro ao desativar pessoa:', error);
        mostrarNotificacao('Erro ao desativar pessoa', 'error');
    }
}

// ===== ATUALIZAR ESTATÍSTICAS =====
function atualizarEstatisticas() {
    const funcionarios = pessoasData.filter(p => p.tipo === 'funcionario' && p.ativo).length;
    const clientes = pessoasData.filter(p => p.tipo === 'cliente' && p.ativo).length;
    const online = pessoasData.filter(p => isOnline(p)).length;
    const total = funcionarios + clientes;

    document.getElementById('countTotal').textContent = total;
    document.getElementById('countFuncionarios').textContent = funcionarios;
    document.getElementById('countClientes').textContent = clientes;
    document.getElementById('countOnline').textContent = online;
}

// ===== FECHAR MODAL DE CONFIRMAÇÃO =====
function fecharModalConfirmacao() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    if (modal) modal.hide();
}

// ===== FORMATAR DATA =====
function formatarData(data) {
    if (!data) return 'N/A';

    // Se for data com hora
    if (data.includes(' ')) {
        const [dataPart, horaPart] = data.split(' ');
        const date = new Date(dataPart + 'T' + horaPart);
        
        // Calcular tempo decorrido
        const agora = new Date();
        const diferenca = agora - date;
        const minutos = Math.floor(diferenca / (1000 * 60));
        const horas = Math.floor(diferenca / (1000 * 60 * 60));
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

        if (minutos < 1) return 'Agora';
        if (minutos < 60) return `${minutos}m atrás`;
        if (horas < 24) return `${horas}h atrás`;
        if (dias < 7) return `${dias}d atrás`;
        
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    }

    // Se for só data
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
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

    // Filtro de tipo
    document.getElementById('tipoFilter').addEventListener('change', aplicarFiltros);

    // Filtro de status
    document.getElementById('statusFilter').addEventListener('change', aplicarFiltros);

    // Botão de atualizar
    document.getElementById('btnRefresh').addEventListener('click', () => {
        carregarPessoas();
        mostrarNotificacao('Lista atualizada com sucesso!', 'success');
    });

    // Botão de editar no modal
    document.getElementById('btnEditarPessoa').addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('pessoaDetailsModal'));
        if (modal) modal.hide();
        mostrarNotificacao('Redirecionando para edição...', 'info');
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
    console.log('✓ Inicializando dashboard de pessoas ativas...');
    setupEventListeners();
    carregarPessoas();
    console.log('✓ Dashboard de pessoas ativas inicializado!');
});