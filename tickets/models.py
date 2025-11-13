from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class CategoriaTicket(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Categoria de Ticket"
        verbose_name_plural = "Categorias de Tickets"
    
    def __str__(self):
        return self.nome

class StatusTicket(models.Model):
    nome = models.CharField(max_length=50)
    cor = models.CharField(max_length=7, default='#007bff')  # Código cor HEX
    ordem = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = "Status do Ticket"
        verbose_name_plural = "Status dos Tickets"
        ordering = ['ordem']
    
    def __str__(self):
        return self.nome

class UrgenciaTicket(models.Model):
    nome = models.CharField(max_length=50)
    nivel = models.IntegerField(unique=True)
    cor = models.CharField(max_length=7, default='#6c757d')
    tempo_resposta_esperado = models.DurationField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Nível de Urgência"
        verbose_name_plural = "Níveis de Urgência"
        ordering = ['nivel']
    
    def __str__(self):
        return f"{self.nome} (Nível {self.nivel})"

class Ticket(models.Model):
    titulo = models.CharField(max_length=200, verbose_name="Título")
    descricao = models.TextField(verbose_name="Descrição")
    categoria = models.ForeignKey(CategoriaTicket, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.ForeignKey(StatusTicket, on_delete=models.SET_NULL, null=True, default=1)
    urgencia = models.ForeignKey(UrgenciaTicket, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Atribuição e responsáveis
    criado_por = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='tickets_criados'
    )
    atribuido_para = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets_atribuidos'
    )
    
    # Datas importantes (criação, atualização, fechamento, prazo') # lembrar de mostrar
    data_criacao = models.DateTimeField(default=timezone.now)
    data_atualizacao = models.DateTimeField(auto_now=True)
    data_fechamento = models.DateTimeField(null=True, blank=True)
    data_limite = models.DateTimeField(null=True, blank=True)
    
    # Campos para ITIL (boas práticas segundo ITIL) # De acordo com a documentação
    tipo = models.CharField(
        max_length=20,
        choices=[
            ('incidente', 'Incidente'),
            ('problema', 'Problema'),
            ('solicitacao', 'Solicitação de Serviço'),
        ],
        default='incidente'
    )
    
    # Metadados
    numero_ticket = models.CharField(max_length=20, unique=True, editable=False)

    ativos_relacionados = models.ManyToManyField(
        'ativos.Ativo',  # Referência ao app ativos
        blank=True,
        related_name='tickets_relacionados',
        verbose_name="Ativos Relacionados"
    )
    
    class Meta:
        verbose_name = "Ticket"
        verbose_name_plural = "Tickets"
        ordering = ['-data_criacao']
        indexes = [
            models.Index(fields=['status', 'urgencia']),
            models.Index(fields=['data_criacao']),
            models.Index(fields=['criado_por', 'status']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.numero_ticket:
            # Gera número automático: TICKET-YYYYMMDD-XXXX
            data_atual = timezone.now().strftime('%Y%m%d')
            ultimo_ticket = Ticket.objects.filter(
                numero_ticket__startswith=f'TICKET-{data_atual}'
            ).order_by('-id').first()
            
            if ultimo_ticket:
                ultimo_numero = int(ultimo_ticket.numero_ticket.split('-')[-1])
                novo_numero = ultimo_numero + 1
            else:
                novo_numero = 1
                
            self.numero_ticket = f'TICKET-{data_atual}-{novo_numero:04d}'
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.numero_ticket} - {self.titulo}"

class InteracaoTicket(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='interacoes')
    usuario = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    mensagem = models.TextField()
    data_criacao = models.DateTimeField(default=timezone.now)
    tipo = models.CharField(
        max_length=20,
        choices=[
            ('comentario', 'Comentário'),
            ('atualizacao', 'Atualização'),
            ('solucao', 'Solução'),
        ],
        default='comentario'
    )
    interno = models.BooleanField(default=False)  # Se apenas equipe interna vê
    
    class Meta:
        verbose_name = "Interação do Ticket"
        verbose_name_plural = "Interações dos Tickets"
        ordering = ['data_criacao']
    
    def __str__(self):
        return f"Interação em {self.ticket.numero_ticket} por {self.usuario}"

class CampoPersonalizado(models.Model):
    TIPOS_CAMPO = [
        ('texto', 'Texto'),
        ('numero', 'Número'),
        ('data', 'Data'),
        ('select', 'Seleção'),
        ('checkbox', 'Checkbox'),
    ]
    
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPOS_CAMPO)
    obrigatorio = models.BooleanField(default=False)
    opcoes = models.TextField(blank=True, help_text="Para campos de seleção, separar opções por vírgula")
    ativo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Campo Personalizado"
        verbose_name_plural = "Campos Personalizados"
    
    def __str__(self):
        return self.nome