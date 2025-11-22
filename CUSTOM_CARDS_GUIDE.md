# How to Add New Custom Cards

This guide shows how to create and add new custom card types to the Vigilance dashboard.

## Architecture Overview

The card system is built on:

- **Pinia Store** (`src/stores/cardStore.ts`) - Central state management for all cards
- **Card Renderer** (`src/components/CardRenderer.vue`) - Dynamic component that renders the correct card based on type
- **Custom Cards** - Individual card components in `src/components/CustomCards/`
- **HomeView** - Grid orchestrator that uses the store to manage cards

## How Cards Work

1. Each card has:

   - `id` - Unique identifier
   - `type` - Card type name (e.g., "example", "weather")
   - `col`, `row`, `colSpan`, `rowSpan` - Position and size in grid
   - `settings` - Card-specific configuration data

2. Card configs define size constraints:
   - `defaultColSpan`, `defaultRowSpan` - Initial size
   - `minColSpan`, `maxColSpan`, `minRowSpan`, `maxRowSpan` - Size limits

## Step-by-Step: Creating a New Card Type

### Step 1: Create Your Card Component

Create a new Vue component in `src/components/CustomCards/MyNewCard.vue`:

```vue
<template>
  <div class="my-new-card">
    <div class="header">
      <h3>{{ title }}</h3>
      <button
        v-if="editMode"
        class="settings-btn"
        @click="showSettingsModal = true"
      >
        ⚙️
      </button>
    </div>
    <div class="content">
      <!-- Your card content here -->
      <p>{{ description }}</p>
    </div>

    <!-- Settings Modal (optional) -->
    <div
      v-if="showSettingsModal"
      class="settings-modal"
      @click="showSettingsModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Settings</h2>
        <label>
          Title:
          <input v-model="localSettings.title" type="text" />
        </label>
        <button @click="saveSettings">Save</button>
        <button @click="showSettingsModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCardStore } from "@/stores/cardStore";

const props = defineProps<{
  cardId: string;
  editMode: boolean;
}>();

const cardStore = useCardStore();
const showSettingsModal = ref(false);

// Get card data from store
const card = computed(() => cardStore.getCard(props.cardId));
const title = computed(() => card.value?.settings.title ?? "My Card");
const description = computed(() => card.value?.settings.description ?? "");

const localSettings = ref({
  title: "My Card",
  description: "",
});

onMounted(() => {
  if (card.value) {
    localSettings.value = { ...card.value.settings };
  }
});

function saveSettings() {
  if (card.value) {
    cardStore.updateCardSettings(props.cardId, localSettings.value);
  }
  showSettingsModal.value = false;
}
</script>

<style scoped>
.my-new-card {
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
}
/* Add your styles here */
</style>
```

### Step 2: Register the Card Type in HomeView

In `src/views/HomeView.vue`, add to the `initializeCardTypes()` function:

```typescript
function initializeCardTypes() {
  cardStore.registerCardType("example", {
    defaultColSpan: 3,
    defaultRowSpan: 3,
    minColSpan: 2,
    maxColSpan: 6,
    minRowSpan: 2,
    maxRowSpan: 6,
  });

  // Add your new card type here:
  cardStore.registerCardType("mynewcard", {
    defaultColSpan: 4,
    defaultRowSpan: 3,
    minColSpan: 2,
    maxColSpan: 6,
    minRowSpan: 2,
    maxRowSpan: 6,
  });
}
```

### Step 3: Add a Button to Create the Card

In `src/views/HomeView.vue`, add a button in the modal template and create an add function:

```vue
<!-- In template -->
<button class="type-button" @click="addMyNewCard">
  <div class="type-name">My New Card</div>
  <div class="type-description">Description of my card</div>
</button>

<!-- In script -->
function addMyNewCard() { const nextCol = Math.max( 1,
Math.max(...cardStore.cards.map((c) => c.col + c.colSpan - 1), 0) + 1 );
cardStore.addCard( "mynewcard", { col: nextCol, row: 1 }, { title: "My New
Card", description: "Initial description", } ); showAddCardModal.value = false;
}
```

### Step 4: Update CardRenderer

In `src/components/CardRenderer.vue`, import and add your card:

```vue
<script setup lang="ts">
import MyNewCard from "./CustomCards/MyNewCard.vue";
// ... existing imports
</script>

<template>
  <!-- Add this -->
  <MyNewCard
    v-if="card.type === 'mynewcard'"
    :card-id="card.id"
    :edit-mode="editMode"
  />
</template>
```

## API Reference

### useCardStore()

Methods available:

- `addCard(type, initialPosition?, settings?)` - Create new card
- `removeCard(cardId)` - Delete card
- `updateCardPosition(cardId, col, row)` - Move card
- `updateCardSize(cardId, colSpan, rowSpan)` - Resize card
- `updateCardSettings(cardId, settings)` - Update card settings
- `getCard(cardId)` - Get card instance
- `getAllCards()` - Get all cards
- `registerCardType(type, config)` - Register card type

### Card Instance Properties

```typescript
interface CardInstance {
  id: string; // Unique ID
  type: string; // Card type
  col: number; // Grid column (1-12)
  row: number; // Grid row
  colSpan: number; // Column span (1-12)
  rowSpan: number; // Row span
  settings: Record<string, any>; // Custom settings
}
```

## Key Features

✅ **Flexible**: Each card defines its own settings and UI
✅ **Easy to Expand**: Just add a new component and register it
✅ **Centralized State**: Pinia store manages all card data
✅ **Auto Positioning**: HomeView handles placement automatically
✅ **Edit Mode**: Toggle edit mode from header menu
✅ **Settings Modal**: Each card can have custom settings UI

## Example: Counter Card

See `src/components/CustomCards/ExampleCard.vue` for a complete example with:

- Custom settings modal
- Dynamic data binding from store
- Edit mode support
- Interactive content
