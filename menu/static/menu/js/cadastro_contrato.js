// ===== FORMULÁRIO CADASTRO CONTRATO =====

document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
    setupDataValidation();
    setupValorCalculation();
    console.log('✓ Formulário Cadastro Contrato carregado!');
});
// ===== VALIDAÇÃO DO FORMULÁRIO =====
function setupFormValidation() {
    const form = document.getElementById('formCadastroContrato');
    
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

        // Validar datas
        const dataInicio = new Date(document.getElementById('data_inicio').value);
        const dataTermino = new Date(document.getElementById('data_termino').value);

        if (dataTermino <= dataInicio) {
            showError('A data de término deve ser posterior à data de início!');
            return;
        }

        // Se validação passou, envia o formulário
        console.log('Formulário válido, enviando...');
        showSuccess();
        
        // Descomente para enviar de verdade:
        // form.submit();

        // Redireciona após 3 segundos
        setTimeout(() => {
            window.location.href = '/menu/';
        }, 3000);
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('.form-control[required]');
    
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
}

// ===== VALIDAÇÃO DE DATAS =====
function setupDataValidation() {
    const dataInicio = document.getElementById('data_inicio');
    const dataTermino = document.getElementById('data_termino');
    const dataRenovacao = document.getElementById('data_renovacao');

    if (dataInicio && dataTermino) {
        dataTermino.addEventListener('change', function() {
            const inicio = new Date(dataInicio.value);
            const termino = new Date(this.value);

            if (termino <= inicio) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });

        dataInicio.addEventListener('change', function() {
            if (dataTermino.value) {
                const inicio = new Date(this.value);
                const termino = new Date(dataTermino.value);

                if (termino <= inicio) {
                    dataTermino.classList.add('is-invalid');
                } else {
                    dataTermino.classList.remove('is-invalid');
                }
            }
        });
    }
}

// ===== CÁLCULO AUTOMÁTICO DO VALOR MENSAL =====
function setupValorCalculation() {
    const valorTotal = document.getElementById('valor_total');
    const numeroParcelas = document.getElementById('numero_parcelas');
    const valorMensal = document.getElementById('valor_mensal');
    const condicao = document.getElementById('condicao_pagamento');

    function calcularValorMensal() {
        const total = parseFloat(valorTotal.value) || 0;
        const parcelas = parseInt(numeroParcelas.value) || 1;

        if (parcelas > 0) {
            const mensal = (total / parcelas).toFixed(2);
            valorMensal.value = mensal;
        }
    }

    if (valorTotal && numeroParcelas) {
        valorTotal.addEventListener('change', calcularValorMensal);
        valorTotal.addEventListener('input', calcularValorMensal);
        numeroParcelas.addEventListener('change', calcularValorMensal);
        numeroParcelas.addEventListener('input', calcularValorMensal);
    }

    // Habilitar/desabilitar número de parcelas conforme condição
    if (condicao) {
        condicao.addEventListener('change', function() {
            if (this.value === 'parcelado') {
                numeroParcelas.disabled = false;
                numeroParcelas.required = true;
            } else {
                numeroParcelas.disabled = true;
                numeroParcelas.required = false;
                numeroParcelas.value = '';
                valorMensal.value = '';
            }
        });
    }
}

// ===== MENSAGENS DE SUCESSO =====
function showSuccess() {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    
    if (successMsg) {
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
        errorMsg.textContent = '';
        errorMsg.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i><strong>${message}</strong>`;
        errorMsg.classList.remove('d-none');
        successMsg.classList.add('d-none');
        
        // Scroll para mensagem
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}