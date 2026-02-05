// ===== DARK MODE GLOBAL =====
// Este arquivo gerencia o dark mode para toda a aplicação

function setupDarkMode() {
    const toggleBtn = document.getElementById('toggleTheme');
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema salvo ao carregar
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>`;
        }
    } else {
        document.body.classList.remove('dark');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>Modo Escuro</span>`;
        }
    }
    // Configurar evento do botão
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

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupDarkMode);