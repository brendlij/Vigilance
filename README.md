# Vigilance 🛡️

A modern, transparent homelab dashboard for monitoring services, servers, and everyday needs. Built with Vue 3, Vite, and pure CSS with custom variables.

## Features

✨ **Modern UI Design**

- Clean, transparent glass-morphism aesthetic
- Responsive grid layouts
- Smooth animations and transitions
- Dark theme optimized for extended viewing

📊 **Dashboard Widgets**

- Real-time clock with date display
- Weather information widget
- System stats (CPU, Memory, Disk) with progress bars
- Quick access links (Google, YouTube, GitHub, etc.)
- Service status cards with online/offline indicators

🎨 **Design System**

- CSS custom variables for easy customization
- Comprehensive color palette (primary, secondary, accents)
- Consistent spacing and typography scales
- Glass-morphism components
- Icon support via Iconify/MDI

🏗️ **Architecture**

- Vue 3 Composition API
- Pinia for state management
- Vue Router for navigation
- Type-safe with TypeScript
- Centralized dummy data helper for easy backend integration

## Project Setup

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- Node.js 18+ (or Bun's bundled runtime)

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
src/
├── components/
│   ├── widgets/
│   │   ├── ClockWidget.vue        # Real-time clock display
│   │   ├── WeatherWidget.vue      # Weather information
│   │   └── SystemStatsWidget.vue  # System resource monitoring
│   ├── QuickLink.vue              # Quick access link cards
│   └── ServiceCard.vue            # Service status cards
├── views/
│   └── HomeView.vue               # Main dashboard page
├── stores/
│   └── dashboardStore.ts          # Pinia store for dashboard state
├── utils/
│   └── dummyData.ts               # Mock data & API definitions
├── router/
│   └── index.ts                   # Vue Router configuration
├── style.css                       # Global CSS with variables
├── main.ts                         # Vue app entry point
└── App.vue                         # Root component
```

## Customization

### Colors

Edit CSS variables in `src/style.css` root selector to customize the color scheme:

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-light: #60a5fa;
  --color-secondary: #8b5cf6;
  --color-accent-orange: #f97316;
  --color-accent-green: #10b981;
  /* ... more colors ... */
}
```

### Dummy Data

Replace mock data with real API calls in `src/utils/dummyData.ts`:

```typescript
// Change these functions to fetch from your backend
export const getDummyServices = (): Service[] => {
  // Replace with actual API call
};

export const getDummyWeather = (): WeatherData => {
  // Replace with weather API integration
};
```

### Adding New Widgets

1. Create a new component in `src/components/widgets/`
2. Import and use it in `HomeView.vue`
3. Add data to Pinia store in `src/stores/dashboardStore.ts`

## Technologies Used

- **Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Iconify + Material Design Icons
- **Package Manager**: Bun
- **Language**: TypeScript
- **Styling**: Pure CSS with custom variables

## Design Highlights

- **Glass Morphism**: Frosted glass effect cards with backdrop blur
- **Responsive**: Auto-fit grid layouts that adapt to screen size
- **Performant**: No heavy CSS frameworks, minimal bundle size
- **Accessible**: Semantic HTML with proper color contrast
- **Themeable**: Complete CSS variable system for easy customization

## Future Enhancements

- Real-time data updates with WebSocket
- Service control actions (start/stop/restart)
- Notification system
- User authentication & settings
- Multiple dashboard views
- Data persistence & history
- Mobile app version

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```
