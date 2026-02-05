// 1. Garante que o chat sempre comece na última mensagem
function scrollToBottom() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', scrollToBottom);

// 2. Abrir/Fechar Modal de Detalhes
function toggleDetalhes() {
    const modal = document.getElementById('modalDetalhes');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}
// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modalDetalhes');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 3. Mostrar nome do arquivo selecionado antes de enviar
function mostrarPreview(input) {
    const previewDiv = document.getElementById('filePreview');
    previewDiv.innerHTML = ''; // Limpa previews anteriores

    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        const reader = new FileReader();

        previewDiv.innerHTML = `
            <div class="alert alert-info d-flex justify-content-between align-items-center p-2 mt-2" style="font-size: 0.8rem;">
                <span><i class="fas fa-file-upload"></i> ${fileName}</span>
                <i class="fas fa-times text-danger" style="cursor:pointer;" onclick="limparArquivo()"></i>
            </div>
        `;
    }
}

function limparArquivo() {
    document.getElementById('fileInput').value = "";
    document.getElementById('filePreview').innerHTML = "";
}

// 4. Atalho: Enviar com Enter (e Shift+Enter para nova linha)
const textarea = document.getElementById('mensagemTexto');
if (textarea) {
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.form.submit();
        }
    });
}