# Leaply-FE Codebase Overview

> **Mục đích**: Tài liệu tóm tắt nén context về implementation hiện tại để brainstorm và hỏi Claude trong chat session.

---

## 1. API & DATA FETCHING

### 1.1 Architecture Overview

**3-Layer Pattern:**
```
API Client (lib/api/client.ts)
    ↓
Service Layer (lib/services/*.ts)
    ↓
Zustand Stores (lib/store/*.ts)
```

### 1.2 API Client Configuration

- **Base URL**: `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080/api`)
- **Mock Mode**: `NEXT_PUBLIC_USE_MOCK_DATA=true` enables full mock mode
- **Auth**: Auto bearer token injection from `useUserStore`
- **Error Handling**: Custom `ApiError` class with logging

### 1.3 API Endpoints (25+ endpoints)

| Category | Endpoints | Key Features |
|----------|-----------|--------------|
| **Auth** | `/v1/auth/*` | login, register, google auth, getCurrentUser |
| **User** | `/v1/user/*` | profile, preferences management |
| **Onboarding** | `/v1/onboarding/*` | status, update onboarding data |
| **Explore** | `/v1/explore/*` | programs list, detail, AI match, filters, save/unsave |
| **Applications** | `/v1/applications/*` | CRUD, SOP management, feedback, evaluation |
| **Persona Lab** | `/v1/persona/*` | state, track selection, messaging, redo |
| **Home** | `/v1/home` | Dashboard aggregated data |

### 1.4 Service Layer

**Files**: `lib/services/*.ts`
- `authService` - Login/register/googleAuth
- `userService` - Profile & preferences
- `exploreService` - Programs, filters, saved programs
- `applicationsService` - Application management
- `personaService` - Persona Lab AI coach
- `onboardingService` - Onboarding flow

### 1.5 Mock Data (`lib/data/`)

- **universities.ts**: 21 mock universities (Oxford, Stanford, MIT, Cambridge, etc.)
- **chat.ts**: 2 mock conversations
- **resources.ts**: 10 resource items (Essays, Financial Aid, Interviews, etc.)

**Mock Delays** (for realism):
- Home data: 500ms
- Applications: 300-500ms
- SOP Feedback: 1000ms (slowest)
- Persona API: 400-1000ms

### 1.6 Zustand Stores (State Management)

| Store | Persistence | Key State |
|-------|-------------|-----------|
| **userStore** | localStorage | profile, token, preferences, journeyType, isAuthenticated |
| **universitiesStore** | No | universities[], savedUniversities[], filters |
| **applicationsStore** | No | applications[], summary, upcomingDeadlines |
| **chatStore** | No | conversations[], currentConversationId, isTyping |
| **personaStore** | localStorage (selective) | tracks, nodes, archetype, conversationHistory |
| **languageStore** | localStorage | language (en/vi) |

**Data Flow Pattern:**
```
Component → Store Action → Service → API Client → Backend
         ← State Update ← Response ← Response ←
```

---

## 2. LAYOUTS & ROUTE STRUCTURE

### 2.1 Route Groups

```
app/
├── (marketing)/        # Public pages - Marketing Navbar/Footer
│   ├── page.tsx           # Landing page
│   ├── features/          # Features showcase
│   ├── about/             # About page
│   └── resources/         # Resources page
│
├── (app)/              # Authenticated pages - App Navbar
│   ├── dashboard/         # Main dashboard
│   │   └── applications/  # Applications list & detail
│   ├── explore/           # University explorer (AI Match + Explore All)
│   │   └── [id]/          # Program detail page
│   └── persona-lab/       # Persona Lab AI coach
│
├── (auth)/             # Auth pages - Minimal layout
│   ├── login/             # Login form
│   └── register/          # Registration form
│
└── onboarding/         # Multi-step onboarding flow
```

### 2.2 Layout Hierarchy

**Root Layout** (`app/layout.tsx`):
- Next-intl provider
- Raleway font
- globals.css

**Marketing Layout** (`app/(marketing)/layout.tsx`):
```
├── Marketing Navbar (sticky)
├── DataInitializer
├── <main> (flex-1)
│   └── {children}
└── Marketing Footer
```

**App Layout** (`app/(app)/layout.tsx`):
```
├── DataInitializer
├── App Navbar (fixed, z-50)
└── <main> (flex-1, overflow-y-auto, pt-16)
    └── {children}
```

