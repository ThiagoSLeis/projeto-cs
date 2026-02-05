from django.contrib import admin
from .models import Categoria, Artigo, AvaliacaoArtigo, Chamado, Mensagem

# ==========================================
# ADMIN: BASE DE CONHECIMENTO 📚
# ==========================================

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'slug', 'ordem', 'ativo', 'total_artigos_count', 'criado_em')
    list_filter = ('ativo', 'criado_em')
    search_fields = ('nome', 'descricao')
    prepopulated_fields = {'slug': ('nome',)}
    ordering = ('ordem', 'nome')
    list_editable = ('ordem', 'ativo')
    
    fieldsets = (
        ('Informações Básicas', {'fields': ('nome', 'slug', 'descricao')}),
        ('Aparência', {'fields': ('icone', 'cor_gradiente')}),
        ('Configurações', {'fields': ('ordem', 'ativo')}),
    )
    
    def total_artigos_count(self, obj):
        return obj.total_artigos
    total_artigos_count.short_description = 'Artigos Ativos'


@admin.register(Artigo)
class ArtigoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'tipo', 'autor', 'visualizacoes', 'ativo', 'destaque', 'data_publicacao')
    list_filter = ('ativo', 'destaque', 'tipo', 'categoria', 'data_publicacao')
    search_fields = ('titulo', 'resumo', 'conteudo', 'tags')
    prepopulated_fields = {'slug': ('titulo',)}
    ordering = ('-data_publicacao',)
    list_editable = ('ativo', 'destaque')
    readonly_fields = ('visualizacoes', 'avaliacoes_positivas', 'avaliacoes_negativas', 'data_publicacao', 'atualizado_em')
    date_hierarchy = 'data_publicacao'
    
    fieldsets = (
        ('Informações Básicas', {'fields': ('titulo', 'slug', 'resumo')}),
        ('Conteúdo', {'fields': ('conteudo',)}),
        ('Classificação', {'fields': ('categoria', 'tipo', 'tags')}),
        ('Metadados', {'fields': ('autor', 'tempo_leitura')}),
        ('Status', {'fields': ('ativo', 'destaque', 'data_publicacao', 'atualizado_em')}),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.autor = request.user
        super().save_model(request, obj, form, change)


@admin.register(AvaliacaoArtigo)
class AvaliacaoArtigoAdmin(admin.ModelAdmin):
    list_display = ('artigo', 'usuario', 'util', 'comentario_preview', 'criado_em')
    list_filter = ('util', 'criado_em')
    search_fields = ('artigo__titulo', 'usuario__username', 'comentario')
    readonly_fields = ('artigo', 'usuario', 'session_key', 'util', 'comentario', 'criado_em')
    
    def comentario_preview(self, obj):
        if obj.comentario:
            return obj.comentario[:50] + '...' if len(obj.comentario) > 50 else obj.comentario
        return '-'
    comentario_preview.short_description = 'Comentário'


# ==========================================
# ADMIN: SISTEMA DE CHAMADOS E CHAT 🎫
# ==========================================

@admin.register(Chamado)
class ChamadoAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'cliente', 'prioridade', 'status', 'tecnico', 'criado_em')
    list_filter = ('status', 'prioridade', 'tecnico')
    search_fields = ('titulo', 'cliente', 'id')
    ordering = ('-criado_em',)
    list_editable = ('status', 'prioridade', 'tecnico') 

    fieldsets = (
        ('Informações do Chamado', {
            'fields': ('titulo', 'cliente', 'descricao')
        }),
        ('Gerenciamento', {
            'fields': ('prioridade', 'status', 'tecnico')
        }),
    )

@admin.register(Mensagem)
class MensagemAdmin(admin.ModelAdmin):
    list_display = ('chamado', 'remetente', 'texto_preview', 'data_envio', 'is_suporte')
    list_filter = ('data_envio', 'is_suporte')
    readonly_fields = ('data_envio',)

    def texto_preview(self, obj):
        return obj.texto[:50] + "..." if len(obj.texto) > 50 else obj.texto
    texto_preview.short_description = 'Mensagem'

    