/* ===== ADMIN BASE DE CONHECIMENTO - JAVASCRIPT ===== */

// ===== VARIÁVEIS GLOBAIS =====
let articles = [];
let editingArticleId = null;
let tags = [];
let tinymceEditor = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Inicializando Gerenciador de Base de Conhecimento...');
    
    // Carregar artigos do Django
    loadArticles();
    
    // Inicializar event listeners
    initializeEventListeners();
    
    // Inicializar TinyMCE
    initializeTinyMCE();
    
    // Inicializar tags input
    initializeTagsInput();
    
    console.log('✓ Gerenciador inicializado com sucesso!');
});

// ===== CARREGAR ARTIGOS DO DJANGO =====
function loadArticles() {
    // Fazer requisição para API Django
    fetch('/menu/api/artigos/')
        .then(response => response.json())
        .then(data => {
            articles = data;
            renderArticles();
            updateStats();
        })
        .catch(error => {
            console.error('Erro ao carregar artigos:', error);
            // Mostrar empty state em caso de erro
            document.getElementById('emptyState').style.display = 'block';
        });
}

// ===== RENDERIZAR ARTIGOS =====
function renderArticles(filteredArticles = null) {
    const tbody = document.getElementById('articlesTableBody');
    const emptyState = document.getElementById('emptyState');
    const articlesToRender = filteredArticles || articles;
    
    if (articlesToRender.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = articlesToRender.map(article => {
        const approval = calculateApproval(article.avaliacoes_positivas, article.avaliacoes_negativas);
        
        return `
            <tr>
                <td>
                    <div class="article-title">
                        <i class="fas fa-file-alt"></i>
                        ${article.titulo}
                    </div>
                    <div class="article-meta" style="margin-top: 8px;">
                        <span><i class="fas fa-calendar"></i> ${formatDate(article.data_publicacao)}</span>
                        <span><i class="fas fa-user"></i> ${article.autor || 'Admin'}</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${article.tipo}">${getTipoLabel(article.tipo)}</span>
                </td>
                <td>${article.categoria.nome}</td>
                <td>
                    <span class="badge ${article.ativo ? 'ativo' : 'inativo'}">
                        ${article.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    ${article.destaque ? '<span class="badge destaque" style="margin-left: 5px;">Destaque</span>' : ''}
                </td>
                <td>
                    <div class="article-meta">
                        <span><i class="fas fa-eye"></i> ${article.visualizacoes}</span>
                        <span><i class="fas fa-thumbs-up"></i> ${approval}%</span>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewArticle(${article.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="editArticle(${article.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="confirmDelete(${article.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== ATUALIZAR ESTATÍSTICAS =====
function updateStats() {
    const totalArticles = articles.length;
    const totalViews = articles.reduce((sum, a) => sum + a.visualizacoes, 0);
    const featuredArticles = articles.filter(a => a.destaque).length;
    
    let totalPositive = 0;
    let totalNegative = 0;
    articles.forEach(a => {
        totalPositive += a.avaliacoes_positivas;
        totalNegative += a.avaliacoes_negativas;
    });
    const avgRating = calculateApproval(totalPositive, totalNegative);
    
    document.getElementById('totalArticles').textContent = totalArticles;
    document.getElementById('totalViews').textContent = totalViews.toLocaleString('pt-BR');
    document.getElementById('featuredArticles').textContent = featuredArticles;
    document.getElementById('avgRating').textContent = avgRating + '%';
}

// ===== INICIALIZAR TINYMCE =====
function initializeTinyMCE() {
    tinymce.init({
        selector: '#conteudo',
        readonly: false, // Força o modo de edição
        height: 400,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
        language: 'pt_BR',
        license_key: 'gpl', // Tenta forçar o modo open-source se a chave falhar
        setup: function(editor) {
            tinymceEditor = editor;
            // Quando o editor carregar, removemos qualquer trava de leitura
            editor.on('init', function() {
                editor.mode.set('design'); 
            });
        }
    });
}

// ===== INICIALIZAR TAGS INPUT =====
function initializeTagsInput() {
    const tagsInput = document.getElementById('tagsInput');
    const tagsContainer = document.getElementById('tagsContainer');
    
    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            addTag(this.value.trim());
            this.value = '';
        }
    });
    
    tagsContainer.addEventListener('click', function() {
        tagsInput.focus();
    });
}

function addTag(tagText) {
    if (!tags.includes(tagText)) {
        tags.push(tagText);
        renderTags();
    }
}

function removeTag(tagText) {
    tags = tags.filter(t => t !== tagText);
    renderTags();
}

function renderTags() {
    const tagsInput = document.getElementById('tagsInput');
    const container = document.getElementById('tagsContainer');
    
    // Remove todas as tags existentes
    const existingTags = container.querySelectorAll('.tag-item');
    existingTags.forEach(tag => tag.remove());
    
    // Adiciona novas tags
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${tag}
            <span class="tag-remove" onclick="removeTag('${tag}')">×</span>
        `;
        container.insertBefore(tagElement, tagsInput);
    });
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Botão novo artigo
    document.getElementById('btnNewArticle').addEventListener('click', openNewArticle);
    
    // Botão publicar
    document.getElementById('btnPublish').addEventListener('click', publishArticle);
    
    // Botão salvar rascunho
    document.getElementById('btnSaveDraft').addEventListener('click', saveDraft);
    
    // Botão confirmar delete
    document.getElementById('btnConfirmDelete').addEventListener('click', deleteArticle);
    
    // Busca
    document.getElementById('searchArticles').addEventListener('input', applyFilters);
    
    // Filtros
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterSort').addEventListener('change', applyFilters);
    
    // Auto-gerar slug ao digitar título
    document.getElementById('titulo').addEventListener('input', function() {
        const slug = generateSlug(this.value);
        document.getElementById('slug').value = slug;
    });
    
    // Reset ao fechar modal
    const articleModal = document.getElementById('articleModal');
    articleModal.addEventListener('hidden.bs.modal', resetForm);
}

// ===== ABRIR MODAL NOVO ARTIGO =====
function openNewArticle() {
    editingArticleId = null;
    resetForm();
    
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Novo Artigo';
    
    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}

// ===== EDITAR ARTIGO =====
function editArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    editingArticleId = id;
    
    // Preencher formulário
    document.getElementById('articleId').value = article.id;
    document.getElementById('titulo').value = article.titulo;
    document.getElementById('slug').value = article.slug;
    document.getElementById('resumo').value = article.resumo;
    document.getElementById('categoria').value = article.categoria.id;
    document.getElementById('tipo').value = article.tipo;
    document.getElementById('tempo_leitura').value = article.tempo_leitura;
    document.getElementById('ativo').checked = article.ativo;
    document.getElementById('destaque').checked = article.destaque;
    
    // Tags
    tags = article.tags ? article.tags.split(', ') : [];
    renderTags();
    
    // Conteúdo (TinyMCE)
    if (tinymceEditor) {
        tinymceEditor.setContent(article.conteudo);
    }
    
    // Atualizar título do modal
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Artigo';
    
    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}

