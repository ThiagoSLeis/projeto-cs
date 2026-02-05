from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from users.views import CustomTokenView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


# Import das views
from tickets.views import (
    CategoriaTicketViewSet, StatusTicketViewSet, UrgenciaTicketViewSet,
    TicketViewSet, InteracaoTicketViewSet, CampoPersonalizadoViewSet
)
from ativos.views import (
    TipoAtivoViewSet, FabricanteViewSet, LocalizacaoViewSet, AtivoViewSet,
    SoftwareViewSet, InstalacaoSoftwareViewSet, ContratoViewSet, ContratoAtivoViewSet
)

router = routers.DefaultRouter()

# Tickets
router.register(r'categorias-tickets', CategoriaTicketViewSet)
router.register(r'status-tickets', StatusTicketViewSet)
router.register(r'urgencias-tickets', UrgenciaTicketViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'interacoes-tickets', InteracaoTicketViewSet)
router.register(r'campos-personalizados', CampoPersonalizadoViewSet)

# Ativos
router.register(r'tipos-ativos', TipoAtivoViewSet)
router.register(r'fabricantes', FabricanteViewSet)
router.register(r'localizacoes', LocalizacaoViewSet)
router.register(r'ativos', AtivoViewSet)
router.register(r'softwares', SoftwareViewSet)
router.register(r'instalacoes-software', InstalacaoSoftwareViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'contratos-ativos', ContratoAtivoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authentication.urls')),
    path('api/', include('users.urls')),
    path('menu/', include('menu.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
    path('api/', include('faq.urls')),
]

# Agora somamos a rota de mídia apenas se estivermos em modo de desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

