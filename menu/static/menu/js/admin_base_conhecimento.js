/* ===== ADMIN BASE DE CONHECIMENTO - JAVASCRIPT ===== */

// ===== VARIÁVEIS GLOBAIS =====
let articles = [];
let editingArticleId = null;
let tags = [];
let tinymceEditor = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function () {
    loadArticles();
    initializeEventListeners();
    initializeTagsInput();
});
// ===== CARREGAR ARTIGOS =====
function loadArticles() {
    fetch('/menu/api/artigos/')
        .then(res => res.json())
        .then(data => {
            articles = data;
            renderArticles();
            updateStats();
        })
        .catch(() => {
            document.getElementById('emptyState').style.display = 'block';
        });
}

// ===== RENDERIZAR ARTIGOS =====
function renderArticles(filteredArticles = null) {
    const tbody = document.getElementById('articlesTableBody');
    const emptyState = document.getElementById('emptyState');
    const list = filteredArticles || articles;

    if (!list.length) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = list.map(article => {
        const approval = calculateApproval(
            article.avaliacoes_positivas,
            article.avaliacoes_negativas
        );

        return `
        <tr>
            <td>
                <div class="article-title">
                    <i class="fas fa-file-alt"></i>
                    ${article.titulo}
                </div>
            </td>
            <td>
                <span class="badge ${article.tipo}">
                    ${getTipoLabel(article.tipo)}
                </span>
            </td>
            <td>${article.categoria.nome}</td>
            <td>
                <span class="badge ${article.ativo ? 'ativo' : 'inativo'}">
                    ${article.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>${approval}%</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view"
                        onclick="viewArticle(${article.id})"
                        title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>

                    <button class="btn-action btn-edit"
                        onclick="editArticle(${article.id})"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>

                    <button class="btn-action btn-delete"
                        onclick="confirmDelete(${article.id})"
                        title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// ===== ESTATÍSTICAS =====
function updateStats() {
    document.getElementById('totalArticles').textContent = articles.length;
}

// ===== TINYMCE =====
function initializeTinyMCE(initialContent = '') {

    if (tinymce.get('conteudo')) {
        tinymceEditor = tinymce.get('conteudo');
        tinymceEditor.mode.set('design'); // ✅ TinyMCE 6
        if (initialContent) {
            tinymceEditor.setContent(initialContent);
        }
        return;
    }

    tinymce.init({
        selector: '#conteudo',
        height: 350,
        menubar: false,
        readonly: false,
        plugins: 'lists link image code table wordcount',
        toolbar: 'undo redo | bold italic | bullist numlist | link image | code',
        setup: function (editor) {
            tinymceEditor = editor;

            editor.on('init', function () {
                editor.mode.set('design'); // ✅ forma correta
                if (initialContent) {
                    editor.setContent(initialContent);
                }
            });
        }
    });
}






// ===== EVENTOS =====
function initializeEventListeners() {

    document.getElementById('btnNewArticle').addEventListener('click', openNewArticle);
    document.getElementById('btnPublish').addEventListener('click', publishArticle);
    document.getElementById('btnSaveDraft').addEventListener('click', saveDraft);
    document.getElementById('btnConfirmDelete').addEventListener('click', deleteArticle);

    document.getElementById('titulo').addEventListener('input', function () {
        document.getElementById('slug').value = generateSlug(this.value);
    });

    document
        .getElementById('articleModal')
        .addEventListener('hidden.bs.modal', resetForm);
}

// ===== MODAL =====
function openNewArticle() {
    editingArticleId = null;
    resetForm();

    document.getElementById('modalTitle').innerHTML =
        '<i class="fas fa-plus-circle"></i> Novo Artigo';

    const modalEl = document.getElementById('articleModal');
    const modal = new bootstrap.Modal(modalEl);

    modalEl.addEventListener('shown.bs.modal', function () {
        initializeTinyMCE();
    }, { once: true });

    modal.show();
}


function editArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    editingArticleId = id;

    titulo.value = article.titulo;
    slug.value = article.slug;
    resumo.value = article.resumo;
    categoria.value = article.categoria.id;
    tipo.value = article.tipo;

    tags = article.tags ? article.tags.split(', ') : [];
    renderTags();

    const modalEl = document.getElementById('articleModal');
    const modal = new bootstrap.Modal(modalEl);

    modalEl.addEventListener('shown.bs.modal', function () {
        initializeTinyMCE(article.conteudo || '');
    }, { once: true });

    modal.show();
}



// ===== VISUALIZAR =====
function viewArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    window.open(`/menu/admin/conhecimento/artigo/${article.slug}/preview/`, '_blank');

}

// ===== SALVAR =====
function publishArticle() {
    if (!validateForm()) return;
    saveArticle(true);
}

function saveDraft() {
    if (!validateBasicFields()) return;
    saveArticle(false);
}

function saveArticle(ativo) {
    const data = getFormData();
    data.ativo = ativo;

    fetch(
        editingArticleId
            ? `/menu/api/artigos/${editingArticleId}/update/`
            : `/menu/api/artigos/create/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(data)
        }
    ).then(() => {
        bootstrap.Modal.getInstance(articleModal).hide();
        loadArticles();
    });
}