// ===== VISUALIZAR ARTIGO =====
function viewArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    // Abrir página pública do artigo em nova aba
    window.open(`/menu/conhecimento/artigo/${article.slug}/`, '_blank');
}

// ===== PUBLICAR ARTIGO =====
function publishArticle() {
    if (!validateForm()) return;
    
    const articleData = getFormData();
    articleData.ativo = true; // Forçar ativo ao publicar
    
    saveArticle(articleData);
}

// ===== SALVAR RASCUNHO =====
function saveDraft() {
    if (!validateBasicFields()) return;
    
    const articleData = getFormData();
    articleData.ativo = false; // Forçar inativo como rascunho
    
    saveArticle(articleData);
}

// ===== SALVAR ARTIGO (AJAX PARA DJANGO) =====
function saveArticle(articleData) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const url = editingArticleId 
        ? `/menu/api/artigos/${editingArticleId}/update/`
        : `/menu/api/artigos/create/`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(articleData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(editingArticleId ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!');
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('articleModal'));
            modal.hide();
            
            // Recarregar lista
            loadArticles();
        } else {
            alert('Erro ao salvar artigo: ' + (data.message || 'Erro desconhecido'));
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar artigo. Verifique o console.');
    });
}

// ===== CONFIRMAR DELETE =====
function confirmDelete(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    document.getElementById('deleteArticleId').value = id;
    document.getElementById('deleteArticleTitle').textContent = article.titulo;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// ===== DELETE ARTIGO (AJAX PARA DJANGO) =====
function deleteArticle() {
    const id = parseInt(document.getElementById('deleteArticleId').value);
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    fetch(`/menu/api/artigos/${id}/delete/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Artigo excluído com sucesso!');
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();
            
            // Recarregar lista
            loadArticles();
        } else {
            alert('Erro ao excluir artigo: ' + (data.message || 'Erro desconhecido'));
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao excluir artigo. Verifique o console.');
    });
}

// ===== APLICAR FILTROS =====
function applyFilters() {
    const searchTerm = document.getElementById('searchArticles').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const typeFilter = document.getElementById('filterType').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const sortFilter = document.getElementById('filterSort').value;
    
    let filtered = [...articles];
    
    // Busca
    if (searchTerm) {
        filtered = filtered.filter(a => 
            a.titulo.toLowerCase().includes(searchTerm) ||
            a.resumo.toLowerCase().includes(searchTerm) ||
            (a.tags && a.tags.toLowerCase().includes(searchTerm))
        );
    }
    
    // Categoria
    if (categoryFilter) {
        filtered = filtered.filter(a => a.categoria.id == categoryFilter);
    }
    
    // Tipo
    if (typeFilter) {
        filtered = filtered.filter(a => a.tipo === typeFilter);
    }
    
    // Status
    if (statusFilter === 'ativo') {
        filtered = filtered.filter(a => a.ativo);
    } else if (statusFilter === 'inativo') {
        filtered = filtered.filter(a => !a.ativo);
    }
    
    // Ordenação
    switch(sortFilter) {
        case 'recente':
            filtered.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
            break;
        case 'antigo':
            filtered.sort((a, b) => new Date(a.data_publicacao) - new Date(b.data_publicacao));
            break;
        case 'visualizacoes':
            filtered.sort((a, b) => b.visualizacoes - a.visualizacoes);
            break;
        case 'titulo':
            filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
    }
    
    renderArticles(filtered);
}

// ===== VALIDAÇÃO =====
function validateForm() {
    const titulo = document.getElementById('titulo').value.trim();
    const resumo = document.getElementById('resumo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;
    const conteudo = tinymceEditor ? tinymceEditor.getContent() : '';
    
    if (!titulo) {
        alert('Por favor, preencha o título do artigo.');
        return false;
    }
    
    if (!resumo) {
        alert('Por favor, preencha o resumo do artigo.');
        return false;
    }
    
    if (!categoria) {
        alert('Por favor, selecione uma categoria.');
        return false;
    }
    
    if (!tipo) {
        alert('Por favor, selecione o tipo de artigo.');
        return false;
    }
    
    if (!conteudo || conteudo === '<p></p>') {
        alert('Por favor, preencha o conteúdo do artigo.');
        return false;
    }
    
    return true;
}

function validateBasicFields() {
    const titulo = document.getElementById('titulo').value.trim();
    
    if (!titulo) {
        alert('Por favor, preencha ao menos o título para salvar o rascunho.');
        return false;
    }
    
    return true;
}

// ===== GET FORM DATA =====
function getFormData() {
    const categoriaId = document.getElementById('categoria').value;
    
    return {
        titulo: document.getElementById('titulo').value.trim(),
        slug: document.getElementById('slug').value.trim(),
        resumo: document.getElementById('resumo').value.trim(),
        conteudo: tinymceEditor ? tinymceEditor.getContent() : '',
        categoria_id: categoriaId,
        tipo: document.getElementById('tipo').value,
        tags: tags.join(', '),
        tempo_leitura: parseInt(document.getElementById('tempo_leitura').value) || 5,
        ativo: document.getElementById('ativo').checked,
        destaque: document.getElementById('destaque').checked
    };
}

// ===== RESET FORM =====
function resetForm() {
    document.getElementById('articleForm').reset();
    tags = [];
    renderTags();
    
    if (tinymceEditor) {
        tinymceEditor.setContent('');
        // Força a remoção e reinicialização se necessário
        tinymce.execCommand('mceRemoveEditor', false, 'conteudo');
        tinymce.execCommand('mceAddEditor', false, 'conteudo');
    }
    
    editingArticleId = null;
}

// ===== UTILITÁRIOS =====
function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function getTipoLabel(tipo) {
    const tipos = {
        'tutorial': 'Tutorial',
        'guia': 'Guia',
        'faq': 'FAQ'
    };
    return tipos[tipo] || tipo;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function calculateApproval(positive, negative) {
    const total = positive + negative;
    if (total === 0) return 0;
    return Math.round((positive / total) * 100);
}

console.log('✓ Admin Base de Conhecimento JS carregado com sucesso!');