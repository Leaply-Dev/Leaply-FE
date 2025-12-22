# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack hot-reloading
npm run build        # Production build
npm run check        # Biome format + lint with auto-fix
npm run check:ci     # Biome format + lint (CI, no auto-fix)
npm run format       # Format only with Biome
npm run lint         # Lint only with Biome
```

Add new shadcn/ui components: `npx shadcn@latest add <component>`

## Architecture

### Tech Stack
- Next.js 16 with App Router (React 19)
- TypeScript (strict mode)
- Tailwind CSS 4 with shadcn/ui components
- Zustand for global state
- Framer Motion for animations
- Biome for formatting/linting (tabs, double quotes)

### Route Structure
All routes are under `app/[lang]/` for i18n support (English and Vietnamese):

- `(marketing)/` - Public pages (landing, about, features, resources) with marketing Navbar/Footer
- `(app)/` - Authenticated app pages (dashboard, universities, persona-lab) with app Navbar/Footer
- `(auth)/` - Auth pages (login, getting-started)
- `onboarding/` - Onboarding flow (outside route groups)

### Internationalization
- Server-side: `getDictionary(locale)` from `app/[lang]/dictionaries.ts`
- Client-side: `useTranslation()` hook from `lib/i18n/useTranslation.ts`
- Dictionaries: `dictionaries/en.json` and `dictionaries/vi.json`
- Default locale: `vi`

### State Management (Zustand)
Stores in `lib/store/`:
- `userStore.ts` - User profile, onboarding status, preferences
- `universitiesStore.ts` - University data, search filters, saved list
- `applicationsStore.ts` - Applications, tasks, deadlines
- `chatStore.ts` - Chat conversations and messages
- `personaStore.ts` - Persona Lab AI essay coach state
- `languageStore.ts` - Current locale

### Key Patterns
- Use Server Components by default; add `'use client'` only when needed
- Prefer interfaces over type aliases for object shapes
- Use absolute imports: `@/components/*`, `@/lib/*`, `@/app/*`
- All layouts validate locale with `hasLocale()` and call `notFound()` if invalid
- Route params are async: `params: Promise<{ lang: string }>`

### Demo Mode
This is a demo app - all data is mocked in `lib/data/`. No real API calls or form validation.
