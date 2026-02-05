from rest_framework.permissions import BasePermission

class CanAssignTicket(BasePermission):
    """
    Permite atribuir tickets somente para funcionários aprovados e administradores.
    """
    def has_permission(self, request, view):
        user = request.user

        # não está autenticado → não pode
        if not user or not user.is_authenticated:
            return False

        # admin sempre pode
        if user.role == 'admin':
            return True

        # funcionário só pode se estiver aprovado
        if user.role == 'funcionario' and user.is_approved:
            return True

        return False

class IsAdminToAssignTicket(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'admin'
        )

class CanUpdateTicketStatus(BasePermission):
    """
    Admin pode atualizar qualquer status.
    Funcionário apenas se o ticket estiver atribuído a ele.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True

        if request.user.role == 'funcionario':
            return obj.atribuido_para == request.user

        return False

