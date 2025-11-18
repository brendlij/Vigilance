<template>
  <div
    class="card"
    style="
      height: 16rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.5rem;
    "
  >
    <!-- Gradient accent -->
    <div
      style="
        position: absolute;
        top: 0;
        right: 0;
        width: 10rem;
        height: 10rem;
        background: radial-gradient(
          circle,
          rgba(249, 115, 22, 0.2) 0%,
          transparent 70%
        );
        border-radius: 50%;
        margin-right: -5rem;
        margin-top: -5rem;
      "
    ></div>

    <!-- Content -->
    <div style="position: relative">
      <div
        class="text-sm"
        style="color: var(--color-text-tertiary); margin-bottom: 0.5rem"
      >
        {{ weather?.location }}
      </div>

      <div class="flex items-start justify-between" style="margin-bottom: 1rem">
        <div>
          <div class="text-4xl font-bold" style="margin-bottom: 0.25rem">
            {{ weather?.temp }}°C
          </div>
          <div style="color: var(--color-text-secondary)">
            {{ weather?.condition }}
          </div>
        </div>

        <Icon
          :icon="weather?.icon || 'mdi:cloud'"
          :width="48"
          :height="48"
          style="color: var(--color-accent-yellow)"
        />
      </div>

      <div
        class="grid-cols-2"
        style="
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        "
      >
        <div>
          <div class="text-xs" style="color: var(--color-text-tertiary)">
            Humidity
          </div>
          <div class="text-sm font-semibold">{{ weather?.humidity }}%</div>
        </div>
        <div>
          <div class="text-xs" style="color: var(--color-text-tertiary)">
            Wind
          </div>
          <div class="text-sm font-semibold">{{ weather?.windSpeed }} km/h</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useDashboardStore } from "@/stores/dashboardStore";

const dashboardStore = useDashboardStore();
const weather = computed(() => dashboardStore.weather);
</script>
