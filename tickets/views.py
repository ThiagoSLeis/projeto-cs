from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsApprovedEmployee
from users.models import CustomUser

from .models import (
    CategoriaTicket, StatusTicket, UrgenciaTicket,
    Ticket, InteracaoTicket, CampoPersonalizado
)
from .serializers import (
    CategoriaTicketSerializer, StatusTicketSerializer,
    UrgenciaTicketSerializer, TicketSerializer,
    InteracaoTicketSerializer, CampoPersonalizadoSerializer,
    TicketCreateSerializer, TicketAtribuicaoSerializer
)
from .permissions import IsAdminToAssignTicket, CanUpdateTicketStatus


class CategoriaTicketViewSet(viewsets.ModelViewSet):
    queryset = CategoriaTicket.objects.all()
    serializer_class = CategoriaTicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['nome']


class StatusTicketViewSet(viewsets.ModelViewSet):
    queryset = StatusTicket.objects.all()
    serializer_class = StatusTicketSerializer


class UrgenciaTicketViewSet(viewsets.ModelViewSet):
    queryset = UrgenciaTicket.objects.all()
    serializer_class = UrgenciaTicketSerializer



class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsApprovedEmployee]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numero_ticket', 'titulo', 'descricao']
    ordering_fields = ['data_criacao', 'status__ordem', 'urgencia__nivel']
    ordering = ['-data_criacao']

    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        return TicketSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Ticket.objects.all()

        if user.role == 'funcionario':
            return Ticket.objects.filter(atribuido_para=user)

        return Ticket.objects.filter(criado_por=user)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAdminToAssignTicket]
    )
    def atribuir(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketAtribuicaoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        funcionario = serializer.validated_data['funcionario']
        ticket.atribuido_para = funcionario
        ticket.save()

        InteracaoTicket.objects.create(
            ticket=ticket,
            usuario=request.user,
            mensagem=f"Ticket atribuído para {funcionario.username}",
            tipo='atualizacao',
            interno=True
        )

        return Response(
            {"msg": "Ticket atribuído com sucesso"},
            status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=['patch'],
        permission_classes=[IsAuthenticated, CanUpdateTicketStatus]
    )
    def atualizar_status(self, request, pk=None):
        ticket = self.get_object()
        status_id = request.data.get('status')

        if not status_id:
            return Response(
                {"erro": "status é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            novo_status = StatusTicket.objects.get(id=status_id)
        except StatusTicket.DoesNotExist:
            return Response(
                {"erro": "Status inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket.status = novo_status
        ticket.save()

        InteracaoTicket.objects.create(
            ticket=ticket,
            usuario=request.user,
            mensagem=f"Status alterado para {novo_status.nome}",
            tipo='atualizacao',
            interno=True
        )

        return Response(
            {"msg": "Status atualizado com sucesso"},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def adicionar_interacao(self, request, pk=None):
        ticket = self.get_object()
        serializer = InteracaoTicketSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(ticket=ticket, usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def interacoes(self, request, pk=None):
        ticket = self.get_object()
        serializer = InteracaoTicketSerializer(ticket.interacoes.all(), many=True)
        return Response(serializer.data)


class InteracaoTicketViewSet(viewsets.ModelViewSet):
    queryset = InteracaoTicket.objects.all()
    serializer_class = InteracaoTicketSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ticket', 'usuario', 'tipo']


class CampoPersonalizadoViewSet(viewsets.ModelViewSet):
    queryset = CampoPersonalizado.objects.all()
    serializer_class = CampoPersonalizadoSerializer

