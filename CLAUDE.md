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

### API Client (`lib/api/client.ts`)
- Uses native `fetch` with base URL from `NEXT_PUBLIC_API_URL`
- Auto-attaches JWT from `useUserStore.getState().token`
- Returns `ApiResponse<T>` with `success`, `data`, `message` fields
- Custom `ApiError` class with status codes and user-friendly messages

### Authentication (`lib/store/userStore.ts`)
- Zustand store with `persist` middleware (localStorage key: `leaply-user-store`)
- Auth state synced to cookie `leaply-auth-state` for middleware access
- Key state: `profile`, `token`, `isAuthenticated`, `isOnboardingComplete`
- Methods: `login(profile, token, isOnboardingComplete)`, `logout()`

---

## Admin Dashboard

### Overview
Admin dashboard for managing users, universities, programs, intakes, and CSV imports. Integrated into the main app under `app/[lang]/(admin)/`.

### Role System
| Role | Permissions |
|------|-------------|
| `user` | No admin access |
| `data_admin` | Full CRUD on universities/programs/intakes; View users; CSV import |
| `super_admin` | All data_admin + Delete users + Change user roles |

Role is at `data.role` in auth response. Update `UserProfile` interface to include `role` field.

### Route Structure
```
app/[lang]/(admin)/
├── layout.tsx              # Admin layout with sidebar navigation
├── admin/
│   ├── page.tsx            # Redirect to /admin/universities
│   ├── dashboard/          # Stats overview
│   ├── universities/       # University CRUD
│   │   ├── page.tsx        # List with search/filter
│   │   ├── new/page.tsx    # Create form
│   │   └── [id]/page.tsx   # Edit form
│   ├── programs/           # Program CRUD
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx    # Edit form
│   │       └── intakes/    # Intakes for this program
│   ├── users/              # User management (view, delete*, role*)
│   └── import/             # CSV bulk import
```
*super_admin only

### API Endpoints (Base: `/v1/admin`)
All require `Authorization: Bearer <token>` header.

```typescript
// Stats
GET /stats → DashboardStatsResponse

// Users
GET /users?page=&size=&search=&role= → PageResponse<UserAdminResponse>
DELETE /users/{id} (super_admin only)
PATCH /users/{id}/role { role } (super_admin only)

// Universities
GET /universities?page=&size=&search=&country= → PageResponse<UniversityAdminResponse>
GET /universities/{id}
POST /universities
PUT /universities/{id}
DELETE /universities/{id}

// Programs
GET /programs?page=&size=&universityId=&country=&search= → PageResponse<ProgramAdminResponse>
GET /programs/{id}
POST /programs
PUT /programs/{id}
DELETE /programs/{id}

// Intakes
GET /programs/{programId}/intakes?page=&size= → PageResponse<IntakeAdminResponse>
GET /intakes/{id}
POST /programs/{programId}/intakes
PUT /intakes/{id}
DELETE /intakes/{id}

// CSV Import
GET /import/templates/{type} → CSV file download
POST /import/universities (multipart/form-data)
POST /import/programs (multipart/form-data)
POST /import/intakes (multipart/form-data)
```

### Implementation Priority
1. University/Program CRUD
2. User management
3. Dashboard stats
4. CSV Import/Export

### Key Files to Create
- `lib/api/adminApi.ts` - Admin API service
- `lib/store/adminStore.ts` - Admin state (optional, can use TanStack Query)
- `lib/types/admin.ts` - Admin TypeScript interfaces
- `components/admin/` - Admin-specific components (DataTable, forms, etc.)

### Reference Files
- `docs/ADMIN_STYLE_GUIDE.md` - Styling patterns for admin UI
- `docs/ADMIN_FRONTEND_SPEC.md` - Complete API specification with all endpoints and types

### Demo Mode
This is a demo app - all data is mocked in `lib/data/`. No real API calls or form validation.
