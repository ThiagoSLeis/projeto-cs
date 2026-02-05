/* ===== TEMPLATE CITIESOFT BASE - JAVASCRIPT ===== */

let menuConfig = [];
function initializeMenuConfig() {
    // 1. ITENS INICIAIS (Todos veem)
    menuConfig = [
        {
            id: 'painel',
            title: 'Painel Principal',
            icon: 'fas fa-tachometer-alt',
            url: window.DjangoURLs ? window.DjangoURLs.citiesoft_home : '/menu/',
            active: true
        },
        {
            id: 'Chamados',
            title: 'Chamados',
            icon: 'fas fa-clipboard-list',
            url: '#',
            submenu: [
                { id: 'Cadastro-ativos', title: 'Cadastro de Ativos', url: window.DjangoURLs?.cadastro_ativo || '#', icon: 'fas fa-laptop' },
                { id: 'Abertura-tickets', title: 'Abertura de Tickets', url: window.DjangoURLs?.abrir_chamado || '#', icon: 'fas fa-ticket-alt' },
                { id: 'Meus-tickets', title: 'Meus Tickets', url: window.DjangoURLs?.meus_tickets || '#', icon: 'fas fa-headset' }
            ]
        },
        {
            id: 'relatorios',
            title: 'Relatórios',
            icon: 'fas fa-file-alt',
            url: '#',
            submenu: [
                { id: 'relatorio-ativos', title: 'Relatório de Ativos', url: window.DjangoURLs?.relatorio_ativos || '#', icon: 'fas fa-laptop' },
                { id: 'relatorio-tickets', title: 'Relatório de Tickets', url:  window.DjangoURLs?.relatorios_atendimento || '#', icon: 'fas fa-ticket-alt' }
            ]
        }
    ];

    // 2. 🛡️ BLOCO EXCLUSIVO: GESTÃO DE USUÁRIOS (Somente Admin)
    if (window.is_admin === true) {
        menuConfig.push({
            id: 'Gestão de usuários',
            title: 'Gestão de Usuários',
            icon: 'fas fa-user-shield',
            url: '#',
            submenu: [
                { id: 'cadastro-usuarios', title: 'Usuários', url: window.DjangoURLs?.cadastro_usuario || '#', icon: 'fas fa-user-cog' },
                { id: 'Autorização-usuarios', title: 'Autorização', url: window.DjangoURLs?.autorizacao_usuarios || '#', icon: 'fas fa-user-check' },
                { id: 'Atribuição-tickets', title: 'Atribuição de Tickets', url: window.DjangoURLs?.atribuicao_tickets || '#', icon: 'fas fa-tasks' },
                { id: 'relatorio-usuarios', title: 'Relatório de Usuários', url: window.DjangoURLs?.pessoas_ativas || '#', icon: 'fas fa-users' }
            ]
        });
    }

    // 3. ITENS FINAIS (Todos veem)
    menuConfig.push(
        { type: 'divider' },
        {
            id: 'metricas-kpi',
            title: 'Métricas KPI',
            icon: 'fas fa-chart-line',
            url: window.DjangoURLs?.metricas_kpi || '#',
            active: false
        },
        {
            id: 'base-conhecimento',
            title: 'Base de Conhecimento',
            icon: 'fas fa-book',
            url: '#',
            submenu: [
                { id: 'gerenciar-artigos', title: 'Gerenciar Artigos', url: window.DjangoURLs?.admin_base_conhecimento || '#', icon: 'fas fa-edit' },
                { id: 'Site oficial', title: 'Site Oficial', url: 'https://citiesoft.com.br/', icon: 'fas fa-laptop-code' }
            ]
        },
        {
            id: 'suporte',
            title: 'Suporte',
            icon: 'fas fa-life-ring',
            url: '#',
            submenu: [
                { id: 'suporte-email', title: 'suporte@citiesoft.com', url: 'mailto:suporte@citiesoft.com', icon: 'fas fa-envelope' }
            ]
        }
    );
}

// ===== MOTOR DE CONSTRUÇÃO DO MENU =====
function buildMenu() {
    const menu = document.getElementById('dynamicMenu');
    if (!menu) return;
    menu.innerHTML = ''; 

    menuConfig.forEach((item) => {
        if (item.type === 'divider') {
            const li = document.createElement('li');
            li.className = 'nav-divider';
            li.style.cssText = 'border-top: 1px solid rgba(0, 166, 255, 0.2); margin: 10px 0; opacity: 0.3;';
            menu.appendChild(li);
            return;
        }

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
                
                if (sub.url && sub.url !== '#') {
                    subA.addEventListener('click', (e) => {
                        if (!sub.url.startsWith('mailto:')) {
                            e.preventDefault();
                            window.location.href = sub.url;
                        }
                    });
                }
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
            a.href = item.url || '#';
            a.innerHTML = `<i class="${item.icon}"></i> <span>${item.title}</span>`;
            
            if (item.url && item.url !== '#') {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = item.url;
                });
            }
            li.appendChild(a);
        }
        menu.appendChild(li);
    });
}

// Funções Auxiliares (Mobile, Dark Mode, Data)
function setupMobileMenu() {
    const toggler = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    if (!toggler || !sidebar) return;
    toggler.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    });
}

function setupDarkMode() {
    const toggleBtn = document.getElementById('toggleTheme');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        });
    }
}

function updateCurrentDate() {
    const el = document.getElementById('currentDate');
    if (el) el.textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function initializeBase() {
    initializeMenuConfig();
    buildMenu();
    setupMobileMenu();
    setupDarkMode();
    updateCurrentDate();
}

document.addEventListener('DOMContentLoaded', initializeBase);