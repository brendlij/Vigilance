/**
 * Theme Loader Service
 * Handles fetching, parsing, and applying themes from backend and GitHub
 */

import axios from "axios";
import {
  parseTOML,
  extractCSSVariables,
  applyCSSVariables,
  TOMLTheme,
} from "../lib/tomlParser";

export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  source: "default" | "community" | "user";
}

export interface ThemeWithContent extends ThemeInfo {
  content: string;
}

const API_BASE = "http://localhost:8080";

/**
 * Fetch all default themes from backend
 */
export async function fetchDefaultThemes(): Promise<ThemeInfo[]> {
  try {
    const response = await axios.get(`${API_BASE}/api/themes`);
    return response.data.data.default || [];
  } catch (error) {
    console.error("Failed to fetch default themes:", error);
    return [];
  }
}

/**
 * Fetch full theme content from backend
 */
export async function fetchThemeContent(theme: ThemeInfo): Promise<string> {
  try {
    console.log("Fetching theme content for:", theme);

    if (theme.source === "default" || theme.source === "user") {
      const params = {
        source: theme.source,
        theme: theme.name,
        author: theme.author || "",
      };
      console.log("Backend request params:", params);

      const response = await axios.get(`${API_BASE}/api/themes/get`, {
        params,
      });

      console.log("Backend response:", response.data);
      return response.data.data.content;
    }
    return "";
  } catch (error) {
    console.error(`Failed to fetch theme content for ${theme.name}:`, error);
    return "";
  }
}

/**
 * Load and apply a theme, returns parsed theme for mode switching
 */
export async function loadAndApplyTheme(
  theme: ThemeInfo
): Promise<{ success: boolean; parsed?: TOMLTheme }> {
  try {
    const content = await fetchThemeContent(theme);
    if (!content) {
      console.error("Theme content is empty");
      return { success: false };
    }

    // Parse TOML
    const parsed = parseTOML(content);

    // Extract CSS variables (prefer dark mode, fallback to light)
    let variables: Record<string, string>;
    if (parsed.dark?.colors) {
      variables = extractCSSVariables(parsed, "dark");
    } else if (parsed.light?.colors) {
      variables = extractCSSVariables(parsed, "light");
    } else {
      console.error("Theme has no color definitions");
      return { success: false };
    }

    // Apply to document
    applyCSSVariables(variables);

    return { success: true, parsed };
  } catch (error) {
    console.error("Failed to load and apply theme:", error);
    return { success: false };
  }
}

/**
 * Get user's uploaded themes
 */
export async function fetchUserThemes(userId: string): Promise<ThemeInfo[]> {
  try {
    const response = await axios.get(`${API_BASE}/api/themes/my`, {
      params: { user_id: userId },
    });
    return response.data.themes || [];
  } catch (error) {
    console.error("Failed to fetch user themes:", error);
    return [];
  }
}

/**
 * Upload a new theme
 */
export async function uploadTheme(
  userId: string,
  themeName: string,
  file: File
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("theme_name", themeName);
    formData.append("theme_file", file);

    const response = await axios.post(
      `${API_BASE}/api/themes/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.success;
  } catch (error) {
    console.error("Failed to upload theme:", error);
    return false;
  }
}

/**
 * Delete a user's theme
 */
export async function deleteTheme(
  userId: string,
  themeName: string
): Promise<boolean> {
  try {
    const response = await axios.delete(`${API_BASE}/api/themes/upload`, {
      params: {
        user_id: userId,
        theme_name: themeName,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error("Failed to delete theme:", error);
    return false;
  }
}
