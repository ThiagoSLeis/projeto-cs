/* ===== RELATÓRIO DE ATIVOS - JAVASCRIPT ===== */
// ===== DADOS DOS ATIVOS (Simulados) =====
const ativosCompletos = [
    { id: 1, patrimonio: 'NB-2025-001', tipo: 'Notebook', marca: 'Dell', modelo: 'Inspiron 15', departamento: 'TI', responsavel: 'João Silva', dataAquisicao: '15/01/2024', status: 'ativo' },
    { id: 2, patrimonio: 'DT-2025-045', tipo: 'Desktop', marca: 'HP', modelo: 'Compaq 290', departamento: 'Financeiro', responsavel: 'Maria Santos', dataAquisicao: '20/02/2024', status: 'ativo' },
    { id: 3, patrimonio: 'MN-2025-012', tipo: 'Monitor', marca: 'LG', modelo: '24UP550', departamento: 'RH', responsavel: 'Pedro Costa', dataAquisicao: '10/03/2024', status: 'ativo' },
    { id: 4, patrimonio: 'NB-2024-089', tipo: 'Notebook', marca: 'Lenovo', modelo: 'ThinkPad X1', departamento: 'Vendas', responsavel: 'Ana Lima', dataAquisicao: '05/12/2023', status: 'manutencao' },
    { id: 5, patrimonio: 'PR-2025-067', tipo: 'Impressora', marca: 'Brother', modelo: 'HL-L8360', departamento: 'Operações', responsavel: 'Carlos Oliveira', dataAquisicao: '08/04/2024', status: 'ativo' },
    { id: 6, patrimonio: 'SV-2024-015', tipo: 'Servidor', marca: 'Dell', modelo: 'PowerEdge', departamento: 'TI', responsavel: 'João Silva', dataAquisicao: '22/06/2023', status: 'ativo' },
    { id: 7, patrimonio: 'SW-2025-003', tipo: 'Switch', marca: 'Cisco', modelo: 'Catalyst 3650', departamento: 'TI', responsavel: 'João Silva', dataAquisicao: '12/05/2024', status: 'desativado' },
    { id: 8, patrimonio: 'DT-2024-120', tipo: 'Desktop', marca: 'Positivo', modelo: 'Master C940', departamento: 'Financeiro', responsavel: 'Maria Santos', dataAquisicao: '18/11/2023', status: 'manutencao' },
    { id: 9, patrimonio: 'NB-2025-055', tipo: 'Notebook', marca: 'HP', modelo: 'Pavilion 15', departamento: 'Vendas', responsavel: 'Ana Lima', dataAquisicao: '28/05/2024', status: 'ativo' },
    { id: 10, patrimonio: 'MN-2025-089', tipo: 'Monitor', marca: 'Dell', modelo: 'U2720Q', departamento: 'TI', responsavel: 'João Silva', dataAquisicao: '01/06/2024', status: 'ativo' },
    { id: 11, patrimonio: 'PR-2024-102', tipo: 'Impressora', marca: 'HP', modelo: 'LaserJet Pro', departamento: 'RH', responsavel: 'Pedro Costa', dataAquisicao: '14/09/2023', status: 'desativado' },
    { id: 12, patrimonio: 'NB-2025-200', tipo: 'Notebook', marca: 'ASUS', modelo: 'VivoBook 15', departamento: 'Operações', responsavel: 'Carlos Oliveira', dataAquisicao: '20/07/2024', status: 'ativo' }
];

let ativosFiltrados = [...ativosCompletos];
let paginaAtual = 1;
const itemsPorPagina = 10;

// ===== MENU CONFIG =====
const menuConfig = [
    {
        id: 'painel',
        title: 'Painel Principal',
        icon: 'fas fa-tachometer-alt',
        url: 'citiesoft_home.html',
        active: false
    },
    {
        id: 'inventarios',
        title: 'Inventários',
        icon: 'fas fa-clipboard-list',
        url: '#',
        submenu: [
            { id: 'inventario-ativos', title: 'Ativos', url: '#', icon: 'fas fa-laptop' },
            { id: 'inventario-tickets', title: 'Tickets', url: '#', icon: 'fas fa-ticket-alt' },
            { id: 'inventario-chamados', title: 'Chamados (OCS)', url: '#', icon: 'fas fa-headset' }
        ]
    },
    {
        id: 'relatorios',
        title: 'Relatórios',
        icon: 'fas fa-file-alt',
        url: '#',
        active: true,
        submenu: [
            { id: 'relatorio-ativos', title: 'Relatório de Ativos', url: '#', icon: 'fas fa-laptop' },
            { id: 'relatorio-tickets', title: 'Relatório de Tickets', url: '#', icon: 'fas fa-ticket-alt' },
            { id: 'relatorio-usuarios', title: 'Relatório de Usuários', url: '#', icon: 'fas fa-users' },
            { id: 'relatorio-analise', title: 'Análise e Métricas', url: '#', icon: 'fas fa-chart-pie' }
        ]
    },
    {
        id: 'cadastros',
        title: 'Cadastros',
        icon: 'fas fa-edit',
        url: '#',
        submenu: [
            { id: 'cadastro-usuarios', title: 'Usuários', url: '#', icon: 'fas fa-user-cog' },
            { id: 'cadastro-clientes', title: 'Clientes', url: '#', icon: 'fas fa-user' },
            { id: 'cadastro-ativos', title: 'Ativos', url: '#', icon: 'fas fa-laptop' }
        ]
    }
];

