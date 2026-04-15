<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

async function login() {
  const success = await authStore.login(username.value, password.value);

  if (success) {
    const redirect = route.query.redirect || '/tarefas';
    router.push(redirect);
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="kicker">Acesso</span>
        <h1>Entrar no Task System</h1>
        <p>
          Faça login para acessar suas tarefas e continuar seu fluxo de trabalho.
        </p>
      </div>

      <div v-if="error" class="mensagem-erro">
        {{ error }}
      </div>

      <div class="form-group">
        <label for="username">Usuário</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Digite seu usuário"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Digite sua senha"
          @keyup.enter="login"
          :disabled="loading"
        />
      </div>

      <button class="login-button" @click="login" :disabled="loading">
        <span v-if="loading">Entrando...</span>
        <span v-else>Entrar</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e7ebf3;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.login-header {
  margin-bottom: 22px;
}

.kicker {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 1.9rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.login-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #dbe2ec;
  border-radius: 12px;
  background: #fff;
  font-size: 0.95rem;
  color: #0f172a;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.12);
}

.login-button {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease;
}

.login-button:hover {
  background: #1d4ed8;
}

.mensagem-erro {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  font-size: 0.92rem;
}

@media (max-width: 640px) {
  .login-card {
    padding: 22px;
    border-radius: 16px;
  }

  .login-header h1 {
    font-size: 1.6rem;
  }
}
</style>
