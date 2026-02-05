document.addEventListener("DOMContentLoaded", () => {

    console.log("register.js carregado ✅");

    const btnFuncionario = document.getElementById("btnFuncionario");
    const btnCliente = document.getElementById("btnCliente");

    const cpfInput = document.querySelector("input[name='cpf']");
    const cpfError = document.getElementById("cpfError");

    const cnpjBox = document.getElementById("cnpjBox");
    const cnpjInput = document.getElementById("cnpj");
    const cnpjError = document.getElementById("cnpjError");

    const form = document.querySelector("form");

    /* ===============================
       CONTROLE FUNCIONÁRIO / CLIENTE
    =============================== */
    let tipoUsuario = "funcionario";

    btnFuncionario.onclick = () => {
        tipoUsuario = "funcionario";
        btnFuncionario.classList.add("active");
        btnCliente.classList.remove("active");

        cnpjBox.classList.add("d-none");
        cnpjInput.value = "";
        cnpjInput.classList.remove("is-invalid");
        cnpjError.textContent = "";
    };

    btnCliente.onclick = () => {
        tipoUsuario = "cliente";
        btnCliente.classList.add("active");
        btnFuncionario.classList.remove("active");

        cnpjBox.classList.remove("d-none");
    };

    /* ===============================
       MÁSCARA CPF
    =============================== */
    cpfInput.addEventListener("input", () => {
        let v = cpfInput.value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);

        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        cpfInput.value = v;
    });

    /* ===============================
       VALIDA CPF
    =============================== */
    cpfInput.addEventListener("blur", () => {
        const valido = validaCPF(cpfInput.value);
        cpfError.textContent = "CPF inválido";
        cpfInput.classList.toggle("is-invalid", !valido);
    });

    function validaCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
        let d1 = (soma * 10) % 11 % 10;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
        let d2 = (soma * 10) % 11 % 10;

        return d1 == cpf[9] && d2 == cpf[10];
    }

    /* ===============================
       MÁSCARA CNPJ
    =============================== */
    cnpjInput.addEventListener("input", () => {
        let v = cnpjInput.value.replace(/\D/g, "");
        if (v.length > 14) v = v.slice(0, 14);

        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
        v = v.replace(/(\d{4})(\d{1,2})$/, "$1-$2");

        cnpjInput.value = v;
    });

    /* ===============================
       VALIDA CNPJ (CORRIGIDO)
    =============================== */
    cnpjInput.addEventListener("blur", () => {
        if (tipoUsuario === "cliente") {
            const valido = validaCNPJ(cnpjInput.value);
            cnpjError.textContent = "CNPJ inválido";
            cnpjInput.classList.toggle("is-invalid", !valido);
        }
    });

    function validaCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, "");
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho++;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        return resultado == digitos.charAt(1);
    }

    /* ===============================
       VALIDAÇÃO FINAL
    =============================== */
    form.addEventListener("submit", (e) => {
        let ok = true;

        if (!validaCPF(cpfInput.value)) {
            cpfInput.classList.add("is-invalid");
            ok = false;
        }

        if (tipoUsuario === "cliente") {
            if (!validaCNPJ(cnpjInput.value)) {
                cnpjInput.classList.add("is-invalid");
                ok = false;
            }
        }

        if (!ok) e.preventDefault();
    });

});




