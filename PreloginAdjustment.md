# Prelogin Page Adjustments

This document tracks adjustments made to prelogin marketing pages and remaining tasks.

## Completed Changes

### Footer Updates
- Email changed from `support@leaply.ai.vn` to `contact@leaply.ai.vn`
- Background color changed from `bg-foreground` to `bg-[#606160]` (matching logo color)
- Social icons updated to: LinkedIn, Facebook, Instagram, Threads

### About Page Updates
- Email changed from `hello@leaply.ai.vn` to `contact@leaply.ai.vn`
- Team members updated with new structure (leaders highlighted)
- Social icons updated to: LinkedIn, Facebook, Instagram, Threads
- Added `isLeader` flag for team lead highlighting
- Leaders displayed in separate row with larger cards and border highlights

### Homepage CTA
- Simplified from complex `cta-pattern` background to simple `bg-primary`
- Removed inline CSS for cta-pattern
- Aligned styling with Features/About page CTA sections

---

## Features Page Preview Images

**Location**: `app/(marketing)/features/page.tsx`, inside `FeatureSection` component (lines 221-247)

**Current State**: Placeholder with icon and text

**Image Container Specs**:
- Aspect ratio: `aspect-4/3` (4:3)
- Border radius: `rounded-2xl` (16px)
- Container width: ~50% of page width (half of 2-column grid)
- Approximate dimensions at 1280px viewport: ~580px x 435px

**To replace placeholder with actual image**:
Replace the visual div content (lines 224-246) with:
```tsx
<div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border shadow-xl">
  <Image
    src={`/features/${feature.id}-preview.png`}
    alt={t(feature.titleKey)}
    fill
    className="object-cover"
  />
</div>
```

**Image files needed** (place in `public/features/`):
| File | Dimensions | Description |
|------|------------|-------------|
| `explore-preview.png` | 1160x870px (or 2x for retina: 2320x1740px) | Explore universities feature preview |
| `applications-preview.png` | 1160x870px | Applications tracking feature preview |
| `persona-lab-preview.png` | 1160x870px | Persona Lab AI feature preview |

**Recommended image format**: PNG or WebP for crisp screenshots, optimized for web

---

## Backend Contact Form API

Status: Pending implementation

See Task #6 in task list for details.
