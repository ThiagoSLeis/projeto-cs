/* ===== BASE DE CONHECIMENTO - JAVASCRIPT (CLIENTE) ===== */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    initSearch();
    initPopularSearches();
    initCategoryCards();
    initArticleCards();
});

// ===== ATUALIZAR DATA ATUAL =====
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const today = new Date().toLocaleDateString('pt-BR', options);
        dateElement.textContent = today.charAt(0).toUpperCase() + today.slice(1);
    }
}

// ===== TOGGLE FAQ =====
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const allQuestions = document.querySelectorAll('.faq-question');
    const allAnswers = document.querySelectorAll('.faq-answer');
    
    // Fechar todas as outras FAQs
    allQuestions.forEach(q => {
        if (q !== element) {
            q.classList.remove('active');
        }
    });
    
    allAnswers.forEach(a => {
        if (a !== answer) {
            a.classList.remove('open');
        }
    });
    
    // Toggle da FAQ clicada
    element.classList.toggle('active');
    answer.classList.toggle('open');
}

// ===== BUSCA EM TEMPO REAL =====
function initSearch() {
    const searchInput = document.getElementById('searchKnowledge');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length > 2) {
            console.log('Buscando:', searchTerm);
            // Aqui você pode implementar a busca real via AJAX
            // searchArticles(searchTerm);
        }
    });

    // Enter para buscar
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }
    });
}

// ===== POPULAR SEARCHES =====
function initPopularSearches() {
    const searchTags = document.querySelectorAll('.search-tag');
    const searchInput = document.getElementById('searchKnowledge');
    
    searchTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.textContent;
            
            if (searchInput) {
                searchInput.value = searchTerm;
                searchInput.focus();
                
                // Scroll suave para o input
                searchInput.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        });
    });
}

// ===== INICIALIZAR CARDS DE CATEGORIA =====
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                showCategoryArticles(category);
            }
        });
    });
}

// ===== INICIALIZAR CARDS DE ARTIGO =====
function initArticleCards() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('click', function() {
            const article = this.getAttribute('data-article');
            if (article) {
                showArticle(article);
            }
        });
    });
}

// ===== MOSTRAR CATEGORIA =====
function showCategoryArticles(category) {
    const categoryNames = {
        'locacao': 'Locação de Equipamentos',
        'suporte': 'Suporte Técnico',
        'desenvolvimento': 'Desenvolvimento de Software'
    };
    
    // Em produção, redirecionar para a página da categoria
    // window.location.href = `/cliente/conhecimento/categoria/${category}/`;
    
    console.log('Abrindo categoria:', categoryNames[category]);
    alert(`Abrindo categoria: ${categoryNames[category]}\n\nEm uma aplicação real, isso mostraria todos os artigos desta categoria.`);
}

// ===== MOSTRAR ARTIGO =====
function showArticle(articleId) {
    const articleTitles = {
        'renovar-contrato': 'Como renovar meu contrato de locação',
        'trocar-equipamento': 'Solicitar troca de equipamento com defeito',
        'acompanhar-projeto': 'Como acompanhar meu projeto de software',
        'politica-devolucao': 'Política de devolução de equipamentos',
        'backup-dados': 'Fazer backup antes de devolver equipamento',
        'configurar-equipamento': 'Configuração inicial do equipamento'
    };
    
    // Rastrear visualização
    trackArticleView(articleId);
    
    // Em produção, redirecionar para a página do artigo
    // window.location.href = `/cliente/conhecimento/artigo/${articleId}/`;
    
    console.log('Abrindo artigo:', articleTitles[articleId]);
    alert(`Abrindo artigo: ${articleTitles[articleId]}\n\nEm uma aplicação real, isso mostraria o conteúdo completo do artigo.`);
}

// ===== REALIZAR BUSCA =====
function performSearch(searchTerm) {
    // Em produção, redirecionar para página de resultados
    // window.location.href = `/cliente/conhecimento/busca/?q=${encodeURIComponent(searchTerm)}`;
    
    console.log('Buscando por:', searchTerm);
    alert(`Buscando por: "${searchTerm}"\n\nEm uma aplicação real, isso redirecionaria para a página de resultados.`);
}

// ===== BUSCAR ARTIGOS (AJAX - OPCIONAL) =====
function searchArticles(term) {
    // Exemplo de requisição AJAX
    fetch(`/api/conhecimento/busca/?q=${encodeURIComponent(term)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Artigos encontrados:', data.artigos);
            // Exibir resultados em dropdown ou redirecionar
            displaySearchResults(data.artigos);
        })
        .catch(error => {
            console.error('Erro na busca:', error);
        });
}

// ===== EXIBIR RESULTADOS DA BUSCA =====
function displaySearchResults(articles) {
    // Implementar lógica para mostrar resultados
    console.log('Exibindo resultados:', articles);
}

// ===== RASTREAR VISUALIZAÇÃO DE ARTIGO =====
function trackArticleView(articleId) {
    // Enviar analytics quando usuário clica em artigo
    fetch(`/api/conhecimento/artigos/${articleId}/view/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Visualização registrada:', data);
    })
    .catch(error => {
        console.error('Erro ao rastrear visualização:', error);
    });
}

// ===== AVALIAR ARTIGO (ÚTIL / NÃO ÚTIL) =====
function rateArticle(articleId, isHelpful) {
    fetch(`/api/conhecimento/artigos/${articleId}/rate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            helpful: isHelpful
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Obrigado pelo seu feedback!', 'success');
        }
    })
    .catch(error => {
        console.error('Erro ao avaliar artigo:', error);
        showNotification('Erro ao enviar avaliação', 'error');
    });
}

// ===== ABRIR CHAMADO =====
function openTicket() {
    // Em produção, redirecionar para abertura de chamado
    // window.location.href = '/cliente/chamados/abrir/';
    
    alert('Redirecionando para abertura de chamado...\n\nEm uma aplicação real, isso abriria o formulário de abertura de chamados.');
}

// ===== MOSTRAR INFO DE CONTATO =====
function showContactInfo() {
    const contactInfo = `
📧 Email: suporte@citiesoft.com

📱 WhatsApp: (98) 98888-8888

☎️ Telefone: (98) 3333-3333

🕐 Horário de atendimento:
Segunda a Sexta, 8h às 18h
    `;
    
    alert(contactInfo);
}

// ===== MOSTRAR NOTIFICAÇÃO =====
function showNotification(message, type = 'info') {
    // Implementar sistema de notificações toast
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Exemplo com alert (substituir por toast em produção)
    alert(message);
}

// ===== GET CSRF TOKEN =====
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

// ===== FECHAR DROPDOWN DE BUSCA AO CLICAR FORA =====
document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box-hero');
    const resultsContainer = document.getElementById('searchResults');
    
    if (resultsContainer && searchBox && !searchBox.contains(e.target)) {
        resultsContainer.style.display = 'none';
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== EXPORTAR FUNÇÕES PARA SEREM USADAS NO HTML =====
window.toggleFAQ = toggleFAQ;
window.showCategoryArticles = showCategoryArticles;
window.showArticle = showArticle;
window.openTicket = openTicket;
window.showContactInfo = showContactInfo;
window.rateArticle = rateArticle;