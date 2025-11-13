from django.contrib import admin
from .models import TipoAtivo, Fabricante, Localizacao, Ativo, Software, InstalacaoSoftware, Contrato, ContratoAtivo

@admin.register(Ativo)
class AtivoAdmin(admin.ModelAdmin):
    list_display = ['tag_patrimonio', 'nome', 'tipo', 'estado', 'localizacao', 'usuario_final']
    list_filter = ['tipo', 'estado', 'localizacao']
    search_fields = ['tag_patrimonio', 'nome', 'numero_serie', 'modelo']
    readonly_fields = ['data_criacao', 'data_atualizacao']

@admin.register(Software)
class SoftwareAdmin(admin.ModelAdmin):
    list_display = ['nome', 'fabricante', 'versao', 'tipo_licenca', 'licencas_disponiveis']
    list_filter = ['fabricante', 'tipo_licenca']
    search_fields = ['nome', 'versao']

admin.site.register(TipoAtivo)
admin.site.register(Fabricante)
admin.site.register(Localizacao)
admin.site.register(InstalacaoSoftware)
admin.site.register(Contrato)
admin.site.register(ContratoAtivo)