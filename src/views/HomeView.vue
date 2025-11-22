<template>
  <section class="home-view">
    <header class="toolbar">
      <div class="toolbar-left">
        <button class="btn primary" @click="toggleEditMode">
          {{ isEditMode ? "✓ Done Editing" : "✏️ Edit Layout" }}
        </button>
        <button class="btn" @click="openCreateDialog" :disabled="!isEditMode">
          ＋ Add Card
        </button>
        <button class="btn ghost" @click="resetLayout" :disabled="!canReset">
          ↻ Reset Layout
        </button>
      </div>
      <p class="toolbar-hint" v-if="isEditMode">
        Drag, resize, edit or delete cards. Changes save automatically.
      </p>
    </header>

    <div ref="gridRef" class="grid-stack" :class="{ 'edit-mode': isEditMode }">
      <div
        v-for="card in cards"
        :key="card.id"
        class="grid-stack-item"
        :data-card-id="card.id"
        :gs-id="card.id"
        :gs-x="card.x"
        :gs-y="card.y"
        :gs-w="card.w"
        :gs-h="card.h"
        :gs-min-w="card.minW"
        :gs-min-h="card.minH"
      >
        <div class="grid-stack-item-content">
          <header class="card-header">
            <div class="card-meta">
              <p class="card-label">{{ card.type }}</p>
              <h3>{{ card.title }}</h3>
            </div>
            <div class="card-actions" v-if="isEditMode">
              <button class="icon-button" @click.stop="openEditDialog(card)">
                ✎
              </button>
              <button
                class="icon-button danger"
                @click.stop="deleteCard(card.id)"
              >
                🗑️
              </button>
            </div>
          </header>
          <p class="card-body">{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="isDialogOpen" class="modal-overlay" @click.self="closeDialog">
      <div class="modal">
        <header>
          <h3>{{ editingCardId ? "Edit Card" : "Add Card" }}</h3>
        </header>
        <form @submit.prevent="submitCard">
          <label>
            Title
            <input
              v-model="formState.title"
              type="text"
              required
              maxlength="60"
            />
          </label>
          <label>
            Type / Category
            <input v-model="formState.type" type="text" maxlength="40" />
          </label>
          <label>
            Description
            <textarea
              v-model="formState.description"
              rows="3"
              maxlength="160"
            />
          </label>
          <div class="size-grid">
            <label>
              Width
              <select v-model.number="formState.w">
                <option v-for="w in [3, 4, 6, 12]" :key="w" :value="w">
                  {{ w }} cols
                </option>
              </select>
            </label>
            <label>
              Height
              <select v-model.number="formState.h">
                <option v-for="h in [2, 3, 4, 5]" :key="h" :value="h">
                  {{ h }} rows
                </option>
              </select>
            </label>
          </div>
          <footer class="modal-footer">
            <button type="button" class="btn ghost" @click="closeDialog">
              Cancel
            </button>
            <button type="submit" class="btn primary">
              {{ editingCardId ? "Save Changes" : "Create Card" }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import { GridStack, type GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.min.css";

type Card = {
  id: string;
  title: string;
  description: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
};

const STORAGE_KEY = "vigilance-dashboard-cards";
const gridRef = ref<HTMLElement | null>(null);
const isEditMode = ref(false);
const isDialogOpen = ref(false);
const editingCardId = ref<string | null>(null);

const defaultCards: Card[] = [
  {
    id: "welcome",
    title: "Welcome Back, Julian!",
    description: "Everything across your smart home is functioning nominally.",
    type: "Overview",
    x: 0,
    y: 0,
    w: 6,
    h: 3,
    minW: 4,
    minH: 2,
  },
  {
    id: "status",
    title: "System Status",
    description: "All core services online with redundant failover ready.",
    type: "Health",
    x: 6,
    y: 0,
    w: 3,
    h: 3,
    minW: 3,
    minH: 2,
  },
  {
    id: "devices",
    title: "Active Devices",
    description: "12 devices connected · 3 in standby · 0 alerts",
    type: "Devices",
    x: 9,
    y: 0,
    w: 3,
    h: 3,
    minW: 3,
    minH: 2,
  },
  {
    id: "temperature",
    title: "Temperature",
    description: "Indoor climate stable at 72°F · AC eco-mode engaged",
    type: "Environment",
    x: 0,
    y: 3,
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
  },
  {
    id: "humidity",
    title: "Humidity",
    description: "45% RH within ideal comfort range",
    type: "Environment",
    x: 4,
    y: 3,
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
  },
  {
    id: "network",
    title: "Network Throughput",
    description: "Down 850 Mbps · Up 640 Mbps · Latency 7 ms",
    type: "Network",
    x: 8,
    y: 3,
    w: 4,
    h: 3,
    minW: 3,
    minH: 2,
  },
];

const loadCards = (): Card[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [...defaultCards];
    const parsed = JSON.parse(saved) as Card[];
    return parsed.length ? parsed : [...defaultCards];
  } catch (error) {
    console.warn("Failed to load dashboard layout", error);
    return [...defaultCards];
  }
};

const cards = ref<Card[]>(loadCards());

const formState = reactive({
  title: "",
  type: "",
  description: "",
  w: 3,
  h: 3,
});

let grid: GridStack | null = null;

const canReset = computed(() => {
  const current = JSON.stringify(cards.value);
  const defaults = JSON.stringify(defaultCards);
  return current !== defaults;
});

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.value));
};

const syncCardsFromNodes = (nodes?: GridStackNode[]) => {
  if (!nodes?.length) return;
  const updated = cards.value.map((card) => {
    const node = nodes.find((n) => n.id === card.id);
    if (!node) return card;
    return {
      ...card,
      x: node.x ?? card.x,
      y: node.y ?? card.y,
      w: node.w ?? card.w,
      h: node.h ?? card.h,
    };
  });
  cards.value = updated;
};

