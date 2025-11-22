<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";

const router = useRouter();
const isDropdownOpen = ref(false);
const isNotificationsOpen = ref(false);
const currentTime = ref("");

// Dummy weather data
const weather = {
  condition: "Cloudy",
  temperature: 8,
};

// Dummy notifications
const notifications = ref([
  { id: 1, message: "New alert received", time: "5m ago" },
  { id: 2, message: "System update available", time: "1h ago" },
  { id: 3, message: "Security check completed", time: "2h ago" },
]);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  isNotificationsOpen.value = false;
};

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
  isDropdownOpen.value = false;
};

const closeAllDropdowns = () => {
  isDropdownOpen.value = false;
  isNotificationsOpen.value = false;
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  document.addEventListener("click", handleOutsideClick);
});

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const notificationsElement = document.querySelector(".notifications");
  const dropdownElement = document.querySelector(".dropdown");

  if (notificationsElement && !notificationsElement.contains(target)) {
    isNotificationsOpen.value = false;
  }
  if (dropdownElement && !dropdownElement.contains(target)) {
    isDropdownOpen.value = false;
  }
};
</script>

<template>
  <header class="header">
    <div class="container">
      <h1 class="logo" @click="router.push('/')">Vigilance</h1>

      <div class="time">{{ currentTime }}</div>

      <div class="menu-section">
        <div class="weather">
          <Icon icon="mdi:cloud" class="weather-icon" />
          <span class="weather-text"
            >{{ weather.condition }}, {{ weather.temperature }}°C</span
          >
        </div>

        <div class="notifications">
          <button class="bell-toggle" @click="toggleNotifications">
            <Icon icon="mdi:bell" class="icon" />
            <span class="notification-badge" v-if="notifications.length > 0">{{
              notifications.length
            }}</span>
          </button>

          <div class="notifications-dropdown" v-show="isNotificationsOpen">
            <div class="notifications-header">
              <h3>Notifications</h3>
            </div>
            <div class="notifications-list">
              <div
                v-if="notifications.length > 0"
                class="notification-item"
                v-for="notif in notifications"
                :key="notif.id"
              >
                <p class="notification-message">{{ notif.message }}</p>
                <span class="notification-time">{{ notif.time }}</span>
              </div>
              <div v-else class="no-notifications">
                <p>No notifications</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dropdown">
          <button class="dropdown-toggle" @click="toggleDropdown">
            <Icon icon="mdi:menu" class="menu-icon" />
          </button>

          <nav class="nav" v-show="isDropdownOpen">
            <a href="#" class="nav-link">Home</a>
            <a href="#" class="nav-link">About</a>
            <a href="#" class="nav-link">Contact</a>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #e0f5f8;
  border-bottom: 1px solid #eee;
  border-radius: 2em;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 2rem;
  padding: 0.75rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  color: #333333;
}

.time {
  color: #999;
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  text-align: center;
}

.menu-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.weather {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-icon {
  width: 24px;
  height: 24px;
  color: #666;
}

.weather-text {
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

.notifications {
  position: relative;
}

.bell-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  position: relative;
}

.icon {
  width: 24px;
  height: 24px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.bell-toggle:hover .icon {
  color: #333;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.notifications-header h3 {
  font-size: 0.95rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-message {
  color: #333;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.notification-time {
  color: #999;
  font-size: 0.8rem;
}

.no-notifications {
  padding: 2rem 1rem;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 24px;
  height: 24px;
  color: #666;
  transition: color 0.2s;
}

.dropdown-toggle:hover .menu-icon {
  color: #333;
}

.nav {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.5rem 0;
  min-width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: background-color 0.2s;
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.nav-link:hover {
  background-color: #f9f9f9;
  color: #333;
}
</style>
