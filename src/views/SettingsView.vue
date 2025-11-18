<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>Settings</h2>
      <p>Customize your dashboard appearance</p>
    </div>

    <!-- Image Upload Section -->
    <section class="settings-section">
      <div class="section-header">
        <Icon icon="mdi:image" :width="24" :height="24" />
        <h3>Background Image</h3>
      </div>
      <p class="section-description">Upload a custom background image for your dashboard</p>

      <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
        <Icon icon="mdi:cloud-upload-outline" :width="48" :height="48" />
        <p>Drag and drop your image here</p>
        <p class="upload-hint">or</p>
        <button class="btn-primary" @click="$refs.fileInput.click()">
          Choose File
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileSelect"
        />
      </div>

      <div v-if="uploadStatus" :class="['upload-status', uploadStatus.type]">
        {{ uploadStatus.message }}
      </div>
    </section>

    <!-- Color Customization Section -->
    <section class="settings-section">
      <div class="section-header">
        <Icon icon="mdi:palette" :width="24" :height="24" />
        <h3>Accent Colors</h3>
      </div>
      <p class="section-description">Customize the theme colors of your dashboard</p>

      <div class="colors-grid">
        <div v-for="(value, key) in colors" :key="key" class="color-item">
          <label :for="key" class="color-label">
            {{ formatLabel(key) }}
          </label>
          <div class="color-input-wrapper">
            <input
              :id="key"
              type="color"
              :value="value"
              class="color-input"
              @input="(e) => updateColor(key as keyof typeof colors, (e.target as HTMLInputElement).value)"
            />
            <span class="color-value">{{ value }}</span>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button class="btn-primary" @click="saveColors">Save Colors</button>
        <button class="btn-secondary" @click="resetColors">Reset to Default</button>
      </div>

      <div v-if="colorStatus" :class="['status-message', colorStatus.type]">
        {{ colorStatus.message }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Icon } from "@iconify/vue";
import {
  uploadBackgroundImage,
  type BackgroundImage,
} from "@/utils/backgroundHelper";
import {
  fetchColors,
  updateColors,
  applyColorsToCSS,
  getDefaultColors,
  type ColorSettings,
} from "@/utils/colorHelper";

const fileInput = ref<HTMLInputElement>();
const uploadStatus = ref<{ type: string; message: string } | null>(null);
const colorStatus = ref<{ type: string; message: string } | null>(null);
const colors = reactive<ColorSettings>(getDefaultColors());

// Load initial colors
const loadColors = async () => {
  try {
    const loaded = await fetchColors();
    Object.assign(colors, loaded);
  } catch (error) {
    console.error("Failed to load colors:", error);
  }
};

loadColors();

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  uploadStatus.value = { type: "loading", message: "Uploading..." };

  try {
    const result = await uploadBackgroundImage(file);
    uploadStatus.value = {
      type: "success",
      message: "Image uploaded successfully!",
    };
    setTimeout(() => {
      uploadStatus.value = null;
    }, 3000);
  } catch (error) {
    uploadStatus.value = {
      type: "error",
      message: "Failed to upload image. Please try again.",
    };
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files?.[0]) {
    const input = fileInput.value;
    if (input) {
      input.files = files;
      handleFileSelect({ target: input } as any);
    }
  }
};

const updateColor = (key: keyof ColorSettings, value: string) => {
  colors[key] = value;
};

const saveColors = async () => {
  try {
    await updateColors(colors);
    applyColorsToCSS(colors);
    colorStatus.value = {
      type: "success",
      message: "Colors saved successfully!",
    };
    setTimeout(() => {
      colorStatus.value = null;
    }, 3000);
  } catch (error) {
    colorStatus.value = {
      type: "error",
      message: "Failed to save colors. Please try again.",
    };
  }
};

const resetColors = () => {
  const defaults = getDefaultColors();
  Object.assign(colors, defaults);
  saveColors();
};

const formatLabel = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
</script>

<style scoped>
.settings-container {
  padding: 2rem;
}

.settings-header {
  margin-bottom: 3rem;
}

.settings-header h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.settings-header p {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
}

.settings-section {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.section-header h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

/* Upload Area */
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.upload-area:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.05);
}

.upload-area p {
  color: var(--color-text-secondary);
  margin: 0;
}

.upload-hint {
  color: var(--color-text-tertiary) !important;
}

.upload-status {
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  margin-top: 1rem;
}

.upload-status.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.upload-status.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-accent-red);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.upload-status.loading {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Colors Grid */
.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.color-input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-input {
  width: 60px;
  height: 40px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.color-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-family: monospace;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-message {
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  margin-top: 1rem;
}

.status-message.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-accent-red);
  border: 1px solid rgba(239, 68, 68, 0.3);
}
</style>
