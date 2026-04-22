from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Tarefa(models.Model):
    PRIORIDADE_CHOICES = [
        (1, 'Baixa'),
        (2, 'Média'),
        (3, 'Alta'),
        (4, 'Urgente'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tarefas')
    titulo = models.CharField(max_length=200, help_text="Título da tarefa")
    descricao = models.TextField(blank=True, help_text="Descrição detalhada da tarefa")
    concluida = models.BooleanField(default=False, help_text="Status de conclusão")
    prioridade = models.IntegerField(
        choices=PRIORIDADE_CHOICES,
        default=2,
        validators=[MinValueValidator(1), MaxValueValidator(4)],
        help_text="Nível de prioridade"
    )
    vencimento = models.DateTimeField(null=True, blank=True, help_text="Data de vencimento")
    criada_em = models.DateTimeField(auto_now_add=True, help_text="Data de criação")
    atualizada_em = models.DateTimeField(auto_now=True, help_text="Última atualização")

    class Meta:
        ordering = ['-prioridade', '-criada_em']
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'

    def __str__(self):
        return f"{self.titulo} - {self.get_prioridade_display()}"