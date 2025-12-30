/* ===== BUSCA RESULTADOS - JAVASCRIPT ===== */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initSearchInput();
    initFilters();
    initSort();
    initPagination();
    highlightSearchTerms();
});

// ===== INICIALIZAR INPUT DE BUSCA =====
function initSearchInput() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;

    // Enter para buscar
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performNewSearch();
        }
    });
}

// ===== REALIZAR NOVA BUSCA =====
function performNewSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        window.location.href = `?q=${encodeURIComponent(searchTerm)}`;
    } else {
        alert('Por favor, digite um termo de busca.');
    }
}

// ===== INICIALIZAR FILTROS =====
function initFilters() {
    initCategoryFilters();
    initTypeFilters();
    initDateFilters();
}

// ===== FILTROS DE CATEGORIA =====
function initCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('[id^="cat-"]');
    
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.id === 'cat-all') {
                // Se "Todas" for marcada, desmarcar outras
                if (this.checked) {
                    document.querySelectorAll('[id^="cat-"]:not(#cat-all)').forEach(cb => {
                        cb.checked = false;
                    });
                }
            } else {
                // Se qualquer outra for marcada, desmarcar "Todas"
                if (this.checked) {
                    document.getElementById('cat-all').checked = false;
                }
            }
            
            applyFilters();
        });
    });
}

// ===== FILTROS DE TIPO =====
function initTypeFilters() {
    const typeRadios = document.querySelectorAll('[name="tipo"]');
    
    typeRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
}

// ===== FILTROS DE DATA =====
function initDateFilters() {
    const dateRadios = document.querySelectorAll('[name="data"]');
    
    dateRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
}

// ===== APLICAR FILTROS =====
function applyFilters() {
    const results = document.querySelectorAll('.result-item');
    let visibleCount = 0;
    
    // Coletar filtros selecionados
    const selectedCategories = getSelectedCategories();
    const selectedType = getSelectedType();
    const selectedDateRange = getSelectedDateRange();
    
    results.forEach(result => {
        let show = true;
        
        // Filtro de categoria
        if (selectedCategories.length > 0) {
            const resultCategory = result.getAttribute('data-category');
            if (!selectedCategories.includes(resultCategory)) {
                show = false;
            }
        }
        
        // Filtro de tipo
        if (selectedType !== 'all') {
            const resultType = result.getAttribute('data-type');
            if (resultType !== selectedType) {
                show = false;
            }
        }
        
        // Filtro de data
        if (selectedDateRange !== 'all') {
            const resultDate = new Date(result.getAttribute('data-date'));
            if (!isDateInRange(resultDate, selectedDateRange)) {
                show = false;
            }
        }
        
        // Aplicar visibilidade
        if (show) {
            result.classList.remove('hidden');
            result.style.display = 'block';
            visibleCount++;
        } else {
            result.classList.add('hidden');
            result.style.display = 'none';
        }
    });
    
    // Atualizar contador
    updateResultsCount(visibleCount);
}

// ===== OBTER CATEGORIAS SELECIONADAS =====
function getSelectedCategories() {
    const categories = [];
    const checkboxes = document.querySelectorAll('[id^="cat-"]:checked:not(#cat-all)');
    
    checkboxes.forEach(cb => {
        const category = cb.id.replace('cat-', '');
        categories.push(category);
    });
    
    return categories;
}

// ===== OBTER TIPO SELECIONADO =====
function getSelectedType() {
    const checkedType = document.querySelector('[name="tipo"]:checked');
    return checkedType ? checkedType.id.replace('tipo-', '') : 'all';
}

// ===== OBTER INTERVALO DE DATA SELECIONADO =====
function getSelectedDateRange() {
    const checkedDate = document.querySelector('[name="data"]:checked');
    return checkedDate ? checkedDate.id.replace('data-', '') : 'all';
}

// ===== VERIFICAR SE DATA ESTÁ NO INTERVALO =====
function isDateInRange(date, range) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch(range) {
        case 'week':
            return diffDays <= 7;
        case 'month':
            return diffDays <= 30;
        case 'year':
            return diffDays <= 365;
        default:
            return true;
    }
}

// ===== ATUALIZAR CONTADOR DE RESULTADOS =====
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// ===== LIMPAR TODOS OS FILTROS =====
function clearAllFilters() {
    // Categorias
    document.getElementById('cat-all').checked = true;
    document.querySelectorAll('[id^="cat-"]:not(#cat-all)').forEach(cb => {
        cb.checked = false;
    });
    
    // Tipo
    document.getElementById('tipo-all').checked = true;
    
    // Data
    document.getElementById('data-all').checked = true;
    
    // Ordenação
    document.getElementById('sortResults').value = 'relevancia';
    
    // Aplicar filtros (mostrar todos)
    applyFilters();
}

// ===== INICIALIZAR ORDENAÇÃO =====
function initSort() {
    const sortSelect = document.getElementById('sortResults');
    
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        const selectedSort = this.value;
        sortResults(selectedSort);
    });
}

