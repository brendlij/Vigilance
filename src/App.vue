<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/header.vue";
</script>

<template>
  <Header />
  <div class="main-content">
    <RouterView />
  </div>
</template>

<style scoped>
.main-content {
  padding: 2rem;
  max-width: 90%;
  margin: 0 auto;
  margin-top: 3em;
  background-color: #f5f5f5;
  border-radius: 3em;
}
</style>
