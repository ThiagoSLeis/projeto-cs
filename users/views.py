from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser



class UserViewSet(viewsets.ModelViewSet):
    """
    Endpoint da API que permite aos usuários serem vistos ou editados.
    """
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        """
        Sobrescreve o método create para aplicar aprovação manual
        quando o usuário for funcionário.
        """
        data = request.data.copy()

        role = data.get('role', 'cliente')

        # Se for funcionário → fica pendente (aguarda aprovação)
        if role == 'funcionario':
            data['is_approved'] = False
        else:
            # cliente → aprovado automaticamente
            data['is_approved'] = True

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pendentes(self, request):
        """
        Lista funcionários que estão aguardando aprovação.
        Apenas administradores podem ver.
        """
        pendentes = CustomUser.objects.filter(role='funcionario', is_approved=False)
        serializer = self.get_serializer(pendentes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def aprovar(self, request, pk=None):
        """
        Aprova manualmente um funcionário pendente.
        """
        user = self.get_object()

        if user.role != 'funcionario':
            return Response({'erro': 'Este usuário não é um funcionário.'}, status=400)

        user.is_approved = True
        user.save()

        return Response({'status': 'Usuário aprovado com sucesso.'})

