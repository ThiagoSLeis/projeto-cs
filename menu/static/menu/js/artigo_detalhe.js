/* ===== ARTIGO DETALHE - JAVASCRIPT ===== */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initTableOfContents();
    initScrollSpy();
    initSmoothScroll();
    trackArticleView();
});

// ===== RASTREAR VISUALIZAÇÃO DO ARTIGO =====
function trackArticleView() {
    if (typeof ARTIGO_SLUG === 'undefined') {
        console.error('ARTIGO_SLUG não está definido');
        return;
    }
    // Enviar analytics quando usuário visualiza artigo
    fetch(`/menu/api/conhecimento/artigos/${ARTIGO_SLUG}/view/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Visualização registrada:', data);
    })
    .catch(error => {
        console.error('Erro ao rastrear visualização:', error);
    });
}

// ===== AVALIAR ARTIGO =====
function rateArticle(articleSlug, isHelpful) {
    // Esconder botões e mostrar agradecimento
    const ratingButtons = document.querySelector('.rating-buttons');
    const thankYouMessage = document.getElementById('ratingThankYou');
    
    if (ratingButtons) {
        ratingButtons.style.display = 'none';
    }
    
    if (thankYouMessage) {
        thankYouMessage.classList.add('show');
    }

    // Enviar avaliação para o backend
    fetch(`/menu/api/conhecimento/artigos/${articleSlug}/rate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            helpful: isHelpful
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Avaliação registrada:', data);
        
        // Opcional: Mostrar mensagem de agradecimento personalizada
        if (data.success && thankYouMessage) {
            setTimeout(() => {
                thankYouMessage.innerHTML = `
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success-color);"></i>
                    <p style="margin-top: 10px; font-weight: 600;">
                        ${isHelpful ? 'Que bom que ajudamos você! 😊' : 'Vamos melhorar este conteúdo. Obrigado!'}
                    </p>
                `;
            }, 500);
        }
    })
    .catch(error => {
        console.error('Erro ao avaliar artigo:', error);
        
        // Reverter UI em caso de erro
        if (ratingButtons) {
            ratingButtons.style.display = 'flex';
        }
        if (thankYouMessage) {
            thankYouMessage.classList.remove('show');
        }
        
        alert('Erro ao enviar avaliação. Tente novamente.');
    });
}

// ===== GERAR ÍNDICE (TABLE OF CONTENTS) =====
function initTableOfContents() {
    const articleContent = document.querySelector('.article-content');
    const tocList = document.getElementById('tocList');
    
    if (!articleContent || !tocList) return;

    // Buscar todos os H2 do conteúdo
    const headings = articleContent.querySelectorAll('h2');
    
    if (headings.length === 0) {
        // Se não houver H2, esconder o card do índice
        const tocCard = tocList.closest('.sidebar-card');
        if (tocCard) {
            tocCard.style.display = 'none';
        }
        return;
    }

    // Limpar lista
    tocList.innerHTML = '';

    // Criar item para cada H2
    headings.forEach((heading, index) => {
        // Garantir que o heading tenha um ID
        if (!heading.id) {
            heading.id = `section-${index}`;
        }

        // Criar item da lista
        const listItem = document.createElement('li');
        listItem.className = 'toc-item';

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.className = 'toc-link';
        link.textContent = heading.textContent;
        
        // Primeira seção começa ativa
        if (index === 0) {
            link.classList.add('active');
        }

        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
}

// ===== SCROLL SPY - DESTACAR SEÇÃO ATIVA =====
function initScrollSpy() {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    const headings = articleContent.querySelectorAll('h2');
    if (headings.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveTocLink(id);
            }
        });
    }, observerOptions);

    // Observar todos os títulos
    headings.forEach(heading => {
        observer.observe(heading);
    });
}

// ===== ATUALIZAR LINK ATIVO NO ÍNDICE =====
function updateActiveTocLink(activeId) {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLL PARA LINKS DO ÍNDICE =====
function initSmoothScroll() {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scroll suave
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Atualizar URL sem recarregar página
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

// ===== ABRIR CHAMADO =====
function openTicket() {
    // Em produção, redirecionar para abertura de chamado
    window.location.href = '/cliente/chamados/abrir/';
    
    // Ou abrir modal se preferir
    // showTicketModal();
}

// ===== COPIAR LINK DO ARTIGO =====
function copyArticleLink() {
    const url = window.location.href;
    
    // Tentar usar a API moderna de clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link copiado para a área de transferência!', 'success');
            })
            .catch(err => {
                console.error('Erro ao copiar link:', err);
                fallbackCopyLink(url);
            });
    } else {
        fallbackCopyLink(url);
    }
}

// ===== FALLBACK PARA COPIAR LINK =====
function fallbackCopyLink(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copiado!', 'success');
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showNotification('Erro ao copiar link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ===== IMPRIMIR ARTIGO =====
function printArticle() {
    window.print();
}

// ===== COMPARTILHAR ARTIGO =====
function shareArticle(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${url}`;
            break;
        default:
            console.error('Plataforma de compartilhamento não reconhecida');
            return;
    }
    
    // Abrir em nova janela
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// ===== EXPANDIR/RECOLHER SEÇÃO =====
function toggleSection(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (content && content.classList.contains('collapsible-content')) {
        content.classList.toggle('expanded');
        
        if (icon) {
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        }
    }
}

// ===== MOSTRAR NOTIFICAÇÃO =====
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Adicionar estilos inline (ou criar CSS separado)
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#00A6FF'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== SCROLL PARA O TOPO =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== MOSTRAR BOTÃO DE VOLTAR AO TOPO =====
window.addEventListener('scroll', function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});

// ===== GET CSRF TOKEN =====
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ===== ADICIONAR ESTILOS DE ANIMAÇÃO =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.rateArticle = rateArticle;
window.openTicket = openTicket;
window.copyArticleLink = copyArticleLink;
window.printArticle = printArticle;
window.shareArticle = shareArticle;
window.toggleSection = toggleSection;
window.scrollToTop = scrollToTop;