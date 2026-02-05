from django.db import models
from django.utils.text import slugify
from django.conf import settings

# ==========================================
# SEÇÃO 1: BASE DE CONHECIMENTO
# ==========================================

class Categoria(models.Model):
    nome = models.CharField(max_length=100, verbose_name='Nome da Categoria')
    slug = models.SlugField(max_length=100, unique=True, blank=True, db_index=True)
    descricao = models.TextField(verbose_name='Descrição')
    icone = models.CharField(max_length=50, default='fas fa-folder', verbose_name='Ícone FontAwesome')
    cor_gradiente = models.CharField(max_length=100, default='linear-gradient(135deg, #00A6FF, #0056b3)', verbose_name='Cor Gradiente CSS')
    ordem = models.IntegerField(default=0, verbose_name='Ordem de Exibição', db_index=True)
    ativo = models.BooleanField(default=True, verbose_name='Ativo', db_index=True)
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['ordem', 'nome']
        db_table = 'menu_categoria'

    def __str__(self):
        return self.nome

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

    @property
    def total_artigos(self):
        return self.artigos.filter(ativo=True).count()


class Artigo(models.Model):
    TIPO_CHOICES = [('tutorial', 'Tutorial'), ('guia', 'Guia'), ('faq', 'FAQ')]
    titulo = models.CharField(max_length=200, verbose_name='Título', db_index=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True, db_index=True)
    resumo = models.TextField(max_length=500, verbose_name='Resumo')
    conteudo = models.TextField(verbose_name='Conteúdo HTML')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='artigos', verbose_name='Categoria')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='tutorial', verbose_name='Tipo')
    tags = models.CharField(max_length=500, blank=True, verbose_name='Tags (separadas por vírgula)')
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    tempo_leitura = models.PositiveIntegerField(default=5, verbose_name='Tempo de Leitura (min)')
    visualizacoes = models.PositiveIntegerField(default=0, verbose_name='Visualizações', db_index=True)
    avaliacoes_positivas = models.PositiveIntegerField(default=0, verbose_name='Avaliações Positivas')
    avaliacoes_negativas = models.PositiveIntegerField(default=0, verbose_name='Avaliações Negativas')
    ativo = models.BooleanField(default=True, verbose_name='Ativo')
    destaque = models.BooleanField(default=False, verbose_name='Destaque')
    data_publicacao = models.DateTimeField(auto_now_add=True, db_index=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Artigo'
        verbose_name_plural = 'Artigos'
        ordering = ['-data_publicacao']
        db_table = 'menu_artigo'

    def __str__(self):
        return self.titulo

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.titulo)
            slug = base_slug
            counter = 1
            while Artigo.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class AvaliacaoArtigo(models.Model):
    artigo = models.ForeignKey(Artigo, on_delete=models.CASCADE, related_name='avaliacoes_detalhadas')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=100, blank=True)
    util = models.BooleanField(verbose_name='Foi Útil?')
    comentario = models.TextField(blank=True, verbose_name='Comentário')
    criado_em = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'menu_avaliacao_artigo'
        unique_together = [['artigo', 'usuario'], ['artigo', 'session_key']]

# ==========================================
# SEÇÃO 2: SISTEMA DE TICKETS E CHAT
# ==========================================

class Chamado(models.Model):
    PRIORIDADE_CHOICES = [('baixo', '🟢 Baixa'), ('medio', '🟡 Média'), ('alto', '🔴 Alta')]
    STATUS_CHOICES = [('aberto', 'Aberto'), ('em_progresso', 'Em Andamento'), ('aguardando', 'Aguardando'), ('fechado', 'Concluído')]

    titulo = models.CharField(max_length=200, verbose_name='Título do Chamado')
    cliente = models.CharField(max_length=150, verbose_name='Nome do Cliente/Prefeitura')
    descricao = models.TextField(verbose_name='Descrição do Problema')
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, default='medio')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aberto', db_index=True)
    
    # CORREÇÃO: Adicionado o campo criado_por para vincular o chamado ao cliente
    criado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='meus_chamados_menu',
        verbose_name='Criado por'
    )
    
    tecnico = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='chamados_atribuidos_menu', 
        verbose_name='Técnico Responsável'
    )
    
    criado_em = models.DateTimeField(auto_now_add=True, db_index=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Chamado'
        verbose_name_plural = 'Chamados'
        db_table = 'menu_chamado'

    def __str__(self):
        return f"#{self.id} - {self.titulo}"

class Mensagem(models.Model):
    chamado = models.ForeignKey(Chamado, on_delete=models.CASCADE, related_name='mensagens', verbose_name='Chamado')
    remetente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Remetente')
    texto = models.TextField(verbose_name='Mensagem')
    arquivo = models.FileField(upload_to='chamados/anexos/', null=True, blank=True, verbose_name='Arquivo Anexo')
    data_envio = models.DateTimeField(auto_now_add=True, verbose_name='Data de Envio', db_index=True)
    is_suporte = models.BooleanField(default=False, verbose_name='É Suporte?')

    class Meta:
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'
        db_table = 'menu_mensagem'
        ordering = ['data_envio']

    def __str__(self):
        return f"Mensagem de {self.remetente} no Chamado #{self.chamado_id}"
    
    