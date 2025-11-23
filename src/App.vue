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
  padding: clamp(1.5rem, 2.5vw, 2.75rem);
}

@media (max-width: 768px) {
  .page-shell {
    margin-top: 1.5rem;
    padding: 1.25rem;
  }
}
</style>
