from rest_framework.permissions import BasePermission

class IsApprovedEmployee(BasePermission):
    """
    Permite acesso apenas para funcionários aprovados.
    Admins sempre têm acesso.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # admin sempre tem permissão
        if user.is_superuser:
            return True

        # cliente pode acessar normalmente (você define o que ele pode ver no ViewSet)
        if user.role == 'cliente':
            return True

        # funcionário só se for aprovado
        if user.role == 'funcionario' and user.is_approved:
            return True

        return False
