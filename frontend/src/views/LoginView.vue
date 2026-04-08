<script setup>
import { ref } from "vue";
import api from "@/services/api";

const username = ref("");
const password = ref("");

function login() {
  api.post("token/", {
    username: username.value,
    password: password.value
  })
  .then(response => {
    localStorage.setItem("token", response.data.access);
    alert("Login realizado!");
  })
  .catch(() => {
    alert("Erro no login");
  });
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <input v-model="username" placeholder="Usuário" />
    <input v-model="password" type="password" placeholder="Senha" />
    <button @click="login">Entrar</button>
  </div>
</template>