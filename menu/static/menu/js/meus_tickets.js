/* ===================================================================
   ARQUIVO: meus_tickets.js
   DESCRIÇÃO: Scripts da página Meus Atendimentos - Citiesoft
   ================================================================ */

/**
 * Inicializa a página de Meus Tickets
 */
function initMeusTickets() {
    console.log('✅ Página Meus Tickets carregada');
    
    // Adiciona animação de entrada nos cards
    animateCards();
    
    // Adiciona efeito nos botões
    setupButtonEffects();
    
    // Atualiza contadores se necessário
    updateCounters();
}
/**
 * Anima a entrada dos cards de estatísticas
 */
function animateCards() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

/**
 * Configura efeitos nos botões
 */
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Cria efeito de ripple
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                width: 20px;
                height: 20px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Atualiza os contadores dos cards
 */
function updateCounters() {
    const counters = document.querySelectorAll('.stat-card-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

/**
 * Filtra tickets por status (função auxiliar para futuro uso)
 */
function filterTicketsByStatus(status) {
    const rows = document.querySelectorAll('.tickets-table tbody tr');
    
    rows.forEach(row => {
        const badge = row.querySelector('.badge');
        const badgeText = badge ? badge.textContent.trim().toLowerCase() : '';
        
        if (status === 'todos' || badgeText === status.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Pesquisa tickets por assunto (função auxiliar para futuro uso)
 */
function searchTickets(searchTerm) {
    const rows = document.querySelectorAll('.tickets-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const subject = row.querySelector('.ticket-subject');
        const subjectText = subject ? subject.textContent.toLowerCase() : '';
        
        if (subjectText.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Exporta tabela para CSV (função auxiliar para futuro uso)
 */
function exportToCSV() {
    const rows = document.querySelectorAll('.tickets-table tr');
    let csv = [];
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];
        
        cols.forEach(col => {
            // Remove botões e pega apenas texto
            let text = col.textContent.trim();
            text = text.replace(/[\n\r]+/g, ' ');
            rowData.push('"' + text + '"');
        });
        
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'meus_tickets_' + new Date().toISOString().split('T')[0] + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Adiciona animação CSS para o ripple effect
if (!document.querySelector('#ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeusTickets);
} else {
    initMeusTickets();
}