<template>
  <div class="ping-card" :class="{ 'edit-mode': editMode }">
    <div class="ping-header">
      <h3>Ping Monitor</h3>
      <div class="status-indicator" :class="statusClass"></div>
    </div>

    <div class="ping-content">
      <div class="ping-target">
        <label>Target:</label>
        <input
          v-model="target"
          type="text"
          placeholder="example.com"
          :disabled="editMode"
        />
      </div>

      <div class="ping-display">
        <div class="ping-value">{{ currentPing }}</div>
        <div class="ping-unit">ms</div>
      </div>

      <div class="ping-stats">
        <div class="stat">
          <span class="label">Min:</span>
          <span class="value">{{ minPing }}ms</span>
        </div>
        <div class="stat">
          <span class="label">Max:</span>
          <span class="value">{{ maxPing }}ms</span>
        </div>
        <div class="stat">
          <span class="label">Avg:</span>
          <span class="value">{{ avgPing }}ms</span>
        </div>
      </div>

      <button
        @click="togglePing"
        :class="{ active: isPinging }"
        :disabled="editMode"
      >
        {{ isPinging ? "Stop" : "Start" }} Ping
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  editMode?: boolean;
  data?: {
    url?: string;
    interval?: number;
  };
}

interface Emits {
  "update-data": [data: Record<string, any>];
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  data: () => ({ url: "google.com", interval: 5 }),
});

const emit = defineEmits<Emits>();

const target = ref(props.data?.url || "google.com");
const interval = ref(props.data?.interval || 5);
const isPinging = ref(false);
const currentPing = ref(0);
const pings = ref<number[]>([]);
let pingInterval: number | null = null;

// Watch for data changes
watch(
  () => props.data,
  (newData) => {
    if (newData?.url) target.value = newData.url;
    if (newData?.interval) interval.value = newData.interval;
  },
  { deep: true }
);

// Emit data changes
watch([target, interval], () => {
  emit("update-data", {
    url: target.value,
    interval: interval.value,
  });
});

const statusClass = computed(() => {
  if (!isPinging.value) return "idle";
  if (currentPing.value < 50) return "excellent";
  if (currentPing.value < 100) return "good";
  if (currentPing.value < 200) return "fair";
  return "poor";
});

const minPing = computed(() =>
  pings.value.length > 0 ? Math.min(...pings.value) : 0
);

const maxPing = computed(() =>
  pings.value.length > 0 ? Math.max(...pings.value) : 0
);

const avgPing = computed(() => {
  if (pings.value.length === 0) return 0;
  const sum = pings.value.reduce((a, b) => a + b, 0);
  return Math.round(sum / pings.value.length);
});

const simulatePing = () => {
  const basePing = 100 + Math.random() * 150;
  const jitter = (Math.random() - 0.5) * 50;
  const ping = Math.max(10, Math.round(basePing + jitter));

  currentPing.value = ping;
  pings.value.push(ping);

  if (pings.value.length > 20) {
    pings.value.shift();
  }
};

const togglePing = () => {
  if (isPinging.value) {
    if (pingInterval !== null) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    isPinging.value = false;
  } else {
    isPinging.value = true;
    pings.value = [];
    currentPing.value = 0;

    pingInterval = window.setInterval(simulatePing, interval.value * 1000);
    simulatePing();
  }
};
</script>

<style scoped>
.ping-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: clamp(0.5rem, 2vw, 1rem);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  box-sizing: border-box;
  padding: clamp(0.5rem, 2vw, 1rem);
}

.ping-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
}

.ping-header h3 {
  margin: 0;
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: #0f172a;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.status-indicator.idle {
  background-color: #cbd5e1;
}

.status-indicator.excellent {
  background-color: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
}

.status-indicator.good {
  background-color: #84cc16;
  box-shadow: 0 0 6px rgba(132, 204, 22, 0.6);
}

.status-indicator.fair {
  background-color: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
}

.status-indicator.poor {
  background-color: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
}

.ping-content {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.5vw, 0.75rem);
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.ping-target {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.ping-target label {
  font-size: clamp(0.65rem, 2vw, 0.85rem);
  color: #64748b;
  font-weight: 500;
}

.ping-target input {
  padding: clamp(0.3rem, 1vw, 0.5rem);
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  font-family: monospace;
}

.ping-target input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.ping-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  padding: clamp(0.5rem, 2vw, 1rem);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0.375rem;
}

.ping-value {
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 700;
  color: #0f172a;
}

.ping-unit {
  font-size: clamp(0.65rem, 2vw, 0.9rem);
  color: #64748b;
}

.ping-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.3rem, 1vw, 0.5rem);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: clamp(0.3rem, 1vw, 0.5rem);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0.375rem;
}

.stat .label {
  font-size: clamp(0.6rem, 1.5vw, 0.75rem);
  color: #94a3b8;
  text-transform: uppercase;
}

.stat .value {
  font-size: clamp(0.75rem, 2vw, 1rem);
  font-weight: 600;
  color: #0f172a;
  font-family: monospace;
}

button {
  padding: clamp(0.4rem, 1.5vw, 0.625rem) clamp(0.75rem, 2vw, 1rem);
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover:not(.active) {
  background: #2563eb;
}

button.active {
  background: #ef4444;
}

button.active:hover {
  background: #dc2626;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ping-card.edit-mode {
  opacity: 0.6;
  pointer-events: none;
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
