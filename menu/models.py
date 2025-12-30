# ===== MODELS DA BASE DE CONHECIMENTO =====

from django.db import models
from django.utils.text import slugify
from django.conf import settings  # ← IMPORTANTE


class Categoria(models.Model):
    """
    Categorias da Base de Conhecimento (ex: Locação, Suporte, Desenvolvimento)
    """
    nome = models.CharField(max_length=100, verbose_name='Nome da Categoria')
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    descricao = models.TextField(verbose_name='Descrição')
    icone = models.CharField(max_length=50, default='fas fa-folder', verbose_name='Ícone FontAwesome')
    cor_gradiente = models.CharField(max_length=100, default='linear-gradient(135deg, #00A6FF, #0056b3)', verbose_name='Cor Gradiente CSS')
    ordem = models.IntegerField(default=0, verbose_name='Ordem de Exibição')
    ativo = models.BooleanField(default=True, verbose_name='Ativo')
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['ordem', 'nome']

    def __str__(self):
        return self.nome

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

    def total_artigos(self):
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
    titulo = models.CharField(max_length=200, verbose_name='Título')
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    resumo = models.TextField(max_length=500, verbose_name='Resumo')
    conteudo = models.TextField(verbose_name='Conteúdo HTML')
    
    # Classificação
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='artigos', verbose_name='Categoria')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='tutorial', verbose_name='Tipo')
    tags = models.CharField(max_length=200, blank=True, verbose_name='Tags (separadas por vírgula)')
    
    # Metadados
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Autor')  # ← CORRIGIDO
    tempo_leitura = models.IntegerField(default=5, verbose_name='Tempo de Leitura (min)')
    visualizacoes = models.IntegerField(default=0, verbose_name='Visualizações')
    
    # Avaliações
    avaliacoes_positivas = models.IntegerField(default=0, verbose_name='Avaliações Positivas')
    avaliacoes_negativas = models.IntegerField(default=0, verbose_name='Avaliações Negativas')
    
    # Status
    ativo = models.BooleanField(default=True, verbose_name='Ativo')
    destaque = models.BooleanField(default=False, verbose_name='Destaque')
    
    # Datas
    data_publicacao = models.DateTimeField(auto_now_add=True, verbose_name='Data de Publicação')
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name = 'Artigo'
        verbose_name_plural = 'Artigos'
        ordering = ['-data_publicacao']

    def __str__(self):
        return self.titulo

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    def avaliacao(self):
        """Calcula a avaliação média (0-5)"""
        total = self.avaliacoes_positivas + self.avaliacoes_negativas
        if total == 0:
            return 0
        return round((self.avaliacoes_positivas / total) * 5, 1)

    def get_tags_list(self):
        """Retorna lista de tags"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []


class AvaliacaoArtigo(models.Model):
    """
    Registra avaliações individuais dos usuários nos artigos
    """
    artigo = models.ForeignKey(Artigo, on_delete=models.CASCADE, related_name='avaliacoes', verbose_name='Artigo')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, verbose_name='Usuário')  # ← CORRIGIDO
    session_key = models.CharField(max_length=100, blank=True, verbose_name='Session Key')
    util = models.BooleanField(verbose_name='Foi Útil?')
    comentario = models.TextField(blank=True, verbose_name='Comentário (opcional)')
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')

    class Meta:
        verbose_name = 'Avaliação de Artigo'
        verbose_name_plural = 'Avaliações de Artigos'
        ordering = ['-criado_em']

    def __str__(self):
        return f"Avaliação de '{self.artigo.titulo}' - {'Útil' if self.util else 'Não Útil'}"