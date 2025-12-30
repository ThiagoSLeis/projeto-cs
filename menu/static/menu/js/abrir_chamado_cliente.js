/* ===== ABRIR CHAMADO CLIENTE - JAVASCRIPT ===== */

// ===== CATEGORIAS POR ÁREA =====
const categoriasPorArea = {
    hardware: [
        { value: 'computador', text: 'Computador / Desktop' },
        { value: 'notebook', text: 'Notebook / Laptop' },
        { value: 'impressora', text: 'Impressora / Scanner' },
        { value: 'monitor', text: 'Monitor / Display' },
        { value: 'perifericos', text: 'Periféricos (Mouse, Teclado, etc)' },
        { value: 'servidor', text: 'Servidor' },
        { value: 'outro_hw', text: 'Outro Hardware' }
    ],
    software: [
        { value: 'sistema_operacional', text: 'Sistema Operacional' },
        { value: 'aplicativo', text: 'Aplicativo / Software' },
        { value: 'licenca', text: 'Licença de Software' },
        { value: 'atualizacao', text: 'Atualização de Software' },
        { value: 'instalacao', text: 'Instalação de Software' },
        { value: 'desempenho', text: 'Desempenho / Lentidão' },
        { value: 'erro_software', text: 'Erro no Software' }
    ],
    rede: [
        { value: 'internet', text: 'Conexão com Internet' },
        { value: 'wifi', text: 'Rede Wi-Fi' },
        { value: 'vpn', text: 'VPN / Acesso Remoto' },
        { value: 'email', text: 'E-mail / Webmail' },
        { value: 'firewall', text: 'Firewall / Segurança de Rede' },
        { value: 'servidor_rede', text: 'Servidor de Rede' },
        { value: 'compartilhamento', text: 'Compartilhamento de Arquivos' }
    ],
    desenvolvimento: [
        { value: 'bug', text: 'Correção de Bug' },
        { value: 'nova_funcionalidade', text: 'Nova Funcionalidade' },
        { value: 'melhoria', text: 'Melhoria / Otimização' },
        { value: 'api', text: 'API / Integração' },
        { value: 'deploy', text: 'Deploy / Publicação' },
        { value: 'codigo', text: 'Revisão de Código' },
        { value: 'documentacao', text: 'Documentação' }
    ],
    banco_dados: [
        { value: 'consulta', text: 'Consulta / Query' },
        { value: 'desempenho_bd', text: 'Desempenho do Banco' },
        { value: 'backup', text: 'Backup / Restore' },
        { value: 'modelagem', text: 'Modelagem de Dados' },
        { value: 'migracao', text: 'Migração de Dados' },
        { value: 'integridade', text: 'Integridade de Dados' },
        { value: 'acesso_bd', text: 'Acesso ao Banco' }
    ],
    suporte_usuario: [
        { value: 'acesso', text: 'Acesso / Login' },
        { value: 'senha', text: 'Recuperação de Senha' },
        { value: 'treinamento', text: 'Treinamento / Capacitação' },
        { value: 'duvida', text: 'Dúvida / Consultoria' },
        { value: 'permissao', text: 'Permissões / Autorizações' },
        { value: 'usuario_novo', text: 'Novo Usuário' },
        { value: 'usuario_inativo', text: 'Inativar Usuário' }
    ],
    seguranca: [
        { value: 'virus', text: 'Vírus / Malware' },
        { value: 'phishing', text: 'Phishing / Spam' },
        { value: 'vazamento', text: 'Vazamento de Dados' },
        { value: 'politica_seguranca', text: 'Política de Segurança' },
        { value: 'auditoria', text: 'Auditoria / Compliance' },
        { value: 'criptografia', text: 'Criptografia' },
        { value: 'incidente', text: 'Incidente de Segurança' }
    ],
    outro: [
        { value: 'sugestao', text: 'Sugestão' },
        { value: 'reclamacao', text: 'Reclamação' },
        { value: 'elogio', text: 'Elogio' },
        { value: 'outros', text: 'Outros' }
    ]
};

// ===== VARIÁVEIS GLOBAIS =====
let currentStep = 1;
let uploadedFiles = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Inicializando Formulário de Abertura de Chamado...');
    
    initializeAreaCategoria();
    initializeStepNavigation();
    initializeFormValidation();
    initializeFileUpload();
    initializeCharCounter();
    initializeFormReview();
    
    console.log('✓ Formulário inicializado com sucesso!');
});

// ===== ÁREA E CATEGORIA =====
function initializeAreaCategoria() {
    const areaSelect = document.getElementById('area');
    
    if (areaSelect) {
        areaSelect.addEventListener('change', function() {
            const area = this.value;
            const categoriaSelect = document.getElementById('categoria');
            
            categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
            
            if (area && categoriasPorArea[area]) {
                categoriaSelect.disabled = false;
                categoriasPorArea[area].forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.value;
                    option.textContent = cat.text;
                    categoriaSelect.appendChild(option);
                });
            } else {
                categoriaSelect.disabled = true;
                categoriaSelect.innerHTML = '<option value="">Selecione a área primeiro</option>';
            }
        });
    }
}

