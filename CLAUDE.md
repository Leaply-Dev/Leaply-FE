# Leaply

## Stack

Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, shadcn/ui (New York), TanStack Query v5, Orval (API codegen), Zod 4, Zustand (auth), Bun 1.3, Biome 2.3

## Architecture

- **API-based**: Backend at `NEXT_PUBLIC_API_URL`, client-side fetching only
- **Auth**: Cookie (`leaply-auth-state`) + Zustand store (`useUserStore`) + `proxy.ts` route protection
- **Data**: TanStack Query for server state, Zustand for client state
- **Route groups**: `(auth)`, `(marketing)`, `(app)`, `oauth`, `onboarding`

## Commands

```bash
bun dev                  # Start dev server
bun build                # Production build
bun check                # Biome lint + format
bun knip                 # Find unused code
bun generate:api         # Regenerate API hooks from OpenAPI
bunx shadcn@latest add   # Install shadcn component
```

## Before Any Task

1. Run `bun generate:api` to check if backend API changed
2. Use Orval-generated hooks from `lib/generated/api/endpoints/` for all API calls
3. Search shadcn MCP before building custom UI components

## Critical Rules

- **Use generated hooks**: Import from `@/lib/generated/api/endpoints/*`, not manual fetch
- **Client components**: Use `'use client'` - Server Components can't access Zustand auth
- **shadcn first**: Check MCP `search_items_in_registries` before custom components
- **Ask when uncertain**: Use MCP tools for docs, never guess APIs

## Data Fetching Pattern

```typescript
// Page: app/(app)/feature/page.tsx
export default function FeaturePage() {
  return <FeatureClient />;
}

// Client: components/feature/FeatureClient.tsx
"use client";
import { useListItems } from "@/lib/generated/api/endpoints/feature/feature";

export function FeatureClient() {
  const { data, isLoading, error } = useListItems();
  // render
}
```

## File Conventions

- `lib/generated/api/endpoints/` - Orval-generated React Query hooks
- `lib/generated/api/models/` - TypeScript types from OpenAPI
- `lib/hooks/use*.ts` - Custom hooks (only for complex business logic)
- `components/ui/` - shadcn components
- `components/*/` - Feature components (PascalCase)

## MCP Tools

- **shadcn**: `search_items_in_registries`, `get_item_examples_from_registries`
- **context7**: `resolve-library-id` then `query-docs` for any library
- **next-devtools**: Next.js docs and migrations

## Security

Validate all user input with Zod. No sensitive data in client code. HTTPS only.

## Docs named in kebab-case

- `docs/agent/` - Claude instructions
- `docs/artifact/` - Task outputs: audits, reports, completed task docs
- `docs/context/` - Long-term project context

## Installed shadcn Components

alert, avatar, badge, button, card, dialog, dropdown-menu, field, input, label, progress, scroll-area, select, separator, skeleton, tabs, toggle, toggle-group
