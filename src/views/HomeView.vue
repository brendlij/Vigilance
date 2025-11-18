<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <Icon
          icon="mdi:shield-account-variant"
          :width="32"
          :height="32"
          style="color: var(--color-primary-light)"
        />
        <h1 class="sidebar-title">Vigilance</h1>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item active">
          <Icon icon="mdi:view-dashboard" :width="20" :height="20" />
          <span>Dashboard</span>
        </router-link>
        <a href="#" class="nav-item">
          <Icon icon="mdi:server-network" :width="20" :height="20" />
          <span>Services</span>
        </a>
        <a href="#" class="nav-item">
          <Icon icon="mdi:chart-line" :width="20" :height="20" />
          <span>Analytics</span>
        </a>
        <a href="#" class="nav-item">
          <Icon icon="mdi:bell-outline" :width="20" :height="20" />
          <span>Alerts</span>
        </a>
        <router-link to="/settings" class="nav-item">
          <Icon icon="mdi:cog-outline" :width="20" :height="20" />
          <span>Settings</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-badge">
          <Icon icon="mdi:account-circle" :width="24" :height="24" />
          <span>Admin</span>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="main-wrapper">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-search">
          <Icon icon="mdi:magnify" :width="18" :height="18" />
          <input
            type="text"
            placeholder="Search services, status..."
            class="search-input"
          />
        </div>

        <div class="topbar-actions">
          <button class="icon-btn">
            <Icon icon="mdi:bell-outline" :width="20" :height="20" />
          </button>
          <button class="icon-btn">
            <Icon icon="mdi:refresh" :width="20" :height="20" />
          </button>
          <button class="icon-btn">
            <Icon icon="mdi:menu" :width="20" :height="20" />
          </button>
        </div>
      </header>

      <!-- Main content -->
      <main class="content">
        <!-- Hero section with quick stats -->
        <section class="hero-section">
          <div class="hero-title">
            <h2>Dashboard</h2>
            <p class="hero-subtitle">
              Monitoring {{ onlineServicesCount }} of
              {{ services.length }} services online
            </p>
          </div>
          <div class="quick-stats">
            <div class="stat-card">
              <div
                class="stat-icon"
                style="background: rgba(16, 185, 129, 0.1)"
              >
                <Icon
                  icon="mdi:check-circle"
                  :width="24"
                  :height="24"
                  style="color: var(--color-accent-green)"
                />
              </div>
              <div>
                <div class="stat-value">{{ onlineServicesCount }}</div>
                <div class="stat-label">Online</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1)">
                <Icon
                  icon="mdi:alert-circle"
                  :width="24"
                  :height="24"
                  style="color: var(--color-accent-red)"
                />
              </div>
              <div>
                <div class="stat-value">
                  {{ services.length - onlineServicesCount }}
                </div>
                <div class="stat-label">Offline</div>
              </div>
            </div>
            <div class="stat-card">
              <div
                class="stat-icon"
                style="background: rgba(59, 130, 246, 0.1)"
              >
                <Icon
                  icon="mdi:server"
                  :width="24"
                  :height="24"
                  style="color: var(--color-primary)"
                />
              </div>
              <div>
                <div class="stat-value">{{ services.length }}</div>
                <div class="stat-label">Total</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Widgets grid -->
        <section class="widgets-section">
          <h3 class="section-title">System Overview</h3>
          <div class="widgets-grid">
            <ClockWidget />
            <WeatherWidget />
            <SystemStatsWidget />
          </div>
        </section>

        <!-- Quick Links -->
        <section class="quick-links-section">
          <h3 class="section-title">Quick Access</h3>
          <div class="quick-links-grid">
            <QuickLink v-for="link in quickLinks" :key="link.id" :link="link" />
          </div>
        </section>

        <!-- Services section -->
        <section class="services-section">
          <div class="services-header">
            <h3 class="section-title">Services Status</h3>
            <div class="filter-buttons">
              <button class="filter-btn active">All</button>
              <button class="filter-btn">Online</button>
              <button class="filter-btn">Offline</button>
            </div>
          </div>
          <div class="services-grid">
            <ServiceCard
              v-for="service in services"
              :key="service.id"
              :service="service"
            />
          </div>
        </section>
      </main>
    </div>
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
.dashboard-container {
  display: flex;
  height: 100vh;
  background: transparent;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  z-index: 20;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(
    135deg,
    var(--color-primary-light),
    var(--color-secondary-light)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  color: var(--color-text-primary);
  background: rgba(59, 130, 246, 0.1);
}

.nav-item.active {
  color: var(--color-primary-light);
  background: rgba(59, 130, 246, 0.15);
  border-left-color: var(--color-primary-light);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Main wrapper */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Top bar */
.topbar {
  height: 60px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 2rem;
  position: relative;
  z-index: 10;
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 0.5rem 1rem;
  color: var(--color-text-muted);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Main content */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  z-index: 5;
}

/* Hero section */
.hero-section {
  margin-bottom: 3rem;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.hero-title h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.hero-subtitle {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all var(--transition-base);
}

.stat-card:hover {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: var(--font-weight-medium);
}

/* Sections */
.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.widgets-section,
.quick-links-section,
.services-section {
  margin-bottom: 3rem;
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

/* Services section */
.services-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Scrollbar */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
