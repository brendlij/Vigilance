# 🚀 Vigilance Dashboard - Quick Start Guide

## Installation & Running

### Prerequisites
- Bun (https://bun.sh/) - Already installed? Run `bun --version`
- Alternatively use Node 20+ with npm

### Setup

```bash
# Clone/navigate to the project
cd Vigilance

# Install dependencies
bun install

# Start development server
bun run dev
```

Open **http://localhost:5173** in your browser!

## What You'll See

A modern dashboard with:

- **Header** - Vigilance branding with search bar and settings
- **Three Widget Cards** (top row)
  - 🕐 Clock - Current time and full date
  - 🌤️ Weather - Temperature, condition, humidity, wind
  - 📊 Stats - CPU, Memory, Disk usage bars
- **Quick Links** - 6 quick access buttons to popular sites
- **Services Grid** - 6 service cards showing status

## Customizing

### Change Colors

Edit `src/style.css` in the `:root` selector:

```css
:root {
  --color-primary: #3b82f6;  /* Change this blue */
  --color-secondary: #8b5cf6;  /* Change this purple */
  --color-accent-green: #10b981;  /* Status colors */
  /* ... etc ... */
}
```

### Add/Edit Services

Edit `src/utils/dummyData.ts`:

```typescript
export const getDummyServices = (): Service[] => [
  {
    id: 'my-service',
    name: 'My Service',
    status: 'online',  // or 'offline'
    icon: 'mdi:server',
    description: 'What it does',
    uptime: 99.9,
  },
  // Add more...
];
```

### Add More Quick Links

In `src/utils/dummyData.ts`:

```typescript
export const getDummyQuickLinks = (): QuickLink[] => [
  {
    id: 'my-link',
    name: 'My Site',
    icon: 'mdi:web',
    url: 'https://example.com',
    color: 'from-blue-500 to-blue-600',  // gradient colors
  },
  // Add more...
];
```

### Update Weather/Stats

Replace the dummy data functions with API calls:

```typescript
export const getDummyWeather = async (): Promise<WeatherData> => {
  const response = await fetch('https://api.weather.com/...');
  return response.json();
};
```

## File Structure

```
Vigilance/
├── src/
│   ├── components/          # Vue components
│   │   ├── widgets/        # Dashboard widgets
│   │   ├── QuickLink.vue
│   │   └── ServiceCard.vue
│   ├── views/              # Page views
│   │   └── HomeView.vue    # Main dashboard
│   ├── stores/             # Pinia state
│   │   └── dashboardStore.ts
│   ├── utils/              # Utilities
│   │   └── dummyData.ts    # Mock data
│   ├── router/             # Vue Router
│   ├── style.css           # Global styles
│   ├── main.ts             # App entry
│   └── App.vue             # Root component
├── index.html              # HTML entry
├── vite.config.ts          # Build config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Available Commands

```bash
# Development
bun run dev          # Start dev server

# Production
bun run build        # Build for production
bun run preview      # Preview production build
bun run type-check   # Check TypeScript

# Using npm instead?
npm install
npm run dev
npm run build
```

## Icons

All icons come from [Material Design Icons](https://materialdesignicons.com/) via Iconify.

Use icon names like: `mdi:server`, `mdi:cpu-64-bit`, `mdi:database`, etc.

To find icons: https://icon-sets.iconify.design/?query=server

## CSS Variables

All styling uses CSS variables defined in `src/style.css`:

- **Colors**: `--color-primary`, `--color-secondary`, `--color-accent-*`
- **Spacing**: `--spacing-xs` through `--spacing-2xl`
- **Typography**: `--font-size-*`, `--font-weight-*`
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`

Change any variable to instantly update the whole UI!

## Common Tasks

### Add a New Widget

1. Create `src/components/widgets/MyWidget.vue`
2. Add to `src/views/HomeView.vue` template
3. Add data to `dashboardStore.ts` if needed

### Connect Real API

1. Add API function to `src/utils/api.ts` (create this file)
2. Update `dashboardStore.ts` to call API instead of dummy data
3. Update component `onMounted` to fetch real data

### Deploy to Production

```bash
bun run build
# Upload 'dist' folder to your server
```

## Troubleshooting

### Port 5173 already in use?
```bash
bun run dev -- --port 3000
```

### CSS not updating?
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser cache settings

### TypeScript errors?
```bash
bun run type-check
```

## Next Steps

1. ✅ Customize colors to match your brand
2. ✅ Add your actual services
3. ✅ Connect real APIs for weather/stats
4. ✅ Add more pages with Vue Router
5. ✅ Deploy to your server

Happy monitoring! 🎉