const initGrid = () => {
  if (!gridRef.value) return;
  grid = GridStack.init(
    {
      column: 12,
      cellHeight: 110,
      margin: 16,
      float: true,
      disableDrag: !isEditMode.value,
      disableResize: !isEditMode.value,
    },
    gridRef.value
  );

  grid.on("change", (_event, nodes) => {
    syncCardsFromNodes(nodes);
  });

  nextTick(() => {
    grid?.load(
      cards.value.map((card) => ({
        id: card.id,
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
        minW: card.minW,
        minH: card.minH,
      }))
    );
  });
};

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
  if (!grid) return;
  if (isEditMode.value) {
    grid.enable();
  } else {
    grid.disable();
    saveState();
  }
};

const openCreateDialog = () => {
  editingCardId.value = null;
  formState.title = "";
  formState.type = "";
  formState.description = "";
  formState.w = 3;
  formState.h = 3;
  isDialogOpen.value = true;
};

const openEditDialog = (card: Card) => {
  editingCardId.value = card.id;
  formState.title = card.title;
  formState.type = card.type;
  formState.description = card.description;
  formState.w = card.w;
  formState.h = card.h;
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
};

const registerNewWidgets = async (ids: string[]) => {
  if (!grid || !gridRef.value || !ids.length) return;
  const activeGrid = grid;
  await nextTick();
  ids.forEach((id) => {
    const el = gridRef.value?.querySelector(
      `[data-card-id="${id}"]`
    ) as HTMLElement | null;
    if (el) {
      activeGrid.makeWidget(el);
    }
  });
};

const handleEscapeClose = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isDialogOpen.value) {
    closeDialog();
  }
};

const submitCard = async () => {
  const trimmedTitle = formState.title.trim();
  if (!trimmedTitle) return;

  if (editingCardId.value) {
    cards.value = cards.value.map((card) =>
      card.id === editingCardId.value
        ? {
            ...card,
            title: trimmedTitle,
            type: formState.type.trim() || "Custom",
            description: formState.description.trim(),
            w: formState.w,
            h: formState.h,
          }
        : card
    );

    if (grid && gridRef.value) {
      const el = gridRef.value.querySelector(
        `[data-card-id="${editingCardId.value}"]`
      ) as HTMLElement | null;
      if (el) {
        grid.update(el, { w: formState.w, h: formState.h });
      }
    }
  } else {
    const id = crypto.randomUUID();
    const newCard: Card = {
      id,
      title: trimmedTitle,
      type: formState.type.trim() || "Custom",
      description: formState.description.trim(),
      x: 0,
      y: 0,
      w: formState.w,
      h: formState.h,
      minW: 3,
      minH: 2,
    };
    cards.value = [...cards.value, newCard];
    await registerNewWidgets([id]);
  }

  saveState();
  closeDialog();
};

const deleteCard = (id: string) => {
  if (grid && gridRef.value) {
    const el = gridRef.value.querySelector(
      `[data-card-id="${id}"]`
    ) as HTMLElement | null;
    if (el) {
      grid.removeWidget(el);
    }
  }
  cards.value = cards.value.filter((card) => card.id !== id);
  saveState();
};

const resetLayout = () => {
  cards.value = defaultCards.map((card) => ({ ...card }));
  nextTick(() => {
    grid?.load(
      cards.value.map((card) => ({
        id: card.id,
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
        minW: card.minW,
        minH: card.minH,
      }))
    );
  });
  saveState();
};

watch(cards, () => saveState(), { deep: true });

onMounted(() => {
  initGrid();
  document.addEventListener("keydown", handleEscapeClose);
});

onBeforeUnmount(() => {
  grid?.destroy(false);
  grid = null;
  document.removeEventListener("keydown", handleEscapeClose);
});
</script>

<style scoped>
.home-view {
  padding: 2rem;
  min-height: 100vh;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.toolbar-left {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.toolbar-hint {
  font-size: 0.9rem;
  color: #94a3b8;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  color: #0f172a;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  color: #fff;
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(15, 23, 42, 0.2);
  box-shadow: none;
}

.btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.2);
}

.grid-stack {
  min-height: 600px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.15);
  border: 1px solid rgba(148, 163, 184, 0.15);
  padding-bottom: 5rem;
}

.grid-stack.edit-mode {
  border: 1px dashed rgba(37, 99, 235, 0.4);
}

:deep(.grid-stack-item) {
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

:deep(.grid-stack-item:hover) {
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);
  transform: translateY(-1px);
}

:deep(.grid-stack-item-content) {
  height: 100%;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.card-meta {
  flex: 1;
}

.card-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2563eb;
  margin-bottom: 0.15rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.card-body {
  margin: 0;
  color: #475569;
  font-size: 0.97rem;
  line-height: 1.55;
}

.card-actions {
  display: flex;
  gap: 0.35rem;
}

.icon-button {
  background: rgba(37, 99, 235, 0.12);
  border: none;
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
  color: #1e3a8a;
}

.icon-button.danger {
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.12);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 20px;
  padding: 1.6rem;
  width: min(420px, 90vw);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal h3 {
  margin: 0;
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #475569;
}

.modal input,
.modal textarea,
.modal select {
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #f8fafc;
  padding: 0.6rem;
  color: #0f172a;
}
.grid-stack.edit-mode .card-meta,
.grid-stack.edit-mode .card-body {
  user-select: none;
  pointer-events: none;
}

.grid-stack.edit-mode .card-actions button {
  pointer-events: auto;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .grid-stack {
    padding: 0.5rem;
  }

  :deep(.grid-stack-item-content) {
    padding: 1rem;
  }
}
</style>
