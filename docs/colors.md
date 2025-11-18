# UI Color System

This document defines the color system for the Leaply application, built with Tailwind CSS v4 using OKLCH color format for better perceptual uniformity and color accuracy.

## Color System Architecture

The color system is defined in `app/globals.css` using Tailwind v4's `@theme inline` directive. Colors are stored as CSS custom properties in OKLCH format, which provides:
- Better perceptual uniformity
- Wider color gamut support
- More predictable color mixing
- Automatic dark mode support

## Primary Colors

### Primary Green
- **CSS Variable**: `--primary`
- **Light Mode**: `oklch(0.7776 0.1578 129.8379)` - Leaf green from the logo
- **Usage**: Primary buttons, active states, key highlights, progress indicators
- **Tailwind Class**: `bg-primary`, `text-primary`, `border-primary`
- **Foreground**: `--primary-foreground` (`oklch(0.2491 0.0353 132.1366)`) - Dark text on primary background

### Foreground (Text)
- **CSS Variable**: `--foreground`
- **Light Mode**: `oklch(0.2781 0.0296 256.8480)` - Dark grey for primary text
- **Usage**: Headings, body text, high-contrast content
- **Tailwind Class**: `text-foreground`

## Secondary Colors

### Secondary
- **CSS Variable**: `--secondary`
- **Light Mode**: `oklch(0.9276 0.0058 264.5313)` - Light grey background
- **Usage**: Secondary buttons, panels, subtle backgrounds
- **Tailwind Class**: `bg-secondary`, `text-secondary`
- **Foreground**: `--secondary-foreground` (`oklch(0.3729 0.0306 259.7328)`)

### Muted
- **CSS Variable**: `--muted`
- **Light Mode**: `oklch(0.9670 0.0029 264.5419)` - Very light grey
- **Usage**: Subtle backgrounds, disabled states
- **Tailwind Class**: `bg-muted`, `text-muted-foreground`
- **Foreground**: `--muted-foreground` (`oklch(0.5510 0.0234 264.3637)`) - Secondary text

### Accent
- **CSS Variable**: `--accent`
- **Light Mode**: `oklch(0.9676 0.0673 99.3210)` - Light green tint
- **Usage**: Hover states, subtle highlights, accent elements
- **Tailwind Class**: `bg-accent`, `text-accent-foreground`

## Semantic Colors

### Destructive
- **CSS Variable**: `--destructive`
- **Value**: `oklch(0.6368 0.2078 25.3313)` - Red/orange for errors
- **Usage**: Delete buttons, error messages, destructive actions
- **Tailwind Class**: `bg-destructive`, `text-destructive-foreground`

### Border
- **CSS Variable**: `--border`
- **Light Mode**: `oklch(0.8717 0.0093 258.3382)` - Subtle border color
- **Usage**: Borders, dividers, input outlines
- **Tailwind Class**: `border-border`

### Input
- **CSS Variable**: `--input`
- **Light Mode**: `oklch(0.9276 0.0058 264.5313)` - Input background
- **Usage**: Form inputs, text fields
- **Tailwind Class**: `bg-input`, `border-input`

### Ring (Focus)
- **CSS Variable**: `--ring`
- **Value**: `oklch(0.7776 0.1578 129.8379)` - Matches primary color
- **Usage**: Focus rings, active states
- **Tailwind Class**: `ring-ring`, `focus:ring-ring`

## Background Colors

### Background
- **CSS Variable**: `--background`
- **Light Mode**: `oklch(0.9846 0.0017 247.8389)` - Off-white background
- **Usage**: Main page background
- **Tailwind Class**: `bg-background`

### Card
- **CSS Variable**: `--card`
- **Light Mode**: `oklch(1.0000 0 0)` - Pure white
- **Usage**: Card backgrounds, elevated surfaces
- **Tailwind Class**: `bg-card`, `text-card-foreground`

## Chart Colors

The system includes 5 chart colors for data visualization:
- **Chart 1**: `oklch(0.7776 0.1578 129.8379)` (Primary green)
- **Chart 2**: `oklch(0.7137 0.1434 254.6240)` (Blue)
- **Chart 3**: `oklch(0.9052 0.1657 98.1108)` (Yellow-green)
- **Chart 4**: `oklch(0.7576 0.1590 55.9344)` (Yellow)
- **Chart 5**: `oklch(0.7090 0.1592 293.5412)` (Purple)

**Tailwind Classes**: `bg-chart-1` through `bg-chart-5`

## Sidebar Colors

Specialized colors for sidebar components:
- **Sidebar**: `--sidebar` - Sidebar background
- **Sidebar Foreground**: `--sidebar-foreground` - Sidebar text
- **Sidebar Primary**: `--sidebar-primary` - Active sidebar items
- **Sidebar Accent**: `--sidebar-accent` - Hover states
- **Sidebar Border**: `--sidebar-border` - Sidebar dividers

**Tailwind Classes**: `bg-sidebar`, `text-sidebar-foreground`, etc.

## Dark Mode

All colors automatically adapt to dark mode when the `.dark` class is applied to the root element. Dark mode values are defined in the `.dark` selector in `globals.css`.

Key dark mode differences:
- **Background**: Darker (`oklch(0.2077 0.0398 265.7549)`)
- **Foreground**: Lighter (`oklch(0.9288 0.0126 255.5078)`)
- **Cards**: Dark grey (`oklch(0.2433 0.0247 263.9506)`)
- **Borders**: More visible (`oklch(0.3729 0.0306 259.7328)`)

## Usage Guidelines

### Tailwind v4 Best Practices

1. **Use Theme Variables**: Always use Tailwind classes that reference theme variables (e.g., `bg-primary` instead of hardcoded colors)

2. **Foreground Pairs**: When using background colors, pair them with their foreground counterparts:
   ```tsx
   <div className="bg-primary text-primary-foreground">
     Primary button
   </div>
   ```

3. **Semantic Naming**: Use semantic color names (`primary`, `destructive`, `muted`) rather than color names (`green`, `red`, `grey`) for better maintainability

4. **Dark Mode**: Colors automatically adapt to dark mode - no need for separate classes

5. **Accessibility**: All color combinations meet WCAG 2.1 AA contrast requirements. The OKLCH format ensures consistent perceptual contrast.

### Common Patterns

```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:opacity-90">
  Click me
</button>

// Card with border
<div className="bg-card text-card-foreground border border-border rounded-lg">
  Card content
</div>

// Muted text
<p className="text-muted-foreground">Secondary information</p>

// Destructive action
<button className="bg-destructive text-destructive-foreground">
  Delete
</button>

// Input field
<input className="bg-input border border-input ring-ring focus:ring-2" />
```

## Modifying Colors

To modify colors, using [TweakCN](https://tweakcn.com/editor/theme) then paste conf into `app/globals.css`:


The OKLCH format allows for easy color manipulation:
- **Lightness** (first value): 0-1, where 0 is black and 1 is white
- **Chroma** (second value): Color intensity (0 = grey, higher = more saturated)
- **Hue** (third value): 0-360 degrees on the color wheel