// ===== NAVEGAÇÃO ENTRE STEPS =====
function initializeStepNavigation() {
    // Botões Next
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            if (validateCurrentStep()) {
                goToStep(nextStep);
            }
        });
    });

    // Botões Previous
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });
}

function goToStep(stepNumber) {
    // Atualizar step atual
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) === stepNumber) {
            step.classList.add('active');
        }
    });

    // Atualizar indicadores de progresso
    const progressSteps = document.querySelectorAll('.step');
    progressSteps.forEach(step => {
        const num = parseInt(step.getAttribute('data-step'));
        if (num === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else if (num < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Gerenciar visibilidade dos botões
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');

    prevBtn.style.display = stepNumber > 1 ? 'flex' : 'none';
    
    if (stepNumber === 1) {
        prevBtn.setAttribute('data-prev', '1');
    } else if (stepNumber === 2) {
        prevBtn.setAttribute('data-prev', '1');
        nextBtn.setAttribute('data-next', '3');
    } else if (stepNumber === 3) {
        prevBtn.setAttribute('data-prev', '2');
    }

    if (stepNumber === 3) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
        updateReview();
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }

    currentStep = stepNumber;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VALIDAÇÃO DO FORMULÁRIO =====
function initializeFormValidation() {
    const submitBtn = document.querySelector('.btn-submit');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'Este campo é obrigatório');
        } else {
            clearFieldError(field);
        }
    });

    return isValid;
}

function validateForm() {
    // Validar todos os campos obrigatórios
    const assunto = document.getElementById('assunto');
    const area = document.getElementById('area');
    const categoria = document.getElementById('categoria');
    const prioridade = document.getElementById('prioridade');
    const descricao = document.getElementById('descricao');

    let isValid = true;

    if (!assunto.value.trim()) {
        showFieldError(assunto, 'O assunto é obrigatório');
        isValid = false;
    }

    if (!area.value) {
        showFieldError(area, 'Selecione uma área');
        isValid = false;
    }

    if (!categoria.value) {
        showFieldError(categoria, 'Selecione uma categoria');
        isValid = false;
    }

    if (!prioridade.value) {
        showFieldError(prioridade, 'Selecione a prioridade');
        isValid = false;
    }

    if (!descricao.value.trim()) {
        showFieldError(descricao, 'A descrição é obrigatória');
        isValid = false;
    }

    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    
    // Remover erro anterior se existir
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Adicionar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e9ecef';
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ===== UPLOAD DE ARQUIVOS =====
function initializeFileUpload() {
    const fileInput = document.getElementById('anexos');
    const uploadArea = document.getElementById('fileUploadArea');

    if (!fileInput || !uploadArea) return;

    // Click para selecionar arquivo
    uploadArea.addEventListener('click', function(e) {
        if (e.target.closest('.file-remove')) return;
        fileInput.click();
    });

    // Seleção de arquivo
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // Drag and Drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    const placeholder = document.querySelector('.upload-placeholder');

    Array.from(files).forEach(file => {
        // Validar tamanho (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`O arquivo "${file.name}" excede o tamanho máximo de 10MB`);
            return;
        }

        // Adicionar à lista
        uploadedFiles.push(file);

        // Criar elemento visual
        const fileItem = createFileItem(file);
        fileList.appendChild(fileItem);
    });

    // Ocultar placeholder se houver arquivos
    if (uploadedFiles.length > 0) {
        placeholder.style.display = 'none';
        fileList.style.display = 'block';
    }
}

