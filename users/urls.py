from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import CustomTokenView
from .views import (
    UserViewSet,
    AprovarFuncionarioView,
    FuncionariosPendentesView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('api/token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    # Funcionários pendentes
    path("funcionarios/pendentes/", FuncionariosPendentesView.as_view()),

    # Aprovar funcionário (POST)
    path("funcionario/aprovar/<int:pk>/", AprovarFuncionarioView.as_view()),
]

