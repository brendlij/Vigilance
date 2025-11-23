<template>
  <div v-if="editMode" class="toolbar">
    <button class="finish-button" @click="finishEditing" title="Finish editing">
      <Icon icon="mdi:check" />
    </button>
    <button
      class="add-button"
      @click="showAddCardModal = true"
      title="Add new card"
    >
      <Icon icon="mdi:plus" />
    </button>

    <div class="grid-controls">
      <label>
        <span>Gap:</span>
        <input
          v-model.number="gridGap"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          class="slider"
        />
        <span class="value">{{ gridGap.toFixed(1) }}rem</span>
      </label>
      <label>
        <span>Row H:</span>
        <input
          v-model.number="baseRowHeight"
          type="range"
          min="60"
          max="200"
          step="10"
          class="slider"
        />
        <span class="value">{{ adjustedRowHeight }}px</span>
      </label>
    </div>
  </div>

  <div
    class="grid-container"
    :class="{ 'edit-mode': editMode }"
    :style="{
      gap: `${gridGap}rem`,
      gridAutoRows: `${adjustedRowHeight}px`,
      '--grid-gap': `${gridGap * 16}px`,
      '--row-height': `${adjustedRowHeight}px`,
    }"
  >
    <template v-if="editMode">
      <div
        v-for="i in gridCellCount"
        :key="`cell-${i}`"
        class="grid-cell"
      ></div>
    </template>

    <GridCard
      v-for="card in cardStore.cards"
      :key="card.id"
      :col="card.col"
      :row="card.row"
      :col-span="card.colSpan"
      :row-span="card.rowSpan"
      :edit-mode="editMode"
      :deletable="editMode"
      @move="(newPos) => handleMove(card.id, newPos)"
      @resize="(newSize) => handleResize(card.id, newSize)"
      @delete="() => removeAndCompact(card.id)"
    >
      <CardRenderer :card="card" :edit-mode="editMode" />
    </GridCard>
  </div>

  <div
    v-if="showAddCardModal"
    class="modal-overlay"
    @click="showAddCardModal = false"
  >
    <div class="modal" @click.stop>
      <h2>Add New Card</h2>
      <div class="card-types">
        <button class="type-button" @click="addExampleCard">
          <div class="type-name">Example Card</div>
          <div class="type-description">A simple example card</div>
        </button>
      </div>
      <button class="modal-close" @click="showAddCardModal = false">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";
import GridCard from "@/components/GridCard.vue";
import CardRenderer from "@/components/CardRenderer.vue";
import { useEditMode } from "@/composables/useEditMode";
import { useCardStore } from "@/stores/cardStore";

// --- STATE ---
const { editMode } = useEditMode();
const cardStore = useCardStore();
const showAddCardModal = ref(false);
const gridGap = ref(1.5);
const baseRowHeight = ref(100);

// --- TYPES ---
// We use a generic interface for the math engine
interface LayoutItem {
  id: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  // This index signature tells TS: "This object might have other properties too (like settings), don't lose them!"
  [key: string]: any;
}

// --- COMPUTED STYLES ---
const adjustedRowHeight = computed(() => {
  const gapFactor = 1 - gridGap.value * 0.1;
  return Math.round(baseRowHeight.value * Math.max(gapFactor, 0.5));
});

const gridCellCount = computed(() => {
  const maxRow = Math.max(20, ...cardStore.cards.map((c) => c.row + c.rowSpan));
  return 12 * maxRow;
});

// =============================================================================
//  CORE LAYOUT ENGINE (The "Waterfall" Algorithm)
// =============================================================================

/**
 * Main Handler: Move
 */
function handleMove(cardId: string, newPos: { col: number; row: number }) {
  const draggedCard = cardStore.getCard(cardId);
  if (!draggedCard) return;

  // 1. Snap to Grid Integers
  let targetCol = Math.round(newPos.col);
  let targetRow = Math.round(newPos.row);

  // 2. Boundary Checks
  targetCol = Math.max(1, Math.min(13 - draggedCard.colSpan, targetCol));
  targetRow = Math.max(1, targetRow);

  if (draggedCard.col === targetCol && draggedCard.row === targetRow) return;

  // 3. Create a shallow copy of the layout
  // TS will now be happy because we updated LayoutItem to accept extra props
  let layout = cardStore.cards.map((c) => ({ ...c }));
  const activeItem = layout.find((c) => c.id === cardId)!;

  // 4. Update the active item
  activeItem.col = targetCol;
  activeItem.row = targetRow;

  // 5. Run Physics
  layout = resolveCollisions(layout, activeItem);
  layout = compactLayout(layout);

  // 6. Apply
  applyLayoutToStore(layout);
}

/**
 * Main Handler: Resize
 */
function handleResize(
  cardId: string,
  newSize: { colSpan: number; rowSpan: number }
) {
  const card = cardStore.getCard(cardId);
  if (!card) return;

  const colSpan = Math.max(1, Math.min(12, Math.round(newSize.colSpan)));
  const rowSpan = Math.max(1, Math.round(newSize.rowSpan));

  if (card.colSpan === colSpan && card.rowSpan === rowSpan) return;

  let layout = cardStore.cards.map((c) => ({ ...c }));
  const activeItem = layout.find((c) => c.id === cardId)!;

  activeItem.colSpan = colSpan;
  activeItem.rowSpan = rowSpan;

  if (activeItem.col + activeItem.colSpan > 13) {
    activeItem.col = 13 - activeItem.colSpan;
  }

  layout = resolveCollisions(layout, activeItem);
  layout = compactLayout(layout);

  applyLayoutToStore(layout);
}

