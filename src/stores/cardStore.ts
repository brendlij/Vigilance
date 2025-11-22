import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";

export interface CardInstance {
  id: string;
  type: string; // e.g., "example", "weather", "stats", etc.
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  settings: Record<string, any>; // Custom settings per card type
}

export interface CardConfig {
  defaultColSpan: number;
  defaultRowSpan: number;
  minColSpan: number;
  maxColSpan: number;
  minRowSpan: number;
  maxRowSpan: number;
}

const STORAGE_KEY = "vigilance_cards";

export const useCardStore = defineStore("cards", () => {
  // State
  const cards = ref<CardInstance[]>([]);
  const cardConfigs = reactive<Record<string, CardConfig>>({});
  const isInitialized = ref(false);

  // Load cards from localStorage
  function loadCards(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedCards = JSON.parse(stored);
        cards.value = Array.isArray(parsedCards) ? parsedCards : [];
      }
    } catch (error) {
      console.error("Failed to load cards from localStorage:", error);
    }
    isInitialized.value = true;
  }

  // Save cards to localStorage
  function saveCards(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value));
    } catch (error) {
      console.error("Failed to save cards to localStorage:", error);
    }
  }

  // Watch for changes and auto-save
  watch(cards, saveCards, { deep: true });

  // Generate unique card ID
  function generateCardId(): string {
    return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Register a custom card type with its config
  function registerCardType(
    type: string,
    config: CardConfig,
    defaultSettings: Record<string, any> = {}
  ): void {
    cardConfigs[type] = config;
  }

  // Add a new card instance
  function addCard(
    type: string,
    initialPosition?: { col: number; row: number },
    settings?: Record<string, any>
  ): CardInstance {
    const config = cardConfigs[type];
    if (!config) {
      console.warn(`Card type "${type}" not registered`);
      return null as any;
    }

    const newCard: CardInstance = {
      id: generateCardId(),
      type,
      col: initialPosition?.col ?? 1,
      row: initialPosition?.row ?? 1,
      colSpan: config.defaultColSpan,
      rowSpan: config.defaultRowSpan,
      settings: settings ?? {},
    };

    cards.value.push(newCard);
    return newCard;
  }

  // Remove a card
  function removeCard(cardId: string): void {
    const index = cards.value.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      cards.value.splice(index, 1);
    }
  }

  // Update card position
  function updateCardPosition(cardId: string, col: number, row: number): void {
    const card = cards.value.find((c) => c.id === cardId);
    if (card) {
      card.col = col;
      card.row = row;
    }
  }

  // Update card size
  function updateCardSize(
    cardId: string,
    colSpan: number,
    rowSpan: number
  ): void {
    const card = cards.value.find((c) => c.id === cardId);
    if (card) {
      const config = cardConfigs[card.type];
      if (config) {
        card.colSpan = Math.max(
          config.minColSpan,
          Math.min(config.maxColSpan, colSpan)
        );
        card.rowSpan = Math.max(
          config.minRowSpan,
          Math.min(config.maxRowSpan, rowSpan)
        );
      }
    }
  }

  // Update card settings
  function updateCardSettings(
    cardId: string,
    settings: Record<string, any>
  ): void {
    const card = cards.value.find((c) => c.id === cardId);
    if (card) {
      card.settings = { ...card.settings, ...settings };
    }
  }

  // Get card by ID
  function getCard(cardId: string): CardInstance | undefined {
    return cards.value.find((c) => c.id === cardId);
  }

  // Get all cards
  function getAllCards(): CardInstance[] {
    return cards.value;
  }

  // Get card config
  function getCardConfig(type: string): CardConfig | undefined {
    return cardConfigs[type];
  }

  return {
    // State
    cards,
    cardConfigs,
    isInitialized,
    // Actions
    loadCards,
    saveCards,
    generateCardId,
    registerCardType,
    addCard,
    removeCard,
    updateCardPosition,
    updateCardSize,
    updateCardSettings,
    getCard,
    getAllCards,
    getCardConfig,
  };
});
