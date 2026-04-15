<script setup>
import { ref, onMounted, computed } from "vue";
import { useTarefasStore } from "@/stores/tarefas";
import TarefaItem from "../components/TarefaItem.vue";

const tarefasStore = useTarefasStore();

const novoTitulo = ref("");
const novaDescricao = ref("");
const novaPrioridade = ref(2);
const novoVencimento = ref("");
const filtro = ref("todas");

const tarefasFiltradas = computed(() => {
  let filtered = tarefasStore.tarefasFiltradas;

  if (filtro.value === "concluidas") {
    return filtered.filter((t) => t.concluida);
  }
  if (filtro.value === "pendentes") {
    return filtered.filter((t) => !t.concluida);
  }
  return filtered;
});
const loading = computed(() => tarefasStore.loading);
const erro = computed(() => tarefasStore.error);

const total = computed(() => tarefasStore.tarefas.length);
const concluidas = computed(() => tarefasStore.tarefasConcluidas.length);
const pendentes = computed(() => tarefasStore.tarefasPendentes.length);

onMounted(() => {
  tarefasStore.carregarTarefas();
});

function criarTarefa() {
  if (!novoTitulo.value.trim()) {
    tarefasStore.error = "Digite um título!";
    return;
  }

  const tarefaData = {
    titulo: novoTitulo.value,
    descricao: novaDescricao.value,
    prioridade: parseInt(novaPrioridade.value),
    concluida: false
  };

  if (novoVencimento.value) {
    tarefaData.vencimento = novoVencimento.value;
  }

  tarefasStore.criarTarefa(tarefaData)
    .then(() => {
      novoTitulo.value = "";
      novaDescricao.value = "";
      novaPrioridade.value = 2;
      novoVencimento.value = "";
    })
    .catch(() => {
      // Error is already set in store
    });
}

function toggleConcluida(tarefa) {
  tarefasStore.toggleConcluida(tarefa.id);
}

function deletarTarefa(tarefa) {
  if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
    tarefasStore.deletarTarefa(tarefa.id);
  }
}
</script>

<template>
  <div class="page">
    <section class="app-shell">
      <header class="header">
        <div>
          <span class="kicker">Workspace</span>
          <h1>Minhas tarefas</h1>
          <p>Planeje o dia, acompanhe o progresso e finalize o que importa.</p>
        </div>
      </header>

      <section class="summary">
        <div class="summary-card">
          <span>Total</span>
          <strong>{{ total }}</strong>
        </div>
        <div class="summary-card">
          <span>Concluídas</span>
          <strong>{{ concluidas }}</strong>
        </div>
        <div class="summary-card">
          <span>Pendentes</span>
          <strong>{{ pendentes }}</strong>
        </div>
      </section>

      <section class="controls">
        <div class="filtros">
          <button :class="{ ativo: filtro === 'todas' }" @click="filtro = 'todas'">
            Todas
          </button>
          <button :class="{ ativo: filtro === 'concluidas' }" @click="filtro = 'concluidas'">
            Concluídas
          </button>
          <button :class="{ ativo: filtro === 'pendentes' }" @click="filtro = 'pendentes'">
            Pendentes
          </button>
        </div>
      </section>

      <div v-if="erro" class="mensagem mensagem-erro">
        {{ erro }}
      </div>

      <section class="composer">
        <input v-model="novoTitulo" placeholder="Nova tarefa" />
        <input v-model="novaDescricao" placeholder="Descrição rápida" />
        <select v-model.number="novaPrioridade">
          <option :value="1">Baixa</option>
          <option :value="2">Média</option>
          <option :value="3">Alta</option>
          <option :value="4">Urgente</option>
        </select>
        <input v-model="novoVencimento" type="date" placeholder="Data de vencimento" />
        <button @click="criarTarefa" :disabled="loading">{{ loading ? 'Adicionando...' : 'Adicionar' }}</button>
      </section>

      <section class="list-card">
        <div class="list-header">
          <h2>Tarefas</h2>
          <span>{{ tarefasFiltradas.length }} item(ns)</span>
        </div>

        <div v-if="loading" class="estado">
          Carregando tarefas...
        </div>

        <ul v-else-if="tarefasFiltradas.length" class="lista-tarefas">
          <TarefaItem
            v-for="tarefa in tarefasFiltradas"
            :key="tarefa.id"
            :tarefa="tarefa"
            @toggle="toggleConcluida"
            @delete="deletarTarefa"
          />
        </ul>

        <div v-else class="estado vazio">
          Nenhuma tarefa encontrada.
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Segoe UI", Arial, sans-serif;
  background: #f5f7fb;
  color: #111827;
}

.page {
  min-height: 100vh;
  padding: 32px 18px;
}

.app-shell {
  max-width: 920px;
  margin: 0 auto;
}

.header {
  margin-bottom: 22px;
}

.kicker {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.header h1 {
  margin: 0;
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.header p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 0.98rem;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.summary-card {
  background: #ffffff;
  border: 1px solid #e7ebf3;
  border-radius: 14px;
  padding: 18px;
}

.summary-card span {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 8px;
}

.summary-card strong {
  font-size: 1.7rem;
  font-weight: 700;
  color: #0f172a;
}

.controls {
  margin-bottom: 16px;
}

.filtros {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filtros button {
  border: 1px solid #dbe2ec;
  background: #fff;
  color: #475569;
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.18s ease;
}

.filtros button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.filtros button.ativo {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.mensagem {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.92rem;
}

.mensagem-erro {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.composer {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr auto;
  gap: 12px;
  margin-bottom: 18px;
}

.composer input {
  background: #fff;
  border: 1px solid #dbe2ec;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.95rem;
  color: #0f172a;
}

.composer input:focus {
  outline: none;
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.12);
}

.composer button {
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.18s ease;
}

.composer button:hover {
  background: #1d4ed8;
}

.list-card {
  background: #ffffff;
  border: 1px solid #e7ebf3;
  border-radius: 16px;
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #eef2f7;
}

.list-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.list-header span {
  font-size: 0.88rem;
  color: #64748b;
}

.lista-tarefas {
  list-style: none;
  padding: 0;
  margin: 0;
}

.estado {
  padding: 28px 20px;
  color: #64748b;
  font-size: 0.95rem;
}

.estado.vazio {
  text-align: center;
}

@media (max-width: 720px) {
  .summary {
    grid-template-columns: 1fr;
  }

  .composer {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.8rem;
  }
}
</style>
