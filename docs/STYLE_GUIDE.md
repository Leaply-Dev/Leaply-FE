# Leaply Style Guide

> **Context File** for AI agents and developers. This document defines the visual design system, component patterns, and implementation conventions for the Leaply study abroad platform.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4+ with OKLCH color space
- **Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Raleway (sans), Lora (serif), Fira Code (mono)
- **Animations**: tw-animate-css + custom keyframes

---

## Color System (OKLCH)

Uses CSS custom properties in OKLCH format for perceptual uniformity.

### Core Palette

| Token | Light Mode | Description |
|-------|------------|-------------|
| `--primary` | `oklch(0.7776 0.1578 129.8379)` | **Leaf green** - Main brand color |
| `--accent` | `oklch(0.9676 0.0673 99.321)` | Light yellow-green highlight |
| `--background` | `oklch(0.9846 0.0017 247.8389)` | Off-white page background |
| `--foreground` | `oklch(0.2781 0.0296 256.848)` | Dark blue-gray text |
| `--card` | `oklch(1 0 0)` | Pure white |
| `--muted` | `oklch(0.968 0.007 247.896)` | Light gray |
| `--muted-foreground` | `oklch(0.554 0.046 257.417)` | Medium gray text |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red for errors |
| `--border` | `oklch(0.929 0.013 255.508)` | Light border color |

### Dark Mode

| Token | Dark Mode Value |
|-------|-----------------|
| `--background` | `oklch(0.129 0.042 264.695)` |
| `--foreground` | `oklch(0.984 0.003 247.858)` |
| `--card` | `oklch(0.208 0.042 265.755)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 15%)` |

### Chart Colors (Data Visualization)

```css
--chart-1: oklch(0.7776 0.1578 129.8379)  /* Primary green */
--chart-2: oklch(0.7137 0.1434 254.624)   /* Blue-violet */
--chart-3: oklch(0.9052 0.1657 98.1108)   /* Bright yellow */
--chart-4: oklch(0.7576 0.159 55.9344)    /* Orange/warning */
--chart-5: oklch(0.709 0.1592 293.5412)   /* Purple */
```

### Sidebar Colors

```css
--sidebar: oklch(0.984 0.003 247.858)            /* Light mode */
--sidebar: oklch(0.2433 0.0247 263.9506)         /* Dark mode */
--sidebar-primary: oklch(0.7776 0.1578 129.8379) /* Same as primary */
--sidebar-accent: oklch(0.8868 0.1822 95.3305)   /* Yellow-green accent */
```

### Semantic Usage

- **Primary actions**: `bg-primary text-primary-foreground`
- **Secondary actions**: `bg-secondary text-secondary-foreground`
- **Destructive**: `bg-destructive text-white`
- **Success indicators**: `bg-green-600 text-white`
- **Warning indicators**: `bg-chart-4 text-white`
- **Info indicators**: `bg-chart-2 text-white`
- **Active/selected states**: `text-primary`
- **Hover states**: `hover:bg-primary/90`, `hover:text-primary`

---

## Typography

### Font Families

```css
--font-sans: Raleway, ui-sans-serif, sans-serif, system-ui
--font-serif: "Lora", serif
--font-mono: "Fira Code", monospace
```

Import: `@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap")`

### Text Sizes & Usage

| Context | Classes |
|---------|---------|
| Page titles | `text-2xl font-semibold` or `text-xl font-semibold` |
| Card titles | `text-xl font-semibold` or `text-lg font-semibold` |
| Section headers | `text-sm font-semibold` |
| Body text | `text-sm text-muted-foreground` |
| Labels | `text-sm font-medium` |
| Descriptions | `text-xs text-muted-foreground` |
| Small info | `text-xs font-medium` |

### Text Styling

- `tracking-tight` for headings
- `leading-none` for card titles
- `line-clamp-2` for truncated descriptions

---

## Spacing & Layout

### Base Spacing Unit

```css
--spacing: 0.25rem
```

### Common Patterns

| Pattern | Classes |
|---------|---------|
| Page container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Card padding | `p-6` |
| Card header | `p-6` with `space-y-1.5` |
| Card content | `p-6 pt-0` |
| Card footer | `p-6 pt-0` |
| Section gaps | `gap-4`, `gap-6`, `gap-8` |
| Item spacing | `space-y-1.5`, `space-y-2`, `space-y-4` |
| Navbar height | `h-16` |
| Footer padding | `py-12` |

### Grid Patterns

