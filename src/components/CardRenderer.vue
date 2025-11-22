<template>
  <div class="card-renderer">
    <!-- Example Card -->
    <ExampleCard
      v-if="card.type === 'example'"
      :card-id="card.id"
      :edit-mode="editMode"
    />

    <!-- Fallback for unknown types -->
    <div v-else class="unknown-card">
      <p>Unknown card type: {{ card.type }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import ExampleCard from "./CustomCards/ExampleCard.vue";
import type { CardInstance } from "@/stores/cardStore";

defineProps<{
  card: CardInstance;
  editMode: boolean;
}>();
</script>

<style scoped>
.card-renderer {
  width: 100%;
  height: 100%;
}

.unknown-card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
  color: #666;
}
</style>