**Auth Layout** (`app/(auth)/layout.tsx`):
- Minimal (no header/footer)
- Centered content

### 2.3 Navbar Variants

**Marketing Navbar**:
- Links: Home, Features, About
- CTA: "Get Started" → /register
- Language switcher

**App Navbar**:
- Links: Home, Explore, Applications, Persona Lab
- User avatar dropdown (Profile, Logout)
- Language switcher
- Mobile hamburger menu

### 2.4 Route Protection

- **Type**: Client-side only (no middleware)
- **Auth State**: Zustand `useUserStore` with localStorage
- **Cookie Sync**: `leaply-auth-state` (7 days)
- **Pattern**: Honor system (components assume auth in (app) group)

### 2.5 Internationalization (i18n)

- **Library**: next-intl
- **Locales**: en, vi (default: vi)
- **Storage**: Cookie `locale`
- **Usage**:
  - Server: `const t = await getTranslations("section")`
  - Client: `const t = useTranslations("section")`

---

## 3. COMPONENTS & FEATURES

### 3.1 Component Organization

```
components/
├── ui/                     # shadcn/ui primitives (23 components)
├── marketing/              # Marketing page components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── app/                    # App-specific components
│   └── LanguageSwitcher.tsx
├── explore-alt/            # Explore page components
│   ├── AIMatchMode.tsx
│   ├── ExploreAll.tsx
│   ├── ProgramCard.tsx
│   └── program-detail/
├── persona-lab/            # Persona Lab components
│   ├── PersonaLabLayout.tsx
│   ├── ChatInterface.tsx
│   ├── ChatSidebar/
│   ├── InsightBoard.tsx
│   └── canvas/
│       └── nodes/
├── onboarding/             # Onboarding flow components
│   ├── OnboardingClient.tsx
│   ├── steps/              # Step1-Step5 components
│   ├── StepContainer.tsx
│   └── StepNavigation.tsx
└── [root-level components]
    ├── Navbar.tsx          # App Navbar
    ├── Footer.tsx          # App Footer
    ├── LoginForm.tsx
    ├── UniversityCard.tsx
    ├── ApplicationCard.tsx
    ├── ChatbotAdvisor.tsx
    └── PageTransition.tsx
```

### 3.2 shadcn/ui Components (23 total)

Alert, Avatar, Badge, Button, Card, Checkbox, Dialog, Dropdown-Menu, Field, Input, Label, Progress, Scroll-Area, Select, Separator, Skeleton, Slider (custom), Switch, Tabs, Textarea, Toggle, Toggle-Group, Tooltip

### 3.3 Key Features

#### A. Persona Lab (AI Essay Coach)

**3-Panel Layout**:
```
┌─────────────┬────────────────┬─────────────┐
│  Profile    │  Chat          │  Insight    │
│  Sidebar    │  Interface     │  Board      │
│  (25%)      │  (50%)         │  (25%)      │
└─────────────┴────────────────┴─────────────┘
```

**Components**:
- **ChatInterface**: AI mentor chat with track selection
- **PersonaCanvas**: Interactive node visualization (@xyflow/react)
- **Node Types**: Core, Archetype, Evidence, Insight, Story, Summary
- **InsightBoard**: Core values, Essay angles

**Flow**:
1. User selects track (4 tracks: Future Vision, Academic Journey, Activities Impact, Values & Turning Points)
2. AI asks core questions + adaptive follow-ups
3. System creates canvas nodes (60% chance per response)
4. After all tracks: Archetype reveal

#### B. University Search & Explore

**Modes**:
1. **AI Match**: Categorized programs (Reach/Target/Safety)
2. **Explore All**: Filterable grid view

**Features**:
- Fit score calculation (based on GPA, test scores, budget, region)
- Save/bookmark functionality
- Filter bar (search, country, tuition range, ranking)
- Program detail tabs (Overview, Curriculum, Admissions, FAQ)

**Components**:
- `ProgramCard` - Compact program display
- `QuickFactsBar` - Tuition, Duration, IELTS, GPA
- `FilterBar` - Search + filters

#### C. Application Tracking

**Features**:
- Application list with status badges
- Detail view: Fit score, Status, SOP status, Deadline countdown
- Gaps analysis (critical/warning/info)
- Status management: planning → writing → submitted
- Delete with confirmation dialog

