from django.shortcuts import render
from tickets.models import Ticket, StatusTicket

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

def citiesoft_home(request):
    status_fechado = StatusTicket.objects.filter(nome__iexact='Fechado').first()
    
    tickets_abertos = Ticket.objects.exclude(status=status_fechado).count()
    tickets_totais = Ticket.objects.count()
    
    context = {
        'tickets_abertos': tickets_abertos,
        'tickets_totais': tickets_totais,
    }
    
    return render(request, 'menu/citiesoft_home.html', context)

def abrir_chamado(request):
    return render(request, 'menu/abrir_chamado.html')

def cadastro_ativo(request):
    return render(request, 'menu/cadastro_ativo.html')

def cadastro_contrato(request):
    return render(request, 'menu/cadastro_contrato.html')

def relatorios_atendimento(request):
    return render(request, 'menu/relatorios_atendimento.html.html')

def relatorio_ativos(request):
    return render(request, 'menu/relatorio_ativos.html')

def autorizacao_usuarios(request):
    return render(request, 'menu/autorizacao_usuarios.html')

def pessoas_ativas(request):
    return render(request, 'menu/pessoas_ativas.html')

def metricas_kpi(request):
    return render(request, 'menu/metricas_kpi.html')

def template_cliente(request):
    return render(request, 'menu/cliente/template_cliente.html')    

def meus_chamados(request):
    return render(request, 'menu/cliente/meus_chamados.html')

def base_conhecimento(request):
    return render(request, 'menu/cliente/base_conhecimento.html')

def atribuicao_tickets(request):
    return render(request, 'menu/atribuicao_tickets.html')

def abrir_chamado_cliente(request):
    return render(request, 'menu/cliente/abrir_chamado_cliente.html')





# ===== VIEWS DA BASE DE CONHECIMENTO =====



# Importe seus models aqui quando criar
# from .models import Categoria, Artigo


# ===== VIEW: BASE DE CONHECIMENTO (PÁGINA PRINCIPAL) =====
def base_conhecimento(request):
    """
    Página principal da Central de Ajuda com categorias e artigos populares
    """
    # Quando tiver os models, descomente:
    # categorias = Categoria.objects.filter(ativo=True)
    # artigos_populares = Artigo.objects.filter(ativo=True).order_by('-visualizacoes')[:6]
    
    context = {
        # 'categorias': categorias,
        # 'artigos_populares': artigos_populares,
    }
    
    return render(request, 'menu/cliente/base_conhecimento.html', context)


# ===== VIEW: CATEGORIA DE ARTIGOS =====
def categoria_artigos(request, slug):
    """
    Lista todos os artigos de uma categoria específica
    """
    # Quando tiver os models, descomente:
    # categoria = get_object_or_404(Categoria, slug=slug, ativo=True)
    # artigos = Artigo.objects.filter(categoria=categoria, ativo=True).order_by('-data_publicacao')
    # outras_categorias = Categoria.objects.filter(ativo=True).exclude(id=categoria.id)[:3]
    
    context = {
        # 'categoria': categoria,
        # 'artigos': artigos,
        # 'outras_categorias': outras_categorias,
    }
    
    return render(request, 'menu/cliente/categoria_artigos.html', context)


# ===== VIEW: DETALHES DO ARTIGO =====
def artigo_detalhe(request, slug):
    """
    Exibe o conteúdo completo de um artigo
    """
    # Quando tiver os models, descomente:
    # artigo = get_object_or_404(Artigo, slug=slug, ativo=True)
    
    # # Artigos relacionados (mesma categoria)
    # artigos_relacionados = Artigo.objects.filter(
    #     categoria=artigo.categoria, 
    #     ativo=True
    # ).exclude(id=artigo.id).order_by('-visualizacoes')[:3]
    
    # # Artigo anterior (mais antigo na mesma categoria)
    # artigo_anterior = Artigo.objects.filter(
    #     categoria=artigo.categoria,
    #     data_publicacao__lt=artigo.data_publicacao,
    #     ativo=True
    # ).order_by('-data_publicacao').first()
    
    # # Artigo próximo (mais recente na mesma categoria)
    # artigo_proximo = Artigo.objects.filter(
    #     categoria=artigo.categoria,
    #     data_publicacao__gt=artigo.data_publicacao,
    #     ativo=True
    # ).order_by('data_publicacao').first()
    
    context = {
        # 'artigo': artigo,
        # 'artigos_relacionados': artigos_relacionados,
        # 'artigo_anterior': artigo_anterior,
        # 'artigo_proximo': artigo_proximo,
    }
    
    return render(request, 'menu/cliente/artigo_detalhe.html', context)


