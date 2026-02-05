from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from .models import FAQ
from .serializers import FAQSerializer

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all().order_by('-criado_em')
    serializer_class = FAQSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]  # só admin pode editar
        return [IsAuthenticatedOrReadOnly()]  # qualquer um pode ver
