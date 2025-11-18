/**
 * Dummy Data Helper
 * Centralized location for all mock data
 * Replace API calls in components without major refactoring needed
 */

export interface Service {
  id: string;
  name: string;
  status: "online" | "offline" | "loading";
  icon: string;
  description: string;
  uptime?: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
}

export interface QuickLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

// Services data
export const getDummyServices = (): Service[] => [
  {
    id: "docker",
    name: "Docker",
    status: "online",
    icon: "mdi:docker",
    description: "3 containers running",
    uptime: 99.8,
  },
  {
    id: "plex",
    name: "Plex Media Server",
    status: "online",
    icon: "mdi:play-circle",
    description: "2 streams active",
    uptime: 99.5,
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    status: "online",
    icon: "mdi:television-play",
    description: "5 users",
    uptime: 100,
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    status: "online",
    icon: "mdi:cloud-upload",
    description: "342 GB used",
    uptime: 99.2,
  },
  {
    id: "vpn",
    name: "WireGuard VPN",
    status: "online",
    icon: "mdi:shield-vpn",
    description: "1 peer connected",
    uptime: 99.9,
  },
  {
    id: "db",
    name: "PostgreSQL",
    status: "offline",
    icon: "mdi:database",
    description: "Connection failed",
    uptime: 95.1,
  },
];

// Weather data
export const getDummyWeather = (): WeatherData => ({
  temp: 22,
  condition: "Partly Cloudy",
  icon: "mdi:cloud",
  humidity: 65,
  windSpeed: 12,
  location: "San Francisco, CA",
});

// System stats
export const getDummySystemStats = (): SystemStats => ({
  cpuUsage: 35,
  memoryUsage: 62,
  diskUsage: 78,
  networkIn: 450,
  networkOut: 230,
});

// Quick links
export const getDummyQuickLinks = (): QuickLink[] => [
  {
    id: "google",
    name: "Google",
    icon: "mdi:google",
    url: "https://google.com",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "mdi:youtube",
    url: "https://youtube.com",
    color: "from-red-500 to-red-600",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "mdi:github",
    url: "https://github.com",
    color: "from-gray-700 to-gray-800",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: "mdi:reddit",
    url: "https://reddit.com",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "docker-hub",
    name: "Docker Hub",
    icon: "mdi:docker",
    url: "https://hub.docker.com",
    color: "from-blue-400 to-blue-500",
  },
  {
    id: "stack-overflow",
    name: "Stack Overflow",
    icon: "mdi:stack-overflow",
    url: "https://stackoverflow.com",
    color: "from-orange-400 to-orange-500",
  },
];

// Dummy logs/events
export const getDummyEvents = () => [
  {
    id: 1,
    type: "info",
    title: "Backup completed",
    description: "Daily backup finished successfully",
    timestamp: new Date(Date.now() - 3600000),
    icon: "mdi:backup-restore",
  },
  {
    id: 2,
    type: "warning",
    title: "High memory usage",
    description: "Memory usage at 85%",
    timestamp: new Date(Date.now() - 7200000),
    icon: "mdi:memory",
  },
  {
    id: 3,
    type: "success",
    title: "Update available",
    description: "Docker containers updated",
    timestamp: new Date(Date.now() - 10800000),
    icon: "mdi:check-circle",
  },
];