# ===== VIEW: BUSCA DE RESULTADOS =====
def busca_resultados(request):
    """
    Busca artigos por termo de pesquisa
    """
    query = request.GET.get('q', '')
    
    if query:
        # Quando tiver os models, descomente:
        # results = Artigo.objects.filter(
        #     Q(titulo__icontains=query) |
        #     Q(resumo__icontains=query) |
        #     Q(conteudo__icontains=query),
        #     ativo=True
        # ).select_related('categoria').order_by('-visualizacoes')
        
        # total_results = results.count()
        
        results = []
        total_results = 0
    else:
        results = []
        total_results = 0
    
    context = {
        'query': query,
        'results': results,
        'total_results': total_results,
    }
    
    return render(request, 'menu/cliente/busca_resultados.html', context)


# ===== API: REGISTRAR VISUALIZAÇÃO DO ARTIGO =====
@csrf_exempt
def registrar_visualizacao(request, slug):
    """
    API para registrar quando um usuário visualiza um artigo
    """
    if request.method == 'POST':
        try:
            # Quando tiver os models, descomente:
            # artigo = get_object_or_404(Artigo, slug=slug)
            # artigo.visualizacoes += 1
            # artigo.save()
            
            return JsonResponse({
                'success': True,
                # 'views': artigo.visualizacoes
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)


# ===== API: AVALIAR ARTIGO =====
@csrf_exempt
def avaliar_artigo(request, slug):
    """
    API para registrar avaliação do artigo (útil/não útil)
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            helpful = data.get('helpful', False)
            
            # Quando tiver os models, descomente:
            # artigo = get_object_or_404(Artigo, slug=slug)
            
            # Você pode criar um model de Avaliacao ou incrementar contadores no Artigo
            # if helpful:
            #     artigo.avaliacoes_positivas += 1
            # else:
            #     artigo.avaliacoes_negativas += 1
            # artigo.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Avaliação registrada com sucesso'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)


# ===== API: BUSCA COM FILTROS (AJAX) =====
@csrf_exempt
def api_busca(request):
    """
    API para busca com filtros via AJAX
    """
    if request.method == 'POST':
        try:
            query = request.GET.get('q', '')
            page = int(request.GET.get('page', 1))
            
            data = json.loads(request.body)
            filters = data.get('filters', {})
            
            # Quando tiver os models, descomente e adapte:
            # results = Artigo.objects.filter(
            #     Q(titulo__icontains=query) |
            #     Q(resumo__icontains=query),
            #     ativo=True
            # )
            
            # # Aplicar filtros de categoria
            # if filters.get('categories'):
            #     results = results.filter(categoria__slug__in=filters['categories'])
            
            # # Aplicar filtro de tipo
            # if filters.get('type') and filters['type'] != 'all':
            #     results = results.filter(tipo=filters['type'])
            
            # # Aplicar ordenação
            # sort_by = filters.get('sort', 'relevancia')
            # if sort_by == 'recentes':
            #     results = results.order_by('-data_publicacao')
            # elif sort_by == 'antigos':
            #     results = results.order_by('data_publicacao')
            # elif sort_by == 'visualizacoes':
            #     results = results.order_by('-visualizacoes')
            # elif sort_by == 'avaliacao':
            #     results = results.order_by('-avaliacao')
            
            # # Paginação
            # per_page = 10
            # start = (page - 1) * per_page
            # end = start + per_page
            # results_page = results[start:end]
            
            return JsonResponse({
                'results': [],  # list(results_page.values())
                'total': 0,  # results.count()
                'page': page
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)