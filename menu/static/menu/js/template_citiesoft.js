/* ===== TEMPLATE CITIESOFT BASE - JAVASCRIPT ===== */

// ===== MENU CONFIGURATION COM URLS DJANGO =====
let menuConfig = [];

// Função para inicializar o menu com URLs
function initializeMenuConfig() {
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
                { 
                    id: 'Cadastro-ativos', 
                    title: 'Cadastro de Ativos', 
                    url: window.DjangoURLs ? window.DjangoURLs.cadastro_ativo : '#', 
                    icon: 'fas fa-laptop' 
                },
                { 
                    id: 'Abertura-tickets', 
                    title: 'Abertura de Tickets', 
                    url: window.DjangoURLs ? window.DjangoURLs.abrir_chamado : '#', 
                    icon: 'fas fa-ticket-alt' 
                },
                /*{ 
                    id: 'inventario-chamados', 
                    title: 'Chamados (OCS)', 
                    url: window.DjangoURLs ? window.DjangoURLs.abrir_chamado : '#', 
                    icon: 'fas fa-headset' 
                }*/,
            ]
        },
        {
            id: 'relatorios',
            title: 'Relatórios',
            icon: 'fas fa-file-alt',
            url: '#',
            submenu: [
                { 
                    id: 'relatorio-ativos', 
                    title: 'Relatório de Ativos', 
                    url: window.DjangoURLs ? window.DjangoURLs.relatorio_ativos : '#', 
                    icon: 'fas fa-laptop' 
                },
                { 
                    id: 'relatorio-tickets', 
                    title: 'Relatório de Tickets', 
                    url:  window.DjangoURLs ? window.DjangoURLs.relatorios_atendimento :'#', 
                    icon: 'fas fa-ticket-alt' 
                },
                { 
                    id: 'relatorio-analise', 
                    title: 'Análise e Métricas', 
                    url: window.DjangoURLs ? window.DjangoURLs.relatorios_atendimento : '#', 
                    icon: 'fas fa-chart-pie' 
                }
            ]
        },
        {
            id: 'Gestão de usuários',
            title: 'Gestão de usuários',
            icon: 'fas fa-edit',
            url: '#',
            submenu: [
                { 
                    id: 'cadastro-usuarios', 
                    title: 'Usuários', 
                    url: window.DjangoURLs ? window.DjangoURLs.register : '#', 
                    icon: 'fas fa-user-cog' 
                },
                { 
                    id: 'Autorização-usuarios', 
                    title: 'Autorização de Usuários', 
                    url: window.DjangoURLs ? window.DjangoURLs.autorizacao_usuarios : '#', 
                    icon: 'fas fa-user' 
                },
                { 
                    id: 'Atribuição-tickets', 
                    title: 'Atribuição de Tickets', 
                    url: window.DjangoURLs ? window.DjangoURLs.atribuicao_tickets : '#', 
                    icon: 'fas fa-laptop' 
                },
                { 
                    id: 'relatorio-usuarios', 
                    title: 'Relatório de Usuários', 
                    url: window.DjangoURLs ? window.DjangoURLs.pessoas_ativas : '#', 
                    icon: 'fas fa-users' 
                }
            ]
        },
        {
            type: 'divider'
        },
        {
            id: 'metricas-kpi',
            title: 'Métricas KPI',
            icon: 'fas fa-chart-line',
            url: window.DjangoURLs ? window.DjangoURLs.metricas_kpi : '#',
            active: false
        },
        {
            id: 'base-conhecimento',
            title: 'Base de Conhecimento',
            icon: 'fas fa-book',
            url: '#',
            submenu: [
                { 
                    id: 'gerenciar-artigos', 
                    title: 'Gerenciar Artigos', 
                    url: window.DjangoURLs ? window.DjangoURLs.admin_base_conhecimento :'/menu/admin_base_conhecimento/', 
                    icon: 'fas fa-edit'
                },
                { 
                    id: 'Site oficial', 
                    title: 'Site Oficial', 
                    url: 'https://citiesoft.com.br/',  
                    icon: 'fas fa-laptop-code'   
                },
                { 
                    id: 'quem-somos', 
                    title: 'Quem Somos', 
                    url:  'https://citiesoft.com.br/about', 
                    icon: 'fas fa-building'  
                },
                /*{ 
                    id: 'artigos', 
                    title: 'Artigos', 
                    url: '#', 
                    icon: 'fas fa-newspaper' 
                }*/
            ]
        },
        {
            id: 'suporte',
            title: 'Suporte',
            icon: 'fas fa-life-ring',
            url: '#',
            submenu: [
                { 
                    id: 'suporte-email', 
                    title: 'suporte@citiesoft.com', 
                    url: 'mailto:suporte@citiesoft.com', 
                    icon: 'fas fa-envelope' 
                }
            ]
        }
    ];
}

// ===== BUILD MENU =====
function buildMenu() {
    const menu = document.getElementById('dynamicMenu');
    if (!menu) return;

    menu.innerHTML = ''; // Limpar menu anterior

    menuConfig.forEach((item) => {
        // Pular divisores
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
            // Menu com submenu
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
                
                // Se for um link #, não redireciona
                if (sub.url && sub.url !== '#') {
                    subA.addEventListener('click', (e) => {
                        // Se for mailto:, deixa funcionar naturalmente
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

            // Toggle submenu ao clicar
            a.addEventListener('click', (e) => {
                e.preventDefault();
                a.classList.toggle('collapsed');
                submenu.classList.toggle('show');
            });
        } else {
            // Menu sem submenu (link direto)
            const a = document.createElement('a');
            a.className = `nav-link ${item.active ? 'active' : ''}`;
            a.href = item.url || '#';
            a.innerHTML = `<i class="${item.icon}"></i> <span>${item.title}</span>`;
            
            // Se for um link #, não redireciona
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

// ===== SETUP MOBILE MENU =====
function setupMobileMenu() {
    const toggler = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');

    if (!toggler || !sidebar) return;

    toggler.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// ===== SETUP DARK MODE =====
function setupDarkMode() {
    const toggleBtn = document.getElementById('toggleTheme');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            document.body.classList.toggle('dark');
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
            } else {
                localStorage.setItem('theme', 'light');
                toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>Modo Escuro</span>`;
            }
        });
    }
}

// ===== UPDATE CURRENT DATE =====
function updateCurrentDate() {
    const el = document.getElementById('currentDate');
    if (el) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.textContent = new Date().toLocaleDateString('pt-BR', options);
    }
}

// ===== INITIALIZE BASE =====
function initializeBase() {
    console.log('✓ Inicializando estrutura base do Citiesoft...');
    
    // Inicializar menu com URLs
    initializeMenuConfig();
    
    // Build menu
    buildMenu();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup dark mode
    setupDarkMode();
    
    // Update date
    updateCurrentDate();
    
    console.log('✓ Estrutura base inicializada com sucesso!');
}

// ===== AUTO-INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    initializeBase();
});
