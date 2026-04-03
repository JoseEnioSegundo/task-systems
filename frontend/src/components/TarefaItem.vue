<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  tarefa: Object
});

const emit = defineEmits(["toggle", "delete"]); // define os eventos que o componente vai emitir

const emitToggle = () => emit("toggle", props.tarefa);
const emitDelete = () => emit("delete", props.tarefa);
</script>

<template>
  <li class="tarefa-item">
    <input type="checkbox" :checked="tarefa.concluida" @change="emitToggle" />
    <span>{{ tarefa.titulo }} - {{ tarefa.descricao }}</span>
    <span v-if="tarefa.concluida">✅</span>
    <span v-else>❌</span>
    <button class="delete-btn" @click="emitDelete">Deletar</button>
  </li>
</template>

<style scoped>
.tarefa-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.tarefa-item:hover {
  background-color: #f9f9f9;
}

.delete-btn {
  margin-left: auto;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
}

.delete-btn:hover {
  font-weight: bold;
}
</style>