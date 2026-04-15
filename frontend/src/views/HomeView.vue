<template>
  <section class="home">
    <div class="hero">
      <span class="kicker">Task System</span>
      <h1>Organize seu trabalho com mais clareza</h1>
      <p class="description">
        Centralize suas tarefas, acompanhe o que está pendente e mantenha o foco
        no que realmente precisa ser entregue.
      </p>
    </div>

    <div class="cards">
      <div class="card">
        <h2>Planeje</h2>
        <p>Crie tarefas rapidamente e registre descrições curtas para não perder contexto.</p>
      </div>

      <div class="card">
        <h2>Acompanhe</h2>
        <p>Visualize o que está pendente, concluído ou precisa de atenção no dia.</p>
      </div>

      <div class="card">
        <h2>Execute</h2>
        <p>Mantenha sua rotina mais leve com uma interface simples e focada em produtividade.</p>
      </div>
    </div>

    <div class="info">
      <p>Use o menu acima para navegar entre Home, Tarefas e About.</p>
    </div>
  </section>
</template>

<script setup>
// Componente inicial da Home
</script>

<style scoped>
.home {
  max-width: 920px;
  margin: 0 auto;
  padding: 32px 20px;
}

.hero {
  margin-bottom: 28px;
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

.hero h1 {
  margin: 0;
  max-width: 680px;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.description {
  max-width: 620px;
  margin: 14px 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #64748b;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  background: #ffffff;
  border: 1px solid #e7ebf3;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.card h2 {
  margin: 0 0 10px;
  font-size: 1rem;
  color: #0f172a;
}

.card p {
  margin: 0;
  color: #64748b;
  line-height: 1.55;
  font-size: 0.95rem;
}

.info {
  padding: 18px 20px;
  background: #f8fafc;
  border: 1px solid #e7ebf3;
  border-radius: 14px;
}

.info p {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
}

@media (max-width: 720px) {
  .home {
    padding: 24px 16px;
  }

  .hero h1 {
    font-size: 1.9rem;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
