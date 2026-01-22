# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, shadcn/ui (New York), TanStack Query v5, Orval (API codegen), Zod 4, Zustand (auth), next-intl (i18n), Bun 1.3, Biome 2.3

## Commands

```bash
bun dev                  # Start dev server (auto-runs generate:api)
bun build                # Production build (auto-runs generate:api)
bun check                # Biome lint + format
bun knip                 # Find unused code
bun generate:api         # Regenerate API hooks from OpenAPI
bunx shadcn@latest add   # Install shadcn component
```

## Before Any Task

1. Run `bun generate:api` to check if backend API changed
2. Use Orval-generated hooks from `lib/generated/api/endpoints/` for all API calls
3. Search shadcn MCP before building custom UI components

## Architecture

### API Layer
- **Backend**: `NEXT_PUBLIC_API_URL` (client-side fetching only, no SSR data fetching)
- **Code generation**: Orval generates React Query hooks from OpenAPI spec at `https://api.leaply.ai.vn/api/api-docs`
- **Custom fetch**: `lib/api/mutator.ts` handles auth headers, token refresh, and 401 retries
- **Response format**: All Orval hooks return `{ data, status, headers }` wrapper

### Authentication Flow
- **Cookie**: `leaply-auth-state` (synced from Zustand for middleware)
- **Store**: `useUserStore` in `lib/store/userStore.ts` (persisted to localStorage)
- **Tokens**: Access + refresh tokens, auto-refresh on 401
- **Route protection**: `proxy.ts` middleware checks cookie, redirects unauthenticated users

### Route Groups
- `(auth)` - Login, register pages
- `(marketing)` - Landing, pricing, about
- `(app)` - Protected dashboard, explore, persona-lab
- `onboarding` - Post-registration flow
- `oauth` - OAuth callback handlers

### Internationalization
- **Library**: next-intl with cookie-based locale (`vi` default, `en` supported)
- **Messages**: `messages/vi.json`, `messages/en.json`
- **Config**: `i18n/request.ts`

## Critical Rules

- **Use generated hooks**: Import from `@/lib/generated/api/endpoints/*`, not manual fetch
- **Client components**: Use `'use client'` - Server Components can't access Zustand auth
- **shadcn first**: Check MCP `search_items_in_registries` before custom components
- **Regenerate after API changes**: Run `bun generate:api` when backend schema updates
- **Cache invalidation**: Generated hooks don't auto-invalidate; add `onSuccess` callbacks manually

## Data Fetching Pattern

```typescript
// Page: app/(app)/feature/page.tsx
export default function FeaturePage() {
  return <FeatureClient />;
}

// Client: components/feature/FeatureClient.tsx
"use client";
import { useListItems } from "@/lib/generated/api/endpoints/feature/feature";
import { unwrapResponse } from "@/lib/api/unwrapResponse";

export function FeatureClient() {
  const { data, isLoading, error } = useListItems();
  const items = unwrapResponse(data); // Extract actual data from wrapper
  // render
}
```

## Mutation with Cache Invalidation

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { useSaveProgram } from "@/lib/generated/api/endpoints/explore/explore";

const queryClient = useQueryClient();
const { mutate } = useSaveProgram({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/v1/programs"] });
    },
  },
});
```

## File Conventions

- `lib/generated/api/endpoints/` - Orval-generated React Query hooks (DO NOT EDIT)
- `lib/generated/api/models/` - TypeScript types from OpenAPI (DO NOT EDIT)
- `lib/generated/api/zod/` - Zod validation schemas from OpenAPI (DO NOT EDIT)
- `lib/api/mutator.ts` - Custom fetch wrapper with auth
- `lib/api/unwrapResponse.ts` - Extract data from API response wrapper
- `lib/hooks/use*.ts` - Custom hooks (only for complex business logic)
- `lib/store/*.ts` - Zustand stores
- `lib/validations/*.ts` - Custom Zod schemas for forms
- `components/ui/` - shadcn components
- `components/*/` - Feature components (PascalCase)

## MCP Tools

- **shadcn**: `search_items_in_registries`, `get_item_examples_from_registries`
- **context7**: `resolve-library-id` then `query-docs` for any library

## Installed shadcn Components

alert, avatar, badge, button, card, dialog, dropdown-menu, field, input, label, progress, scroll-area, select, separator, skeleton, tabs, toggle, toggle-group

## Docs

- `docs/agent/` - Claude instructions
- `docs/contexts/` - Long-term project context, API specs
- `docs/audit/` - Audit reports
