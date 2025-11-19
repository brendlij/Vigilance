<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1><Icon icon="mdi:shield" class="logo-icon" /> Vigilance</h1>
          <p class="status-text">
            Backend:
            <span :class="{ online: isOnline, offline: !isOnline }">
              <Icon
                :icon="isOnline ? 'mdi:circle' : 'mdi:circle'"
                :style="{ color: isOnline ? '#4ade80' : '#ef4444' }"
              />
              {{ isOnline ? "Online" : "Offline" }}
            </span>
          </p>
        </div>
        <ModeToggle />
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterView } from "vue-router";
import ModeToggle from "./components/ModeToggle.vue";
import axios from "axios";
import { Icon } from "@iconify/vue";

const isOnline = ref(false);

onMounted(async () => {
  try {
    await axios.get("http://localhost:8080/health");
    isOnline.value = true;
  } catch (err) {
    isOnline.value = false;
  }
});
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
  background-image: url("/bg.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  position: relative;
}

.app-layout::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 21, 32, 0.4);
  pointer-events: none;
  z-index: 0;
}

.app-header,
.app-main {
  position: relative;
  z-index: 1;
}

.app-header {
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  box-shadow: var(--shadow-md);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-left h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.logo-icon {
  color: var(--color-text-primary);
}

.status-text {
  font-size: var(--font-size-sm);
  margin: 0;
  color: var(--color-text-secondary);
}

.status-text .online {
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
}

.status-text .offline {
  color: var(--color-error);
  font-weight: var(--font-weight-semibold);
}

.app-main {
  flex: 1;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
