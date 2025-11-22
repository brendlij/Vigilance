<template>
  <div class="grid-card" :style="cardStyle" @mousedown="startDrag">
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
});

const emit = defineEmits<{
  resize: [{ colSpan: number; rowSpan: number }];
  move: [{ col: number; row: number }];
}>();

const localColSpan = ref(props.colSpan);
const localRowSpan = ref(props.rowSpan);

const cardStyle = computed(() => ({
  gridColumn: `${props.col} / span ${localColSpan.value}`,
  gridRow: `${props.row} / span ${localRowSpan.value}`,
  backgroundColor: props.color,
}));

const startDrag = (event: MouseEvent) => {
  // Don't drag if clicking on resize handle
  if ((event.target as HTMLElement).classList.contains("resize-handle")) {
    return;
  }

  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const startCol = props.col;
  const startRow = props.row;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;

    // Calculate new position based on movement (110px per column/row for 2x mouse speed responsiveness)
    const colChange = Math.round(deltaX / 110);
    const rowChange = Math.round(deltaY / 110);

    const newCol = Math.max(1, startCol + colChange);
    const newRow = Math.max(1, startRow + rowChange);

    // Emit the new position
    emit("move", { col: newCol, row: newRow });
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

const startResize = (event: MouseEvent) => {
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const startColSpan = localColSpan.value;
  const startRowSpan = localRowSpan.value;

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
  transition: box-shadow 0.2s ease;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.grid-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
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
}

.grid-card:hover .resize-handle {
  opacity: 0.6;
}

.resize-handle:active {
  opacity: 1;
}
</style>
