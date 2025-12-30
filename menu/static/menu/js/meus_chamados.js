/* ===== MEUS CHAMADOS - JAVASCRIPT ===== */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initFilterTabs();
    initSearch();
});

// ===== FILTROS POR STATUS =====
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const tableBody = document.getElementById('chamadosTableBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.querySelector('.table-responsive');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover active de todos
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Adicionar active no clicado
            this.classList.add('active');

            // Pegar filtro selecionado
            const filter = this.getAttribute('data-filter');

            // Filtrar chamados
            filterChamados(filter, tableBody, emptyState, tableContainer);
        });
    });
}

// ===== FUNÇÃO DE FILTRO =====
function filterChamados(filter, tableBody, emptyState, tableContainer) {
    const rows = tableBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        
        if (filter === 'todos') {
            // Mostrar todos
            row.style.display = '';
            visibleCount++;
        } else if (filter === 'abertos' && (status === 'aberto' || status === 'andamento')) {
            // Mostrar abertos e em andamento
            row.style.display = '';
            visibleCount++;
        } else if (filter === 'aguardando' && status === 'aguardando') {
            // Mostrar aguardando resposta
            row.style.display = '';
            visibleCount++;
        } else if (filter === 'resolvidos' && (status === 'resolvido' || status === 'fechado')) {
            // Mostrar resolvidos e fechados
            row.style.display = '';
            visibleCount++;
        } else {
            // Esconder os que não correspondem
            row.style.display = 'none';
        }
    });

    // Mostrar/esconder empty state
    if (visibleCount === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';
    }

    // Atualizar contador de paginação
    updatePaginationCounter(visibleCount);
}

// ===== BUSCA EM TEMPO REAL =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('chamadosTableBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.querySelector('.table-responsive');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            
            if (text.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Mostrar/esconder empty state
        if (visibleCount === 0 && searchTerm !== '') {
            tableContainer.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.querySelector('h3').textContent = 'Nenhum chamado encontrado';
            emptyState.querySelector('p').textContent = `Não foram encontrados resultados para "${searchTerm}".`;
        } else {
            tableContainer.style.display = 'block';
            emptyState.style.display = 'none';
        }

        // Atualizar contador
        updatePaginationCounter(visibleCount);
    });
}

// ===== ATUALIZAR CONTADOR DE PAGINAÇÃO =====
function updatePaginationCounter(visibleCount) {
    const paginationText = document.querySelector('.pagination-container > div');
    if (paginationText) {
        paginationText.innerHTML = `Mostrando <strong>1-${visibleCount}</strong> de <strong>${visibleCount}</strong> chamados`;
    }
}

// ===== VER DETALHES DO CHAMADO =====
function verChamado(id) {
    // Redirecionar para página de detalhes do chamado
    window.location.href = `/cliente/chamados/${id}/`;
    
    // Ou abrir em modal (alternativa)
    // abrirModalChamado(id);
}

// ===== OPCIONAL: ABRIR MODAL COM DETALHES =====
function abrirModalChamado(id) {
    // Fazer requisição AJAX para buscar detalhes
    fetch(`/api/chamados/${id}/`)
        .then(response => response.json())
        .then(data => {
            // Preencher modal com dados
            console.log('Dados do chamado:', data);
            // Implementar lógica de modal aqui
        })
        .catch(error => {
            console.error('Erro ao buscar chamado:', error);
            alert('Erro ao carregar detalhes do chamado.');
        });
}

// ===== PAGINAÇÃO (EXEMPLO BÁSICO) =====
function initPagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.querySelector('i')) return; // Ignorar botões prev/next por enquanto
            
            // Remover active de todos
            pageButtons.forEach(b => b.classList.remove('active'));
            
            // Adicionar active no clicado
            this.classList.add('active');
            
            // Aqui você implementaria a lógica de carregar página específica
            const pageNumber = this.textContent;
            console.log('Carregar página:', pageNumber);
            
            // Exemplo: carregarPagina(pageNumber);
        });
    });
}

// ===== CARREGAR PÁGINA (AJAX) =====
function carregarPagina(pageNumber) {
    // Implementar requisição AJAX para carregar página específica
    fetch(`/api/chamados/?page=${pageNumber}`)
        .then(response => response.json())
        .then(data => {
            // Atualizar tabela com novos dados
            console.log('Dados da página:', data);
            // Implementar atualização da tabela aqui
        })
        .catch(error => {
            console.error('Erro ao carregar página:', error);
        });
}

// ===== EXPORT PARA CSV (OPCIONAL) =====
function exportarCSV() {
    const rows = document.querySelectorAll('.table-chamados tbody tr:not([style*="display: none"])');
    let csv = 'ID,Título,Status,Prioridade,Categoria,Data Abertura,Última Atualização\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        
        // Pegar dados de cada célula (exceto a última que tem ações)
        for (let i = 0; i < cells.length - 1; i++) {
            let text = cells[i].textContent.trim();
            // Remover quebras de linha e vírgulas
            text = text.replace(/\n/g, ' ').replace(/,/g, ';');
            rowData.push(text);
        }
        
        csv += rowData.join(',') + '\n';
    });
    
    // Download do arquivo
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus_chamados_${new Date().getTime()}.csv`;
    a.click();
}

// ===== ATUALIZAR BADGES DOS FILTROS (DINÂMICO) =====
function atualizarBadges() {
    const tableBody = document.getElementById('chamadosTableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    let contadores = {
        todos: 0,
        abertos: 0,
        aguardando: 0,
        resolvidos: 0
    };
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        contadores.todos++;
        
        if (status === 'aberto' || status === 'andamento') {
            contadores.abertos++;
        } else if (status === 'aguardando') {
            contadores.aguardando++;
        } else if (status === 'resolvido' || status === 'fechado') {
            contadores.resolvidos++;
        }
    });
    
    // Atualizar badges
    document.querySelector('[data-filter="todos"] .badge').textContent = contadores.todos;
    document.querySelector('[data-filter="abertos"] .badge').textContent = contadores.abertos;
    document.querySelector('[data-filter="aguardando"] .badge').textContent = contadores.aguardando;
    document.querySelector('[data-filter="resolvidos"] .badge').textContent = contadores.resolvidos;
}

// ===== CHAMAR ATUALIZAÇÃO DE BADGES AO CARREGAR =====
document.addEventListener('DOMContentLoaded', function() {
    atualizarBadges();
});