// ===== BUILD MENU =====
function buildMenu() {
    const menu = document.getElementById('dynamicMenu');
    if (!menu) return;

    menuConfig.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'nav-item';

        if (item.submenu) {
            const a = document.createElement('a');
            a.className = `nav-link menu-toggle ${item.active ? 'active' : ''}`;
            a.href = 'javascript:void(0)';
            a.innerHTML = `<i class="${item.icon}"></i> <span>${item.title}</span>`;

            const submenu = document.createElement('div');
            submenu.className = `submenu ${item.active ? 'show' : ''}`;

            const ul = document.createElement('ul');
            ul.className = 'nav flex-column';

            item.submenu.forEach(sub => {
                const subLi = document.createElement('li');
                subLi.className = 'nav-item';
                const subA = document.createElement('a');
                subA.className = 'nav-link';
                subA.href = sub.url;
                subA.innerHTML = `<i class="${sub.icon}"></i> <span>${sub.title}</span>`;
                subLi.appendChild(subA);
                ul.appendChild(subLi);
            });

            submenu.appendChild(ul);
            li.appendChild(a);
            li.appendChild(submenu);

            a.addEventListener('click', (e) => {
                e.preventDefault();
                a.classList.toggle('collapsed');
                submenu.classList.toggle('show');
            });
        } else {
            const a = document.createElement('a');
            a.className = `nav-link ${item.active ? 'active' : ''}`;
            a.href = item.url;
            a.innerHTML = `<i class="${item.icon}"></i> <span>${item.title}</span>`;
            li.appendChild(a);
        }

        menu.appendChild(li);
    });
}

