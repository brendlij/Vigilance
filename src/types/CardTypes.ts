// Card-Typ System für einfache Verwaltung

export interface CardConfig {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  minColSpan: number;
  maxColSpan: number;
  minRowSpan: number;
  maxRowSpan: number;
}

export interface Card extends CardConfig {
  id: string;
  type: string; // "ping", "clock", "weather", etc.
  color: string;
  data: Record<string, any>; // Bearbeitbare Daten (url, interval, etc.)
}

// Template für jeden Card-Typ
export interface CardTemplate {
  type: string;
  label: string;
  defaultConfig: CardConfig;
  defaultData: Record<string, any>;
  description: string;
}

// Verfügbare Card-Typen
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    type: "weather",
    label: "Weather",
    description: "Show weather information",
    defaultConfig: {
      col: 1,
      row: 1,
      colSpan: 3,
      rowSpan: 3,
      minColSpan: 2,
      maxColSpan: 5,
      minRowSpan: 2,
      maxRowSpan: 4,
    },
    defaultData: {
      location: "Berlin",
      unit: "celsius",
    },
  },
];

export function generateCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