/**
 * Helper: Resolve Collisions (Generic T ensures we don't lose 'settings', 'type' etc)
 */
function resolveCollisions<T extends LayoutItem>(
  layout: T[],
  activeItem: LayoutItem
): T[] {
  const sorted = sortLayout(layout);

  for (const otherItem of sorted) {
    if (otherItem.id === activeItem.id) continue;

    if (collides(activeItem, otherItem)) {
      const newRow = activeItem.row + activeItem.rowSpan;

      if (otherItem.row < newRow) {
        otherItem.row = newRow;
        // Recursively push down items below this one
        layout = resolveCollisions(layout, otherItem);
      }
    }
  }
  return layout;
}

/**
 * Helper: Compact (Gravity)
 */
function compactLayout<T extends LayoutItem>(layout: T[]): T[] {
  const sorted = sortLayout(layout);
  const compareList: T[] = [];

  for (const item of sorted) {
    let newRow = item.row;

    // Bubble up
    while (newRow > 1) {
      const candidate = { ...item, row: newRow - 1 };
      const hasCollision = compareList.some((placed) =>
        collides(candidate, placed)
      );
      if (hasCollision) break;
      newRow--;
    }

    item.row = newRow;
    compareList.push(item);
  }

  return layout;
}

// --- UTILITIES ---

function collides(a: LayoutItem, b: LayoutItem): boolean {
  if (a.id === b.id) return false;
  return !(
    a.col + a.colSpan <= b.col ||
    a.col >= b.col + b.colSpan ||
    a.row + a.rowSpan <= b.row ||
    a.row >= b.row + b.rowSpan
  );
}

function sortLayout<T extends LayoutItem>(layout: T[]): T[] {
  return [...layout].sort((a, b) => {
    if (a.row === b.row) return a.col - b.col;
    return a.row - b.row;
  });
}

function applyLayoutToStore(layout: LayoutItem[]) {
  layout.forEach((item) => {
    const current = cardStore.getCard(item.id);
    if (
      current &&
      (current.col !== item.col ||
        current.row !== item.row ||
        current.colSpan !== item.colSpan ||
        current.rowSpan !== item.rowSpan)
    ) {
      cardStore.updateCardPosition(item.id, item.col, item.row);
      cardStore.updateCardSize(item.id, item.colSpan, item.rowSpan);
    }
  });
}

// --- ACTIONS ---

function addExampleCard() {
  // Pass a copy to avoid mutating store directly during calculation
  const layout = compactLayout(cardStore.cards.map((c) => ({ ...c })));
  const maxRow = Math.max(0, ...layout.map((c) => c.row + c.rowSpan));

  cardStore.addCard(
    "example",
    { col: 1, row: maxRow || 1 },
    { title: "New Card", description: "Freshly added" }
  );

  // Re-compact instantly so it floats up if there is space
  setTimeout(() => {
    const newLayout = compactLayout(cardStore.cards.map((c) => ({ ...c })));
    applyLayoutToStore(newLayout);
  }, 10);

  showAddCardModal.value = false;
}

function removeAndCompact(id: string) {
  cardStore.removeCard(id);
  // Wait for store update, then compact
  setTimeout(() => {
    const newLayout = compactLayout(cardStore.cards.map((c) => ({ ...c })));
    applyLayoutToStore(newLayout);
  }, 10);
}

function finishEditing() {
  editMode.value = false;
}

onMounted(() => {
  cardStore.loadCards();
  initializeCardTypes();
});

function initializeCardTypes() {
  cardStore.registerCardType("example", {
    defaultColSpan: 3,
    defaultRowSpan: 3,
    minColSpan: 2,
    maxColSpan: 12,
    minRowSpan: 2,
    maxRowSpan: 10,
  });
}
</script>

<style scoped>
/* Keep your existing styles exactly as they were */
.toolbar {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.finish-button,
.add-button {
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: rgba(100, 100, 100, 0.7);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.finish-button:hover,
.add-button:hover {
  background: rgba(80, 80, 80, 0.9);
}
.grid-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 0 0.5rem;
  border-left: 1px solid #ddd;
  padding-left: 1rem;
}
.grid-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}
.slider {
  width: 100px;
  height: 4px;
  cursor: pointer;
  accent-color: #667eea;
}
.value {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #333;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  overflow: visible;
  padding: 1rem;
  position: relative;
}
.grid-cell {
  border: 1px solid rgba(8, 145, 178, 0.2);
  pointer-events: none;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.card-types {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.type-button {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.type-button:hover {
  border-color: #667eea;
  background: #f8f9ff;
}
.modal-close {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background: #f0f0f0;
  color: #333;
  cursor: pointer;
}
.modal-close:hover {
  background: #e0e0e0;
}

/* IMPORTANT: This makes the cards slide smoothly */
:deep(.grid-card) {
  transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease;
}
</style>
