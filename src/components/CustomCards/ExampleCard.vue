<template>
  <div class="example-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <button
        v-if="editMode"
        class="edit-settings-btn"
        @click="showSettingsModal = true"
        title="Edit card settings"
      >
        ⚙️
      </button>
    </div>
    <div class="card-body">
      <p>{{ description }}</p>
      <div class="counter">
        <button @click="count--">-</button>
        <span>{{ count }}</span>
        <button @click="count++">+</button>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="showSettingsModal"
      class="settings-modal"
      @click="showSettingsModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Card Settings</h2>
        <div class="settings-form">
          <label>
            Title:
            <input v-model="localSettings.title" type="text" />
          </label>
          <label>
            Description:
            <input v-model="localSettings.description" type="text" />
          </label>
        </div>
        <button class="save-btn" @click="saveSettings">Save</button>
        <button class="close-btn" @click="showSettingsModal = false">
          Close
        </button>
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
const count = ref(0);

// Get card data from store
const card = computed(() => cardStore.getCard(props.cardId));
const title = computed(() => card.value?.settings.title ?? "Example Card");
const description = computed(
  () => card.value?.settings.description ?? "This is an example card"
);

const localSettings = ref({
  title: "Example Card",
  description: "This is an example card",
});

onMounted(() => {
  if (card.value) {
    localSettings.value = {
      title: card.value.settings.title || "Example Card",
      description: card.value.settings.description || "This is an example card",
    };
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
.example-card {
  border: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--primary-light);
  color: var(--text-primary);
  padding: 1rem;
  border-radius: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.edit-settings-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.edit-settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-body p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.counter button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.counter button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.counter span {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 3rem;
  text-align: center;
}

/* Settings Modal */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  min-width: 300px;
  max-width: 500px;
  color: #333;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.settings-form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
}

.settings-form input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.settings-form input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.save-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #5568d3;
}

.close-btn {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #d0d0d0;
}
</style>
