<template>
  <div class="theme-controls">
    <ModeToggle />
    <div class="theme-switcher" ref="dropdownElement">
      <!-- Current Theme Display -->
      <div class="current-theme" @click="isOpen = !isOpen">
        <Icon icon="mdi:palette" class="theme-icon" />
        <span class="theme-name">{{ currentThemeName }}</span>
        <Icon
          icon="mdi:chevron-down"
          class="chevron"
          :class="{ 'chevron-open': isOpen }"
        />
      </div>

      <!-- Theme Dropdown -->
      <transition name="dropdown">
        <div v-if="isOpen" class="theme-dropdown">
          <!-- Default Themes -->
          <div class="theme-section" v-if="themeStore.defaultThemes.length > 0">
            <div class="section-title">Default Themes</div>
            <button
              v-for="theme in themeStore.defaultThemes"
              :key="theme.id"
              :class="['theme-option', { active: isCurrentTheme(theme) }]"
              @click="selectTheme(theme)"
              :disabled="themeStore.isLoading"
            >
              <span class="theme-name-option">{{ theme.name }}</span>
              <Icon
                v-if="isCurrentTheme(theme)"
                icon="mdi:check"
                class="checkmark"
              />
            </button>
          </div>

          <!-- User Themes -->
          <div class="theme-section" v-if="themeStore.userThemes.length > 0">
            <div class="section-title">Your Themes</div>
            <button
              v-for="theme in themeStore.userThemes"
              :key="theme.id"
              :class="['theme-option', { active: isCurrentTheme(theme) }]"
              @click="selectTheme(theme)"
              :disabled="themeStore.isLoading"
            >
              <span class="theme-name-option">{{ theme.name }}</span>
              <Icon
                v-if="isCurrentTheme(theme)"
                icon="mdi:check"
                class="checkmark"
              />
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="themeStore.isLoading" class="loading">
            <Icon icon="mdi:loading" class="spinner" /> Loading themes...
          </div>

          <!-- Error State -->
          <div v-if="themeStore.error" class="error">
            {{ themeStore.error }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useThemeStore } from "../stores/theme";
import type { ThemeInfo } from "../services/themeLoader";
import ModeToggle from "./ModeToggle.vue";
import { Icon } from "@iconify/vue";

const themeStore = useThemeStore();
const isOpen = ref(false);
const dropdownElement = ref<HTMLElement>();

const currentThemeName = computed(() => themeStore.currentThemeName);

onMounted(async () => {
  // Initialize themes on component mount
  if (themeStore.defaultThemes.length === 0) {
    await themeStore.initThemes();
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  if (
    dropdownElement.value &&
    !dropdownElement.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
}

function isCurrentTheme(theme: ThemeInfo): boolean {
  return themeStore.currentTheme?.id === theme.id;
}

async function selectTheme(theme: ThemeInfo) {
  await themeStore.applyTheme(theme);
  isOpen.value = false;
}
</script>

<style scoped>
.theme-switcher {
  position: relative;
  display: inline-block;
}

.current-theme {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.current-theme:hover {
  border-color: var(--color-primary);
  background: var(--color-background-tertiary);
}

.theme-icon {
  font-size: 1.3em;
  display: flex;
  align-items: center;
}

.theme-name {
  min-width: 100px;
  text-align: left;
}

.chevron {
  display: flex;
  align-items: center;
  transition: transform var(--transition-base);
  font-size: 1.2em;
}

.chevron-open {
  transform: rotate(-180deg);
}

/* Dropdown Menu */
.theme-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--spacing-xs);
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  min-width: 200px;
}

.theme-section {
  padding: var(--spacing-md);
}

.theme-section:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-sm);
  padding: 0 var(--spacing-sm);
}

.author-group {
  margin-bottom: var(--spacing-md);
}

.author-group:last-child {
  margin-bottom: 0;
}

.author-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  padding: 0 var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.theme-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: left;
  font-weight: var(--font-weight-medium);
}

.theme-option:hover:not(:disabled) {
  background: var(--color-background-tertiary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.theme-option.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
  border-color: var(--color-primary-dark);
}

.theme-option.active .checkmark {
  color: var(--color-text-primary);
}

.theme-option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.theme-option.community {
  padding-left: calc(var(--spacing-md) + var(--spacing-md));
}

.checkmark {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

.spinner {
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: var(--spacing-xs);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading,
.error {
  padding: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  color: var(--color-text-secondary);
}

.error {
  color: var(--color-error);
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-base);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Font size for small text */
:root {
  --font-size-xs: 0.75rem;
}

.theme-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.theme-switcher {
  position: relative;
  display: inline-block;
}
</style>
