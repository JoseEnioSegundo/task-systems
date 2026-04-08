<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import TarefaItem from "../components/TarefaItem.vue";

const tarefas = ref([]);
const novoTitulo = ref("");
const novaDescricao = ref("");
const loading = ref(false);
const erro = ref("");

// Carregar tarefas ao iniciar
onMounted(() => carregarTarefas());

function carregarTarefas() {
  loading.value = true;
  erro.value = "";

  api.get("tarefas/")
    .then(response => {
      tarefas.value = response.data;
    })
    .catch(() => {
      erro.value = "Erro ao carregar tarefas";
    })
    .finally(() => {
      loading.value = false;
    });
}

function criarTarefa() {
  if (!novoTitulo.value) return alert("Digite um título!");

  api.post("tarefas/", {
    titulo: novoTitulo.value,
    descricao: novaDescricao.value,
    concluida: false
  })
  .then(response => {
    tarefas.value.push(response.data);
    novoTitulo.value = "";
    novaDescricao.value = "";
  })
  .catch(() => {
    erro.value = "Erro ao criar tarefa";
  });
}

function toggleConcluida(tarefa) {
  api.patch(`tarefas/${tarefa.id}/`, {
    concluida: !tarefa.concluida
  })
  .then(response => {
    tarefa.concluida = response.data.concluida;
  })
  .catch(() => {
    erro.value = "Erro ao atualizar tarefa";
  });
}

function deletarTarefa(tarefa) {
  api.delete(`tarefas/${tarefa.id}/`)
    .then(() => {
      tarefas.value = tarefas.value.filter(t => t.id !== tarefa.id);
    })
    .catch(() => {
      erro.value = "Erro ao deletar tarefa";
    });
}
</script>

<template>
  <div class="tarefas-container">
    <h1>Minhas Tarefas</h1>

    <!-- Loading -->
    <div v-if="loading">Carregando...</div>

    <!-- Erro -->
    <div v-if="erro" style="color: red; margin-bottom: 10px;">
      {{ erro }}
    </div>

    <!-- Formulário -->
    <div class="form-tarefa">
      <input v-model="novoTitulo" placeholder="Título da tarefa" />
      <input v-model="novaDescricao" placeholder="Descrição" />
      <button @click="criarTarefa">Adicionar</button>
    </div>

    <!-- Lista -->
    <ul>
      <TarefaItem
        v-for="tarefa in tarefas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @toggle="toggleConcluida"
        @delete="deletarTarefa"
      />
    </ul>
  </div>
</template>

<style scoped>
.tarefas-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.form-tarefa {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-tarefa input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-tarefa button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-tarefa button:hover {
  background-color: #369f6e;
}
</style>