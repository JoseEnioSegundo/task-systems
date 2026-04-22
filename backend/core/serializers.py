from rest_framework import serializers
from .models import Tarefa


class TarefaSerializer(serializers.ModelSerializer):
    prioridade_display = serializers.CharField(source='get_prioridade_display', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Tarefa
        fields = [
            'id', 'titulo', 'descricao', 'concluida',
            'prioridade', 'prioridade_display', 'vencimento',
            'criada_em', 'atualizada_em', 'usuario_nome'
        ]
        read_only_fields = ['usuario', 'criada_em', 'atualizada_em', 'usuario_nome', 'prioridade_display']

    def validate_titulo(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("O título deve ter pelo menos 3 caracteres.")
        return value.strip()

    def validate_descricao(self, value):
        return value.strip()

    def validate_vencimento(self, value):
        from django.utils import timezone
        if value and value < timezone.now():
            raise serializers.ValidationError("A data de vencimento não pode ser no passado.")
        return value  