// ===== DELETE =====
function confirmDelete(id) {
    deleteArticleId.value = id;
    new bootstrap.Modal(deleteModal).show();
}

function deleteArticle() {
    fetch(`/menu/api/artigos/${deleteArticleId.value}/delete/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(() => {
        bootstrap.Modal.getInstance(deleteModal).hide();
        loadArticles();
    });
}

// ===== FORM =====
function resetForm() {
    articleForm.reset();
    tags = [];
    renderTags();

    if (tinymce.get('conteudo')) {
        tinymce.get('conteudo').remove();
        tinymceEditor = null;
    }

    editingArticleId = null;
}


function getFormData() {
    return {
        titulo: titulo.value.trim(),
        slug: slug.value.trim(),
        resumo: resumo.value.trim(),
        conteudo: tinymceEditor ? tinymceEditor.getContent() : '',
        categoria_id: categoria.value,
        tipo: tipo.value,
        tags: tags.join(', '),
        destaque: document.getElementById('destaque').checked
    };
}


// ===== VALIDAÇÃO =====
function validateForm() {
    if (!titulo.value.trim() ||
        !resumo.value.trim() ||
        !categoria.value ||
        !tipo.value ||
        !tinymceEditor.getContent({ format: 'text' }).trim()
    ) {
        alert('Preencha todos os campos obrigatórios.');
        return false;
    }
    return true;
}

function validateBasicFields() {
    return !!titulo.value.trim();
}

// ===== TAGS =====
function initializeTagsInput() {
    tagsInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && tagsInput.value.trim()) {
            e.preventDefault();
            tags.push(tagsInput.value.trim());
            tagsInput.value = '';
            renderTags();
        }
    });
}

function renderTags() {
    tagsContainer.querySelectorAll('.tag-item').forEach(t => t.remove());

    tags.forEach(tag => {
        const el = document.createElement('div');
        el.className = 'tag-item';
        el.innerHTML = `${tag} <span onclick="removeTag('${tag}')">×</span>`;
        tagsContainer.insertBefore(el, tagsInput);
    });
}

function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderTags();
}

// ===== UTIL =====
function generateSlug(text) {
    return text.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function getTipoLabel(tipo) {
    return { tutorial: 'Tutorial', guia: 'Guia', faq: 'FAQ' }[tipo] || tipo;
}

function calculateApproval(p, n) {
    const t = p + n;
    return t ? Math.round((p / t) * 100) : 0;
}

// ===== EXPOR FUNÇÕES INLINE =====
window.editArticle = editArticle;
window.confirmDelete = confirmDelete;
window.deleteArticle = deleteArticle;
window.viewArticle = viewArticle;