```tsx
// Responsive grid for cards
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Footer grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
```

### Responsive Breakpoints

- `sm:` — 640px+
- `md:` — 768px+ (mobile menu breakpoint)
- `lg:` — 1024px+

---

## Border Radius

```css
--radius: 0.625rem  /* Light mode */
--radius: 0.5rem    /* Dark mode */

--radius-sm: calc(var(--radius) - 4px)
--radius-md: calc(var(--radius) - 2px)
--radius-lg: var(--radius)
--radius-xl: calc(var(--radius) + 4px)
```

### Usage

| Component | Class |
|-----------|-------|
| Buttons | `rounded-md` |
| Cards | `rounded-lg` |
| Dialogs | `rounded-xl` |
| Badges | `rounded-full` |
| Inputs | `rounded-md` |
| Avatars | `rounded-full` |

---

## Shadows

Uses green-tinted shadows in light mode, black in dark mode.

```css
/* Light mode shadow color */
--shadow-color: #95ca55

/* Shadow scale */
--shadow-2xs: 0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.05)
--shadow-xs: 0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.05)
--shadow-sm: layered with 0.1 opacity
--shadow-md: 0.1 opacity with 2px vertical offset
--shadow-lg: 0.1 opacity with 4px vertical offset
--shadow-xl: 0.1 opacity with 8px vertical offset
--shadow-2xl: 0.25 opacity

/* Dark mode uses neutral black shadows with 0.2-0.5 opacity */
```

### Usage

| Context | Class |
|---------|-------|
| Cards | `shadow-xs` |
| Elevated cards (hover) | `shadow-xl` |
| Buttons (outline) | `shadow-xs` |
| Dropdowns/Dialogs | `shadow-lg` |

---

## Animations

### Predefined Keyframes

```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

### Animation Variables

```css
--animate-fade-in: fadeIn 0.3s ease-out
--animate-slide-up: slideUp 0.4s ease-out
--animate-slide-down: slideDown 0.4s ease-out
```

### Common Animation Classes

| Effect | Classes |
|--------|---------|
| Transitions | `transition-colors`, `transition-all`, `transition-transform` |
| Hover lift | `hover:-translate-y-1` |
| Duration | `duration-200`, `duration-300` |
| Loading spinner | `animate-spin` |
| Icon rotation | `transition-transform rotate-180` |

### Dialog Animations (Radix)

```
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95
```

---

## Component Patterns

### Button Variants

```tsx
// Variants: default, secondary, outline, ghost, destructive, link
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>

// Sizes: sm, default, lg, icon, icon-sm, icon-lg
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><PlusIcon /></Button>

// With asChild for Link wrapping
<Button asChild>
  <Link href="/path">Navigate</Link>
</Button>
```

### Card Structure

```tsx
<Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  <CardHeader>
    <CardTitle className="text-xl">Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Action buttons</CardFooter>
</Card>
```

### Badge Variants

```tsx
// Variants: default, secondary, destructive, outline, success, warning, info
<Badge>Default (primary green)</Badge>
<Badge variant="secondary">Secondary (muted)</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outlined</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

### Input Fields

```tsx
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com"
    disabled={isLoading}
  />
  <FieldDescription>Optional help text</FieldDescription>
</Field>

// With validation error
<Input aria-invalid={hasError} />
```

### Alert Messages

```tsx
// Error alert
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Error message here</AlertDescription>
</Alert>

// Default alert
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>Information message</AlertDescription>
</Alert>
```

### Dialog/Modal

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Navigation Patterns

### Navbar Structure

```tsx
<nav className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/Logo.png" alt="Leaply" width={120} height={40} className="h-8 w-auto" />
      </Link>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {/* Links */}
      </div>
      
      {/* Mobile Toggle */}
      <div className="md:hidden">
        {/* Hamburger */}
      </div>
    </div>
  </div>
</nav>
```

### Nav Link States

```tsx
<Link
  href={href}
  className={cn(
    "text-sm font-medium transition-colors hover:text-primary",
    isActive ? "text-primary" : "text-foreground"
  )}
>
  {label}
</Link>
```

### Avatar Dropdown

```tsx
<Avatar className="w-8 h-8 border-2 border-primary/20">
  <AvatarImage src={url} alt={name} />
  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
    {initials}
  </AvatarFallback>
</Avatar>
```

---

## Feature Card Patterns

### AI Match Card

Key styling for AI-enhanced university cards:

```tsx
// Container with primary border accent
<Card className="border-2 border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

// AI Match badge with gradient
<Badge className="bg-linear-to-r from-primary to-accent text-white border-0">
  <Sparkles className="w-3 h-3 mr-1" />
  AI Match
</Badge>

// Fit score with dynamic color based on percentage
<Badge className={cn("bg-card border-2 font-semibold", getFitScoreColor(score))}>
  <TrendingUp className="w-3 h-3 mr-1" />
  {score}% Match
</Badge>
```

### Highlight Effects

```tsx
// Subtle primary overlay
className="bg-primary/5 rounded-lg border border-primary/20"

// Gradient image overlay
className="bg-linear-to-br from-leaf-green/10 to-light-green/5"

// Match reason highlight
className="flex items-start gap-2 text-xs text-muted-foreground"
```

---

## Footer Pattern

```tsx
<footer className="bg-foreground text-background mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Logo with inversion for dark bg */}
    <Image 
      src="/Logo.png" 
      alt="Leaply" 
      className="h-8 w-auto mb-4 brightness-0 invert" 
    />
    
    {/* Links */}
    <Link className="text-sm text-gray-300 hover:text-primary transition-colors">
      Link
    </Link>
    
    {/* Social icons */}
    <a className="text-gray-400 hover:text-primary transition-colors">
      <Icon className="w-5 h-5" />
    </a>
  </div>
</footer>
```

---

## Form Patterns

### Auth Form Layout

```tsx
<Card>
  <CardHeader className="text-center">
    <CardTitle className="text-xl">Welcome back</CardTitle>
    <CardDescription>Sign in to your account</CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <FieldGroup>
        <Field>
          <GoogleLoginButton />
        </Field>
        <FieldSeparator>or continue with</FieldSeparator>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" />
        </Field>
        
        <Field>
          <Button type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </CardContent>
</Card>
```

---

## Icon Usage

- **Library**: Lucide React
- **Default size with button**: `w-4 h-4`
- **Standalone icons**: `w-5 h-5` or `w-6 h-6`
- **Icon + text gap**: `gap-2` or `mr-2`
- **Icon colors**: Inherit from text or use semantic colors

Common icons used:
- Navigation: `Menu`, `X`, `ChevronDown`, `ChevronRight`
- Actions: `Plus`, `Edit`, `Trash`, `Download`
- Status: `Check`, `AlertCircle`, `Info`, `Sparkles`
- UI: `Loader2` (for loading states), `Star`, `Heart`
- Features: `MapPin`, `DollarSign`, `TrendingUp`, `MessageCircle`

---

## Dark Mode Implementation

- Toggle via `.dark` class on root element
- Use `dark:` variant prefix for overrides
- Key differences:
  - Backgrounds become deep blue-gray
  - Borders become semi-transparent white
  - Shadows use black instead of green-tinted
  - Input backgrounds get `dark:bg-input/30`

```tsx
// Example dark mode overrides
className="bg-background dark:bg-input/30"
className="border-input dark:border-input dark:hover:bg-input/50"
```

---

## Accessibility Guidelines

### Focus States

```css
focus-visible:outline-none
focus-visible:ring-ring/50
focus-visible:ring-[3px]
focus-visible:border-ring
```

### Invalid States

```css
aria-invalid:ring-destructive/20
dark:aria-invalid:ring-destructive/40
aria-invalid:border-destructive
```

### Screen Reader Support

- Use `sr-only` class for visually hidden text
- All interactive elements must be keyboard focusable
- Dialogs include close button with `<span className="sr-only">Close</span>`

### ARIA Attributes

- Dialogs use `role="alert"` for alerts
- Form fields use `aria-invalid` for validation
- Buttons have proper `type="button"` or `type="submit"`

---

## Helper Utilities

### cn() Function

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Custom CSS Utilities

```css
@utility container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

@utility page-container {
  @apply max-w-7xl mx-auto container-padding py-8;
}
```

---

## Internationalization (i18n)

- Uses `next-intl` for translations
- Translation hook: `useTranslations("namespace")`
- Default locales: Vietnamese (`vi`), English (`en`)
- All user-facing text must use translation keys

### Common Namespaces

- `nav` - Navigation labels
- `auth` - Login/signup forms
- `explore` - University exploration
- `footer` - Footer content
- `common` - Shared strings

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/globals.css` | CSS variables, theme config |
| `components/ui/*.tsx` | Base UI components |
| `lib/utils.ts` | Helper functions including `cn()` |
| `components.json` | shadcn/ui configuration |
| `messages/*.json` | i18n translation files |