**Components**:
- `ApplicationDashboard` - Main detail view
- `ApplicationCard` - List item
- `ApplicationSidebar` - Navigation

#### D. Chatbot Advisor ("Leafy")

**Knowledge Base**:
- Admission requirements
- Scholarships
- Essay writing tips
- Application deadlines
- Visa process
- University recommendations

**Features**:
- Quick reply buttons
- Profile context integration
- Typing simulation (bouncing dots)
- Human advisor contact dialog

#### E. Onboarding Flow

**5 Steps**:
1. Basic Info (Education level, Target degree)
2. Preferences (Fields, Regions)
3. Plan (Budget, Timeline)
4. Journey Selection (Exploring vs Targeted)
5. Completion

**Components**:
- `OnboardingClient` - Main container
- `Step1-Step5` - Individual step forms
- `StepContainer` - Wrapper with animation
- `OnboardingProgress` - Visual progress indicator

### 3.4 Interactive Patterns

**Forms**:
- Custom Sliders (GPA, SAT, Budget) with dynamic formatting
- Toggle Groups (Education level, Degree type)
- Dropdowns (Status selectors, Filters)

**Modals**:
- Deletion confirmations
- Human advisor contact
- Node detail (Persona Lab)

**Animations**:
- Page transitions (fade + slide)
- Stagger lists (0.1s delay between items)
- Hover effects (shadow lift, scale)
- Loading skeletons
- Typing indicator (3 bouncing dots)

---

## 4. STYLING APPROACH

### 4.1 Tech Stack

- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **No tailwind.config.js** - Configuration inline in `globals.css` via `@theme`
- **Class Variance Authority (CVA)** for component variants
- **Framer Motion** for complex animations
- **tw-animate-css** for CSS animation library

### 4.2 Theme System

**Color System - OKLCH**:
```css
:root {
  --primary: oklch(0.7776 0.1578 129.8379);     /* Green */
  --secondary: oklch(0.968 0.007 247.896);
  --accent: oklch(0.9676 0.0673 99.321);        /* Yellow */
  --destructive: oklch(0.577 0.245 27.325);     /* Red */
  --background: oklch(0.9846 0.0017 247.8389);
  --foreground: oklch(0.2781 0.0296 256.848);
  /* + card, border, input, ring, muted, etc. */
}

.dark { /* Dark variants */ }
```

**Typography**:
- **Sans**: Raleway (Google Fonts)
- **Serif**: Lora
- **Mono**: Fira Code

**Spacing & Radius**:
- `--radius`: 0.625rem (light), 0.5rem (dark)
- `--spacing`: 0.25rem

**Shadows**: 8 levels (`--shadow-2xs` to `--shadow-2xl`)

### 4.3 Design Tokens

