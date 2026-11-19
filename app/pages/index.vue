<script setup lang="ts">
useSeoMeta({
  title: 'Mercadinho OS — Início',
  description: 'Uma base para organizar seu mercadinho com segurança.',
})
</script>

<template>
  <main class="shell">
    <header class="topbar">
      <div class="brand" aria-label="Mercadinho OS">
        <span class="brand-mark" aria-hidden="true">M</span>
        <span>Mercadinho <strong>OS</strong></span>
      </div>
      <span class="status">Em desenvolvimento</span>
    </header>
    <section class="hero" aria-labelledby="headline">
      <p class="eyebrow">Gestão para o comércio de bairro</p>
      <h1 id="headline">Mais clareza para cuidar do seu mercadinho.</h1>
      <p class="lead">Estamos construindo uma ferramenta para simplificar o dia a dia do seu negócio, do estoque ao caixa.</p>
      <div class="notice" role="status">
        <strong>Primeira versão em preparação.</strong>
        <p>As funções de vendas, estoque e cadastro ainda não estão disponíveis. Nenhum dado comercial é coletado nesta página.</p>
      </div>
    </section>
    <footer>Mercadinho OS · Fundação técnica</footer>
  </main>
</template>
