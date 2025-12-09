from rest_framework import viewsets, filters, status
from users.permissions import IsApprovedEmployee
from .models import Ticket
from .serializers import TicketSerializer 
from .permissions import CanAssignTicket
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategoriaTicket, StatusTicket, UrgenciaTicket, Ticket, InteracaoTicket, CampoPersonalizado
from .serializers import (
    CategoriaTicketSerializer, StatusTicketSerializer, UrgenciaTicketSerializer,
    TicketSerializer, InteracaoTicketSerializer, CampoPersonalizadoSerializer, TicketCreateSerializer
)

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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    serializer_class = TicketSerializer
    permission_classes = [IsApprovedEmployee]
    search_fields = ['numero_ticket', 'titulo', 'descricao']
    ordering_fields = ['data_criacao', 'urgencia__nivel', 'status__ordem']
    ordering = ['-data_criacao']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        return TicketSerializer
    
    def get_queryset(self):
        queryset = Ticket.objects.all()
        
        # Filtros específicos
        status = self.request.query_params.get('status', None)
        urgencia = self.request.query_params.get('urgencia', None)
        tipo = self.request.query_params.get('tipo', None)
        
        if status:
            queryset = queryset.filter(status__nome=status)
        if urgencia:
            queryset = queryset.filter(urgencia__nome=urgencia)
        if tipo:
            queryset = queryset.filter(tipo=tipo)
            
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[CanAssignTicket])
    def atribuir(self, request, pk=None):
        """
        Atribui o ticket a um funcionário.
        Apenas funcionários aprovados e admin podem usar.
        """
        ticket = self.get_object()
        funcionario_id = request.data.get("funcionario_id")

        try:
            funcionario = CustomUser.objects.get(id=funcionario_id)
        except CustomUser.DoesNotExist:
            return Response({"erro": "Funcionário não encontrado."}, status=400)

        # Verifica se o destino é funcionário aprovado ou admin
        if funcionario.role == "funcionario" and not funcionario.is_approved:
            return Response({"erro": "Funcionário não aprovado."}, status=400)

        if funcionario.role not in ["funcionario", "admin"]:
            return Response({"erro": "Somente funcionários e administradores podem ser responsáveis."},
                            status=400)

        ticket.responsavel = funcionario
        ticket.save()

        return Response({"status": "Ticket atribuído com sucesso!"})

    
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
        interacoes = ticket.interacoes.all()
        serializer = InteracaoTicketSerializer(interacoes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def atribuir_para(self, request, pk=None):
        ticket = self.get_object()
        usuario_id = request.data.get('usuario_id')
        
        if usuario_id:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                usuario = User.objects.get(id=usuario_id)
                ticket.atribuido_para = usuario
                ticket.save()
                
            
                InteracaoTicket.objects.create(
                    ticket=ticket,
                    usuario=request.user,
                    mensagem=f"Ticket atribuído para {usuario.username}",
                    tipo='atualizacao',
                    interno=True
                )
                
                return Response({'status': 'Ticket atribuído com sucesso'})
            except User.DoesNotExist:
                return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'error': 'usuario_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

class InteracaoTicketViewSet(viewsets.ModelViewSet):
    queryset = InteracaoTicket.objects.all()
    serializer_class = InteracaoTicketSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ticket', 'usuario', 'tipo']

class CampoPersonalizadoViewSet(viewsets.ModelViewSet):
    queryset = CampoPersonalizado.objects.all()
    serializer_class = CampoPersonalizadoSerializer