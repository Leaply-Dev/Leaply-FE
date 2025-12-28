# Admin Dashboard Style Guide

Compressed styling reference for the Leaply Admin Dashboard. Follow these patterns for consistency with the main app.

## Color System (OKLCH)

```css
/* Primary */
--primary: oklch(0.7776 0.1578 129.8379)  /* Green - buttons, active states */
--primary-foreground: oklch(0.9846 0.0017 247.8389)

/* Neutrals */
--background: oklch(0.9846 0.0017 247.8389)  /* Off-white */
--foreground: oklch(0.2781 0.0296 256.848)   /* Dark text */
--muted: oklch(0.9594 0.0103 247.8389)
--muted-foreground: oklch(0.5466 0.0177 256.848)

/* Semantic */
--destructive: oklch(0.5772 0.2154 27.3242)  /* Red - delete, errors */
--accent: oklch(0.8236 0.1182 88.2591)       /* Yellow/gold */

/* Borders & Cards */
--border: oklch(0.9218 0.0185 247.8389)
--card: oklch(1 0 0)
--ring: oklch(0.7776 0.1578 129.8379)
```

## Typography

- **Font Family:** Raleway (primary), Lora (serif), Fira Code (mono)
- **Import:** Already in globals.css via Google Fonts
- **Usage:** Default sans-serif applies Raleway automatically

## Spacing & Layout

```tsx
// Page container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// Card padding
<Card className="p-6">  // 24px standard

// Section gaps
<div className="space-y-6">  // Between sections
<div className="space-y-4">  // Between form fields
```

## Component Patterns

### Buttons
```tsx
import { Button } from "@/components/ui/button"

<Button>Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Subtle</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon /></Button>
```

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Badges
```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
```

### Form Inputs
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter name" />
</div>
```

### Data Tables
```tsx
// Use @tanstack/react-table with shadcn Table component
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
```

## Animation Patterns

### Page Transitions (Framer Motion)
```tsx
import { motion } from "framer-motion"

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>

// Stagger children
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}
```

### CSS Transitions
```tsx
// Hover effects - 200ms
className="transition-colors hover:bg-muted"

// All transitions - 300ms default
className="transition-all duration-300"
```

## Shadows

```css
--shadow-2xs: 0 1px 1px 0 oklch(0.3961 0.1265 129.8379 / 0.05)
--shadow-xs: 0 1px 2px 0 oklch(0.3961 0.1265 129.8379 / 0.05)
--shadow-sm: 0 2px 4px 0 oklch(0.3961 0.1265 129.8379 / 0.05)
--shadow-md: 0 4px 8px -2px oklch(0.3961 0.1265 129.8379 / 0.1)
```

Usage: `className="shadow-xs"` or `className="shadow-md"`

## Border Radius

```css
--radius: 0.625rem  /* ~10px base */
```

Usage: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`

## Responsive Breakpoints

```tsx
// Mobile first
className="w-full md:w-1/2 lg:w-1/3"

// Hide on mobile
className="hidden md:flex"

// Stack on mobile, row on desktop
className="flex flex-col md:flex-row gap-4"
```

## Admin-Specific Patterns

### Stats Cards
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Total Users
    </CardTitle>
    <Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-muted-foreground">+12% from last month</p>
  </CardContent>
</Card>
```

### Action Toolbar
```tsx
<div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-4">
    <Input placeholder="Search..." className="w-64" />
    <Select>...</Select>
  </div>
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Add New
  </Button>
</div>
```

### Table Actions Column
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Confirmation Dialog
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Icons

Use Lucide React icons (already installed):
```tsx
import { Users, Building2, GraduationCap, Upload, Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react"
```

## Logo

Copy from: `/public/Logo.png`
Usage: `<Image src="/Logo.png" alt="Leaply" width={120} height={40} />`
