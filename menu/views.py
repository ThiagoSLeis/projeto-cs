from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Q
from django.utils import timezone
import json

# Importação dos modelos de outros apps e do app atual
from tickets.models import Ticket, StatusTicket
from .models import Categoria, Artigo


# ========== VIEWS ADMINISTRATIVAS (DASHBOARD) ==========

def citiesoft_home(request):
    """Exibe o painel principal com contagem de tickets ativos e totais"""
    # Busca o objeto de status 'Fechado' (independente de maiúsculas/minúsculas)
    status_fechado = StatusTicket.objects.filter(nome__iexact='Fechado').first()
    
    # Conta tickets excluindo os que já estão fechados
    tickets_abertos = Ticket.objects.exclude(status=status_fechado).count()
    tickets_totais = Ticket.objects.count()
    
    context = {
        'tickets_abertos': tickets_abertos,
        'tickets_totais': tickets_totais,
    }
    return render(request, 'menu/citiesoft_home.html', context)

# Views simples que apenas renderizam templates estáticos
def abrir_chamado(request): return render(request, 'menu/abrir_chamado.html')
def cadastro_ativo(request): return render(request, 'menu/cadastro_ativo.html')
def cadastro_contrato(request): return render(request, 'menu/cadastro_contrato.html')
def relatorios_atendimento(request): return render(request, 'menu/relatorios_atendimento.html')
def relatorio_ativos(request): return render(request, 'menu/relatorio_ativos.html')
def autorizacao_usuarios(request): return render(request, 'menu/autorizacao_usuarios.html')
def pessoas_ativas(request): return render(request, 'menu/pessoas_ativas.html')
def metricas_kpi(request): return render(request, 'menu/metricas_kpi.html')
def atribuicao_tickets(request): return render(request, 'menu/atribuicao_tickets.html')


# ========== VIEWS DO CLIENTE (NAVEGAÇÃO) ==========

def template_cliente(request): return render(request, 'menu/cliente/template_cliente.html')
def meus_chamados(request): return render(request, 'menu/cliente/meus_chamados.html')
def abrir_chamado_cliente(request): return render(request, 'menu/cliente/abrir_chamado_cliente.html')


# ========== ADMINISTRAÇÃO DA BASE DE CONHECIMENTO ==========

@staff_member_required
def admin_base_conhecimento(request):
    """Lista as categorias para o administrador gerenciar"""
    categorias = Categoria.objects.filter(ativo=True).order_by('ordem')
    return render(request, 'menu/admin/admin_base_conhecimento.html', {'categorias': categorias})

@staff_member_required
def api_artigos_list(request):
    """Retorna uma lista JSON de todos os artigos para a tabela do admin"""
    artigos = Artigo.objects.all().select_related('categoria', 'autor')
    data = [{
        'id': a.id,
        'titulo': a.titulo,
        'slug': a.slug,
        'resumo': a.resumo,
        'conteudo': a.conteudo,
        'categoria': {'id': a.categoria.id, 'nome': a.categoria.nome},
        'tipo': a.tipo,
        'tags': a.tags or '',
        'tempo_leitura': a.tempo_leitura or 5,
        'visualizacoes': a.visualizacoes or 0,
        'avaliacoes_positivas': a.avaliacoes_positivas or 0,
        'avaliacoes_negativas': a.avaliacoes_negativas or 0,
        'ativo': a.ativo,
        'destaque': a.destaque,
        'autor': a.autor.get_full_name() if a.autor else 'Admin',
        'data_publicacao': a.data_publicacao.isoformat() if a.data_publicacao else None
    } for a in artigos]
    return JsonResponse(data, safe=False)

