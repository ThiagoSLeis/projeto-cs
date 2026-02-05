// ===== FORMULÁRIO ABRIR CHAMADO =====

let chamadosCriados = [];

document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
    setupUploadArea();
    setupRealtimeValidation();
    console.log('✓ Formulário Abrir Chamado carregado!');
});

// ===== VALIDAÇÃO DO FORMULÁRIO =====
function setupFormValidation() {
    const form = document.getElementById('formAbrirChamado');
    
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar campos obrigatórios
        const required = form.querySelectorAll('[required]');
        let isValid = true;

        required.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            showError('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        // Validar email
        const email = document.getElementById('email').value;
        if (!validarEmail(email)) {
            showError('Por favor, insira um email válido!');
            return;
        }

        // Validar telefone
        const telefone = document.getElementById('telefone').value;
        if (!validarTelefone(telefone)) {
            showError('Por favor, insira um telefone/ramal válido!');
            return;
        }

        // Se validação passou, processar o chamado
        processarChamado(form);
    });
}

// ===== PROCESSAR CHAMADO =====
function processarChamado(form) {
    // Gerar ID do ticket
    const ticketId = gerarTicketId();
    
    // Coleta dados do formulário
    const dadosChamado = {
        id: ticketId,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        departamento: document.getElementById('departamento').value,
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value,
        prioridade: document.getElementById('prioridade').value,
        equipamento: document.getElementById('equipamento').value || 'N/A',
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        dataAbertura: new Date().toLocaleString('pt-BR'),
        status: 'Aberto'
    };

    // Armazenar chamado (simulação)
    chamadosCriados.push(dadosChamado);
    console.log('Chamado criado:', dadosChamado);

    // Mostrar sucesso
    showSuccess(ticketId);

    // Limpar formulário
    form.reset();
    document.getElementById('uploadArea').innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <span>Clique ou arraste um arquivo aqui</span>
    `;

    // Desabilitar botão por 3 segundos
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // Redirecionar após 3 segundos
    setTimeout(() => {
        submitBtn.disabled = false;
        window.location.href = '{% url "citiesoft_home" %}';
    }, 3000);
}

// ===== GERAR ID DO TICKET =====
function gerarTicketId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TKT-${timestamp}-${random}`;
}

// ===== VALIDAR EMAIL =====
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== VALIDAR TELEFONE =====
function validarTelefone(telefone) {
    // Remove caracteres especiais
    const apenasNumeros = telefone.replace(/\D/g, '');
    // Aceita ramal (até 4 dígitos) ou celular (10-11 dígitos)
    return apenasNumeros.length >= 4;
}

// ===== UPLOAD AREA =====
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('anexo');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag over
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    // Drag leave
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    // Drop
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            processarArquivo(file, fileInput, uploadArea);
        }
    });

    // Input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            processarArquivo(file, fileInput, uploadArea);
        }
    });
}

// ===== PROCESSAR ARQUIVO =====
function processarArquivo(file, fileInput, uploadArea) {
    // Validar tipo de arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'text/plain', 'text/x-log'];
    
    if (!allowedTypes.includes(file.type)) {
        showError('Tipo de arquivo não permitido. Use: PNG, JPG, PDF, TXT ou LOG');
        return;
    }
    
    // Validar tamanho (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('Arquivo muito grande. Máximo 10MB');
        fileInput.value = '';
        return;
    }
    
    // Mostrar arquivo selecionado
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    uploadArea.innerHTML = `
        <i class="fas fa-check-circle me-2" style="color: var(--success-green);"></i>
        <span>${file.name} (${sizeMB}MB)</span>
    `;
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
function setupRealtimeValidation() {
    const inputs = document.querySelectorAll('.form-control[required]');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Validar email em tempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validarEmail(this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }

    // Contador de caracteres
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');

    if (tituloInput) {
        tituloInput.addEventListener('input', function() {
            const max = this.maxLength;
            const atual = this.value.length;
            const label = this.parentElement.querySelector('label');
            label.textContent = `Título do Chamado * (${atual}/${max})`;
        });
    }

    if (descricaoInput) {
        descricaoInput.addEventListener('input', function() {
            const max = this.maxLength;
            const atual = this.value.length;
            const label = this.parentElement.querySelector('label');
            label.textContent = `Descrição Detalhada * (${atual}/${max})`;
        });
    }
}

// ===== MENSAGENS =====
function showSuccess(ticketId) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    const ticketIdSpan = document.getElementById('ticketId');
    
    if (successMsg) {
        ticketIdSpan.textContent = ticketId;
        successMsg.classList.remove('d-none');
        errorMsg.classList.add('d-none');
        
        // Scroll para mensagem
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    
    if (errorMsg) {
        errorMsg.classList.remove('d-none');
        successMsg.classList.add('d-none');
        
        // Scroll para mensagem
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ===== ATUALIZAR CATEGORIA BASEADO NO TIPO =====
function atualizarCategoria() {
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria');
    
    // Limpar opções atuais
    categoria.innerHTML = '<option value="">Selecione a categoria...</option>';
    
    // Adicionar opções baseado no tipo
    const categorias = {
        'suporte': [
            { value: 'hardware', text: 'Hardware' },
            { value: 'software', text: 'Software' },
            { value: 'rede', text: 'Rede e Internet' },
            { value: 'email', text: 'Email' },
            { value: 'impressora', text: 'Impressora' },
            { value: 'sistema', text: 'Sistema' }
        ],
        'incidente': [
            { value: 'queda-sistema', text: 'Queda de Sistema' },
            { value: 'queda-rede', text: 'Queda de Rede' },
            { value: 'perda-dados', text: 'Perda de Dados' },
            { value: 'seguranca', text: 'Segurança' }
        ],
        'request': [
            { value: 'novo-usuario', text: 'Novo Usuário' },
            { value: 'reset-senha', text: 'Reset de Senha' },
            { value: 'acesso', text: 'Acesso a Sistema' },
            { value: 'instalacao', text: 'Instalação de Software' }
        ],
        'duvida': [
            { value: 'como-usar', text: 'Como Usar' },
            { value: 'configuracao', text: 'Configuração' },
            { value: 'senha', text: 'Senha' },
            { value: 'permissoes', text: 'Permissões' }
        ],
        'outro': [
            { value: 'outro', text: 'Outro' }
        ]
    };
    
    if (tipo && categorias[tipo]) {
        categorias[tipo].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.value;
            option.textContent = cat.text;
            categoria.appendChild(option);
        });
    }
}