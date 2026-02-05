/* ===== TEMPLATE CLIENTE CITIESOFT - JAVASCRIPT ===== */

// ===== MENU CONFIGURATION PARA CLIENTES =====
let menuConfig = [];
// Função para inicializar o menu com URLs
function initializeMenuConfig() {
    menuConfig = [
        {
            id: 'painel',
            title: 'Painel Principal',
            icon: 'fas fa-tachometer-alt',
            url: window.DjangoURLs ? window.DjangoURLs.template_cliente : '/menu/template_cliente/',
            active: true
        },   
        {
            id: 'novo-chamado',
            title: '+ Novo Chamado',
            icon: 'fas fa-plus-circle',
            url: window.DjangoURLs ? window.DjangoURLs.abrir_chamado_cliente : '#',
            active: false,
            highlight: true  // Item destacado
        },
        {
            type: 'divider'
        },
        {
            id: 'meus-chamados',
            title: 'Meus Chamados',
            icon: 'fas fa-ticket-alt',
            url: window.DjangoURLs ? window.DjangoURLs.meus_chamados : '#',
            active: false
        },
        {
            type: 'divider'
        },
        {
            id: 'base-conhecimento',
            title: 'Base de Conhecimento',
            icon: 'fas fa-book',
            url: window.DjangoURLs ? window.DjangoURLs.base_conhecimento : '#',
            active: false
        },
        {
            type: 'divider'
        },
        {
            id: 'contato',
            title: 'Contato / Suporte',
            icon: 'fas fa-headset',
            url: '#',
            submenu: [
                { 
                    id: 'email-suporte', 
                    title: 'suporte@citiesoft.com', 
                    url: 'mailto:suporte@citiesoft.com', 
                    icon: 'fas fa-envelope' 
                },
                { 
                    id: 'whatsapp-suporte', 
                    title: '(98) 98888-8888', 
                    url: 'https://wa.me/5598988888888', 
                    icon: 'fab fa-whatsapp' 
                },
                { 
                    id: 'telefone-suporte', 
                    title: '(98) 3333-3333', 
                    url: 'tel:+559833333333', 
                    icon: 'fas fa-phone' 
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
        // Divisores
        if (item.type === 'divider') {
            const li = document.createElement('li');
            li.className = 'nav-divider';
            menu.appendChild(li);
            return;
        }

        const li = document.createElement('li');
        li.className = 'nav-item';

        if (item.submenu) {
            // Menu com submenu
            const a = document.createElement('a');
            a.className = `nav-link menu-toggle ${item.active ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`;
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
                
                let linkContent = `<i class="${sub.icon}"></i> <span>${sub.title}</span>`;
                if (sub.badge) {
                    linkContent += `<span class="nav-badge">${sub.badge}</span>`;
                }
                subA.innerHTML = linkContent;
                
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
            a.className = `nav-link ${item.active ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`;
            a.href = item.url || '#';
            a.innerHTML = `<i class="${item.icon}"></i> <span>${item.title}</span>`;
            
            // Adicionar evento de clique
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
    const savedTheme = localStorage.getItem('theme-cliente');

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
                localStorage.setItem('theme-cliente', 'dark');
                toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
            } else {
                localStorage.setItem('theme-cliente', 'light');
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
    console.log('✓ Inicializando Portal do Cliente...');
    
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
    
    console.log('✓ Portal do Cliente inicializado com sucesso!');
}

// ===== AUTO-INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    initializeBase();
});