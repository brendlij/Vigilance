<template>
  <div class="h-screen w-screen overflow-hidden">
    <!-- Animated gradient background -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            to bottom right,
            var(--color-bg-dark),
            #0e1b3c,
            var(--color-bg-dark)
          );
        "
      ></div>
      <div
        class="absolute animate-float"
        style="
          top: 0;
          left: 25%;
          width: 24rem;
          height: 24rem;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 70%
          );
          border-radius: 50%;
        "
      ></div>
      <div
        class="absolute animate-float"
        style="
          bottom: 0;
          right: 25%;
          width: 24rem;
          height: 24rem;
          background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.1) 0%,
            transparent 70%
          );
          border-radius: 50%;
          animation-delay: 2s;
        "
      ></div>
    </div>

    <!-- Header with search -->
    <header
      class="relative z-10"
      style="
        border-bottom: 1px solid var(--color-border);
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.05)
        );
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      "
    >
      <div
        style="
          max-width: 80rem;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="flex items-center gap-3">
          <Icon
            icon="mdi:shield-account-variant"
            :width="28"
            :height="28"
            style="color: var(--color-primary-light)"
          />
          <h1
            class="text-2xl font-bold"
            style="
              background: linear-gradient(
                135deg,
                var(--color-primary-light),
                var(--color-secondary-light)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            "
          >
            Vigilance
          </h1>
        </div>

        <!-- Search bar -->
        <div style="flex: 1; max-width: 28rem; margin: 0 1.5rem">
          <div class="relative">
            <Icon
              icon="mdi:magnify"
              class="absolute"
              style="
                left: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--color-text-muted);
              "
            />
            <input
              type="text"
              placeholder="Search services..."
              class="input"
              style="padding-left: 2.5rem; width: 100%"
            />
          </div>
        </div>

        <!-- Header icons -->
        <div class="flex items-center" style="gap: 1rem">
          <button class="btn" style="padding: 0.5rem">
            <Icon
              icon="mdi:bell-outline"
              :width="20"
              :height="20"
              style="color: var(--color-text-secondary)"
            />
          </button>
          <button class="btn" style="padding: 0.5rem">
            <Icon
              icon="mdi:cog-outline"
              :width="20"
              :height="20"
              style="color: var(--color-text-secondary)"
            />
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main
      class="relative z-10 overflow-y-auto"
      style="height: calc(100vh - 73px)"
    >
      <div style="max-width: 80rem; margin: 0 auto; padding: 2rem 1.5rem">
        <!-- Top widgets row -->
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          "
        >
          <!-- Clock widget -->
          <ClockWidget />

          <!-- Weather widget -->
          <WeatherWidget />

          <!-- System stats widget -->
          <SystemStatsWidget />
        </div>

        <!-- Quick links section -->
        <section style="margin-bottom: 2rem">
          <h2
            class="text-xl font-semibold flex items-center"
            style="margin-bottom: 1rem; color: var(--color-text-primary)"
          >
            <Icon
              icon="mdi:lightning-bolt"
              style="color: var(--color-accent-yellow); margin-right: 0.5rem"
            />
            Quick Links
          </h2>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 1rem;
            "
          >
            <QuickLink v-for="link in quickLinks" :key="link.id" :link="link" />
          </div>
        </section>

        <!-- Services grid -->
        <section>
          <div
            class="flex items-center justify-between"
            style="margin-bottom: 1rem"
          >
            <h2
              class="text-xl font-semibold flex items-center"
              style="color: var(--color-text-primary)"
            >
              <Icon
                icon="mdi:server-network"
                style="color: var(--color-accent-green); margin-right: 0.5rem"
              />
              Services
              <span
                class="text-sm font-normal"
                style="color: var(--color-text-tertiary); margin-left: 0.5rem"
              >
                {{ onlineServicesCount }}/{{ services.length }} online
              </span>
            </h2>
            <div class="flex" style="gap: 0.5rem">
              <button class="btn">All</button>
              <button class="btn">Offline</button>
            </div>
          </div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 1.5rem;
            "
          >
            <ServiceCard
              v-for="service in services"
              :key="service.id"
              :service="service"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useDashboardStore } from "@/stores/dashboardStore";
import ClockWidget from "@/components/widgets/ClockWidget.vue";
import WeatherWidget from "@/components/widgets/WeatherWidget.vue";
import SystemStatsWidget from "@/components/widgets/SystemStatsWidget.vue";
import QuickLink from "@/components/QuickLink.vue";
import ServiceCard from "@/components/ServiceCard.vue";

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.loadDashboardData();
});

const services = computed(() => dashboardStore.services);
const quickLinks = computed(() => dashboardStore.quickLinks);
const onlineServicesCount = computed(() => dashboardStore.onlineServicesCount);
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
