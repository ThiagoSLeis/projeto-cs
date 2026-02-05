from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    # ========== VIEWS ADMINISTRATIVAS (SISTEMA) ==========
    path('', views.citiesoft_home, name='citiesoft_home'),
    path('abrir_chamado/', views.abrir_chamado, name='abrir_chamado'),
    path('cadastro-ativo/', views.cadastro_ativo, name='cadastro_ativo'),
    path('cadastro_contrato/', views.cadastro_contrato, name='cadastro_contrato'),
    path('relatorios_atendimento/', views.relatorios_atendimento, name='relatorios_atendimento'),
    path('relatorio_ativos/', views.relatorio_ativos, name='relatorio_ativos'),
    path('autorizacao_usuarios/', views.autorizacao_usuarios, name='autorizacao_usuarios'),
    path('pessoas_ativas/', views.pessoas_ativas, name='pessoas_ativas'),
    path('metricas_kpi/', views.metricas_kpi, name='metricas_kpi'),
    path('atribuicao_tickets/', views.atribuicao_tickets, name='atribuicao_tickets'),
    path("logout/", LogoutView.as_view(next_page="login"), name="logout"),
    
    # ========== VIEWS CLIENTE ==========
    path('template_cliente/', views.template_cliente, name='template_cliente'),
    path('meus_chamados/', views.meus_chamados, name='meus_chamados'),
    path('abrir_chamado_cliente/', views.abrir_chamado_cliente, name='abrir_chamado_cliente'),
    
    # ========== ADMIN: BASE DE CONHECIMENTO ==========
    path('admin/conhecimento/', views.admin_base_conhecimento, name='admin_base_conhecimento'),
    path('cadastro_usuario/', views.cadastro_usuario, name='cadastro_usuario'),
    
    # APIs Admin (Wiki)
    path('api/artigos/', views.api_artigos_list, name='api_artigos_list'),
    path('api/artigos/create/', views.api_artigo_save, name='api_artigo_create'),
    path('api/artigos/<int:artigo_id>/update/', views.api_artigo_save, name='api_artigo_update'),
    path('api/artigos/<int:artigo_id>/delete/', views.api_artigo_delete, name='api_artigo_delete'),
    path('admin/conhecimento/artigo/<slug:slug>/preview/', views.artigo_preview_admin, name='artigo_preview_admin'),
    
    # ========== PÚBLICO: BASE DE CONHECIMENTO (CLIENTES) ==========
    path('conhecimento/', views.base_conhecimento, name='base_conhecimento'),
    path('conhecimento/categoria/<slug:slug>/', views.categoria_artigos, name='categoria_artigos'),
    path('conhecimento/artigo/<slug:slug>/', views.artigo_detalhe, name='artigo_detalhe'),
    path('conhecimento/busca/', views.busca_resultados, name='busca_resultados'),
    
    # APIs Públicas (Wiki)
    path('api/conhecimento/artigos/<slug:slug>/view/', views.registrar_visualizacao, name='api_visualizacao'),
    path('api/conhecimento/artigos/<slug:slug>/rate/', views.avaliar_artigo, name='api_avaliacao'),
    path('api/conhecimento/busca/', views.api_busca, name='api_busca'),

    # ========== API SISTEMA DE TICKETS (INTEGRAÇÃO JS) ==========
    # Rota que o JS usa para carregar os cards (GET)
    path('api/tickets/', views.api_get_tickets, name='api_tickets'),
    
    # Rota que o JS usa para salvar o técnico (POST)
    path('api/atribuir/', views.api_atribuir_ticket, name='api_atribuir_ticket'),
    
    # Rota para o botão de Chat/Dúvidas
    path('chamados/chat/<int:ticket_id>/', views.chamado_detalhe, name='chat_chamado'),
    path('chamado/<int:ticket_id>/', views.chamado_detalhe, name='chamado_detalhe'),
    # Adicione esta linha junto com as outras views de cliente
    path('meus_tickets/', views.meus_tickets, name='meus_tickets'),
]
