from django.db import models
from django.contrib.auth.models import AbstractUser
from authentication.validators import validate_cpf
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    cpf = models.CharField(max_length=14, unique=True, verbose_name='CPF', validators=[validate_cpf])
    email = models.EmailField(unique=True, verbose_name='E-mail')
    telefone = models.CharField('Telefone', max_length=11, blank=True, null=True)
    cnpj = models.CharField('CNPJ', max_length=14, unique=True, blank=True, null=True)
    logradouro = models.CharField('Logradouro', max_length=150, blank=True, null=True)
    bairro = models.CharField('Bairro', max_length=100, blank=True, null=True)
    cidade = models.CharField('Cidade', max_length=100, blank=True, null=True)
    cep = models.CharField('CEP', max_length=8, blank=True, null=True)
    uf = models.CharField('UF', max_length=2, blank=True, null=True)
    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'email']

    objects = CustomUserManager() 

    def __str__(self):
        return self.cpf or self.username
    
    def save(self, *args, **kwargs):
        if self.cnpj == "":
            self.cnpj = None
        super().save(*args, **kwargs)
    
    ROLE_CHOICES = (
    ('cliente', 'Cliente'),
    ('funcionario', 'Funcionário'),
    ('admin', 'Administrador'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='cliente')
    is_approved = models.BooleanField(default=True)  # por padrão True para clientes

    # VOU DEIXAR DE OPCIONAL POR ENQUANTO (QUALQUER COISA MUDO DPS)

    def is_employee(self):
        return self.role == 'funcionario' and self.is_approved
    
    def is_client(self):
        return self.role == 'cliente'


