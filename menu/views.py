import json
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Q
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model
from django.apps import apps

# ===== Models do próprio app =====
from .models import Categoria, Artigo, Chamado, Mensagem

# ===== Importação dinâmica de outros apps =====
Ticket = apps.get_model('tickets', 'Ticket')
CategoriaTicket = apps.get_model('tickets', 'CategoriaTicket')
StatusTicket = apps.get_model('tickets', 'StatusTicket')

# ============================================================
# ========== VIEWS ADMINISTRATIVAS (SISTEMA) ==========
# ============================================================

def citiesoft_home(request):
    status_fechado = StatusTicket.objects.filter(nome__iexact='Fechado').first()
    tickets_abertos = Ticket.objects.exclude(status=status_fechado).count()
    tickets_totais = Ticket.objects.count()
    return render(request, 'menu/citiesoft_home.html', {
        'tickets_abertos': tickets_abertos,
        'tickets_totais': tickets_totais,
    })

def abrir_chamado(request): return render(request, 'menu/abrir_chamado.html')
def cadastro_ativo(request): return render(request, 'menu/cadastro_ativo.html')
def cadastro_contrato(request): return render(request, 'menu/cadastro_contrato.html')
def relatorios_atendimento(request): return render(request, 'menu/relatorios_atendimento.html')
def relatorio_ativos(request): return render(request, 'menu/relatorio_ativos.html')
def metricas_kpi(request): return render(request, 'menu/metricas_kpi.html')

@user_passes_test(lambda u: u.is_superuser, login_url='citiesoft_home')
def autorizacao_usuarios(request): return render(request, 'menu/autorizacao_usuarios.html')

@user_passes_test(lambda u: u.is_superuser, login_url='citiesoft_home')
def pessoas_ativas(request): return render(request, 'menu/pessoas_ativas.html')

@user_passes_test(lambda u: u.is_superuser, login_url='citiesoft_home')
def atribuicao_tickets(request): return render(request, 'menu/atribuicao_tickets.html')

@user_passes_test(lambda u: u.is_superuser, login_url='citiesoft_home')
def cadastro_usuario(request): return render(request, 'menu/admin/cadastro_usuario.html')

# ============================================================
# ================= API DE TICKETS (JS) ======================
# ============================================================

def api_get_tickets(request):
    tickets = Chamado.objects.all().order_by('-criado_em')
    data = []
    for t in tickets:
        data.append({
            'id': t.id,
            'title': t.titulo,
            'customer': t.cliente,
            'priority': t.prioridade,
            'status': t.status,
            'technician': t.tecnico.username if t.tecnico else None,
            'createdAt': t.criado_em.strftime('%d/%m/%Y')
        })
    return JsonResponse(data, safe=False)