**Fit Score Colors**:
- Reach: Blue (#3b82f6)
- Target: Yellow/Amber (#eab308)
- Safety: Green (#22c55e)

**Persona Lab Track Colors** (`lib/constants/tracks.ts`):
- Future Vision: Violet (#8B5CF6)
- Academic Journey: Blue (#3B82F6)
- Activities Impact: Amber (#F59E0B)
- Values & Turning Points: Rose (#F43F5E)

**Node Type Colors**:
- Story: Emerald (#10B981)
- Evidence: Stone (#78716C)
- Insight: Amber (#F59E0B)
- Archetype: Primary Green (#16A34A)

### 4.4 Component Patterns

**CVA Example (Button)**:
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 ...",
  {
    variants: {
      variant: { default, destructive, outline, ghost, link },
      size: { default, sm, lg, icon },
    },
  }
);
```

**Class Utility**:
```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));  // Prevents Tailwind class conflicts
}
```

### 4.5 Responsive Design

**Breakpoint Pattern**:
```html
<h1 class="text-4xl md:text-5xl lg:text-6xl">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<span class="text-xs sm:text-sm">
```

**Custom Utilities**:
```css
@utility container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

@utility page-container {
  @apply max-w-7xl mx-auto container-padding py-8;
}
```

### 4.6 Animation Patterns

**Framer Motion**:
```typescript
// PageTransition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// Stagger (lists)
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }}
/>
```

**CSS Animations**:
```css
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } ... }
```

**Tailwind Transitions**:
```html
<div class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
<button class="transition-colors hover:text-primary">
```

### 4.7 Gradients & Effects

```html
<!-- Linear gradients (Tailwind CSS 4) -->
<section class="bg-linear-to-br from-leaf-green/10 via-light-green/5 to-white">
<Badge class="bg-linear-to-r from-primary to-accent text-white">

<!-- Node gradient -->
<div class="bg-gradient-to-br from-primary to-primary/80">
```

### 4.8 Accessibility Patterns

```html
<input class="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
<input class="aria-invalid:ring-destructive/20">
<button class="disabled:pointer-events-none disabled:opacity-50">
```

---

## 5. KEY ARCHITECTURAL DECISIONS

1. **Demo App**: No real backend - Mock data with `NEXT_PUBLIC_USE_MOCK_DATA` flag
2. **Client-Side Auth**: No middleware - Zustand + localStorage + cookie sync
3. **Three-Layer API**: Client → Services → Stores
4. **Route Groups**: Organized by function (marketing/app/auth)
5. **i18n-First**: next-intl with en/vi support
6. **Component Library**: shadcn/ui + CVA for variants
7. **Animation Strategy**: Framer Motion (complex) + CSS keyframes (simple)
8. **Tailwind CSS 4**: Theme in `globals.css`, no separate config
9. **Type Safety**: Strict TypeScript throughout
10. **Mobile-First**: Responsive design with md/lg breakpoints

---

## 6. FILE STRUCTURE REFERENCE

### Critical Files

```
/home/user/Leaply-FE/
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── globals.css                         # Theme config + global styles
│   ├── (marketing)/layout.tsx              # Marketing layout
│   ├── (app)/layout.tsx                    # App layout
│   └── (auth)/layout.tsx                   # Auth layout
│
├── components/
│   ├── ui/                                 # shadcn/ui (23 components)
│   ├── marketing/                          # Marketing Navbar/Footer
│   ├── persona-lab/                        # Persona Lab components
│   ├── explore-alt/                        # Explore components
│   ├── onboarding/                         # Onboarding flow
│   ├── Navbar.tsx                          # App Navbar
│   ├── Footer.tsx                          # App Footer
│   └── PageTransition.tsx                  # Animation wrapper
│
├── lib/
│   ├── api/
│   │   ├── client.ts                       # HTTP client
│   │   └── types.ts                        # API type definitions (656 lines)
│   ├── services/                           # Service layer
│   │   ├── authService.ts
│   │   ├── exploreService.ts
│   │   ├── applicationsService.ts
│   │   └── personaService.ts
│   ├── store/                              # Zustand stores
│   │   ├── userStore.ts
│   │   ├── universitiesStore.ts
│   │   ├── applicationsStore.ts
│   │   ├── personaStore.ts (440 lines)
│   │   └── languageStore.ts
│   ├── data/                               # Mock data
│   │   ├── universities.ts                 # 21 universities
│   │   ├── chat.ts                         # 2 conversations
│   │   └── resources.ts                    # 10 resources
│   ├── constants/
│   │   └── tracks.ts                       # Persona Lab track/node colors
│   └── utils.ts                            # cn() utility
│
├── i18n/
│   └── request.ts                          # i18n config
│
├── messages/
│   ├── en.json                             # English translations
│   └── vi.json                             # Vietnamese translations
│
├── postcss.config.js                       # PostCSS setup
└── CLAUDE.md                               # Project instructions
```

---

## 7. DEVELOPMENT WORKFLOW

**Commands**:
```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run check        # Biome format + lint (auto-fix)
npm run check:ci     # Biome CI check
npm run format       # Format only
npm run lint         # Lint only
```

**Add shadcn/ui components**:
```bash
npx shadcn@latest add <component>
```

**Code Style**:
- Tabs (not spaces)
- Double quotes
- Biome for linting/formatting
- Strict TypeScript

---

## 8. DEPENDENCIES REFERENCE

**Core**:
- Next.js 16 (React 19, App Router)
- TypeScript (strict mode)
- Tailwind CSS 4

**UI & Animation**:
- shadcn/ui (Radix UI primitives)
- Framer Motion
- @xyflow/react (Canvas visualization)
- lucide-react (Icons)

**State & Data**:
- Zustand (global state)
- next-intl (i18n)

**Utilities**:
- clsx + tailwind-merge → cn()
- Class Variance Authority (CVA)

---

**End of Document**

*Tài liệu này cung cấp overview toàn diện về Leaply-FE implementation. Sử dụng để nhanh chóng hiểu context khi brainstorm hoặc hỏi Claude về codebase.*
