from django.contrib import admin
from .models import Categoria, Artigo, AvaliacaoArtigo


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    """
    Administração de Categorias da Base de Conhecimento
    """
    list_display = ('nome', 'slug', 'ordem', 'ativo', 'total_artigos_count', 'criado_em')
    list_filter = ('ativo', 'criado_em')
    search_fields = ('nome', 'descricao')
    prepopulated_fields = {'slug': ('nome',)}
    ordering = ('ordem', 'nome')
    list_editable = ('ordem', 'ativo')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'slug', 'descricao')
        }),
        ('Aparência', {
            'fields': ('icone', 'cor_gradiente')
        }),
        ('Configurações', {
            'fields': ('ordem', 'ativo')
        }),
    )
    
    def total_artigos_count(self, obj):
        """Exibe total de artigos ativos"""
        return obj.total_artigos
    total_artigos_count.short_description = 'Artigos Ativos'


@admin.register(Artigo)
class ArtigoAdmin(admin.ModelAdmin):
    """
    Administração de Artigos da Base de Conhecimento
    """
    list_display = (
        'titulo', 
        'categoria', 
        'tipo', 
        'autor', 
        'visualizacoes', 
        'taxa_aprovacao_display',
        'ativo', 
        'destaque',
        'data_publicacao'
    )
    list_filter = ('ativo', 'destaque', 'tipo', 'categoria', 'data_publicacao')
    search_fields = ('titulo', 'resumo', 'conteudo', 'tags')
    prepopulated_fields = {'slug': ('titulo',)}
    ordering = ('-data_publicacao',)
    list_editable = ('ativo', 'destaque')
    readonly_fields = ('visualizacoes', 'avaliacoes_positivas', 'avaliacoes_negativas', 'data_publicacao', 'atualizado_em')
    date_hierarchy = 'data_publicacao'
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'slug', 'resumo')
        }),
        ('Conteúdo', {
            'fields': ('conteudo',),
            'description': 'Use HTML para formatar o conteúdo'
        }),
        ('Classificação', {
            'fields': ('categoria', 'tipo', 'tags')
        }),
        ('Metadados', {
            'fields': ('autor', 'tempo_leitura')
        }),
        ('Estatísticas', {
            'fields': ('visualizacoes', 'avaliacoes_positivas', 'avaliacoes_negativas'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('ativo', 'destaque', 'data_publicacao', 'atualizado_em')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Auto-preenche o autor com o usuário logado"""
        if not obj.pk:  # Se for novo
            obj.autor = request.user
        super().save_model(request, obj, form, change)
    
    def taxa_aprovacao_display(self, obj):
        """Exibe taxa de aprovação em %"""
        return f"{obj.taxa_aprovacao}%"
    taxa_aprovacao_display.short_description = 'Aprovação'


@admin.register(AvaliacaoArtigo)
class AvaliacaoArtigoAdmin(admin.ModelAdmin):
    """
    Administração de Avaliações dos Artigos
    """
    list_display = ('artigo', 'usuario', 'util', 'comentario_preview', 'criado_em')
    list_filter = ('util', 'criado_em')
    search_fields = ('artigo__titulo', 'usuario__username', 'comentario')
    readonly_fields = ('artigo', 'usuario', 'session_key', 'util', 'comentario', 'criado_em')
    ordering = ('-criado_em',)
    
    def comentario_preview(self, obj):
        """Exibe preview do comentário"""
        if obj.comentario:
            return obj.comentario[:50] + '...' if len(obj.comentario) > 50 else obj.comentario
        return '-'
    comentario_preview.short_description = 'Comentário'
    
    def has_add_permission(self, request):
        """Desabilita criação manual de avaliações"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Desabilita edição de avaliações"""
        return False