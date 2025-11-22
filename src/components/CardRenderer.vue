<template>
  <div class="card-renderer">
    <!-- Ping Monitor Card -->
    <PingCard
      v-if="card.type === 'ping'"
      :edit-mode="editMode"
      :data="card.data"
      @update-data="(newData: Record<string, any>) => emit('update-data', newData)"
    />

    <!-- Clock Card -->
    <ClockCard
      v-else-if="card.type === 'clock'"
      :edit-mode="editMode"
      :data="card.data"
      @update-data="(newData: Record<string, any>) => emit('update-data', newData)"
    />

    <!-- Fallback für unbekannte Typen -->
    <div v-else class="card-content">
      <div class="card-label">Unknown Card Type: {{ card.type }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import PingCard from "./CustomCards/PingCard.vue";
import ClockCard from "./CustomCards/ClockCard.vue";
import type { Card } from "@/types/CardTypes";

defineProps<{
  card: Card;
  editMode: boolean;
}>();

const emit = defineEmits<{
  "update-data": [data: Record<string, any>];
}>();
</script>

<style scoped>
.card-renderer {
  width: 100%;
  height: 100%;
}

.card-content {
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>
