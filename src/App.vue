<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getLocalBackground } from "./utils/backgroundHelper";
import type { BackgroundImage } from "./utils/backgroundHelper";

const background = ref<BackgroundImage>({ url: "" });

onMounted(() => {
  background.value = getLocalBackground();
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
