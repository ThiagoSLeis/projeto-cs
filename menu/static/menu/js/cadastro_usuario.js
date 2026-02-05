/* ===== CADASTRO DE USUÁRIO - JAVASCRIPT ===== */

// ===== ALTERNAR ENTRE TIPOS =====
document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.form-section').forEach(form => form.classList.remove('active'));
        if (type === 'funcionario') {
            document.getElementById('formFuncionario').classList.add('active');
        } else {
            document.getElementById('formCliente').classList.add('active');
        }
    });
});
// ===== MÁSCARAS =====
document.querySelectorAll('.cpf-mask').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
});

document.querySelectorAll('.cnpj-mask').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 14) value = value.slice(0, 14);
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        e.target.value = value;
    });
});

document.querySelectorAll('.phone-mask').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    });
});

// ===== FORÇA DA SENHA =====
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

document.querySelectorAll('.password-input').forEach(input => {
    input.addEventListener('input', function() {
        const password = this.value;
        const strengthDiv = this.parentElement.querySelector('.password-strength');
        
        if (password.length === 0) {
            strengthDiv.classList.remove('show');
            return;
        }

        const strength = checkPasswordStrength(password);
        strengthDiv.classList.add('show');
        strengthDiv.classList.remove('weak', 'medium', 'strong');

        if (strength <= 2) {
            strengthDiv.classList.add('weak');
            strengthDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Senha fraca';
        } else if (strength <= 4) {
            strengthDiv.classList.add('medium');
            strengthDiv.innerHTML = '<i class="fas fa-check"></i> Senha média';
        } else {
            strengthDiv.classList.add('strong');
            strengthDiv.innerHTML = '<i class="fas fa-check-circle"></i> Senha forte';
        }
    });
});

// ===== RESETAR FORMULÁRIO =====
function resetForm(formId) {
    if (confirm('Deseja realmente cancelar? Todos os dados não salvos serão perdidos.')) {
        document.getElementById(formId).reset();
        document.querySelectorAll('.password-strength').forEach(el => el.classList.remove('show'));
    }
}

// ===== VALIDAÇÃO E ENVIO =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const senha = this.querySelector('input[name="senha"]').value;
        const confirmarSenha = this.querySelector('input[name="confirmar_senha"]').value;
        
        if (senha !== confirmarSenha) {
            e.preventDefault();
            alert('⚠️ As senhas não coincidem!');
            return;
        }

        if (senha.length < 8) {
            e.preventDefault();
            alert('⚠️ A senha deve ter no mínimo 8 caracteres!');
            return;
        }

        // Formulário será enviado normalmente para o Django
        console.log('✅ Formulário validado!');
    });
});

console.log('✅ Script de cadastro carregado!');