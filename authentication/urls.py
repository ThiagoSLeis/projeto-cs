from django.urls import path
from .views import login_view, dashboard_view, register_view, password_reset, password_reset_done, password_reset_complete
from django.contrib.auth import views as auth_views
from authentication.views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('register/', register_view, name='register'),
    path('password_reset/', password_reset, name='password_reset'),
    path('password_reset/done/', password_reset_done, name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name="authentication/password_reset_confirm.html"),name='password_reset_confirm' ),
    path('reset/done/', password_reset_complete, name='password_reset_complete'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
            ]
