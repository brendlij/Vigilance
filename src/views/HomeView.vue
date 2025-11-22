<template>
  <div class="toolbar">
    <button
      class="edit-button"
      :class="{ active: editMode }"
      @click="editMode = !editMode"
      title="Toggle edit mode"
    >
      ✏️
    </button>
    <button
      v-if="editMode"
      class="add-button"
      @click="showAddCardModal = true"
      title="Add new card"
    >
      ➕
    </button>
  </div>

  <!-- Grid -->
  <div
    class="grid-container"
    :style="{ gap: `${gridGap}rem`, gridAutoRows: `${rowHeight}px` }"
  >
    <GridCard
      v-for="card in cards"
      :key="card.id"
      :col="card.col"
      :row="card.row"
      :col-span="card.colSpan"
      :row-span="card.rowSpan"
      :color="card.color"
      :min-col-span="card.minColSpan"
      :max-col-span="card.maxColSpan"
      :min-row-span="card.minRowSpan"
      :max-row-span="card.maxRowSpan"
      :edit-mode="editMode"
      :deletable="editMode"
      @resize="(newSize) => handleResize(card.id, newSize)"
      @preview-move="(newPos) => handlePreviewMove(card.id, newPos)"
      @cancel-preview="() => handleCancelPreview(card.id)"
      @move="(newPos) => handleMove(card.id, newPos)"
      @delete="() => deleteCard(card.id)"
    >
      <CardRenderer
        :card="card"
        :edit-mode="editMode"
        @update-data="(newData) => updateCardData(card.id, newData)"
      />
    </GridCard>
  </div>

  <!-- Add Card Modal -->
  <div
    v-if="showAddCardModal"
    class="modal-overlay"
    @click="showAddCardModal = false"
  >
    <div class="modal" @click.stop>
      <h2>Add New Card</h2>
      <div class="card-templates">
        <button
          v-for="template in CARD_TEMPLATES"
          :key="template.type"
          class="template-button"
          @click="addCard(template)"
        >
          <div class="template-name">{{ template.label }}</div>
          <div class="template-description">{{ template.description }}</div>
        </button>
      </div>
      <button class="modal-close" @click="showAddCardModal = false">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GridCard from "@/components/GridCard.vue";
import CardRenderer from "@/components/CardRenderer.vue";
import type { Card, CardTemplate } from "@/types/CardTypes";
import { CARD_TEMPLATES, generateCardId } from "@/types/CardTypes";

// State
const cards = ref<Card[]>([
  {
    id: generateCardId(),
    type: "ping",
    col: 1,
    row: 1,
    colSpan: 4,
    rowSpan: 4,
    minColSpan: 2,
    maxColSpan: 6,
    minRowSpan: 2,
    maxRowSpan: 6,
    color: "#fce4ec",
    data: { url: "8.8.8.8", interval: 5 },
  },
  {
    id: generateCardId(),
    type: "clock",
    col: 5,
    row: 1,
    colSpan: 2,
    rowSpan: 1,
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 2,
    color: "#e0e7ff",
    data: { format: "HH:mm:ss" },
  },
]);

const editMode = ref(false);
const showAddCardModal = ref(false);
const gridGap = ref(1.5);
const rowHeight = ref(120);

// Actions
function addCard(template: CardTemplate) {
  const nextPos = findNextAvailablePosition(
    1,
    1,
    undefined,
    template.defaultConfig.colSpan,
    template.defaultConfig.rowSpan
  );

  const newCard: Card = {
    id: generateCardId(),
    type: template.type,
    col: nextPos.col,
    row: nextPos.row,
    colSpan: template.defaultConfig.colSpan,
    rowSpan: template.defaultConfig.rowSpan,
    minColSpan: template.defaultConfig.minColSpan,
    maxColSpan: template.defaultConfig.maxColSpan,
    minRowSpan: template.defaultConfig.minRowSpan,
    maxRowSpan: template.defaultConfig.maxRowSpan,
    color: generateRandomColor(),
    data: { ...template.defaultData },
  };

  cards.value.push(newCard);
  showAddCardModal.value = false;
}
function deleteCard(cardId: string) {
  const index = cards.value.findIndex((c) => c.id === cardId);
  if (index > -1) {
    cards.value.splice(index, 1);
  }
}

function updateCardData(cardId: string, newData: Record<string, any>) {
  const card = cards.value.find((c) => c.id === cardId);
  if (card) {
    card.data = { ...card.data, ...newData };
  }
}

// Collision Detection
function doRectanglesOverlap(
  col1: number,
  row1: number,
  colSpan1: number,
  rowSpan1: number,
  col2: number,
  row2: number,
  colSpan2: number,
  rowSpan2: number
): boolean {
  return !(
    col1 + colSpan1 <= col2 ||
    col2 + colSpan2 <= col1 ||
    row1 + rowSpan1 <= row2 ||
    row2 + rowSpan2 <= row1
  );
}

