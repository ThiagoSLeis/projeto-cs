from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TipoAtivo, Fabricante, Localizacao, Ativo, Software, InstalacaoSoftware, Contrato, ContratoAtivo
from .serializers import (
    TipoAtivoSerializer, FabricanteSerializer, LocalizacaoSerializer,
    AtivoSerializer, SoftwareSerializer, InstalacaoSoftwareSerializer,
    ContratoSerializer, ContratoAtivoSerializer
)
class TipoAtivoViewSet(viewsets.ModelViewSet):
    queryset = TipoAtivo.objects.all()
    serializer_class = TipoAtivoSerializer

class FabricanteViewSet(viewsets.ModelViewSet):
    queryset = Fabricante.objects.all()
    serializer_class = FabricanteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']

class LocalizacaoViewSet(viewsets.ModelViewSet):
    queryset = Localizacao.objects.all()
    serializer_class = LocalizacaoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']

class AtivoViewSet(viewsets.ModelViewSet):
    queryset = Ativo.objects.all()
    serializer_class = AtivoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['tag_patrimonio', 'nome', 'numero_serie', 'modelo']
    filterset_fields = ['tipo', 'estado', 'localizacao']
    ordering_fields = ['data_criacao', 'tag_patrimonio']
    ordering = ['tag_patrimonio']
    
    @action(detail=True, methods=['get'])
    def tickets_relacionados(self, request, pk=None):
        ativo = self.get_object()
        tickets = ativo.tickets_relacionados.all()
        from tickets.serializers import TicketSerializer
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

class SoftwareViewSet(viewsets.ModelViewSet):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome', 'fabricante__nome']

class InstalacaoSoftwareViewSet(viewsets.ModelViewSet):
    queryset = InstalacaoSoftware.objects.all()
    serializer_class = InstalacaoSoftwareSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['software', 'ativo']

class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['numero', 'fornecedor']

class ContratoAtivoViewSet(viewsets.ModelViewSet):
    queryset = ContratoAtivo.objects.all()
    serializer_class = ContratoAtivoSerializer