<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";

import RobotFace from "./RobotFace.vue";
import { useEditMode } from "@/composables/useEditMode";

const router = useRouter();
const { editMode, toggleEditMode } = useEditMode();
const isDropdownOpen = ref(false);
const isNotificationsOpen = ref(false);
const isWeatherOpen = ref(false);
const isSettingsOpen = ref(false);
const currentTime = ref("");

// Settings
const settingsCity = ref("London");
const settingsApiKey = ref("");

// Weather data
const weather = ref({
  city: "Loading...",
  country: "",
  temp: 0,
  feels_like: 0,
  humidity: 0,
  pressure: 0,
  description: "Loading...",
  icon: "02d",
  wind_speed: 0,
});

const weatherLoading = ref(true);
const weatherError = ref("");

// Dummy notifications
const notifications = ref([
  { id: 1, message: "New alert received", time: "5m ago" },
  { id: 2, message: "System update available", time: "1h ago" },
  { id: 3, message: "Security check completed", time: "2h ago" },
]);

const fetchWeather = async (location: string = "London") => {
  weatherLoading.value = true;
  weatherError.value = "";

  const apiKey = settingsApiKey.value;
  if (!apiKey) {
    weatherError.value = "API key not configured. Add one in settings.";
    weatherLoading.value = false;
    weather.value.city = "No API Key";
    weather.value.description = "Configure in settings";
    return;
  }

  try {
    let url = `http://localhost:8080/weather?location=${encodeURIComponent(
      location
    )}&apiKey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      weatherError.value = data.error || "Failed to fetch weather data";
      return;
    }

    weather.value = data;
  } catch (error) {
    weatherError.value = "Failed to connect to weather service";
    console.error("Weather fetch error:", error);
  } finally {
    weatherLoading.value = false;
  }
};

const getWeatherIcon = (iconCode: string) => {
  const iconMap: { [key: string]: string } = {
    "01d": "mdi:weather-sunny",
    "01n": "mdi:weather-night",
    "02d": "mdi:weather-partly-cloudy",
    "02n": "mdi:weather-night-partly-cloudy",
    "03d": "mdi:weather-cloudy",
    "03n": "mdi:weather-cloudy",
    "04d": "mdi:weather-cloudy",
    "04n": "mdi:weather-cloudy",
    "09d": "mdi:weather-rainy",
    "09n": "mdi:weather-rainy",
    "10d": "mdi:weather-rainy",
    "10n": "mdi:weather-rainy",
    "11d": "mdi:weather-lightning",
    "11n": "mdi:weather-lightning",
    "13d": "mdi:weather-snowy",
    "13n": "mdi:weather-snowy",
    "50d": "mdi:weather-fog",
    "50n": "mdi:weather-fog",
  };
  return iconMap[iconCode] || "mdi:cloud";
};

const openSettings = () => {
  isSettingsOpen.value = true;
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};

const saveSettings = () => {
  localStorage.setItem("weatherCity", settingsCity.value);
  localStorage.setItem("weatherApiKey", settingsApiKey.value);
  fetchWeather(settingsCity.value);
  closeSettings();
};

const loadSettings = () => {
  const savedCity = localStorage.getItem("weatherCity");
  const savedApiKey = localStorage.getItem("weatherApiKey");
  if (savedCity) settingsCity.value = savedCity;
  if (savedApiKey) settingsApiKey.value = savedApiKey;
};

const handleEditModeToggle = () => {
  toggleEditMode();
  isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  isNotificationsOpen.value = false;
  isWeatherOpen.value = false;
};

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
  isDropdownOpen.value = false;
  isWeatherOpen.value = false;
};

const toggleWeather = () => {
  isWeatherOpen.value = !isWeatherOpen.value;
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
  loadSettings();
  // Fetch weather if API key is configured
  if (settingsApiKey.value) {
    fetchWeather(settingsCity.value);
  } else {
    // If no API key yet, show placeholder
    weatherLoading.value = false;
    weather.value.city = "API Key needed";
    weather.value.description = "Add in settings";
  }
  document.addEventListener("click", handleOutsideClick);
});

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const notificationsElement = document.querySelector(".notifications");
  const dropdownElement = document.querySelector(".dropdown");
  const weatherElement = document.querySelector(".weather-section");
  const settingsElement = document.querySelector(".settings-modal");
  const settingsBtn = (event.target as HTMLElement).closest(".settings-btn");

  // Don't close if clicking the settings button
  if (settingsBtn) {
    return;
  }

  if (notificationsElement && !notificationsElement.contains(target)) {
    isNotificationsOpen.value = false;
  }
  if (dropdownElement && !dropdownElement.contains(target)) {
    isDropdownOpen.value = false;
  }
  if (
    weatherElement &&
    !weatherElement.contains(target) &&
    !settingsElement?.contains(target)
  ) {
    isWeatherOpen.value = false;
  }
  if (settingsElement && !settingsElement.contains(target)) {
    isSettingsOpen.value = false;
  }
};
</script>

<template>
  <header class="header">
    <div class="container">
      <RobotFace emotion="smiling" />
      <h1 class="logo" @click="router.push('/')">Vigilance</h1>

      <div class="time">{{ currentTime }}</div>

      <div class="menu-section">
        <div class="weather-section">
          <button class="weather-toggle" @click="toggleWeather">
            <Icon :icon="getWeatherIcon(weather.icon)" class="weather-icon" />
            <span class="weather-text"
              >{{ weather.description }}, {{ Math.round(weather.temp) }}°C</span
            >
          </button>

          <div class="weather-dropdown" v-show="isWeatherOpen">
            <div class="weather-header">
              <h3>{{ weather.city }}, {{ weather.country }}</h3>
              <button class="settings-btn" @click="openSettings">
                <Icon icon="mdi:cog" />
              </button>
            </div>
            <div
              class="weather-content"
              v-if="!weatherLoading && !weatherError"
            >
              <div class="weather-main">
                <Icon
                  :icon="getWeatherIcon(weather.icon)"
                  class="weather-icon-large"
                />
                <div class="weather-temp">
                  <div class="temp-display">
                    {{ Math.round(weather.temp) }}°C
                  </div>
                  <div class="temp-description">{{ weather.description }}</div>
                </div>
              </div>
              <div class="weather-details">
                <div class="weather-detail">
                  <Icon icon="mdi:water-percent" class="detail-icon" />
                  <span class="detail-label">Humidity</span>
                  <span class="detail-value">{{ weather.humidity }}%</span>
                </div>
                <div class="weather-detail">
                  <Icon icon="mdi:weather-wind" class="detail-icon" />
                  <span class="detail-label">Wind</span>
                  <span class="detail-value"
                    >{{ Math.round(weather.wind_speed) }} m/s</span
                  >
                </div>
                <div class="weather-detail">
                  <Icon icon="mdi:gauge" class="detail-icon" />
                  <span class="detail-label">Pressure</span>
                  <span class="detail-value">{{ weather.pressure }} hPa</span>
                </div>
                <div class="weather-detail">
                  <Icon icon="mdi:thermometer" class="detail-icon" />
                  <span class="detail-label">Feels Like</span>
                  <span class="detail-value"
                    >{{ Math.round(weather.feels_like) }}°C</span
                  >
                </div>
              </div>
            </div>
            <div class="weather-loading" v-else-if="weatherLoading">
              <Icon icon="mdi:loading" class="loading-icon" />
              <p>Loading weather...</p>
            </div>
            <div class="weather-error" v-else>
              <Icon icon="mdi:alert-circle" class="error-icon" />
              <p class="error-message">{{ weatherError }}</p>
              <button class="retry-btn" @click="fetchWeather(settingsCity)">
                Retry
              </button>
            </div>
          </div>
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
            <hr class="nav-divider" />
            <button class="nav-link edit-toggle" @click="handleEditModeToggle">
              {{ editMode ? "Finish" : "Edit" }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </header>

  <!-- Settings Modal -->
  <div class="settings-modal" v-if="isSettingsOpen">
    <div class="settings-content">
      <div class="settings-header">
        <h2>Weather Settings</h2>
        <button class="close-settings" @click="closeSettings">
          <Icon icon="mdi:close" />
        </button>
      </div>
      <div class="settings-body">
        <div class="setting-group">
          <label for="city">City</label>
          <input
            id="city"
            v-model="settingsCity"
            type="text"
            placeholder="Enter city name"
            class="setting-input"
          />
        </div>
        <div class="setting-group">
          <label for="apiKey">OpenWeatherMap API Key</label>
          <input
            id="apiKey"
            v-model="settingsApiKey"
            type="password"
            placeholder="Enter your API key"
            class="setting-input"
          />
          <small class="help-text"
            >Get one at
            <a href="https://openweathermap.org/api" target="_blank"
              >openweathermap.org</a
            ></small
          >
        </div>
      </div>
      <div class="settings-footer">
        <button class="btn-cancel" @click="closeSettings">Cancel</button>
        <button class="btn-save" @click="saveSettings">Save Settings</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  background: var(--primary);
  border: none;
  border-radius: 20px;
  position: fixed;
  top: 1em;
  left: clamp(1rem, 2vw, 1.75rem);
  right: clamp(1rem, 2vw, 1.75rem);
  z-index: 1001;
  width: calc(100% - 2 * clamp(1rem, 2vw, 1.75rem));
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 2rem;
  padding: 0.4rem 0;
  gap: 2rem;
  height: 60px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.time {
  color: var(--text-light);
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

.weather-section {
  position: relative;
}

.weather-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  transition: color 0.2s;
}

.weather-toggle:hover {
  color: var(--accent-light);
}

.weather-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.weather-icon-large {
  width: 48px;
  height: 48px;
  color: var(--accent-light);
}

.weather-text {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.weather-dropdown {
  position: absolute;
  top: 100%;
  left: -100px;
  background: var(--primary);
  border: none;
  border-radius: 20px;
  width: 350px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.weather-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.weather-header h3 {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.weather-content {
  padding: 1rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.weather-temp {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.temp-display {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.temp-description {
  font-size: 0.85rem;
  color: #666;
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.weather-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
}

.detail-icon {
  width: 20px;
  height: 20px;
  color: #666;
}

.detail-label {
  font-size: 0.75rem;
  color: #999;
  font-weight: 500;
}

.detail-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
}

.weather-loading,
.weather-error {
  padding: 1rem;
  text-align: center;
  color: #666;
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
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.2s;
}

.bell-toggle:hover .icon {
  color: var(--accent-light);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent);
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
  background: var(--primary);
  border: none;
  border-radius: 20px;
  width: 300px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.notifications-header h3 {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

.weather-loading {
  padding: 2rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #666;
}

.loading-icon {
  width: 32px;
  height: 32px;
  color: #0891b2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.weather-error {
  padding: 2rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #dc2626;
}

.error-icon {
  width: 32px;
  height: 32px;
  color: #dc2626;
}

.error-message {
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

.retry-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dc2626;
  background-color: #fff;
  color: #dc2626;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.retry-btn:hover {
  background-color: #fef2f2;
  border-color: #b91c1c;
  color: #b91c1c;
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
  color: var(--text-primary);
  transition: color 0.2s;
}

.dropdown-toggle:hover .menu-icon {
  color: var(--accent-light);
}

.nav {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--primary);
  border: none;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.5rem 0;
  min-width: 150px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.nav-link {
  text-decoration: none;
  color: var(--text-light);
  font-weight: 500;
  transition: background-color 0.2s;
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  width: 100%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
}

.nav-link.edit-toggle {
  color: var(--text-light);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-link.edit-toggle:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
}

.nav-divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0.25rem 0;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.settings-btn:hover {
  color: #333;
}

/* Settings Modal */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.settings-content {
  background-color: #fff;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.settings-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-settings {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.close-settings:hover {
  color: #333;
}

.close-settings svg {
  width: 24px;
  height: 24px;
}

.settings-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.setting-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.setting-input:focus {
  outline: none;
  border-color: #0891b2;
}

.help-text {
  font-size: 0.8rem;
  color: #999;
}

.help-text a {
  color: #0891b2;
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}

.settings-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-save {
  background-color: #0891b2;
  color: white;
}

.btn-save:hover {
  background-color: #0577a1;
}
</style>