@csrf_exempt
def api_atribuir_ticket(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            t_id = str(data.get('ticket_id')).replace('TKT-', '')
            chamado = get_object_or_404(Chamado, id=t_id)
            User = get_user_model()
            tecnico = User.objects.get(id=data.get('tecnico_id'))
            chamado.tecnico = tecnico
            chamado.status = 'em_progresso'
            chamado.save()
            return JsonResponse({'status': 'success', 'message': f'Atribuído a {tecnico.username}'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error'}, status=405)

# ============================================================
# ================= BASE DE CONHECIMENTO =====================
# ============================================================

@staff_member_required
def admin_base_conhecimento(request):
    categorias = Categoria.objects.filter(ativo=True).order_by('ordem')
    return render(request, 'menu/admin/admin_base_conhecimento.html', {'categorias': categorias})

def base_conhecimento(request):
    categorias = Categoria.objects.filter(ativo=True)
    artigos_populares = Artigo.objects.filter(ativo=True).order_by('-visualizacoes')[:6]
    return render(request, 'menu/cliente/base_conhecimento.html', {
        'categorias': categorias,
        'artigos_populares': artigos_populares
    })

def categoria_artigos(request, slug):
    categoria = get_object_or_404(Categoria, slug=slug, ativo=True)
    artigos = Artigo.objects.filter(categoria=categoria, ativo=True)
    return render(request, 'menu/cliente/categoria_artigos.html', {'categoria': categoria, 'artigos': artigos})

def artigo_detalhe(request, slug):
    artigo = get_object_or_404(Artigo, slug=slug, ativo=True)
    artigo.visualizacoes += 1
    artigo.save(update_fields=['visualizacoes'])
    return render(request, 'menu/cliente/artigo_detalhe.html', {'artigo': artigo})

def busca_resultados(request):
    query = request.GET.get('q', '')
    artigos = Artigo.objects.filter(Q(titulo__icontains=query) | Q(resumo__icontains=query), ativo=True) if query else []
    return render(request, 'menu/cliente/busca_resultados.html', {'query': query, 'results': artigos})

# ============================================================
# ================== ÁREA DO CLIENTE =========================
# ============================================================

def template_cliente(request):
    return render(request, 'menu/cliente/template_cliente.html')

@login_required
def abrir_chamado_cliente(request):
    if request.method == 'POST':
        assunto = request.POST.get('assunto', '').strip()
        categoria_id = request.POST.get('categoria')
        descricao = request.POST.get('descricao', '').strip()
        # Aqui você pode decidir se cria como 'Ticket' (app externo) ou 'Chamado' (seu modelo local)
        # Se for para o chat novo, mude para Chamado.objects.create(...)
        ticket = Ticket.objects.create(titulo=assunto, descricao=descricao, categoria_id=categoria_id, criado_por=request.user)
        messages.success(request, f'Chamado {ticket.numero_ticket} criado.')
        return redirect('meus_chamados')
    categorias = CategoriaTicket.objects.filter(ativo=True)
    return render(request, 'menu/cliente/abrir_chamado_cliente.html', {'categorias': categorias})

@login_required
def meus_chamados(request):
    tickets = Ticket.objects.filter(criado_por=request.user).order_by('-data_criacao')
    return render(request, 'menu/cliente/meus_chamados.html', {'tickets': tickets})

# ============================================================
# ================= APIs RESTANTES (WIKI/CHAT) ===============
# ============================================================

@staff_member_required
def api_artigos_list(request):
    artigos = Artigo.objects.select_related('categoria')
    return JsonResponse([{'id': a.id, 'titulo': a.titulo, 'slug': a.slug, 'categoria': a.categoria.nome} for a in artigos], safe=False)

@staff_member_required
@csrf_exempt
def api_artigo_save(request, artigo_id=None):
    data = json.loads(request.body)
    artigo = get_object_or_404(Artigo, id=artigo_id) if artigo_id else Artigo(autor=request.user)
    artigo.titulo = data['titulo']; artigo.slug = data['slug']; artigo.save()
    return JsonResponse({'success': True})

@staff_member_required
@csrf_exempt
def api_artigo_delete(request, artigo_id):
    get_object_or_404(Artigo, id=artigo_id).delete()
    return JsonResponse({'success': True})

@csrf_exempt
def avaliar_artigo(request, slug): return JsonResponse({'success': True})

@csrf_exempt
def registrar_visualizacao(request, slug):
    a = get_object_or_404(Artigo, slug=slug); a.visualizacoes += 1; a.save()
    return JsonResponse({'success': True})

@csrf_exempt
def api_busca(request): return JsonResponse({'results': []})

@staff_member_required
def artigo_preview_admin(request, slug):
    artigo = get_object_or_404(Artigo, slug=slug)
    return render(request, 'menu/cliente/artigo_detalhe.html', {'artigo': artigo, 'preview_admin': True})

# --- Views de Chat e Detalhes ---

@login_required
def chamado_detalhe(request, ticket_id):
    # Buscamos o chamado no seu modelo local
    chamado = get_object_or_404(Chamado, id=ticket_id)
    
    if request.method == 'POST':
        texto = request.POST.get('mensagemTexto')
        arquivo = request.FILES.get('arquivo')
        
        if texto:
            Mensagem.objects.create(
                chamado=chamado, 
                remetente=request.user,
                texto=texto,
                arquivo=arquivo
            )
            # CORREÇÃO: Redireciona usando o nome da URL definida no urls.py
            return redirect('chamado_detalhe', ticket_id=chamado.id)

    # Pegamos as mensagens deste chamado
    mensagens = Mensagem.objects.filter(chamado=chamado).order_by('data_envio')
    
    return render(request, 'menu/chamado_detalhe.html', {
        'ticket': chamado,
        'mensagens': mensagens
    })

@login_required
def meus_tickets(request):
    # Mudamos para 'Chamado' e usamos o campo 'criado_em'
    todos_tickets = Chamado.objects.filter(criado_por=request.user).order_by('-criado_em')
    
    context = {
        'tickets': todos_tickets,
        'abertos_count': todos_tickets.filter(status='aberto').count(),
        'em_andamento_count': todos_tickets.filter(status='em_progresso').count(),
        'fechados_count': todos_tickets.filter(status='fechado').count(),
    }
    
    return render(request, 'menu/meus_tickets.html', context)
