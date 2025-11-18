/**
 * Color settings helper
 * Manages dashboard accent colors
 */

const API_BASE = "http://localhost:8080/api";

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent_green: string;
  accent_red: string;
  accent_orange: string;
  accent_yellow: string;
  accent_purple: string;
}

/**
 * Fetch color settings from backend
 */
export const fetchColors = async (): Promise<ColorSettings> => {
  try {
    const response = await fetch(`${API_BASE}/colors`);
    if (!response.ok) {
      throw new Error("Failed to fetch colors");
    }
    return response.json();
  } catch (error) {
    console.warn("Failed to fetch colors from backend", error);
    return getDefaultColors();
  }
};

/**
 * Update color settings on backend
 */
export const updateColors = async (
  colors: ColorSettings
): Promise<ColorSettings> => {
  try {
    const response = await fetch(`${API_BASE}/colors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colors),
    });

    if (!response.ok) {
      throw new Error("Failed to update colors");
    }

    return colors;
  } catch (error) {
    console.error("Failed to update colors", error);
    throw error;
  }
};

/**
 * Default color scheme
 */
export const getDefaultColors = (): ColorSettings => {
  return {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent_green: "#10b981",
    accent_red: "#ef4444",
    accent_orange: "#f97316",
    accent_yellow: "#eab308",
    accent_purple: "#a855f7",
  };
};

/**
 * Apply colors to CSS variables
 */
export const applyColorsToCSS = (colors: ColorSettings): void => {
  const root = document.documentElement;

  root.style.setProperty("--color-primary", colors.primary);
  root.style.setProperty("--color-secondary", colors.secondary);
  root.style.setProperty("--color-accent-green", colors.accent_green);
  root.style.setProperty("--color-accent-red", colors.accent_red);
  root.style.setProperty("--color-accent-orange", colors.accent_orange);
  root.style.setProperty("--color-accent-yellow", colors.accent_yellow);
  root.style.setProperty("--color-accent-purple", colors.accent_purple);

  // Calculate lighter variants
  const lightenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8) + amt & 0x00ff);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return (
      "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)
    );
  };

  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8) - amt & 0x00ff);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return (
      "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)
    );
  };

  root.style.setProperty(
    "--color-primary-light",
    lightenColor(colors.primary, 20)
  );
  root.style.setProperty(
    "--color-primary-dark",
    darkenColor(colors.primary, 20)
  );
  root.style.setProperty(
    "--color-secondary-light",
    lightenColor(colors.secondary, 20)
  );
  root.style.setProperty(
    "--color-secondary-dark",
    darkenColor(colors.secondary, 20)
  );
};
