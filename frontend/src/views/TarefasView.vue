<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TarefaItem from '../components/TarefaItem.vue';

const tarefas = ref([]);
const novoTitulo = ref("");
const novaDescricao = ref("");

onMounted(() => carregarTarefas());

function carregarTarefas() {
  axios.get("http://127.0.0.1:8000/api/tarefas/")
    .then(response => tarefas.value = response.data)
    .catch(console.error);
}

function criarTarefa() {
  if (!novoTitulo.value) return alert("Digite um título!");
  axios.post("http://127.0.0.1:8000/api/tarefas/", {
    titulo: novoTitulo.value,
    descricao: novaDescricao.value,
    concluida: false
  })
  .then(response => {
    tarefas.value.push(response.data);
    novoTitulo.value = "";
    novaDescricao.value = "";
  })
  .catch(console.error);
}

function toggleConcluida(tarefa) {
  axios.patch(`http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`, {
    concluida: !tarefa.concluida
  })
  .then(response => tarefa.concluida = response.data.concluida)
  .catch(console.error);
}

function deletarTarefa(tarefa) {
  axios.delete(`http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`)
    .then(() => tarefas.value = tarefas.value.filter(t => t.id !== tarefa.id))
    .catch(console.error);
}
</script>

<template>
  <div class="tarefas-container">
    <h1>Minhas Tarefas</h1>

    <div class="form-tarefa">
      <input v-model="novoTitulo" placeholder="Título da tarefa" />
      <input v-model="novaDescricao" placeholder="Descrição" />
      <button @click="criarTarefa">Adicionar</button>
    </div>

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