<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="card"
    style="
      height: 8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    "
  >
    <!-- Gradient background based on link color -->
    <div
      class="absolute inset-0 opacity-0"
      :style="`background: linear-gradient(to bottom right, var(${link.color})); transition: opacity var(--transition-base);`"
      style="
        background: linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.3),
          rgba(59, 130, 246, 0.1)
        );
      "
    ></div>

    <!-- Glass effect layer -->
    <div
      style="
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom right,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.05)
        );
      "
    ></div>

    <!-- Content -->
    <div
      style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
      "
    >
      <Icon
        :icon="link.icon"
        :width="32"
        :height="32"
        style="
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
          transition: transform var(--transition-base);
        "
      />
      <span
        class="text-xs font-medium"
        style="color: var(--color-text-secondary)"
      >
        {{ link.name }}
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { QuickLink } from "@/utils/dummyData";

defineProps<{
  link: QuickLink;
}>();
</script>
