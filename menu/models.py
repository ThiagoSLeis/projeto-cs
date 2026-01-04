from django.db import models
from django.utils.text import slugify
from django.conf import settings


class Categoria(models.Model):
    """
    Categorias da Base de Conhecimento (ex: Locação, Suporte, Desenvolvimento)
    """
    nome = models.CharField(max_length=100, verbose_name='Nome da Categoria')
    slug = models.SlugField(max_length=100, unique=True, blank=True, db_index=True)  # ← Índice para performance
    descricao = models.TextField(verbose_name='Descrição')
    icone = models.CharField(max_length=50, default='fas fa-folder', verbose_name='Ícone FontAwesome')
    cor_gradiente = models.CharField(
        max_length=100, 
        default='linear-gradient(135deg, #00A6FF, #0056b3)', 
        verbose_name='Cor Gradiente CSS'
    )
    ordem = models.IntegerField(default=0, verbose_name='Ordem de Exibição', db_index=True)  # ← Índice
    ativo = models.BooleanField(default=True, verbose_name='Ativo', db_index=True)  # ← Índice
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['ordem', 'nome']
        db_table = 'menu_categoria'  # ← Nome da tabela no MySQL

    def __str__(self):
        return self.nome

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

    @property
    def total_artigos(self):
        """Total de artigos ativos nesta categoria"""
        return self.artigos.filter(ativo=True).count()


class Artigo(models.Model):
    """
    Artigos da Base de Conhecimento
    """
    TIPO_CHOICES = [
        ('tutorial', 'Tutorial'),
        ('guia', 'Guia'),
        ('faq', 'FAQ'),
    ]

    # Informações Básicas
    titulo = models.CharField(max_length=200, verbose_name='Título', db_index=True)  # ← Índice
    slug = models.SlugField(max_length=200, unique=True, blank=True, db_index=True)  # ← Índice
    resumo = models.TextField(max_length=500, verbose_name='Resumo')
    conteudo = models.TextField(verbose_name='Conteúdo HTML')  # ← LONGTEXT no MySQL
    
    # Classificação
    categoria = models.ForeignKey(
        Categoria, 
        on_delete=models.CASCADE, 
        related_name='artigos', 
        verbose_name='Categoria',
        db_index=True  # ← Índice para JOIN
    )
    tipo = models.CharField(
        max_length=20, 
        choices=TIPO_CHOICES, 
        default='tutorial', 
        verbose_name='Tipo',
        db_index=True  # ← Índice
    )
    tags = models.CharField(max_length=500, blank=True, verbose_name='Tags (separadas por vírgula)')
    
    # Metadados
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name='Autor'
    )
    tempo_leitura = models.PositiveIntegerField(default=5, verbose_name='Tempo de Leitura (min)')  # ← Não pode ser negativo
    visualizacoes = models.PositiveIntegerField(default=0, verbose_name='Visualizações', db_index=True)  # ← Índice
    
    # Avaliações
    avaliacoes_positivas = models.PositiveIntegerField(default=0, verbose_name='Avaliações Positivas')
    avaliacoes_negativas = models.PositiveIntegerField(default=0, verbose_name='Avaliações Negativas')
    
    # Status
    ativo = models.BooleanField(default=True, verbose_name='Ativo', db_index=True)  # ← Índice
    destaque = models.BooleanField(default=False, verbose_name='Destaque', db_index=True)  # ← Índice
    
    # Datas
    data_publicacao = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Data de Publicação',
        db_index=True  # ← Índice para ordenação
    )
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name = 'Artigo'
        verbose_name_plural = 'Artigos'
        ordering = ['-data_publicacao']
        db_table = 'menu_artigo'  # ← Nome da tabela no MySQL
        indexes = [
            models.Index(fields=['ativo', 'destaque']),  # ← Índice composto
            models.Index(fields=['categoria', 'ativo']),  # ← Índice composto
        ]

    def __str__(self):
        return self.titulo

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.titulo)
            slug = base_slug
            counter = 1
            # Garantir slug único
            while Artigo.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def avaliacao(self):
        """Calcula a avaliação média (0-5)"""
        total = self.avaliacoes_positivas + self.avaliacoes_negativas
        if total == 0:
            return 0
        return round((self.avaliacoes_positivas / total) * 5, 1)

    @property
    def taxa_aprovacao(self):
        """Calcula a taxa de aprovação em porcentagem"""
        total = self.avaliacoes_positivas + self.avaliacoes_negativas
        if total == 0:
            return 0
        return round((self.avaliacoes_positivas / total) * 100)

    def get_tags_list(self):
        """Retorna lista de tags"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []

    def incrementar_visualizacao(self):
        """Incrementa contador de visualizações de forma atômica"""
        self.visualizacoes = models.F('visualizacoes') + 1
        self.save(update_fields=['visualizacoes'])


class AvaliacaoArtigo(models.Model):
    """
    Registra avaliações individuais dos usuários nos artigos
    """
    artigo = models.ForeignKey(
        Artigo, 
        on_delete=models.CASCADE, 
        related_name='avaliacoes_detalhadas', 
        verbose_name='Artigo'
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        verbose_name='Usuário'
    )
    session_key = models.CharField(max_length=100, blank=True, verbose_name='Session Key')
    util = models.BooleanField(verbose_name='Foi Útil?')
    comentario = models.TextField(blank=True, verbose_name='Comentário (opcional)')
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name='Criado em', db_index=True)

    class Meta:
        verbose_name = 'Avaliação de Artigo'
        verbose_name_plural = 'Avaliações de Artigos'
        ordering = ['-criado_em']
        db_table = 'menu_avaliacao_artigo'
        unique_together = [['artigo', 'usuario'], ['artigo', 'session_key']]  # ← Evita avaliação duplicada

    def __str__(self):
        return f"Avaliação de '{self.artigo.titulo}' - {'Útil' if self.util else 'Não Útil'}"
    
    # formulario cliente
    
    
    