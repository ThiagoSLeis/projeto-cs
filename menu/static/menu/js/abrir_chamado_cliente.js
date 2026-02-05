/* ===== ABRIR CHAMADO CLIENTE - JAVASCRIPT (VERSÃO FINAL) ===== */

// ===== CATEGORIAS POR ÁREA (NÃO USADAS NO BACKEND) =====
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
        { value: 'licenca', text: 'Licença de Software' }
    ],
    rede: [
        { value: 'internet', text: 'Conexão com a Internet' },
        { value: 'wifi', text: 'Rede Wi-Fi' },
        { value: 'vpn', text: 'VPN / Acesso Remoto' },
        { value: 'outro_rede', text: 'Outro Problema de Rede' }
    ],    
    banco_dados: [
        { value: 'acesso_bd', text: 'Acesso ao Banco de Dados' },
        { value: 'desempenho_bd', text: 'Desempenho do Banco de Dados' },
        { value: 'outro_bd', text: 'Outro Problema de Banco de Dados' }
    ],
    desenvolvimento: [
        { value: 'bug_sistema', text: 'Bug no Sistema / Aplicativo' },
        { value: 'nova_funcionalidade', text: 'Solicitação de Nova Funcionalidade' },   
        { value: 'outro_desenvolvimento', text: 'Outro Assunto de Desenvolvimento' }
    ], 
    suporte_usuario: [ 
        { value: 'duvida_sistema', text: 'Dúvida sobre o Sistema / Aplicativo' },
        { value: 'treinamento', text: 'Solicitação de Treinamento' },
        { value: 'outro_suporte', text: 'Outro Assunto de Suporte ao Usuário' } 
    ],
    outros: [
        { value: 'outros', text: 'Outros / Não se aplica' }
    ],
    
    seguranca: [
        { value: 'incidente_seguranca', text: 'Incidente de Segurança' },
        { value: 'vulnerabilidade', text: 'Vulnerabilidade / Ameaça' },
        { value: 'outro_seguranca', text: 'Outro Assunto de Segurança' }
    ],
};

// ===== VARIÁVEIS GLOBAIS =====
let currentStep = 1;
let uploadedFiles = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('✓ Inicializando formulário de abertura de chamado');

    // ⚠️ NÃO USAR – categorias agora vêm do backend
    initializeAreaCategoria();

    initializeStepNavigation();
    initializeFormValidation();
    initializeFileUpload();
    initializeCharCounter();
    initializeFormReview();

    console.log('✓ Formulário pronto');
});


// =======================================================
// ❌ FUNÇÃO DESATIVADA – NÃO USAR CATEGORIA DO FRONT
// =======================================================

function initializeAreaCategoria() {
    const areaSelect = document.getElementById('area');
    const categoriaSelect = document.getElementById('categoria');

    if (!areaSelect || !categoriaSelect) return;

    areaSelect.addEventListener('change', function () {
        const area = this.value;

        categoriaSelect.innerHTML = '';
        categoriaSelect.disabled = false;

        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Selecione a categoria';
        categoriaSelect.appendChild(opt);

        if (categoriasPorArea[area]) {
            categoriasPorArea[area].forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.value;
                option.textContent = cat.text;
                categoriaSelect.appendChild(option);
            });
        } else {
            // fallback seguro
            const option = document.createElement('option');
            option.value = 'outros';
            option.textContent = 'Outros / Não se aplica';
            categoriaSelect.appendChild(option);
        }
    });
}


// =======================================================


// ===== NAVEGAÇÃO ENTRE STEPS =====
function initializeStepNavigation() {
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {

            if (!validateCurrentStep()) return;

            // se estiver no step 2, vai para o 3
            if (currentStep === 2) {
                goToStep(3);
                return;
            }

            // se estiver no step 1, vai para o 2
            if (currentStep === 1) {
                goToStep(2);
                return;
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            goToStep(parseInt(btn.dataset.prev));
        });
    });
}



function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.step) === step);
    });

    document.querySelectorAll('.step').forEach(el => {
        const n = parseInt(el.dataset.step);
        el.classList.toggle('active', n === step);
        el.classList.toggle('completed', n < step);
    });

    document.querySelector('.btn-prev').style.display = step > 1 ? 'flex' : 'none';
    document.querySelector('.btn-next').style.display = step < 3 ? 'flex' : 'none';
    document.querySelector('.btn-submit').style.display = step === 3 ? 'flex' : 'none';

    if (step === 3) updateReview();

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ===== VALIDAÇÃO (CORRIGIDA - PULA CAMPOS DESABILITADOS) =====
function initializeFormValidation() {
    const submitBtn = document.querySelector('.btn-submit');

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (validateForm()) submitForm();
    });
}


