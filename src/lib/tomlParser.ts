/**
 * Simple TOML Parser for Browser
 * Parses only the structure we need for Vigilance themes
 */

export interface TOMLTheme {
  metadata: {
    name: string;
    description: string;
    version: string;
    author: string;
  };
  dark?: {
    colors?: Record<string, string>;
  };
  light?: {
    colors?: Record<string, string>;
  };
  shared?: {
    spacing?: Record<string, string>;
    typography?: Record<string, string>;
    "border-radius"?: Record<string, string>;
    shadows?: Record<string, string>;
    transitions?: Record<string, string>;
  };
}

/**
 * Parse TOML string into theme object
 */
export function parseTOML(content: string): TOMLTheme {
  const theme: any = {};
  const lines = content.split("\n");
  let currentSection: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Section header: [metadata], [dark.colors], etc.
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const sectionName = trimmed.slice(1, -1);
      currentSection = sectionName.split(".");
      ensureNestedObject(theme, currentSection);
      continue;
    }

    // Key-value pairs
    if (trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const cleanKey = key.trim();
      const value = valueParts.join("=").trim();

      // Parse value (handle strings, remove quotes)
      let parsedValue: any = value;
      if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      } else if (value === "true") {
        parsedValue = true;
      } else if (value === "false") {
        parsedValue = false;
      }

      // Set nested value
      setNestedValue(theme, [...currentSection, cleanKey], parsedValue);
    }
  }

  console.log("Parsed TOML theme:", theme);
  return theme as TOMLTheme;
}

/**
 * Ensure nested object structure exists
 */
function ensureNestedObject(obj: any, path: string[]): void {
  let current = obj;
  for (const key of path) {
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
}

/**
 * Set value in nested object
 */
function setNestedValue(obj: any, path: string[], value: any): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
}

/**
 * Extract CSS variables from parsed theme
 * Includes: colors, typography (fonts, sizes, weights), border-radius, shadows, transitions
 * Excludes: spacing (to protect layout)
 */
export function extractCSSVariables(
  theme: TOMLTheme,
  mode: "dark" | "light" = "dark"
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Colors from dark or light section
  if (theme[mode]?.colors) {
    for (const [key, value] of Object.entries(theme[mode]!.colors!)) {
      variables[`--color-${key}`] = value as string;
    }
  }

  // Typography (fonts, sizes, weights) - but NOT spacing
  if (theme.shared?.typography) {
    for (const [key, value] of Object.entries(theme.shared.typography)) {
      variables[`--font-${key}`] = value as string;
    }
  }

  // Border radius
  if (theme.shared?.["border-radius"]) {
    for (const [key, value] of Object.entries(theme.shared["border-radius"])) {
      variables[`--radius-${key}`] = value as string;
    }
  }

  // Shadows
  if (theme.shared?.shadows) {
    for (const [key, value] of Object.entries(theme.shared.shadows)) {
      variables[`--shadow-${key}`] = value as string;
    }
  }

  // Transitions
  if (theme.shared?.transitions) {
    for (const [key, value] of Object.entries(theme.shared.transitions)) {
      variables[`--transition-${key}`] = value as string;
    }
  }

  return variables;
}

/**
 * Apply CSS variables to document root
 */
export function applyCSSVariables(variables: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
}
