<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getBackgroundFromBackend } from "./utils/backgroundHelper";
import { fetchColors, applyColorsToCSS } from "./utils/colorHelper";
import type { BackgroundImage } from "./utils/backgroundHelper";

const background = ref<BackgroundImage>({ url: "" });

onMounted(async () => {
  // Load colors from backend and apply to CSS
  try {
    const colors = await fetchColors();
    applyColorsToCSS(colors);
  } catch (error) {
    console.error("Failed to load colors:", error);
  }

  // Load background image from backend
  try {
    background.value = await getBackgroundFromBackend();
  } catch (error) {
    console.error("Failed to load background:", error);
  }
});
</script>

<template>
  <div
    class="app-container"
    :style="{ backgroundImage: `url('${background.url}')` }"
  >
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: 0;
  overflow: hidden;
}

:deep(*) {
  position: relative;
  z-index: 1;
}
</style>
