<template>
  <div v-if="showToggle" class="mode-toggle">
    <button
      class="toggle-button"
      :title="
        currentMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      "
      @click="toggleMode"
    >
      <Icon v-if="currentMode === 'dark'" icon="mdi:moon-waning-crescent" />
      <Icon v-else icon="mdi:white-balance-sunny" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useThemeStore } from "../stores/theme";
import {
  getThemeMode,
  applyThemeMode,
  hasBothModes,
} from "../services/themeModeService";
import { Icon } from "@iconify/vue";

const themeStore = useThemeStore();

const currentMode = computed({
  get: () => themeStore.currentMode,
  set: (value) => themeStore.setMode(value),
});

const showToggle = computed(() => {
  return (
    themeStore.currentParsedTheme && hasBothModes(themeStore.currentParsedTheme)
  );
});

onMounted(() => {
  // Mode should already be loaded from store initialization
  const mode = getThemeMode();
  if (mode !== themeStore.currentMode) {
    themeStore.setMode(mode);
  }
});

function toggleMode() {
  const newMode = themeStore.currentMode === "dark" ? "light" : "dark";
  if (themeStore.currentParsedTheme) {
    applyThemeMode(themeStore.currentParsedTheme, newMode);
    themeStore.setMode(newMode);
  }
}
</script>

<style scoped>
.mode-toggle {
  display: flex;
  align-items: center;
}

.toggle-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.toggle-button:hover {
  border-color: var(--color-primary);
  background: var(--color-background-tertiary);
}

.toggle-button:active {
  background: var(--color-primary);
  color: white;
}
</style>
