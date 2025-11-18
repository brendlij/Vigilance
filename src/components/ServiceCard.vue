<template>
  <div class="card" style="position: relative">
    <!-- Status indicator glow -->
    <div
      v-if="service.status === 'online'"
      style="
        position: absolute;
        top: 0;
        right: 0;
        width: 8rem;
        height: 8rem;
        background: radial-gradient(
          circle,
          rgba(16, 185, 129, 0.1) 0%,
          transparent 70%
        );
        border-radius: 50%;
        margin-right: -4rem;
        margin-top: -4rem;
        transition: background var(--transition-base);
      "
    ></div>
    <div
      v-else
      style="
        position: absolute;
        top: 0;
        right: 0;
        width: 8rem;
        height: 8rem;
        background: radial-gradient(
          circle,
          rgba(239, 68, 68, 0.1) 0%,
          transparent 70%
        );
        border-radius: 50%;
        margin-right: -4rem;
        margin-top: -4rem;
      "
    ></div>

    <!-- Content -->
    <div style="position: relative; padding: 1.5rem">
      <!-- Header -->
      <div
        class="flex items-start justify-between"
        style="margin-bottom: 0.75rem"
      >
        <div class="flex items-center" style="gap: 0.75rem">
          <Icon
            :icon="service.icon"
            :width="28"
            :height="28"
            style="color: var(--color-primary-light)"
          />
          <div>
            <h3 class="font-semibold">{{ service.name }}</h3>
            <p class="text-xs" style="color: var(--color-text-tertiary)">
              {{ service.description }}
            </p>
          </div>
        </div>

        <!-- Status badge -->
        <div
          class="badge"
          :class="service.status === 'online' ? 'badge-success' : 'badge-error'"
        >
          <div
            style="
              width: 0.375rem;
              height: 0.375rem;
              border-radius: 50%;
              animation: pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            "
            :style="{
              backgroundColor:
                service.status === 'online'
                  ? 'var(--color-accent-green)'
                  : 'var(--color-accent-red)',
            }"
          ></div>
          {{ service.status === "online" ? "Online" : "Offline" }}
        </div>
      </div>

      <!-- Details -->
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <div
          v-if="service.uptime"
          class="flex items-center justify-between text-xs"
        >
          <span style="color: var(--color-text-tertiary)">Uptime</span>
          <span style="color: var(--color-text-secondary); font-weight: 600"
            >{{ service.uptime }}%</span
          >
        </div>

        <!-- Action buttons -->
        <div
          class="flex"
          style="
            gap: 0.5rem;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid var(--color-border);
          "
        >
          <button
            class="btn"
            style="
              flex: 1;
              padding: 0.375rem 0.75rem;
              font-size: var(--font-size-xs);
            "
          >
            View
          </button>
          <button
            class="btn"
            style="
              flex: 1;
              padding: 0.375rem 0.75rem;
              font-size: var(--font-size-xs);
            "
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Service } from "@/utils/dummyData";

defineProps<{
  service: Service;
}>();
</script>
