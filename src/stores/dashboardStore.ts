import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getDummyServices,
  getDummyWeather,
  getDummySystemStats,
  getDummyQuickLinks,
  getDummyEvents,
} from "@/utils/dummyData";
import type {
  Service,
  WeatherData,
  SystemStats,
  QuickLink,
} from "@/utils/dummyData";

export const useDashboardStore = defineStore("dashboard", () => {
  // State
  const services = ref<Service[]>([]);
  const weather = ref<WeatherData | null>(null);
  const systemStats = ref<SystemStats | null>(null);
  const quickLinks = ref<QuickLink[]>([]);
  const events = ref<any[]>([]);

  // Load dummy data
  const loadDashboardData = () => {
    services.value = getDummyServices();
    weather.value = getDummyWeather();
    systemStats.value = getDummySystemStats();
    quickLinks.value = getDummyQuickLinks();
    events.value = getDummyEvents();
  };

  // Computed
  const onlineServicesCount = computed(
    () => services.value.filter((s) => s.status === "online").length
  );

  const offlineServicesCount = computed(
    () => services.value.filter((s) => s.status === "offline").length
  );

  return {
    services,
    weather,
    systemStats,
    quickLinks,
    events,
    loadDashboardData,
    onlineServicesCount,
    offlineServicesCount,
  };
});
