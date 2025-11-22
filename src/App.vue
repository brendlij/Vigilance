<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/header.vue";
</script>

<template>
  <Header />
  <main class="page-shell">
    <RouterView />
  </main>
</template>

<style scoped>
.page-shell {
  width: min(1800px, 100%);
  margin: clamp(2rem, 4vw, 3.5rem) auto 4rem;
  padding: clamp(1.5rem, 2.5vw, 2.75rem);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 45px 120px rgba(15, 23, 42, 0.15);
}

@media (max-width: 768px) {
  .page-shell {
    margin-top: 1.5rem;
    padding: 1.25rem;
  }
}
</style>
