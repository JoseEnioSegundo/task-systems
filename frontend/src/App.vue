<template>
  <div class="app-layout">
    <header class="topbar">
      <div class="topbar-inner">
        <router-link to="/" class="brand">
          <span class="brand-mark">TS</span>

          <div class="brand-text">
            <strong>Task System</strong>
            <span>Organização de tarefas</span>
          </div>
        </router-link>

        <nav class="nav">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/tarefas" class="nav-link">Tarefas</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
          <button v-else @click="logout" class="nav-link logout-btn">Logout</button>
        </nav>
      </div>
    </header>

    <main class="page-shell">
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
:root {
  --bg: #f5f7fb;
  --surface: #ffffff;
  --surface-soft: #f8fafc;
  --border: #e7ebf3;
  --text: #0f172a;
  --muted: #64748b;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --shadow-soft: 0 8px 24px rgba(15, 23, 42, 0.06);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}

a {
  text-decoration: none;
}

.app-layout {
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(245, 247, 251, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(231, 235, 243, 0.9);
}

.topbar-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--primary);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-text strong {
  font-size: 0.96rem;
  line-height: 1.1;
  color: var(--text);
}

.brand-text span {
  font-size: 0.81rem;
  line-height: 1.1;
  color: var(--muted);
}

.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 9px 14px;
  border-radius: 10px;
  color: #475569;
  font-size: 0.94rem;
  font-weight: 600;
  transition: background 0.18s ease, color 0.18s ease;
}

.nav-link:hover {
  background: var(--surface-soft);
  color: var(--text);
}

.nav-link.router-link-exact-active {
  background: var(--primary);
  color: #ffffff;
}

.logout-btn {
  background: transparent !important;
  border: none;
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #dc2626 !important;
}

.page-shell {
  padding: 28px 20px 36px;
}

.page-content {
  max-width: 1120px;
  margin: 0 auto;
}

@media (max-width: 720px) {
  .topbar-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px 16px;
  }

  .nav {
    width: 100%;
  }

  .nav-link {
    flex: 1;
    text-align: center;
  }

  .page-shell {
    padding: 22px 16px 28px;
  }
}
</style>
