from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User =  get_user_model()

class CustomAuthBackend(ModelBackend):
    def user_can_authenticate(self, user):
        # superuser / admin sempre autentica
        if user.is_superuser or getattr(user, 'role', None) == 'admin':
            return True

        # cliente sempre autentica
        if getattr(user, 'role', None) == 'cliente':
            return True

        # funcionário autentica somente se aprovado
        if getattr(user, 'role', None) == 'funcionario' and getattr(user, 'is_approved', False):
            return True

        return False
    