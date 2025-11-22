<template>
  <div
    class="grid-card"
    :style="cardStyle"
    :class="{
      preview: isDragging,
      resizing: isResizing,
      'edit-mode': editMode,
    }"
    @mousedown="startDrag"
  >
    <button
      v-if="deletable"
      class="delete-button"
      @click.stop="emit('delete')"
      title="Delete card"
    >
      ✕
    </button>

    <slot>
      <p>Card Content</p>
    </slot>

    <div class="resize-handle" @mousedown.stop="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  row?: number;
  col?: number;
  rowSpan?: number;
  colSpan?: number;
  color?: string;
  minColSpan?: number;
  maxColSpan?: number;
  minRowSpan?: number;
  maxRowSpan?: number;
  editMode?: boolean;
  deletable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  row: 1,
  col: 1,
  rowSpan: 1,
  colSpan: 1,
  color: "#f8fafc",
  minColSpan: 1,
  maxColSpan: 12,
  minRowSpan: 1,
  maxRowSpan: 10,
  editMode: false,
  deletable: false,
});

const emit = defineEmits<{
  resize: [{ colSpan: number; rowSpan: number }];
  move: [{ col: number; row: number }];
  previewMove: [{ col: number; row: number }];
  cancelPreview: [];
  delete: [];
}>();

const localColSpan = ref(props.colSpan);
const localRowSpan = ref(props.rowSpan);
const isDragging = ref(false);
const isResizing = ref(false);

const cardStyle = computed(() => ({
  gridColumn: `${props.col} / span ${localColSpan.value}`,
  gridRow: `${props.row} / span ${localRowSpan.value}`,
  backgroundColor: props.color,
}));

const startDrag = (event: MouseEvent) => {
  // Don't drag if clicking on resize handle or edit mode is off
  if ((event.target as HTMLElement).classList.contains("resize-handle")) {
    return;
  }

  if (!props.editMode) {
    return;
  }

  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const startCol = props.col;
  const startRow = props.row;
  let lastPreviewCol = startCol;
  let lastPreviewRow = startRow;

  console.log(
    `[GRIDCARD] Drag started at (${startX}, ${startY}) from position (${startCol}, ${startRow})`
  );
  isDragging.value = true;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;

    // Calculate new position based on movement (110px per column/row for 2x mouse speed responsiveness)
    const colChange = Math.round(deltaX / 110);
    const rowChange = Math.round(deltaY / 110);

    const newCol = Math.max(1, startCol + colChange);
    const newRow = Math.max(1, startRow + rowChange);

    // Track the last preview position
    lastPreviewCol = newCol;
    lastPreviewRow = newRow;

    // Emit preview position (card moves in UI but not committed yet)
    emit("previewMove", { col: newCol, row: newRow });
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    isDragging.value = false;

    console.log(
      `[GRIDCARD] Mouse up - lastPreview: (${lastPreviewCol}, ${lastPreviewRow}), Start: (${startCol}, ${startRow})`
    );

    // Check if preview position changed from start
    if (lastPreviewCol !== startCol || lastPreviewRow !== startRow) {
      console.log(
        `[GRIDCARD] Emitting MOVE event to (${lastPreviewCol}, ${lastPreviewRow})`
      );
      emit("move", { col: lastPreviewCol, row: lastPreviewRow });
    } else {
      console.log(`[GRIDCARD] Emitting CANCEL event (no movement)`);
      // If no movement, cancel the preview and revert
      emit("cancelPreview");
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

const startResize = (event: MouseEvent) => {
  // Don't resize if edit mode is off
  if (!props.editMode) {
    return;
  }

  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const startColSpan = localColSpan.value;
  const startRowSpan = localRowSpan.value;

  isResizing.value = true;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;

    // Calculate new spans based on movement (110px per column/row for 2x mouse speed responsiveness)
    const colChange = Math.round(deltaX / 110);
    const rowChange = Math.round(deltaY / 110);

    // Apply min/max constraints
    localColSpan.value = Math.max(
      props.minColSpan,
      Math.min(props.maxColSpan, startColSpan + colChange)
    );
    localRowSpan.value = Math.max(
      props.minRowSpan,
      Math.min(props.maxRowSpan, startRowSpan + rowChange)
    );
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    isResizing.value = false;
    emit("resize", {
      colSpan: localColSpan.value,
      rowSpan: localRowSpan.value,
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};
</script>

<style scoped>
.grid-card {
  border: 2px solid #0f172a;
  padding: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s ease, opacity 0.1s ease, z-index 0s ease;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.grid-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.grid-card.preview {
  opacity: 1;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.grid-card.resizing {
  opacity: 1;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
  border-color: #22c55e;
}

.grid-card p {
  margin: 0;
  color: #0f172a;
  font-weight: 500;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, transparent 50%, #0f172a 50%);
  cursor: nwse-resize;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: none;
}

.grid-card.edit-mode:hover .resize-handle {
  display: block;
  opacity: 0.6;
}

.grid-card.resizing .resize-handle {
  display: block;
  opacity: 1;
}

.resize-handle:active {
  opacity: 1;
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: #ff4444;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-card.edit-mode:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  background: #cc0000;
}
</style>