// ===== ORDENAR RESULTADOS =====
function sortResults(sortBy) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultsContainer) return;

    const results = Array.from(resultsContainer.querySelectorAll('.result-item:not(.hidden)'));
    
    results.sort((a, b) => {
        switch(sortBy) {
            case 'recentes':
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));
                return dateB - dateA;
                
            case 'antigos':
                const dateC = new Date(a.getAttribute('data-date'));
                const dateD = new Date(b.getAttribute('data-date'));
                return dateC - dateD;
                
            case 'visualizacoes':
                const viewsA = parseInt(a.querySelector('.result-meta-item:nth-child(3)').textContent.trim());
                const viewsB = parseInt(b.querySelector('.result-meta-item:nth-child(3)').textContent.trim());
                return viewsB - viewsA;
                
            case 'avaliacao':
                const ratingA = parseFloat(a.querySelector('.result-meta-item:nth-child(4)').textContent.trim());
                const ratingB = parseFloat(b.querySelector('.result-meta-item:nth-child(4)').textContent.trim());
                return ratingB - ratingA;
                
            default: // 'relevancia'
                return 0;
        }
    });

    // Reordenar DOM
    results.forEach(result => resultsContainer.appendChild(result));
}

// ===== DESTACAR TERMOS DE BUSCA =====
function highlightSearchTerms() {
    if (typeof SEARCH_QUERY === 'undefined' || !SEARCH_QUERY) return;
    
    const terms = SEARCH_QUERY.toLowerCase().split(' ').filter(term => term.length > 2);
    
    if (terms.length === 0) return;
    
    const results = document.querySelectorAll('.result-title, .result-excerpt');
    
    results.forEach(element => {
        let html = element.innerHTML;
        
        terms.forEach(term => {
            const regex = new RegExp(`\\b(${escapeRegExp(term)})\\b`, 'gi');
            html = html.replace(regex, '<mark>$1</mark>');
        });
        
        element.innerHTML = html;
    });
}

// ===== ESCAPAR REGEX =====
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== INICIALIZAR PAGINAÇÃO =====
function initPagination() {
    // Tornar botões de página clicáveis
    const pageButtons = document.querySelectorAll('.pagination-btn:not(#prevPage):not(#nextPage)');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll suave para o topo
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
                
                // Em produção, carregar resultados da nova página via AJAX
                const pageNumber = this.textContent.trim();
                console.log('Carregando página:', pageNumber);
                // loadSearchResults(SEARCH_QUERY, pageNumber);
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
        
        // Em produção, carregar resultados da nova página via AJAX
        const pageNumber = allPages[newIndex].textContent.trim();
        console.log('Carregando página:', pageNumber);
        // loadSearchResults(SEARCH_QUERY, pageNumber);
    }
}

// ===== CARREGAR RESULTADOS DE BUSCA (AJAX) =====
function loadSearchResults(query, page = 1) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultsContainer) return;
    
    // Mostrar loading
    resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i>
            <p style="margin-top: 20px; color: var(--text-muted);">Buscando resultados...</p>
        </div>
    `;
    
    // Coletar filtros ativos
    const filters = {
        categories: getSelectedCategories(),
        type: getSelectedType(),
        dateRange: getSelectedDateRange(),
        sort: document.getElementById('sortResults').value
    };
    
    // Fazer requisição AJAX
    fetch(`/api/conhecimento/busca/?q=${encodeURIComponent(query)}&page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(data => {
        renderSearchResults(data.results);
        updateResultsCount(data.total);
    })
    .catch(error => {
        console.error('Erro ao carregar resultados:', error);
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Erro ao carregar resultados</h3>
                <p>Tente novamente mais tarde.</p>
            </div>
        `;
    });
}

// ===== RENDERIZAR RESULTADOS DE BUSCA =====
function renderSearchResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultsContainer) return;
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search-minus"></i>
                </div>
                <h3>Nenhum resultado encontrado</h3>
                <p>Tente usar palavras-chave diferentes.</p>
            </div>
        `;
        return;
    }
    
    // Limpar container
    resultsContainer.innerHTML = '';
    
    // Adicionar resultados
    results.forEach(result => {
        const resultItem = createResultItem(result);
        resultsContainer.appendChild(resultItem);
    });
    
    // Destacar termos de busca
    highlightSearchTerms();
}

// ===== CRIAR ITEM DE RESULTADO =====
function createResultItem(result) {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.setAttribute('data-category', result.categoria_slug);
    item.setAttribute('data-type', result.tipo);
    item.setAttribute('data-date', result.data_publicacao);
    item.onclick = () => window.location.href = `/cliente/conhecimento/artigo/${result.slug}/`;
    
    item.innerHTML = `
        <div class="result-header">
            <div class="result-title-area">
                <h3 class="result-title">${result.titulo}</h3>
                <div class="result-breadcrumb">
                    <i class="fas fa-folder"></i>
                    <span>${result.categoria}</span>
                    <i class="fas fa-chevron-right"></i>
                    <span>${result.tipo.toUpperCase()}</span>
                </div>
            </div>
            <span class="result-badge article-badge-${result.tipo}">
                ${result.tipo.toUpperCase()}
            </span>
        </div>
        
        <p class="result-excerpt">${result.resumo}</p>
        
        <div class="result-meta">
            <div class="result-meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(result.data_publicacao)}</span>
            </div>
            <div class="result-meta-item">
                <i class="fas fa-clock"></i>
                <span>${result.tempo_leitura} min de leitura</span>
            </div>
            <div class="result-meta-item">
                <i class="fas fa-eye"></i>
                <span>${result.visualizacoes} visualizações</span>
            </div>
            <div class="result-meta-item">
                <i class="fas fa-star"></i>
                <span>${result.avaliacao}/5.0</span>
            </div>
        </div>
    `;
    
    return item;
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
window.performNewSearch = performNewSearch;
window.clearAllFilters = clearAllFilters;
window.changePage = changePage;