from django.contrib import admin
from .models import CategoriaTicket, StatusTicket, UrgenciaTicket, Ticket, InteracaoTicket, CampoPersonalizado

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['numero_ticket', 'titulo', 'criado_por', 'status', 'urgencia', 'data_criacao']
    list_filter = ['status', 'urgencia', 'categoria', 'tipo']
    search_fields = ['numero_ticket', 'titulo', 'descricao']
    readonly_fields = ['numero_ticket', 'data_criacao', 'data_atualizacao']

admin.site.register(CategoriaTicket)
admin.site.register(StatusTicket)
admin.site.register(UrgenciaTicket)
admin.site.register(InteracaoTicket)
admin.site.register(CampoPersonalizado)