// ===== SETUP MOBILE MENU =====
function setupMobileMenu() {
    const toggler = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');

    if (!toggler) return;

    toggler.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

// ===== DARK MODE =====
function setupDarkMode() {
    const toggleBtn = document.getElementById("toggleTheme");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark");
            if (document.body.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
                toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
            } else {
                localStorage.setItem("theme", "light");
                toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>Modo Escuro</span>`;
            }
        });
    }
}

// ===== UPDATE DATE =====
function updateCurrentDate() {
    const el = document.getElementById('currentDate');
    if (el) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.textContent = new Date().toLocaleDateString('pt-BR', options);
    }
}

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
    const patrimonio = document.getElementById('filterPatrimonio').value.toLowerCase();
    const tipo = document.getElementById('filterTipo').value.toLowerCase();
    const departamento = document.getElementById('filterDepartamento').value.toLowerCase();
    const status = document.getElementById('filterStatus').value.toLowerCase();

    ativosFiltrados = ativosCompletos.filter(ativo => {
        const matchPatrimonio = ativo.patrimonio.toLowerCase().includes(patrimonio);
        const matchTipo = !tipo || ativo.tipo.toLowerCase() === tipo;
        const matchDepartamento = !departamento || ativo.departamento.toLowerCase() === departamento;
        const matchStatus = !status || ativo.status.toLowerCase() === status;

        return matchPatrimonio && matchTipo && matchDepartamento && matchStatus;
    });

    paginaAtual = 1;
    atualizarTabela();
}

// ===== ATUALIZAR TABELA =====
function atualizarTabela() {
    const inicio = (paginaAtual - 1) * itemsPorPagina;
    const fim = inicio + itemsPorPagina;
    const ativosExibir = ativosFiltrados.slice(inicio, fim);

    const tbody = document.getElementById('tabelaAtivosBody');
    tbody.innerHTML = '';

    if (ativosExibir.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-search" style="font-size: 40px; opacity: 0.5; display: block; margin-bottom: 10px;"></i>
                    Nenhum ativo encontrado com os filtros aplicados
                </td>
            </tr>
        `;
    } else {
        ativosExibir.forEach(ativo => {
            const statusClass = `status-${ativo.status}`;
            const statusLabel = ativo.status === 'ativo' ? 'Ativo' : ativo.status === 'manutencao' ? 'Em Manutenção' : 'Desativado';

            const row = `
                <tr>
                    <td><strong>${ativo.patrimonio}</strong></td>
                    <td>${ativo.tipo}</td>
                    <td>${ativo.marca} ${ativo.modelo}</td>
                    <td>${ativo.departamento}</td>
                    <td>${ativo.responsavel}</td>
                    <td>${ativo.dataAquisicao}</td>
                    <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                    <td>
                        <button onclick="verDetalhes(${ativo.id})" title="Ver Detalhes" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-size: 16px;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editarAtivo(${ativo.id})" title="Editar" style="background: none; border: none; color: #ffc107; cursor: pointer; font-size: 16px; margin-left: 10px;">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    // Atualizar stats
    document.getElementById('totalAtivosStat').textContent = ativosCompletos.length;
    document.getElementById('totalAtivoAtivos').textContent = ativosCompletos.filter(a => a.status === 'ativo').length;
    document.getElementById('totalManutencao').textContent = ativosCompletos.filter(a => a.status === 'manutencao').length;
    document.getElementById('totalDesativado').textContent = ativosCompletos.filter(a => a.status === 'desativado').length;
    document.getElementById('resultadosBuscas').textContent = ativosFiltrados.length;
    document.getElementById('totalRegistros').textContent = `Total: ${ativosFiltrados.length} registros`;

    // Atualizar paginação
    atualizarPaginacao();
}

// ===== ATUALIZAR PAGINAÇÃO =====
function atualizarPaginacao() {
    const totalPaginas = Math.ceil(ativosFiltrados.length / itemsPorPagina);
    const paginacaoDiv = document.getElementById('paginacao');
    paginacaoDiv.innerHTML = '';

    if (totalPaginas <= 1) return;

    // Botão Anterior
    if (paginaAtual > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = '← Anterior';
        btnAnterior.onclick = () => {
            paginaAtual--;
            atualizarTabela();
        };
        paginacaoDiv.appendChild(btnAnterior);
    }

    // Números das páginas
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === paginaAtual) {
            const btnAtiva = document.createElement('button');
            btnAtiva.textContent = i;
            btnAtiva.className = 'active';
            btnAtiva.style.pointerEvents = 'none';
            paginacaoDiv.appendChild(btnAtiva);
        } else if (i === 1 || i === totalPaginas || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.onclick = () => {
                paginaAtual = i;
                atualizarTabela();
            };
            paginacaoDiv.appendChild(btn);
        } else if (i === 2 || i === totalPaginas - 1) {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.padding = '8px 5px';
            paginacaoDiv.appendChild(span);
        }
    }

    // Botão Próximo
    if (paginaAtual < totalPaginas) {
        const btnProximo = document.createElement('button');
        btnProximo.textContent = 'Próximo →';
        btnProximo.onclick = () => {
            paginaAtual++;
            atualizarTabela();
        };
        paginacaoDiv.appendChild(btnProximo);
    }
}

// ===== VER DETALHES =====
function verDetalhes(id) {
    const ativo = ativosCompletos.find(a => a.id === id);
    if (ativo) {
        alert(`
DETALHES DO ATIVO
═══════════════════════════════════
Patrimônio: ${ativo.patrimonio}
Tipo: ${ativo.tipo}
Marca: ${ativo.marca}
Modelo: ${ativo.modelo}
Departamento: ${ativo.departamento}
Responsável: ${ativo.responsavel}
Data Aquisição: ${ativo.dataAquisicao}
Status: ${ativo.status === 'ativo' ? 'Ativo' : ativo.status === 'manutencao' ? 'Em Manutenção' : 'Desativado'}
        `);
    }
}

// ===== EDITAR ATIVO =====
function editarAtivo(id) {
    alert('Função de edição não implementada neste exemplo.\nEm produção, isso abriria um formulário para editar o ativo.');
}

// ===== EXPORTAR EXCEL =====
function exportarExcel() {
    let csv = 'Patrimônio,Tipo,Marca/Modelo,Departamento,Responsável,Data Aquisição,Status\n';

    ativosFiltrados.forEach(ativo => {
        const status = ativo.status === 'ativo' ? 'Ativo' : ativo.status === 'manutencao' ? 'Em Manutenção' : 'Desativado';
        csv += `${ativo.patrimonio},${ativo.tipo},"${ativo.marca} ${ativo.modelo}",${ativo.departamento},${ativo.responsavel},${ativo.dataAquisicao},${status}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'relatorio_ativos.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ Relatório exportado com sucesso!\nArquivo: relatorio_ativos.csv');
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    buildMenu();
    setupMobileMenu();
    setupDarkMode();
    updateCurrentDate();
    atualizarTabela();
});