function validateCurrentStep() {
    let valid = true;
    
    // Limpar erros anteriores primeiro
    document.querySelector(`.form-step[data-step="${currentStep}"]`)
        .querySelectorAll('.error-message')
        .forEach(err => err.remove());
    
    document.querySelector(`.form-step[data-step="${currentStep}"]`)
        .querySelectorAll('[required]')
        .forEach(field => {
            // ⚠️ IMPORTANTE: PULAR CAMPOS DESABILITADOS
            if (field.disabled) {
                console.log(`⏭️ Pulando campo desabilitado: ${field.id || field.name}`);
                return;
            }
            
            // Pegar valor do campo
            const value = field.value || '';
            
            // Verificar se está vazio (ignora apenas espaços em branco)
            if (value.trim() === '') {
                valid = false;
                showFieldError(field, 'Campo obrigatório');
                console.log(`❌ Campo obrigatório vazio: ${field.id || field.name}`);
            } else {
                clearFieldError(field);
                console.log(`✓ Campo válido: ${field.id || field.name}`);
            }
        });
    
    if (!valid) {
        console.warn(`⚠️ Validação falhou no Step ${currentStep}`);
    } else {
        console.log(`✓ Step ${currentStep} validado com sucesso`);
    }
    
    return valid;
}

function validateForm() {
    let ok = true;
    
    // Limpar todos os erros
    document.querySelectorAll('.error-message').forEach(err => err.remove());
    
    ['assunto', 'area', 'categoria', 'prioridade', 'descricao'].forEach(id => {
        const el = document.getElementById(id);
        
        // Pular se campo estiver desabilitado
        if (el.disabled) {
            console.log(`⏭️ Pulando campo desabilitado: ${id}`);
            return;
        }
        
        const value = el.value || '';
        
        if (value.trim() === '') {
            showFieldError(el, 'Campo obrigatório');
            ok = false;
            console.log(`❌ Campo obrigatório vazio: ${id}`);
        }
    });
    
    if (!ok) {
        console.warn('⚠️ Formulário possui campos obrigatórios vazios');
    }
    
    return ok;
}

function showFieldError(field, msg) {
    clearFieldError(field);
    field.style.borderColor = '#dc3545';
    const div = document.createElement('div');
    div.className = 'error-message';
    div.style.color = '#dc3545';
    div.style.fontSize = '0.85rem';
    div.style.marginTop = '5px';
    div.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    field.parentElement.appendChild(div);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const err = field.parentElement.querySelector('.error-message');
    if (err) err.remove();
}


// ===== UPLOAD =====
function initializeFileUpload() {
    const input = document.getElementById('anexos');
    if (!input) return;

    input.addEventListener('change', () => {
        uploadedFiles = Array.from(input.files);
        console.log(`📎 ${uploadedFiles.length} arquivo(s) selecionado(s)`);
    });
}


// ===== CONTADOR =====
function initializeCharCounter() {
    const textarea = document.getElementById('descricao');
    const counter = document.getElementById('charCount');

    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
    });
}


// ===== REVISÃO =====
function initializeFormReview() {
    ['assunto', 'area', 'categoria', 'prioridade', 'descricao'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        el.addEventListener('input', updateReview);
        el.addEventListener('change', updateReview);
    });
}

function updateReview() {
    const assuntoEl = document.getElementById('assunto');
    const areaEl = document.getElementById('area');
    const categoriaEl = document.getElementById('categoria');
    const prioridadeEl = document.getElementById('prioridade');
    const descricaoEl = document.getElementById('descricao');

    if (assuntoEl) {
        document.getElementById('review-assunto').textContent = assuntoEl.value || '-';
    }

    if (areaEl && areaEl.selectedOptions[0]) {
        document.getElementById('review-area').textContent = areaEl.selectedOptions[0].text || '-';
    }

    if (categoriaEl && categoriaEl.selectedOptions[0]) {
        document.getElementById('review-categoria').textContent = categoriaEl.selectedOptions[0].text || '-';
    }

    if (prioridadeEl && prioridadeEl.selectedOptions[0]) {
        document.getElementById('review-prioridade').textContent = prioridadeEl.selectedOptions[0].text || '-';
    }

    if (descricaoEl) {
        document.getElementById('review-descricao').textContent = descricaoEl.value || '-';
    }
}


// ===== SUBMIT =====
function submitForm() {
    const data = new FormData();

    // 🔹 mapeamento FRONT → API
    data.append('titulo', document.getElementById('assunto').value);
    data.append('descricao', document.getElementById('descricao').value);

    // ⚠️ ESTES VALORES PRECISAM SER IDs DO BANCO
    data.append('categoria', document.getElementById('categoria').value);
    data.append('urgencia', document.getElementById('prioridade').value);

    // portal do cliente sempre cria incidente
    data.append('tipo', 'incidente');

    fetch('/api/tickets/', {
        method: 'POST',
        body: data,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro ao criar ticket');
        }
        return res.json();
    })
    .then(ticket => {
        console.log('Ticket criado:', ticket);
        window.location.href = '/meus-chamados/';
    })
    .catch(err => {
        console.error(err);
        alert('Erro ao enviar o chamado');
    });
}





// ===== BLOQUEAR SUBMIT NATIVO =====
//document.getElementById('ticketForm')?.addEventListener('submit', e => {
    //e.preventDefault();
    //console.log('⚠️ Submit nativo bloqueado');
//});//

document.addEventListener('click', function (e) {
    const submitBtn = e.target.closest('.btn-submit');

    if (submitBtn) {
        e.preventDefault();
        console.log('🖱️ CLIQUE NO BOTÃO ENVIAR DETECTADO');

        if (validateForm()) {
            submitForm();
        } else {
            console.warn('⚠️ Validação falhou');
        }
    }
});


console.log('✓ JS carregado sem erros');


