<template>
  <div
    class="card"
    style="
      height: 16rem;
      display: flex;
      flex-direction: column;
      align-items: center;
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
          rgba(59, 130, 246, 0.2) 0%,
          transparent 70%
        );
        border-radius: 50%;
        margin-right: -5rem;
        margin-top: -5rem;
      "
    ></div>

    <!-- Content -->
    <div style="position: relative; text-align: center">
      <div class="text-6xl font-bold">
        {{ currentTime }}
      </div>
      <div
        class="text-sm"
        style="color: var(--color-text-tertiary); margin-top: 0.5rem"
      >
        {{ currentDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("00:00");
const currentDate = ref("");

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: undefined,
    hour12: true,
  });
  currentDate.value = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  updateClock();
  interval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
