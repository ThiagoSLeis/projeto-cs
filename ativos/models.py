from django.db import models
from django.utils import timezone

class TipoAtivo(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    icone = models.CharField(max_length=50, blank=True)  # Para UI
    
    class Meta:
        verbose_name = "Tipo de Ativo"
        verbose_name_plural = "Tipos de Ativo"
    
    def __str__(self):
        return self.nome

class Fabricante(models.Model):
    nome = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    suporte_email = models.EmailField(blank=True)
    
    class Meta:
        verbose_name = "Fabricante"
        verbose_name_plural = "Fabricantes"
    
    def __str__(self):
        return self.nome

class Localizacao(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.TextField(blank=True)
    responsavel = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = "Localização"
        verbose_name_plural = "Localizações"
    
    def __str__(self):
        return self.nome

class Ativo(models.Model):
    ESTADOS_ATIVO = [
        ('operacional', 'Operacional'),
        ('manutencao', 'Em Manutenção'),
        ('desativado', 'Desativado'),
        ('reserva', 'Reserva'),
    ]
    
    # Identificação única
    tag_patrimonio = models.CharField(max_length=50, unique=True, verbose_name="Tag Patrimônio")
    numero_serie = models.CharField(max_length=100, blank=True, verbose_name="Número de Série")
    
    # Informações básicas
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    tipo = models.ForeignKey(TipoAtivo, on_delete=models.PROTECT)
    fabricante = models.ForeignKey(Fabricante, on_delete=models.SET_NULL, null=True, blank=True)
    modelo = models.CharField(max_length=100, blank=True)
    
    # Localização e responsável
    localizacao = models.ForeignKey(Localizacao, on_delete=models.SET_NULL, null=True, blank=True)
    usuario_final = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='ativos_alocados')
    
    # Estado e datas
    estado = models.CharField(max_length=20, choices=ESTADOS_ATIVO, default='operacional')
    data_aquisicao = models.DateField(null=True, blank=True, verbose_name="Data de Aquisição")
    data_garantia = models.DateField(null=True, blank=True, verbose_name="Fim da Garantia")
    
    # Especificações técnicas
    especificacoes = models.JSONField(default=dict, blank=True)  # Flexível para diferentes tipos
    
    # Auditoria
    criado_por = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True)
    data_criacao = models.DateTimeField(default=timezone.now)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Ativo"
        verbose_name_plural = "Ativos"
        indexes = [
            models.Index(fields=['tag_patrimonio']),
            models.Index(fields=['tipo', 'estado']),
            models.Index(fields=['usuario_final']),
        ]
    
    def __str__(self):
        return f"{self.tag_patrimonio} - {self.nome}"

class Software(models.Model):
    TIPOS_LICENCA = [
        ('volume', 'Licença por Volume'),
        ('oem', 'OEM'),
        ('subscription', 'Assinatura'),
        ('gratuito', 'Gratuito'),
    ]
    
    nome = models.CharField(max_length=200)
    fabricante = models.ForeignKey(Fabricante, on_delete=models.CASCADE)
    versao = models.CharField(max_length=50)
    tipo_licenca = models.CharField(max_length=20, choices=TIPOS_LICENCA)
    chave_licenca = models.CharField(max_length=200, blank=True)
    total_licencas = models.IntegerField(default=1)
    licencas_utilizadas = models.IntegerField(default=0)
    data_expiracao = models.DateField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Software"
        verbose_name_plural = "Softwares"
    
    def licencas_disponiveis(self):
        return self.total_licencas - self.licencas_utilizadas
    
    def __str__(self):
        return f"{self.nome} {self.versao}"

class InstalacaoSoftware(models.Model):
    software = models.ForeignKey(Software, on_delete=models.CASCADE)
    ativo = models.ForeignKey(Ativo, on_delete=models.CASCADE)
    data_instalacao = models.DateField(default=timezone.now)
    usuario = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True)
    
    class Meta:
        verbose_name = "Instalação de Software"
        verbose_name_plural = "Instalações de Software"
        unique_together = ['software', 'ativo']
    
    def __str__(self):
        return f"{self.software} em {self.ativo}"

class Contrato(models.Model):
    numero = models.CharField(max_length=100, unique=True)
    fornecedor = models.CharField(max_length=200)
    descricao = models.TextField()
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    renovacao_automatica = models.BooleanField(default=False)
    
    # Arquivo do contrato (opcional)
    arquivo = models.FileField(upload_to='contratos/', null=True, blank=True)
    
    class Meta:
        verbose_name = "Contrato"
        verbose_name_plural = "Contratos"
    
    def __str__(self):
        return f"{self.numero} - {self.fornecedor}"

class ContratoAtivo(models.Model):
    contrato = models.ForeignKey(Contrato, on_delete=models.CASCADE)
    ativo = models.ForeignKey(Ativo, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Contrato do Ativo"
        verbose_name_plural = "Contratos dos Ativos"
        unique_together = ['contrato', 'ativo']
    
    def __str__(self):
        return f"{self.contrato} - {self.ativo}"