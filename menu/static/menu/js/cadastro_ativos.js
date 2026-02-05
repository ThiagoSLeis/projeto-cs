// ===== FORMULÁRIO CADASTRO ATIVO =====

let ativosCadastrados = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Inicializando Formulário Cadastro Ativo...');
    
    setupFormValidation();
    setupRealtimeValidation();
    
    console.log('✓ Formulário Cadastro Ativo carregado com sucesso!');
});
// ===== VALIDAÇÃO DO FORMULÁRIO =====
function setupFormValidation() {
    const form = document.getElementById('formCadastroAtivo');
    
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

        // Validar patrimônio (formato)
        const patrimonio = document.getElementById('patrimonio').value;
        if (!validarPatrimonio(patrimonio)) {
            showError('Por favor, insira um patrimônio válido (ex: NB-2025-001)');
            return;
        }

        // Validar data de aquisição
        const dataAquisicao = document.getElementById('dataAquisicao').value;
        if (!validarData(dataAquisicao)) {
            showError('Por favor, insira uma data válida');
            return;
        }

        // Se validação passou, processar o ativo
        processarAtivo(form);
    });
}

// ===== PROCESSAR ATIVO =====
function processarAtivo(form) {
    // Gerar ID do ativo
    const ativoId = gerarAtivoId();
    
    // Coleta dados do formulário
    const dadosAtivo = {
        id: ativoId,
        patrimonio: document.getElementById('patrimonio').value,
        tipo: document.getElementById('tipo').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        serie: document.getElementById('serie').value,
        descricao: document.getElementById('descricao').value || 'Sem descrição',
        departamento: document.getElementById('departamento').value,
        responsavel: document.getElementById('responsavel').value,
        localizacao: document.getElementById('localizacao').value,
        dataAquisicao: document.getElementById('dataAquisicao').value,
        valor: document.getElementById('valor').value || '0.00',
        fornecedor: document.getElementById('fornecedor').value || 'N/A',
        status: 'Ativo',
        dataCadastro: new Date().toLocaleString('pt-BR')
    };

    // Armazenar ativo (simulação)
    ativosCadastrados.push(dadosAtivo);
    console.log('Ativo cadastrado:', dadosAtivo);

    // Mostrar sucesso
    showSuccess(ativoId);

    // Limpar formulário
    form.reset();

    // Desabilitar botão por 3 segundos
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // Redirecionar após 3 segundos
    setTimeout(() => {
        submitBtn.disabled = false;
        window.location.href = '/menu/';
    }, 3000);
}

// ===== GERAR ID DO ATIVO =====
function gerarAtivoId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `AT-${timestamp}-${random}`;
}

// ===== VALIDAR PATRIMÔNIO =====
function validarPatrimonio(patrimonio) {
    // Aceita formatos como: NB-2025-001, DT-2024-001, etc
    const regex = /^[A-Z]{2}-\d{4}-\d{3}$/;
    return regex.test(patrimonio) || patrimonio.length >= 5;
}

// ===== VALIDAR DATA =====
function validarData(data) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(data)) return false;
    
    const dataObj = new Date(data);
    return !isNaN(dataObj.getTime());
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
function setupRealtimeValidation() {
    const inputs = document.querySelectorAll('.form-control[required]');
    
    inputs.forEach(input => {
        // Validar ao mudar
        input.addEventListener('change', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });

        // Validar ao digitar
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Validar patrimônio em tempo real
    const patrimonioInput = document.getElementById('patrimonio');
    if (patrimonioInput) {
        patrimonioInput.addEventListener('blur', function() {
            if (this.value && !validarPatrimonio(this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }

    // Validar data de aquisição
    const dataAquisicaoInput = document.getElementById('dataAquisicao');
    if (dataAquisicaoInput) {
        dataAquisicaoInput.addEventListener('blur', function() {
            if (this.value && !validarData(this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }

    // Limitar valor monetário
    const valorInput = document.getElementById('valor');
    if (valorInput) {
        valorInput.addEventListener('input', function() {
            // Remover caracteres não numéricos
            this.value = this.value.replace(/[^0-9.]/g, '');
        });
    }
}

// ===== MENSAGENS DE SUCESSO =====
function showSuccess(ativoId) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    const ativoIdSpan = document.getElementById('ativoId');
    
    if (successMsg) {
        ativoIdSpan.textContent = ativoId;
        successMsg.classList.remove('d-none');
        errorMsg.classList.add('d-none');
        
        // Scroll para mensagem
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ===== MENSAGENS DE ERRO =====
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