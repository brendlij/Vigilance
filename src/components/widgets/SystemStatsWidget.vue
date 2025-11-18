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
          rgba(168, 85, 247, 0.2) 0%,
          transparent 70%
        );
        border-radius: 50%;
        margin-right: -5rem;
        margin-top: -5rem;
      "
    ></div>

    <!-- Content -->
    <div style="position: relative">
      <h3
        class="text-sm"
        style="color: var(--color-text-tertiary); margin-bottom: 1rem"
      >
        System Stats
      </h3>

      <div style="display: flex; flex-direction: column; gap: 0.75rem">
        <!-- CPU -->
        <div>
          <div
            class="flex items-center justify-between"
            style="margin-bottom: 0.25rem"
          >
            <span
              class="text-xs flex items-center gap-1"
              style="color: var(--color-text-tertiary)"
            >
              <Icon icon="mdi:cpu-64-bit" :width="14" :height="14" />
              CPU
            </span>
            <span class="text-sm font-semibold">{{ stats?.cpuUsage }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-bar-fill progress-fill-blue"
              :style="{ width: `${stats?.cpuUsage}%` }"
            ></div>
          </div>
        </div>

        <!-- Memory -->
        <div>
          <div
            class="flex items-center justify-between"
            style="margin-bottom: 0.25rem"
          >
            <span
              class="text-xs flex items-center gap-1"
              style="color: var(--color-text-tertiary)"
            >
              <Icon icon="mdi:memory" :width="14" :height="14" />
              Memory
            </span>
            <span class="text-sm font-semibold">{{ stats?.memoryUsage }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-bar-fill progress-fill-purple"
              :style="{ width: `${stats?.memoryUsage}%` }"
            ></div>
          </div>
        </div>

        <!-- Disk -->
        <div>
          <div
            class="flex items-center justify-between"
            style="margin-bottom: 0.25rem"
          >
            <span
              class="text-xs flex items-center gap-1"
              style="color: var(--color-text-tertiary)"
            >
              <Icon icon="mdi:harddisk" :width="14" :height="14" />
              Disk
            </span>
            <span class="text-sm font-semibold">{{ stats?.diskUsage }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-bar-fill progress-fill-orange"
              :style="{ width: `${stats?.diskUsage}%` }"
            ></div>
          </div>
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
const stats = computed(() => dashboardStore.systemStats);
</script>