function createFileItem(file) {
    const div = document.createElement('div');
    div.className = 'file-item';

    const icon = getFileIcon(file.name);
    const size = formatFileSize(file.size);

    div.innerHTML = `
        <div class="file-info">
            <div class="file-icon">
                <i class="${icon}"></i>
            </div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${size}</div>
            </div>
        </div>
        <button type="button" class="file-remove" onclick="removeFile('${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;

    return div;
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'xls': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'txt': 'fas fa-file-alt',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image'
    };
    return icons[ext] || 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function removeFile(filename) {
    // Remover do array
    uploadedFiles = uploadedFiles.filter(f => f.name !== filename);

    // Remover elemento visual
    const fileList = document.getElementById('fileList');
    const items = fileList.querySelectorAll('.file-item');
    items.forEach(item => {
        if (item.querySelector('.file-name').textContent === filename) {
            item.remove();
        }
    });

    // Mostrar placeholder se não houver mais arquivos
    if (uploadedFiles.length === 0) {
        const placeholder = document.querySelector('.upload-placeholder');
        placeholder.style.display = 'block';
        fileList.style.display = 'none';
    }

    // Atualizar input
    const fileInput = document.getElementById('anexos');
    const dt = new DataTransfer();
    uploadedFiles.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
}

// ===== CONTADOR DE CARACTERES =====
function initializeCharCounter() {
    const textarea = document.getElementById('descricao');
    const counter = document.getElementById('charCount');

    if (textarea && counter) {
        textarea.addEventListener('input', function() {
            const count = this.value.length;
            counter.textContent = count;

            // Alerta se exceder 2000
            if (count > 2000) {
                counter.style.color = '#dc3545';
                this.value = this.value.substring(0, 2000);
            } else {
                counter.style.color = '#6c757d';
            }
        });
    }
}

// ===== REVISÃO DO FORMULÁRIO =====
function initializeFormReview() {
    // Listeners para atualizar preview ao digitar
    const formFields = ['assunto', 'area', 'categoria', 'prioridade', 'descricao', 'passos_reproduzir'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', updateReview);
            field.addEventListener('input', updateReview);
        }
    });
}

function updateReview() {
    // Assunto
    const assunto = document.getElementById('assunto').value;
    document.getElementById('review-assunto').textContent = assunto || '-';

    // Área
    const area = document.getElementById('area');
    const areaText = area.options[area.selectedIndex]?.text || '-';
    document.getElementById('review-area').textContent = areaText;

    // Categoria
    const categoria = document.getElementById('categoria');
    const categoriaText = categoria.options[categoria.selectedIndex]?.text || '-';
    document.getElementById('review-categoria').textContent = categoriaText;

    // Prioridade
    const prioridade = document.getElementById('prioridade');
    const prioridadeText = prioridade.options[prioridade.selectedIndex]?.text || '-';
    const reviewPrioridade = document.getElementById('review-prioridade');
    reviewPrioridade.textContent = prioridadeText;
    
    // Cor da prioridade
    const prioridadeValue = prioridade.value;
    const cores = {
        'baixa': '#28a745',
        'media': '#ffc107',
        'alta': '#ff9800',
        'critica': '#dc3545'
    };
    reviewPrioridade.style.color = cores[prioridadeValue] || 'inherit';
    reviewPrioridade.style.fontWeight = '700';

    // Descrição
    const descricao = document.getElementById('descricao').value;
    document.getElementById('review-descricao').textContent = descricao || '-';

    // Passos para Reproduzir
    const passos = document.getElementById('passos_reproduzir').value;
    const passosContainer = document.getElementById('review-passos-container');
    if (passos.trim()) {
        passosContainer.style.display = 'block';
        document.getElementById('review-passos').textContent = passos;
    } else {
        passosContainer.style.display = 'none';
    }

    // Anexos
    const anexosContainer = document.getElementById('review-anexos-container');
    if (uploadedFiles.length > 0) {
        anexosContainer.style.display = 'block';
        const anexosList = uploadedFiles.map(f => `• ${f.name} (${formatFileSize(f.size)})`).join('\n');
        document.getElementById('review-anexos').textContent = anexosList;
    } else {
        anexosContainer.style.display = 'none';
    }
}

// ===== SUBMISSÃO DO FORMULÁRIO =====
function submitForm() {
    const form = document.getElementById('ticketForm');
    const formData = new FormData(form);

    // Adicionar arquivos ao FormData
    uploadedFiles.forEach(file => {
        formData.append('anexos', file);
    });

    // Mostrar loading
    showLoading();

    // AJAX para envio (configurar URL do Django)
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccessModal(data.protocolo);
        } else {
            showError(data.message || 'Erro ao enviar o chamado. Tente novamente.');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Erro ao enviar o chamado. Tente novamente.');
        console.error('Erro:', error);
    });
}

function showLoading() {
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
}

function hideLoading() {
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Chamado';
}

function showSuccessModal(protocolo = null) {
    // Gerar número de protocolo aleatório se não fornecido
    const protocolNumber = protocolo || Math.floor(100000 + Math.random() * 900000);
    
    // Atualizar número do protocolo no modal
    document.getElementById('protocolNumber').textContent = protocolNumber;

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();

    // Limpar formulário após 3 segundos
    setTimeout(() => {
        resetForm();
    }, 3000);
}

function showError(message) {
    alert(message); // Substituir por um modal ou notificação mais elegante
}

function resetForm() {
    document.getElementById('ticketForm').reset();
    uploadedFiles = [];
    document.getElementById('fileList').innerHTML = '';
    document.querySelector('.upload-placeholder').style.display = 'block';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('categoria').disabled = true;
    document.getElementById('categoria').innerHTML = '<option value="">Selecione a área primeiro</option>';
    goToStep(1);
}

// ===== UTILITÁRIOS =====
// Prevenir submit com Enter (exceto em textarea)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = e.target.closest('form');
        if (form && form.id === 'ticketForm') {
            e.preventDefault();
        }
    }
});

console.log('✓ Abrir Chamado Cliente JS carregado com sucesso!');