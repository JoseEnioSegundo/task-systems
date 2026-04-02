<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const tarefas = ref([]);

onMounted(() => {
  axios.get("http://127.0.0.1:8000/api/tarefas/")
    .then(response => {
      tarefas.value = response.data;
    })
    .catch(error => {
      console.error(error);
    });
});
</script>

<template>
  <div>
    <h1>Minhas Tarefas</h1>

    <ul>
      <li v-for="tarefa in tarefas" :key="tarefa.id">
        {{ tarefa.titulo }} - 
        <span v-if="tarefa.concluida">✅</span>
        <span v-else>❌</span>
      </li>
    </ul>

  </div>
</template>