function hasCollisions(cardId: string): boolean {
  const card = cards.value.find((c) => c.id === cardId);
  if (!card) return false;

  return cards.value.some(
    (other) =>
      other.id !== cardId &&
      doRectanglesOverlap(
        card.col,
        card.row,
        card.colSpan,
        card.rowSpan,
        other.col,
        other.row,
        other.colSpan,
        other.rowSpan
      )
  );
}

function getCollidingCards(cardId: string): string[] {
  const card = cards.value.find((c) => c.id === cardId);
  if (!card) return [];

  return cards.value
    .filter(
      (other) =>
        other.id !== cardId &&
        doRectanglesOverlap(
          card.col,
          card.row,
          card.colSpan,
          card.rowSpan,
          other.col,
          other.row,
          other.colSpan,
          other.rowSpan
        )
    )
    .map((c) => c.id);
}

function findNextAvailablePosition(
  preferredCol: number,
  preferredRow: number,
  excludeCardId?: string,
  width: number = 1,
  height: number = 1
): { col: number; row: number } {
  for (let row = 1; row <= 50; row++) {
    for (let col = 1; col <= 12; col++) {
      // Check if position is within grid bounds
      if (col + width - 1 > 12) continue;

      const isAvailable = !cards.value.some(
        (card) =>
          card.id !== excludeCardId &&
          doRectanglesOverlap(
            col,
            row,
            width,
            height,
            card.col,
            card.row,
            card.colSpan,
            card.rowSpan
          )
      );

      if (isAvailable) {
        return { col, row };
      }
    }
  }
  return { col: preferredCol, row: preferredRow };
}

function handleResize(
  cardId: string,
  newSize: { colSpan: number; rowSpan: number }
) {
  const card = cards.value.find((c) => c.id === cardId);
  if (!card) return;

  card.colSpan = newSize.colSpan;
  card.rowSpan = newSize.rowSpan;

  if (hasCollisions(cardId)) {
    const colliding = getCollidingCards(cardId);
    colliding.forEach((collidingId) => {
      const collidingCard = cards.value.find((c) => c.id === collidingId);
      if (collidingCard) {
        const nextPos = findNextAvailablePosition(
          collidingCard.col,
          collidingCard.row,
          collidingId,
          collidingCard.colSpan,
          collidingCard.rowSpan
        );
        collidingCard.col = nextPos.col;
        collidingCard.row = nextPos.row;
      }
    });
  }
}

function handlePreviewMove(
  cardId: string,
  newPos: { col: number; row: number }
) {
  const card = cards.value.find((c) => c.id === cardId);
  if (card) {
    card.col = newPos.col;
    card.row = newPos.row;
  }
}

function handleCancelPreview(cardId: string) {
  // GridCard handles this internally
}

function handleMove(cardId: string, newPos: { col: number; row: number }) {
  const card = cards.value.find((c) => c.id === cardId);
  if (!card) return;

  card.col = newPos.col;
  card.row = newPos.row;

  if (hasCollisions(cardId)) {
    const colliding = getCollidingCards(cardId);
    colliding.forEach((collidingId) => {
      const collidingCard = cards.value.find((c) => c.id === collidingId);
      if (collidingCard) {
        const nextPos = findNextAvailablePosition(
          collidingCard.col,
          collidingCard.row,
          collidingId,
          collidingCard.colSpan,
          collidingCard.rowSpan
        );
        collidingCard.col = nextPos.col;
        collidingCard.row = nextPos.row;
      }
    });
  }
}

function generateRandomColor(): string {
  const colors = [
    "#fce4ec",
    "#f3e5f5",
    "#e3f2fd",
    "#e0f2f1",
    "#e8f5e9",
    "#fff9c4",
    "#ffe0b2",
    "#ffccbc",
    "#f1f8e9",
    "#fef3c7",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex] || "#fce4ec";
}
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 75px;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 1002;
}

.edit-button,
.add-button {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-button:hover,
.add-button:hover {
  border-color: #999;
  background: #f9f9f9;
}

.edit-button.active {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.add-button {
  background: #51cf66;
  color: white;
  border-color: #51cf66;
}

.add-button:hover {
  background: #37b24d;
  border-color: #37b24d;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  overflow: visible;
  padding: 1rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.card-templates {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.template-button {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
}

.template-button:hover {
  border-color: #51cf66;
  background: #f9fff9;
}

.template-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.template-description {
  font-size: 0.85rem;
  color: #666;
}

.modal-close {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: #eee;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #ddd;
}
</style>
