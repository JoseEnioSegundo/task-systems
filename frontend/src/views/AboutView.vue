<template>
  <section class="about">
    <div class="hero">
      <span class="kicker">Sobre</span>
      <h1>Um sistema simples para organizar tarefas do dia a dia</h1>
      <p class="description">
        Este projeto foi construído para facilitar o acompanhamento de atividades,
        combinando uma interface leve no front-end com uma estrutura sólida no back-end.
      </p>
    </div>

    <div class="cards">
      <div class="card">
        <h2>Front-end</h2>
        <p>
          A interface foi desenvolvida com Vue para entregar uma experiência mais
          rápida, reativa e organizada.
        </p>
      </div>

      <div class="card">
        <h2>Back-end</h2>
        <p>
          O Django cuida da estrutura da aplicação e do gerenciamento das tarefas
          com uma base confiável.
        </p>
      </div>

      <div class="card">
        <h2>Integração</h2>
        <p>
          O Axios faz a comunicação entre interface e API, permitindo criar,
          atualizar e remover tarefas com facilidade.
        </p>
      </div>
    </div>

    <div class="info">
      <p>
        A proposta do projeto é manter tudo direto ao ponto: visual limpo, navegação
        simples e foco na produtividade.
      </p>
    </div>
  </section>
</template>

<script setup>
// Componente da página About
</script>

<style scoped>
.about {
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
  max-width: 720px;
  font-size: 2.2rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.description {
  max-width: 640px;
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
  line-height: 1.6;
}

@media (max-width: 720px) {
  .about {
    padding: 24px 16px;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
