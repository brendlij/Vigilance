<template>
  <!-- Edit Mode Toolbar -->
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

    <!-- Grid Controls -->
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

  <!-- Grid -->
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
    <!-- Grid cells background (visible in edit mode) -->
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
      @delete="() => cardStore.removeCard(card.id)"
    >
      <CardRenderer :card="card" :edit-mode="editMode" />
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

const { editMode } = useEditMode();
const cardStore = useCardStore();

const showAddCardModal = ref(false);
const gridGap = ref(1.5);
const baseRowHeight = ref(100); // Base height for calculation

// Calculate adjusted row height to maintain square cells
// As gap increases, cell width decreases, so height should also decrease
const adjustedRowHeight = computed(() => {
  // Inverse factor: as gap increases, multiply by smaller number
  const gapFactor = 1 - gridGap.value * 0.1; // Decreases height as gap increases
  return Math.round(baseRowHeight.value * Math.max(gapFactor, 0.5)); // Min 50% of base
});

// Calculate number of grid cells to display
const gridCellCount = computed(() => {
  const maxCol = Math.max(...cardStore.cards.map((c) => c.col + c.colSpan), 12);
  const maxRow = Math.max(...cardStore.cards.map((c) => c.row + c.rowSpan), 10);
  return maxCol * maxRow;
});

// Initialize card types
function initializeCardTypes() {
  cardStore.registerCardType("example", {
    defaultColSpan: 3,
    defaultRowSpan: 3,
    minColSpan: 2,
    maxColSpan: 6,
    minRowSpan: 2,
    maxRowSpan: 6,
  });
}

// Add example card
function addExampleCard() {
  const nextCol = Math.max(
    1,
    Math.max(...cardStore.cards.map((c) => c.col + c.colSpan - 1), 0) + 1
  );
  const nextRow = 1;

  cardStore.addCard(
    "example",
    { col: nextCol, row: nextRow },
    {
      title: "Example Card",
      description: "This is an example card",
    }
  );

  showAddCardModal.value = false;
}

// Handle card movement
function handleMove(cardId: string, newPos: { col: number; row: number }) {
  cardStore.updateCardPosition(cardId, newPos.col, newPos.row);
}

// Handle card resizing
function handleResize(
  cardId: string,
  newSize: { colSpan: number; rowSpan: number }
) {
  cardStore.updateCardSize(cardId, newSize.colSpan, newSize.rowSpan);
}

// Finish editing
function finishEditing() {
  editMode.value = false;
}

// Initialize on mount
onMounted(() => {
  cardStore.loadCards();
  initializeCardTypes();
});
</script>

<style scoped>
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

.finish-button:active,
.add-button:active {
  transform: scale(0.95);
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

.grid-controls span:first-child {
  min-width: 50px;
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

/* Modal */
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

.modal h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
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

.type-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.type-description {
  font-size: 0.85rem;
  color: #999;
}

.modal-close {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background: #f0f0f0;
  color: #333;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #e0e0e0;
}
</style>
