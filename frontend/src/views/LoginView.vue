<script setup>
import { ref } from "vue";
import api from "@/services/api";

const username = ref("");
const password = ref("");
const erro = ref("");

function login() {
  erro.value = "";

  api.post("token/", {
    username: username.value,
    password: password.value
  })
  .then(response => {
    const token = response.data.access;

    // 🔥 salva o token
    localStorage.setItem("token", token);

    // 👉 redireciona pra tarefas
    window.location.href = "/tarefas";
  })
  .catch(() => {
    erro.value = "Usuário ou senha inválidos";
  });
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>

    <input v-model="username" placeholder="Usuário" />
    <input v-model="password" type="password" placeholder="Senha" />

    <button @click="login">Entrar</button>

    <p v-if="erro" style="color:red">{{ erro }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>  