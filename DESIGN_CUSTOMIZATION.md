# 🎨 Vigilance Design Customization Guide

## Color System

All colors are defined as CSS variables in `src/style.css`. Edit them in the `:root` selector to instantly change the entire dashboard appearance.

### Primary Colors

```css
--color-primary: #3b82f6; /* Main blue accent */
--color-primary-light: #60a5fa; /* Lighter blue for hover */
--color-primary-dark: #1e40af; /* Darker blue for pressed */
```

**Used for:** Links, primary buttons, interactive elements

### Secondary Colors

```css
--color-secondary: #8b5cf6; /* Purple accent */
--color-secondary-light: #a78bfa; /* Lighter purple */
--color-secondary-dark: #6d28d9; /* Darker purple */
```

**Used for:** Secondary elements, header gradient

### Accent Colors

```css
--color-accent-orange: #f97316; /* Disk usage, alerts */
--color-accent-green: #10b981; /* Online status */
--color-accent-red: #ef4444; /* Offline status, errors */
--color-accent-yellow: #eab308; /* Weather, highlights */
--color-accent-purple: #a855f7; /* Stats widget */
```

**Used for:** Status indicators, progress bars, category colors

### Background Colors

```css
--color-bg-dark: #0f172a; /* Main background */
--color-bg-darker: #020617; /* Darker overlay background */
--color-bg-card: rgba(15, 23, 42, 0.8); /* Card background */
```

### Text Colors

```css
--color-text-primary: #ffffff; /* Main text */
--color-text-secondary: rgba(255, 255, 255, 0.7); /* Secondary text */
--color-text-tertiary: rgba(255, 255, 255, 0.5); /* Tertiary text */
--color-text-muted: rgba(255, 255, 255, 0.4); /* Muted text */
```

### Border Colors

```css
--color-border: rgba(255, 255, 255, 0.1); /* Light border */
--color-border-light: rgba(255, 255, 255, 0.2); /* Medium border */
--color-border-hover: rgba(255, 255, 255, 0.3); /* Hover border */
```

### Glass Effect

```css
--color-glass-light: rgba(255, 255, 255, 0.1); /* Light glass */
--color-glass-lighter: rgba(255, 255, 255, 0.05); /* Extra light */
```

## Pre-made Color Schemes

### Dark Mode (Current Default)

Already configured - perfect for evening/night use

### Light Mode

To switch to light mode, replace the colors:

```css
:root {
  --color-bg-dark: #f8f9fa;
  --color-bg-darker: #ffffff;
  --color-text-primary: #1f2937;
  --color-text-secondary: rgba(31, 46, 55, 0.7);
  --color-text-tertiary: rgba(31, 46, 55, 0.5);
  --color-text-muted: rgba(31, 46, 55, 0.4);
  --color-border: rgba(31, 46, 55, 0.1);
  --color-border-light: rgba(31, 46, 55, 0.2);
  --color-border-hover: rgba(31, 46, 55, 0.3);
}
```

### Ocean Theme

Blue-dominant with cyan accents:

```css
:root {
  --color-primary: #0369a1;
  --color-primary-light: #0284c7;
  --color-secondary: #06b6d4;
  --color-accent-green: #06d6a0;
  --color-accent-orange: #0ea5e9;
}
```

### Forest Theme

Green-dominant with earth tones:

```css
:root {
  --color-primary: #059669;
  --color-primary-light: #10b981;
  --color-secondary: #7c3aed;
  --color-accent-orange: #d97706;
  --color-accent-yellow: #f59e0b;
}
```

## Typography System

### Font Sizes

```css
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-md: 1rem; /* 16px - base */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 2rem; /* 32px */
--font-size-4xl: 2.5rem; /* 40px */
--font-size-5xl: 3rem; /* 48px */
--font-size-6xl: 3.75rem; /* 60px - Clock size */
```

### Font Weights

```css
--font-weight-normal: 400; /* Body text */
--font-weight-medium: 500; /* Labels */
--font-weight-semibold: 600; /* Headings */
--font-weight-bold: 700; /* Strong headings */
```

**Usage:** Apply with `.font-bold`, `.font-semibold`, etc.

### Font Family

```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  Oxygen, Ubuntu, Cantarell, sans-serif;
```

To change globally, update this variable.

## Spacing System

```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
```

Used for: padding, margins, gaps between elements

## Transitions & Animations

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Built-in Animations

- `@keyframes float` - Floating effect (used by bg orbs)
- `@keyframes pulse-soft` - Soft pulsing
- `@keyframes pulse-dot` - Dot pulsing (status indicator)
- `@keyframes glow` - Glowing box shadow

## Border Radius

```css
--radius-sm: 0.375rem; /* 6px */
--radius-md: 0.5rem; /* 8px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px - cards */
--radius-2xl: 1.5rem; /* 24px */
```

## Shadow System

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-glow-blue: 0 0 20px rgba(59, 130, 246, 0.5);
--shadow-glow-purple: 0 0 20px rgba(168, 85, 247, 0.5);
--shadow-glow-green: 0 0 20px rgba(16, 185, 129, 0.5);
```

## Component Customization

### Card Styling

Edit the `.card` class in `src/style.css`:

```css
.card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
}

.card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-xl);
}
```

### Button Styling

Edit the `.btn` class:

```css
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
}

.btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}
```

### Input Styling

Edit the `.input` class for search bar appearance

## Quick CSS Tips

### Disable Animations

Add to `src/style.css`:

```css
* {
  animation: none !important;
  transition: none !important;
}
```

### Increase Glass Blur

Change backdrop-filter value (higher = more blur):

```css
.card {
  backdrop-filter: blur(20px); /* was 10px */
}
```

### Add More Transparency

Reduce opacity values:

```css
--color-glass-light: rgba(255, 255, 255, 0.05); /* was 0.1 */
```

### Remove Glass Effect

Set background to solid:

```css
.card {
  background: var(--color-bg-dark);
  backdrop-filter: none;
}
```

## Testing Your Changes

1. Edit a variable in `src/style.css`
2. Browser will hot-reload automatically
3. No need to restart dev server

## Color Picker Tools

- https://htmlcolorcodes.com/
- https://coolors.co/
- https://www.color-hex.com/

## Accessibility Tips

- Maintain contrast ratio of at least 4.5:1 for text
- Use color + icons, not just color for status
- Test with color blindness simulators
- Avoid pure red/green only differentiation

Enjoy customizing! 🎨