@staff_member_required
@csrf_exempt
def api_artigo_save(request, artigo_id=None):
    """Cria ou atualiza um artigo via requisição POST JSON"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if artigo_id:
                artigo = get_object_or_404(Artigo, id=artigo_id)
            else:
                artigo = Artigo(autor=request.user)
                if data.get('ativo'): artigo.data_publicacao = timezone.now()
            
            # Mapeamento dos campos recebidos do Front-end
            artigo.titulo = data['titulo']; artigo.slug = data['slug']
            artigo.resumo = data['resumo']; artigo.conteudo = data['conteudo']
            artigo.categoria_id = data['categoria_id']; artigo.tipo = data['tipo']
            artigo.tags = data.get('tags', ''); artigo.tempo_leitura = data.get('tempo_leitura', 5)
            artigo.ativo = data['ativo']; artigo.destaque = data['destaque']
            artigo.save()
            return JsonResponse({'success': True, 'id': artigo.id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Método não permitido'}, status=405)

@staff_member_required
@csrf_exempt
def api_artigo_delete(request, artigo_id):
    """Exclui um artigo do banco de dados"""
    if request.method == 'POST':
        try:
            artigo = get_object_or_404(Artigo, id=artigo_id)
            artigo.delete()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    return JsonResponse({'error': 'Método não permitido'}, status=405)


# ========== CENTRAL DE AJUDA PÚBLICA (CLIENTES) ==========

def base_conhecimento(request):
    """Página principal da Central de Ajuda com categorias e artigos populares"""
    categorias = Categoria.objects.filter(ativo=True).order_by('ordem')
    artigos_populares = Artigo.objects.filter(ativo=True).order_by('-visualizacoes')[:6]
    
    # Contagem de artigos (usando nome diferente da property)
    for categoria in categorias:
        categoria.contagem_artigos = Artigo.objects.filter(
            categoria=categoria,
            ativo=True
        ).count()
    
    # Calcular avaliação usando um nome que NÃO CONFLITE com o Model
    for artigo in artigos_populares:
        pos = artigo.avaliacoes_positivas or 0
        neg = artigo.avaliacoes_negativas or 0
        total = pos + neg
        # MUDANÇA AQUI: de 'avaliacao' para 'nota_avaliacao'
        artigo.nota_avaliacao = round((pos / total) * 5, 1) if total > 0 else 0
    
    return render(request, 'menu/cliente/base_conhecimento.html', {
        'categorias': categorias,
        'artigos_populares': artigos_populares
    })

def categoria_artigos(request, slug):
    """Lista todos os artigos de uma categoria específica"""
    categoria = get_object_or_404(Categoria, slug=slug, ativo=True)
    artigos = Artigo.objects.filter(
        categoria=categoria,
        ativo=True
    ).order_by('-data_publicacao')
    
    # Outras categorias para a barra lateral
    outras_categorias = Categoria.objects.filter(ativo=True).exclude(id=categoria.id)
    
    # Contar artigos por categoria usando o nome corrigido
    for cat in outras_categorias:
        cat.contagem_artigos = Artigo.objects.filter(
            categoria=cat,
            ativo=True
        ).count()
    
    # Calcular avaliação usando nota_avaliacao para evitar erro de setter
    for artigo in artigos:
        pos = artigo.avaliacoes_positivas or 0
        neg = artigo.avaliacoes_negativas or 0
        total = pos + neg
        # TROCADO: de artigo.avaliacao para artigo.nota_avaliacao
        artigo.nota_avaliacao = round((pos / total) * 5, 1) if total > 0 else 0
        
        # Processar tags
        if artigo.tags:
            artigo.tags_list = [tag.strip() for tag in artigo.tags.split(',')]
        else:
            artigo.tags_list = []
    
    return render(request, 'menu/cliente/categoria_artigos.html', {
        'categoria': categoria,
        'artigos': artigos,
        'outras_categorias': outras_categorias
    })

def artigo_detalhe(request, slug):
    """Página de leitura do artigo com sugestões de 'Próximo' e 'Anterior'"""
    
    artigo = get_object_or_404(Artigo, slug=slug, ativo=True)

    # Incrementa visualizações (boa prática)
    artigo.visualizacoes += 1
    artigo.save(update_fields=['visualizacoes'])

    # Busca 3 artigos da mesma categoria como sugestão
    artigos_relacionados = Artigo.objects.filter(
        categoria=artigo.categoria,
        ativo=True
    ).exclude(id=artigo.id).order_by('-visualizacoes')[:3]

    # Artigo anterior (pela data)
    artigo_anterior = Artigo.objects.filter(
        categoria=artigo.categoria,
        ativo=True,
        data_publicacao__lt=artigo.data_publicacao
    ).order_by('-data_publicacao').first()

    # Próximo artigo
    artigo_proximo = Artigo.objects.filter(
        categoria=artigo.categoria,
        ativo=True,
        data_publicacao__gt=artigo.data_publicacao
    ).order_by('data_publicacao').first()

    return render(request, 'menu/cliente/artigo_detalhe.html', {
        'artigo': artigo,
        'artigos_relacionados': artigos_relacionados,
        'artigo_anterior': artigo_anterior,
        'artigo_proximo': artigo_proximo,
    })




def busca_resultados(request):
    """Busca textual em Título, Resumo, Conteúdo ou Tags usando Q objects (OR)"""
    query = request.GET.get('q', '')
    if query:
        results = Artigo.objects.filter(
            Q(titulo__icontains=query) | Q(resumo__icontains=query) |
            Q(conteudo__icontains=query) | Q(tags__icontains=query),
            ativo=True
        ).order_by('-visualizacoes')
        
        for r in results:
            total = (r.avaliacoes_positivas or 0) + (r.avaliacoes_negativas or 0)
            r.avaliacao = round((r.avaliacoes_positivas / total) * 5, 1) if total > 0 else 0
            r.categoria_slug = r.categoria.slug
    else:
        results = []
    
    return render(request, 'menu/cliente/busca_resultados.html', {
        'query': query, 'results': results, 'total_results': len(results)
    })


# ========== APIs DE INTERAÇÃO (AJAX) ==========

@csrf_exempt
def registrar_visualizacao(request, slug):
    """Incrementa o contador de visualizações do artigo"""
    if request.method == 'POST':
        try:
            artigo = get_object_or_404(Artigo, slug=slug)
            artigo.visualizacoes = (artigo.visualizacoes or 0) + 1
            artigo.save()
            return JsonResponse({'success': True, 'views': artigo.visualizacoes})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def avaliar_artigo(request, slug):
    """Registra feedback positivo ou negativo do usuário"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            artigo = get_object_or_404(Artigo, slug=slug)
            if data.get('helpful'):
                artigo.avaliacoes_positivas = (artigo.avaliacoes_positivas or 0) + 1
            else:
                artigo.avaliacoes_negativas = (artigo.avaliacoes_negativas or 0) + 1
            artigo.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def api_busca(request):
    """Busca avançada com filtros (categoria, tipo, ordenação) via POST JSON"""
    if request.method == 'POST':
        try:
            query = request.GET.get('q', '')
            page = int(request.GET.get('page', 1))
            data = json.loads(request.body)
            filters = data.get('filters', {})
            
            # Base da busca
            results = Artigo.objects.filter(
                Q(titulo__icontains=query) | Q(resumo__icontains=query), ativo=True
            )
            
            # Aplicação de filtros dinâmicos
            if filters.get('categories'):
                results = results.filter(categoria__slug__in=filters['categories'])
            if filters.get('type') and filters['type'] != 'all':
                results = results.filter(tipo=filters['type'])
            
            # Ordenação dinâmica
            sort_by = filters.get('sort', 'relevancia')
            if sort_by == 'recentes': results = results.order_by('-data_publicacao')
            elif sort_by == 'antigos': results = results.order_by('data_publicacao')
            elif sort_by == 'visualizacoes': results = results.order_by('-visualizacoes')
            
            # Paginação manual (10 itens por página)
            per_page = 10; start = (page - 1) * per_page; end = start + per_page
            results_page = results[start:end]
            
            results_data = [{
                'id': r.id, 'titulo': r.titulo, 'slug': r.slug,
                'resumo': r.resumo, 'categoria': r.categoria.nome,
                'categoria_slug': r.categoria.slug, 'tipo': r.tipo,
                'visualizacoes': r.visualizacoes, 'tempo_leitura': r.tempo_leitura,
                'data_publicacao': r.data_publicacao.isoformat() if r.data_publicacao else None
            } for r in results_page]
            
            return JsonResponse({'results': results_data, 'total': results.count(), 'page': page})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método não permitido'}, status=405)