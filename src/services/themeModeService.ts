/**
 * Theme Mode Service
 * Handles switching between dark and light modes for themes with both variants
 */

import { extractCSSVariables, applyCSSVariables } from "../lib/tomlParser";
import type { TOMLTheme } from "../lib/tomlParser";

const MODE_STORAGE_KEY = "vigilance_theme_mode";

export type ThemeMode = "dark" | "light";

/**
 * Get current theme mode from localStorage or system preference
 */
export function getThemeMode(): ThemeMode {
  const saved = localStorage.getItem(MODE_STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }

  return "dark";
}

/**
 * Set theme mode and persist to localStorage
 */
export function setThemeMode(mode: ThemeMode): void {
  localStorage.setItem(MODE_STORAGE_KEY, mode);
}

/**
 * Check if theme supports both dark and light modes
 */
export function hasBothModes(theme: TOMLTheme): boolean {
  const result = !!(theme.dark?.colors && theme.light?.colors);
  console.log("hasBothModes check:", {
    hasDarkColors: !!theme.dark?.colors,
    hasLightColors: !!theme.light?.colors,
    result,
  });
  return result;
}

/**
 * Apply theme with specific mode
 */
export function applyThemeMode(theme: TOMLTheme, mode: ThemeMode): boolean {
  try {
    if (mode === "light" && !theme.light?.colors) {
      console.warn("Theme does not have light mode, falling back to dark");
      mode = "dark";
    }

    if (mode === "dark" && !theme.dark?.colors) {
      console.warn("Theme does not have dark mode, falling back to light");
      mode = "light";
    }

    const variables = extractCSSVariables(theme, mode);
    applyCSSVariables(variables);
    setThemeMode(mode);

    return true;
  } catch (error) {
    console.error("Failed to apply theme mode:", error);
    return false;
  }
}
