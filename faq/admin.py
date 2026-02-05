from django.contrib import admin
from .models import FAQ


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('pergunta', 'criado_em', 'atualizado_em')
    search_fields = ('pergunta',)
