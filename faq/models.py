from django.db import models


class FAQ(models.Model):
    pergunta = models.CharField(max_length=500)
    resposta = models.TextField()
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.pergunta

