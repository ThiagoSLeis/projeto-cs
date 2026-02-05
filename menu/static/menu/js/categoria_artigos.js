/* ===== CATEGORIA DE ARTIGOS - JAVASCRIPT ===== */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    initFilters();
    initSort();
    initPagination();
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
// ===== INICIALIZAR FILTROS =====
function initFilters() {
    const filterType = document.getElementById('filterType');
    
    if (!filterType) return;

    filterType.addEventListener('change', function() {
        const selectedType = this.value;
        const articles = document.querySelectorAll('.article-card-full');
        
        articles.forEach(article => {
            if (selectedType === 'todos' || article.getAttribute('data-type') === selectedType) {
                article.style.display = 'flex';
            } else {
                article.style.display = 'none';
            }
        });

        updateArticlesCount();
    });
}

// ===== INICIALIZAR ORDENAÇÃO =====
function initSort() {
    const sortBy = document.getElementById('sortBy');
    
    if (!sortBy) return;

    sortBy.addEventListener('change', function() {
        const selectedSort = this.value;
        console.log('Ordenando por:', selectedSort);
        
        // Em produção, fazer requisição AJAX para reordenar
        // sortArticles(selectedSort);
        
        // Simulação de ordenação no frontend (apenas para demonstração)
        sortArticlesLocally(selectedSort);
    });
}

// ===== ORDENAR ARTIGOS LOCALMENTE =====
function sortArticlesLocally(sortBy) {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    const articles = Array.from(articlesGrid.querySelectorAll('.article-card-full'));
    
    articles.sort((a, b) => {
        switch(sortBy) {
            case 'recentes':
                // Ordenar por data (mais recente primeiro)
                // Em produção, usar data real do atributo data-date
                return Math.random() - 0.5; // Simulação
                
            case 'visualizacoes':
                // Ordenar por visualizações
                const viewsA = parseInt(a.querySelector('.article-stats .article-meta-item:first-child').textContent.trim());
                const viewsB = parseInt(b.querySelector('.article-stats .article-meta-item:first-child').textContent.trim());
                return viewsB - viewsA;
                
            case 'avaliacao':
                // Ordenar por avaliação
                const ratingA = parseFloat(a.querySelector('.article-stats .article-meta-item:last-child').textContent.trim());
                const ratingB = parseFloat(b.querySelector('.article-stats .article-meta-item:last-child').textContent.trim());
                return ratingB - ratingA;
                
            default: // 'relevancia'
                return 0;
        }
    });

    // Reordenar DOM
    articles.forEach(article => articlesGrid.appendChild(article));
}

// ===== ATUALIZAR CONTADOR DE ARTIGOS =====
function updateArticlesCount() {
    const visibleArticles = document.querySelectorAll('.article-card-full[style="display: flex;"], .article-card-full:not([style])');
    const countElement = document.querySelector('.articles-count strong');
    
    if (countElement) {
        countElement.textContent = visibleArticles.length;
    }
}

// ===== INICIALIZAR PAGINAÇÃO =====
function initPagination() {
    // Tornar botões de página clicáveis
    document.querySelectorAll('.pagination-btn:not(#prevPage):not(#nextPage)').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll suave para o topo
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
                
                // Em produção, carregar artigos da nova página via AJAX
                const pageNumber = this.textContent.trim();
                console.log('Carregando página:', pageNumber);
                // loadArticlesPage(pageNumber);
            }
        });
    });
}

// ===== MUDAR PÁGINA =====
function changePage(direction) {
    const currentPage = document.querySelector('.pagination-btn.active');
    const allPages = document.querySelectorAll('.pagination-btn:not(#prevPage):not(#nextPage)');
    const currentIndex = Array.from(allPages).indexOf(currentPage);
    
    let newIndex = currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < allPages.length) {
        currentPage.classList.remove('active');
        allPages[newIndex].classList.add('active');
        
        // Scroll suave para o topo
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
        
        // Em produção, carregar artigos da nova página via AJAX
        const pageNumber = allPages[newIndex].textContent.trim();
        console.log('Carregando página:', pageNumber);
        // loadArticlesPage(pageNumber);
    }
}

// ===== CARREGAR ARTIGOS DE UMA PÁGINA (AJAX) =====
function loadArticlesPage(page) {
    const articlesGrid = document.getElementById('articlesGrid');
    const categoria = window.location.pathname.split('/').filter(Boolean).pop();
    
    // Mostrar loading
    articlesGrid.innerHTML = '<div style="text-align: center; padding: 60px;"><i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i></div>';
    
    // Fazer requisição AJAX
    fetch(`/api/conhecimento/categorias/${categoria}/artigos/?page=${page}`)
        .then(response => response.json())
        .then(data => {
            renderArticles(data.artigos);
        })
        .catch(error => {
            console.error('Erro ao carregar artigos:', error);
            articlesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Erro ao carregar artigos</h3>
                    <p>Tente novamente mais tarde.</p>
                </div>
            `;
        });
}

// ===== RENDERIZAR ARTIGOS =====
function renderArticles(artigos) {
    const articlesGrid = document.getElementById('articlesGrid');
    
    if (!artigos || artigos.length === 0) {
        articlesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Nenhum artigo encontrado</h3>
                <p>Não há artigos disponíveis nesta categoria no momento.</p>
            </div>
        `;
        return;
    }
    
    // Limpar grid
    articlesGrid.innerHTML = '';
    
    // Adicionar artigos
    artigos.forEach(artigo => {
        const articleCard = createArticleCard(artigo);
        articlesGrid.appendChild(articleCard);
    });
    
    updateArticlesCount();
}

// ===== CRIAR CARD DE ARTIGO =====
function createArticleCard(artigo) {
    const card = document.createElement('div');
    card.className = 'article-card-full';
    card.setAttribute('data-article', artigo.slug);
    card.setAttribute('data-type', artigo.tipo);
    card.onclick = () => window.location.href = `/cliente/conhecimento/artigo/${artigo.slug}/`;
    
    card.innerHTML = `
        <div class="article-card-header">
            <div class="article-badge article-badge-${artigo.tipo}">${artigo.tipo.toUpperCase()}</div>
            <div class="article-meta">
                <span class="article-meta-item">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(artigo.data_publicacao)}
                </span>
                <span class="article-meta-item">
                    <i class="fas fa-user"></i>
                    ${artigo.autor}
                </span>
            </div>
        </div>

        <div class="article-card-body">
            <h4>${artigo.titulo}</h4>
            
            <p class="article-description">${artigo.resumo}</p>

            ${artigo.tags && artigo.tags.length > 0 ? `
                <div class="article-tags">
                    ${artigo.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}

            <div class="article-card-footer">
                <div class="article-stats">
                    <span class="article-meta-item">
                        <i class="fas fa-eye"></i>
                        ${artigo.visualizacoes}
                    </span>
                    <span class="article-meta-item">
                        <i class="fas fa-star"></i>
                        ${artigo.avaliacao}
                    </span>
                </div>
                <div class="read-time">
                    <i class="fas fa-clock"></i>
                    ${artigo.tempo_leitura} min
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// ===== FORMATAR DATA =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.changePage = changePage;