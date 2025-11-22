<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";

interface Props {
  emotion?: "smiling" | "neutral" | "sad" | "scared";
  speech?: string;
}

const props = withDefaults(defineProps<Props>(), {
  emotion: "neutral",
  speech: "",
});

// --- Element Refs ---
const faceRef = ref<HTMLElement | null>(null);

// --- Reactive State ---
const pupilX = ref(0);
const pupilY = ref(0);
const isBlinking = ref(false);
const showSpeech = ref(true);

// --- Computed Props ---
const isScared = computed(() => props.emotion === "scared");

// We use SVG paths for the mouth to ensure perfectly rounded ends
const mouthPath = computed(() => {
  switch (props.emotion) {
    case "smiling":
      return "M4,8 Q16,20 28,8";
    case "sad":
      return "M4,18 Q16,6 28,18";
    case "scared":
      return "M4,13 Q10,18 16,13 T28,13";
    case "neutral":
    default:
      return "M10,13 L22,13";
  }
});

// Calculate pupil position based on mouse
const pupilStyle = computed(() => ({
  transform: `translate(${pupilX.value}px, ${pupilY.value}px)`,
}));

// --- Mouse Tracking Logic ---
const handleMouseMove = (event: MouseEvent) => {
  if (!faceRef.value) return;

  // Get face dimensions to find center
  const rect = faceRef.value.getBoundingClientRect();
  const faceCenterX = rect.left + rect.width / 2;
  const faceCenterY = rect.top + rect.height / 2;

  // Calculate distance from mouse to face center
  const dx = event.clientX - faceCenterX;
  const dy = event.clientY - faceCenterY;

  // Calculate angle
  const angle = Math.atan2(dy, dx);

  // Clamping distance so pupils don't leave the white area
  // Limit movement radius to 6px
  const maxRadius = 6;
  const distance = Math.min(maxRadius, Math.hypot(dx, dy) / 15); // Divisor dampens the movement speed

  pupilX.value = Math.cos(angle) * distance;
  pupilY.value = Math.sin(angle) * distance;
};

// --- Realistic Blinking Logic ---
let blinkTimeout: number;

const triggerBlink = () => {
  isBlinking.value = true;

  // Close eyes for 150ms
  setTimeout(() => {
    isBlinking.value = false;
  }, 150);
};

const scheduleNextBlink = () => {
  const randomDelay = Math.random() * 4000 + 2000;

  // 10% chance of a double blink for realism
  if (Math.random() > 0.9) {
    blinkTimeout = setTimeout(() => {
      triggerBlink();
      setTimeout(() => {
        triggerBlink();
        // Schedule next blink after double blink completes
        scheduleNextBlink();
      }, 300); // Second blink shortly after
    }, randomDelay);
  } else {
    blinkTimeout = setTimeout(() => {
      triggerBlink();
      scheduleNextBlink();
    }, randomDelay);
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
  scheduleNextBlink();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  clearTimeout(blinkTimeout);
});
</script>

<template>
  <div class="robot-container">
    <div v-if="speech && showSpeech" class="speech-bubble">
      <button class="close-bubble" @click="showSpeech = false">×</button>
      <p>{{ speech }}</p>
      <div class="bubble-pointer"></div>
    </div>

    <!-- Bind Ref here for tracking -->
    <div ref="faceRef" class="robot-face" :class="{ shaking: isScared }">
      <!-- Left Eye -->
      <div class="eye left" :class="{ wide: isScared, blink: isBlinking }">
        <div class="pupil" :style="pupilStyle"></div>
      </div>

      <!-- Right Eye -->
      <div class="eye right" :class="{ wide: isScared, blink: isBlinking }">
        <div class="pupil" :style="pupilStyle"></div>
      </div>

      <!-- Mouth -->
      <svg class="mouth" width="32" height="24" viewBox="0 0 32 24">
        <path
          :d="mouthPath"
          fill="none"
          stroke="#7bbbb0"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <div v-if="emotion === 'smiling'" class="blush left"></div>
      <div v-if="emotion === 'smiling'" class="blush right"></div>
    </div>
  </div>
</template>

<style scoped>
/* --- Layout --- */
.robot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: sans-serif;
  position: relative;
  padding-bottom: -20px;
}

/* --- Face Base --- */
.robot-face {
  position: relative;
  width: 100px;
  height: 80px;
  background-color: #d0f0eb;
  border-radius: 15px;
  box-shadow: 0 2px 0 rgba(123, 187, 176, 0.2);
  display: flex;
  justify-content: center;
  transition: transform 0.2s ease;
}

.robot-face.shaking {
  animation: shake 0.5s infinite;
}

/* --- Eyes --- */
.eye {
  position: absolute;
  width: 16px;
  height: 32px;
  background-color: #7bbbb0;
  border-radius: 50%;
  top: 16px;
  /* Overflow hidden ensures pupils don't slide out of the eye */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.eye.left {
  left: 16px;
}
.eye.right {
  right: 16px;
}

/* Blinking State (Controlled by JS) */
.eye.blink {
  transform: scaleY(0.1);
}

.eye.wide {
  height: 50px;
  width: 26px;
}

/* --- Pupils --- */
.pupil {
  width: 8px;
  height: 10px;
  background-color: #4a8a80; /* Darker teal/green */
  border-radius: 50%;
  /* Smooth movement */
  transition: transform 0.05s linear;
}

/* --- Mouth --- */
.mouth {
  position: absolute;
  bottom: 12px;
  transition: all 0.3s ease;
}

/* --- Blush --- */
.blush {
  position: absolute;
  width: 8px;
  height: 4px;
  background-color: rgba(123, 187, 176, 0.3);
  border-radius: 50%;
  top: 40px;
}
.blush.left {
  left: 8px;
}
.blush.right {
  right: 8px;
}

/* --- Speech Bubble --- */
.speech-bubble {
  position: absolute;
  top: calc(100% - 8px);
  left: calc(50% + 40px);
  transform: translateX(-50%);
  background-color: #fff;
  border: 2px solid #7bbbb0;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  max-width: none;
  min-width: 200px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(123, 187, 176, 0.15);
  animation: float 3s ease-in-out infinite;
  z-index: 10;
  margin-top: 18px;
  white-space: normal;
  word-wrap: break-word;
}

.speech-bubble p {
  margin: 0;
  font-size: 0.95rem;
  color: #5a8a82;
  font-weight: 600;
  line-height: 1.4;
  display: block;
}

.close-bubble {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #7bbbb0;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  line-height: 1;
}

.close-bubble:hover {
  background-color: #6aa39e;
  transform: scale(1.1);
}

.bubble-pointer {
  position: absolute;
  top: -7.5px;
  left: calc(50% - 40px);
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-top: 2px solid #7bbbb0;
  border-left: 2px solid #7bbbb0;
  transform: translateX(-50%) rotate(45deg);
}

/* --- Animations --- */
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px) rotate(-1deg);
  }
  50% {
    transform: translateX(2px) rotate(1deg);
  }
  75% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}
</style>
