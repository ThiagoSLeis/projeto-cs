from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = (
        ("Dados de Login", {"fields": ("cpf", "password")}),
        ("Informações pessoais", {"fields": ("first_name", "last_name", "email")}),
        ("Endereço", {"fields": ("logradouro", "bairro", "cidade", "uf", "cep")}),
        ("Empresa", {"fields": ("telefone", "cnpj")}),
        ("Permissões", {"fields": ("role", "is_staff", "is_superuser", "is_approved")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("cpf", "username", "email", "first_name", "last_name", "password1", "password2", "role"),
        }),
    )

    list_display = ("cpf", "username", "email", "role", "is_approved")
    search_fields = ("cpf", "username", "email")

