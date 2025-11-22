<template>
  <div class="home-view">
    <h1>Welcome to Vigilance</h1>
    <p>Your smart home monitoring system is ready.</p>

    <div class="controls">
      <label for="gap-control">Grid Gap:</label>
      <input
        id="gap-control"
        v-model.number="gridGap"
        type="range"
        min="0"
        max="3"
        step="0.1"
      />
      <span>{{ gridGap.toFixed(1) }}rem</span>
    </div>

    <div class="controls">
      <label for="row-height-control">Row Height:</label>
      <input
        id="row-height-control"
        v-model.number="rowHeight"
        type="range"
        min="50"
        max="300"
        step="10"
      />
      <span>{{ rowHeight }}px</span>
    </div>

    <div
      class="grid-container"
      :style="{ gap: `${gridGap}rem`, gridAutoRows: `${rowHeight}px` }"
    >
      <GridCard
        v-for="(card, index) in cards"
        :key="index"
        :col="card.col"
        :row="card.row"
        :col-span="card.colSpan"
        :row-span="card.rowSpan"
        :color="card.color"
        :min-col-span="card.minColSpan"
        :max-col-span="card.maxColSpan"
        :min-row-span="card.minRowSpan"
        :max-row-span="card.maxRowSpan"
        @resize="(newSize) => handleResize(index, newSize)"
      >
        <div class="card-content">
          <div class="card-label">{{ card.label }}</div>
          <div class="card-info">
            <div>Pos: ({{ card.col }}, {{ card.row }})</div>
            <div>Size: {{ card.colSpan }}x{{ card.rowSpan }}</div>
          </div>
        </div>
      </GridCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GridCard from "@/components/GridCard.vue";

interface Card {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  label: string;
  color: string;
  minColSpan?: number;
  maxColSpan?: number;
  minRowSpan?: number;
  maxRowSpan?: number;
}

const gridGap = ref(1);
const rowHeight = ref(100);
const cards = ref<Card[]>([
  {
    col: 1,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    label: "Card 1x1",
    color: "#fecaca",
    minColSpan: 1,
    maxColSpan: 2,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    col: 2,
    row: 1,
    colSpan: 2,
    rowSpan: 1,
    label: "Card 2x1",
    color: "#fed7aa",
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 3,
  },
  {
    col: 4,
    row: 1,
    colSpan: 1,
    rowSpan: 2,
    label: "Card 1x2",
    color: "#fef08a",
    minColSpan: 1,
    maxColSpan: 1,
    minRowSpan: 1,
    maxRowSpan: 3,
  },
  {
    col: 1,
    row: 2,
    colSpan: 1,
    rowSpan: 1,
    label: "Card 1x1",
    color: "#bbf7d0",
    minColSpan: 1,
    maxColSpan: 2,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    col: 2,
    row: 2,
    colSpan: 2,
    rowSpan: 1,
    label: "Card 2x1",
    color: "#a5f3fc",
    minColSpan: 1,
    maxColSpan: 3,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    col: 1,
    row: 3,
    colSpan: 3,
    rowSpan: 1,
    label: "Card 3x1",
    color: "#c4b5fd",
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
]);

const doRectanglesOverlap = (
  col1: number,
  row1: number,
  colSpan1: number,
  rowSpan1: number,
  col2: number,
  row2: number,
  colSpan2: number,
  rowSpan2: number
): boolean => {
  return (
    col1 < col2 + colSpan2 &&
    col1 + colSpan1 > col2 &&
    row1 < row2 + rowSpan2 &&
    row1 + rowSpan1 > row2
  );
};

const canPlaceCard = (
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number,
  excludeIndex?: number
): boolean => {
  return !cards.value.some((card, index) => {
    if (excludeIndex !== undefined && index === excludeIndex) return false;
    return doRectanglesOverlap(
      col,
      row,
      colSpan,
      rowSpan,
      card.col,
      card.row,
      card.colSpan,
      card.rowSpan
    );
  });
};

const findNextAvailablePosition = (
  colSpan: number,
  rowSpan: number,
  excludeIndex?: number
): { col: number; row: number } => {
  // Search in expanding grid - start from col 1, row 1
  const maxCol = 12; // Grid goes up to 12 columns max
  const maxSearchRow = 100; // Don't search forever

  for (let row = 1; row < maxSearchRow; row++) {
    for (let col = 1; col <= maxCol; col++) {
      // Check if card fits within grid boundaries
      if (col + colSpan - 1 > maxCol) {
        continue; // Card extends beyond grid, skip
      }
      if (canPlaceCard(col, row, colSpan, rowSpan, excludeIndex)) {
        return { col, row };
      }
    }
  }

  // Fallback: place at the end
  return { col: 1, row: maxSearchRow };
};

const handleResize = (
  cardIndex: number,
  newSize: { colSpan: number; rowSpan: number }
) => {
  const oldCard = cards.value[cardIndex];
  if (!oldCard) return;

  // Update the resized card
  oldCard.colSpan = newSize.colSpan;
  oldCard.rowSpan = newSize.rowSpan;

  // Keep resolving collisions until there are none
  let hasCollisions = true;
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops

  while (hasCollisions && iterations < maxIterations) {
    hasCollisions = false;
    iterations++;

    cards.value.forEach((card, index) => {
      if (index !== cardIndex) {
        // Check if this card collides with any other card
        let collides = false;
        cards.value.forEach((otherCard, otherIndex) => {
          if (index !== otherIndex) {
            if (
              doRectanglesOverlap(
                card.col,
                card.row,
                card.colSpan,
                card.rowSpan,
                otherCard.col,
                otherCard.row,
                otherCard.colSpan,
                otherCard.rowSpan
              )
            ) {
              collides = true;
            }
          }
        });

        if (collides) {
          // Find next available position for this card
          const nextPos = findNextAvailablePosition(
            card.colSpan,
            card.rowSpan,
            index
          );
          card.col = nextPos.col;
          card.row = nextPos.row;
          hasCollisions = true;
        }
      }
    });
  }
};
</script>

<style scoped>
.home-view {
  padding: 2rem;
}

h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  color: #0f172a;
}

p {
  color: #475569;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
}

.controls label {
  font-weight: 600;
  color: #0f172a;
}

.controls input[type="range"] {
  flex: 1;
  max-width: 300px;
}

.controls span {
  color: #475569;
  font-weight: 500;
  min-width: 60px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  position: relative;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 1fr;
  pointer-events: none;
  z-index: 1000;
  gap: 0;
}

.grid-overlay::before {
  content: "";
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  background-image: linear-gradient(
      90deg,
      rgba(220, 38, 38, 0.6) 1px,
      transparent 1px
    ),
    linear-gradient(180deg, rgba(220, 38, 38, 0.6) 1px, transparent 1px);
  background-size: calc(100% / 12) calc(100% / 100);
  background-position: 0 0;
  background-repeat: repeat;
  pointer-events: none;
}

.grid-item {
  border: 2px solid #0f172a;
  padding: 2rem;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #0f172a;
}

.grid-item:hover {
  background-color: #e2e8f0;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}

.card-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}

.card-info {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.card-info div {
  line-height: 1.4;
}
</style>
