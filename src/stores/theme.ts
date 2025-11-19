/**
 * Pinia Theme Store
 * Manages current theme state and persistence
 */

import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import {
  ThemeInfo,
  fetchDefaultThemes,
  fetchUserThemes,
  loadAndApplyTheme,
} from "../services/themeLoader";
import type { TOMLTheme } from "../lib/tomlParser";
import type { ThemeMode } from "../services/themeModeService";
import { applyThemeMode } from "../services/themeModeService";

const STORAGE_KEY = "vigilance_current_theme";
const MODE_STORAGE_KEY = "vigilance_current_mode";

export const useThemeStore = defineStore("theme", () => {
  // State
  const defaultThemes = ref<ThemeInfo[]>([]);
  const userThemes = ref<ThemeInfo[]>([]);
  const currentTheme = ref<ThemeInfo | null>(null);
  const currentParsedTheme = ref<TOMLTheme | null>(null);
  const currentMode = ref<ThemeMode>("dark");
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const allThemes = computed(() => {
    return {
      default: defaultThemes.value,
      user: userThemes.value,
    };
  });

  const currentThemeName = computed(
    () => currentTheme.value?.name || "Default"
  );

  // Methods
  async function initThemes() {
    isLoading.value = true;
    error.value = null;

    try {
      // Fetch only default themes
      const defaults = await fetchDefaultThemes();
      defaultThemes.value = defaults;

      // Load saved theme or use first default
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      const savedMode = (localStorage.getItem(MODE_STORAGE_KEY) ||
        "dark") as ThemeMode;
      currentMode.value = savedMode;
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          const theme = findTheme(parsed);
          if (theme) {
            await applyTheme(theme);
          }
        } catch (e) {
          console.error("Failed to load saved theme:", e);
        }
      }

      // If no theme selected yet, use first default
      if (!currentTheme.value && defaultThemes.value.length > 0) {
        await applyTheme(defaultThemes.value[0]);
      }

      // Apply saved mode to current theme
      if (currentParsedTheme.value && savedMode) {
        applyThemeMode(currentParsedTheme.value, savedMode);
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to initialize themes";
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
    }

    // Watch for mode changes and persist
    watch(
      () => currentMode.value,
      (newMode) => {
        localStorage.setItem(MODE_STORAGE_KEY, newMode);
      }
    );
  }

  async function loadUserThemes(userId: string) {
    try {
      const themes = await fetchUserThemes(userId);
      userThemes.value = themes;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load user themes";
      console.error(error.value, err);
    }
  }

  async function applyTheme(theme: ThemeInfo) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await loadAndApplyTheme(theme);
      if (result.success && result.parsed) {
        currentTheme.value = theme;
        currentParsedTheme.value = result.parsed;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));

        // Apply the current saved mode to the new theme
        const savedMode = (localStorage.getItem(MODE_STORAGE_KEY) ||
          "dark") as ThemeMode;
        applyThemeMode(result.parsed, savedMode);
      } else {
        error.value = "Failed to apply theme";
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to apply theme";
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
    }
  }

  function findTheme(themeData: Partial<ThemeInfo>): ThemeInfo | undefined {
    const { source, name } = themeData;

    if (source === "default") {
      return defaultThemes.value.find((t) => t.name === name);
    } else if (source === "user") {
      return userThemes.value.find((t) => t.name === name);
    }

    return undefined;
  }

  function setMode(mode: ThemeMode) {
    currentMode.value = mode;
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    // Apply the mode to the current theme immediately
    if (currentParsedTheme.value) {
      applyThemeMode(currentParsedTheme.value, mode);
    }
  }

  function resetToDefault() {
    if (defaultThemes.value.length > 0) {
      applyTheme(defaultThemes.value[0]);
    }
  }

  return {
    // State
    defaultThemes,
    userThemes,
    currentTheme,
    currentParsedTheme,
    currentMode,
    isLoading,
    error,

    // Computed
    allThemes,
    currentThemeName,

    // Methods
    initThemes,
    loadUserThemes,
    applyTheme,
    findTheme,
    resetToDefault,
    setMode,
  };
});
