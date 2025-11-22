<template>
  <div class="clock-card" :class="{ 'edit-mode': editMode }">
    <div class="clock-display">{{ currentTime }}</div>
    <button @click="toggleClock" :disabled="editMode">Update Clock</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface Props {
  editMode?: boolean;
  data?: {
    format?: string;
  };
}

interface Emits {
  "update-data": [data: Record<string, any>];
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  data: () => ({ format: "HH:mm:ss" }),
});

const emit = defineEmits<Emits>();

const currentTime = ref("");
let intervalId: number | null = null;

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

const toggleClock = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  } else {
    updateTime();
    intervalId = window.setInterval(updateTime, 1000);
  }
};

onMounted(() => {
  updateTime();
  intervalId = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.clock-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.clock-display {
  font-size: 2rem;
  font-weight: bold;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clock-card.edit-mode {
  opacity: 0.6;
  pointer-events: none;
}
</style>
