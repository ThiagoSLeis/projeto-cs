from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.apps import apps

User = get_user_model()
Ticket = apps.get_model('tickets', 'Ticket')  # para garantir import dinâmico

@receiver(post_save, sender=User)
def manage_employee_permissions(sender, instance, created, **kwargs):
    # Só nos funcionários
    if instance.role != 'funcionario':
        return

    try:
        perm = Permission.objects.get(codename='atribuir_ticket')
    except Permission.DoesNotExist:
        return

    if instance.is_approved:
        # adiciona se não tiver
        if not instance.has_perm('tickets.atribuir_ticket'):
            instance.user_permissions.add(perm)
    else:
        # remove se tiver
        if instance.has_perm('tickets.atribuir_ticket'):
            instance.user_permissions.remove(perm)
