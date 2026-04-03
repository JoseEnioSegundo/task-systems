<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/tarefas">Tarefas</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </header>

  <router-view />
</template>

<style>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #42b983;
  color: white;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
}
</style>