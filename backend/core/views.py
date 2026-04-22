from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tarefa
from .serializers import TarefaSerializer


class TarefaViewSet(ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['concluida', 'prioridade']
    search_fields = ['titulo', 'descricao']
    ordering_fields = ['criada_em', 'atualizada_em', 'prioridade', 'vencimento']
    ordering = ['-prioridade', '-criada_em']

    def get_queryset(self):
        return Tarefa.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)