# Leaply Claude Code Configuration

## Stack

- **Next.js 16.1.1** App Router + **React 19.2.1**
- **TypeScript 5.9** + **Tailwind CSS 4.1** + **Lucide** icons
- **shadcn/ui** (New York style) + **next-intl** (i18n)
- **Zustand** state + **Framer Motion** animations
- **Bun 1.3.3** runtime
- **Biome 2.3** linting/formatting
- **Knip 5.80** dead code removal

## Core Principles

- **Client Components primary** - Current app uses `'use client'` extensively (marketing pages, animations)
- **API-based architecture** - Backend API at `NEXT_PUBLIC_API_URL` with mock data fallback
- **Accessibility-first** - Full keyboard/screen reader support
- **Type safety** - TypeScript strict mode
- **i18n ready** - next-intl for internationalization

## Code Quality Standards

**Clean Code Principles (apply rigorously):**
- **SOLID** - Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY** - Don't Repeat Yourself (extract reusable logic)
- **KISS** - Keep It Simple, Stupid (avoid over-engineering)
- **YAGNI** - You Aren't Gonna Need It (don't add speculative features)

**Web Security (OWASP Top 10 + SANS CWE):**
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection (SQL, XSS, Command)
- A07: Identification/Authentication Failures
- A08: Software/Data Integrity Failures
- Always validate, sanitize, escape user input
- Use parameterized queries, CSP headers, HTTPS only

**MCP Tools Available:**
- **next-devtools** - Next.js docs, runtime inspection, migrations
- **shadcn** - Component search, examples, installation
- **context7** - Any library documentation lookup

**When Uncertain:**
- **STOP and ASK** - If you don't know how to implement something correctly, ask the user for clarification
- Never guess security-critical implementations
- Never invent APIs - use MCP to lookup docs

## Code Change Checklist

**REQUIRED: Apply this checklist to EVERY code change before implementation:**

**1. Security Review**
- [ ] Input validation with Zod (forms, API params, user data)
- [ ] XSS prevention (sanitize/escape user content)
- [ ] SQL injection prevention (use parameterized queries/ORMs)
- [ ] Authentication/authorization checks in place
- [ ] No sensitive data in client code or logs
- [ ] HTTPS only for API calls
- [ ] Rate limiting on public endpoints

**2. Code Quality**
- [ ] SOLID principles applied (single responsibility per function/component)
- [ ] DRY - no code duplication (extract reusable logic)
- [ ] KISS - simplest solution that works
- [ ] YAGNI - only implement what's requested
- [ ] Meaningful variable/function names
- [ ] No magic numbers/strings (use constants)
- [ ] Proper error handling (try/catch, error boundaries)

**3. TypeScript**
- [ ] Full type safety (no `any`, use proper types)
- [ ] Zod schemas for runtime validation
- [ ] Type imports from proper sources

**4. React/Next.js Best Practices**
- [ ] Use Client Component (`'use client'`) only when needed
- [ ] Proper use of hooks (useEffect cleanup, dependency arrays)
- [ ] Accessibility (ARIA labels, keyboard navigation, semantic HTML)
- [ ] Performance (memoization, lazy loading if needed)

**5. UI Implementation (shadcn/ui first)**
- [ ] **BEFORE implementing ANY UI component:**
  - Search shadcn MCP: `search_items_in_registries` for the component
  - Check examples: `get_item_examples_from_registries` for usage patterns
  - If exists: Install via `bunx shadcn@latest add [component]` (or `npx`)
  - Only build custom if shadcn doesn't have it
- [ ] Use installed components from `components/ui/`
- [ ] Follow New York style conventions
- [ ] Maintain Tailwind CSS + Lucide icons consistency

**6. Code Formatting**
- [ ] Run `bun check` (or `npm run check`) before committing
- [ ] Tabs for indentation, double quotes
- [ ] Auto-organized imports (Biome)

**7. Before Commit**
- [ ] Build passes (`bun build` or `npm run build`)
- [ ] No Biome errors (`bun check:ci` or `npm run check:ci`)
- [ ] No unused code (`bun knip` or `npm run knip`)
- [ ] Test in browser if UI change
- [ ] Review git diff for unintended changes

## Runtime Preference

**Runtime Detection (check BEFORE running commands):**

```bash
# Check if Bun is available
which bun  # or: bun --version
```

**If Bun is installed (preferred):**
- Use `bun` commands (faster, better performance)
- Bun 1.3.3+ recommended

**If Bun is NOT installed:**
- Fall back to `npm` commands (Node.js 18+)
- Use `npx` instead of `bunx`
- Project works fine with npm, just slower

**Installation (optional, recommended):**
- macOS/Linux: `curl -fsSL https://bun.sh/install | bash`
- Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`

## Commands

**Detect runtime first, then use appropriate commands:**

```bash
# Development (use bun if available, otherwise npm)
bun install  OR  npm install
bun dev      OR  npm run dev
bun build    OR  npm run build
bun start    OR  npm start

# Code quality (Biome)
bun check       OR  npm run check       # lint + format + fix
bun check:ci    OR  npm run check:ci    # CI mode, no fixes
bun format      OR  npm run format      # format only
bun lint        OR  npm run lint        # lint only
bun knip        OR  npm run knip        # find unused code

# Components
bunx shadcn@latest add [component]  OR  npx shadcn@latest add [component]
```

## Security Checklist

- [ ] Zod for validation
- [ ] Environment vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCK_DATA`
- [ ] Rate limiting
- [ ] CSP headers to next.config.ts

## Documentation Lookup

**Always use MCP tools - never guess APIs:**

- **Next.js:** next-devtools MCP (init, docs, index, call) or Context7 → `/vercel/next.js`
- **React:** Context7 → `/facebook/react`
- **shadcn/ui:** shadcn MCP (search, view, get_examples, add_command)
- **Other libs:** Context7 → `resolve-library-id` then `query-docs`

**Migrations:** Use next-devtools MCP (upgrade_nextjs_16, enable_cache_components) + codemods

## File Conventions (App Router)

- `page.tsx` - Route UI
- `layout.tsx` - Shared layout
- `loading.tsx` - Suspense fallback
- `error.tsx` - Error boundary (Client Component)
- `not-found.tsx` - 404
- `route.ts` - API handler

## Current Architecture

**Data Flow:**
- External API calls via `NEXT_PUBLIC_API_URL`
- Mock data fallback when `NEXT_PUBLIC_USE_MOCK_DATA=true`
- No Server Actions currently implemented
- Client-side state: Zustand + React hooks

**Route Groups:**
- `(auth)`: login, register, verify-email, forgot/reset-password
- `(marketing)`: landing, about, features, resources, privacy, tos
- `(app)`: dashboard, applications, explore, persona-lab, profile
- `oauth`: OAuth success handling
- `onboarding`: user onboarding flow

## Installed Components

alert, avatar, badge, button, card, dialog, dropdown-menu, field, input, label, progress, scroll-area, select, separator, skeleton, tabs, toggle, toggle-group

**shadcn config:** New York style, slate base, CSS variables, Lucide icons

## Key Dependencies

- **Viz:** @xyflow/react, react-force-graph-2d, d3-force
- **UI:** framer-motion, class-variance-authority, clsx, tailwind-merge
- **Utils:** js-cookie, next-intl
- **Radix:** 10+ primitives (dialog, dropdown, select, tabs, etc.)

## Deployment Checklist

- [ ] Build passes (`bun run build`)
- [ ] Biome clean (`bun check:ci`)
- [ ] Knip clean (`bun knip`)
- [ ] Env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCK_DATA`
- [ ] Implement Zod validation for forms
- [ ] Add rate limiting + CSP headers
- [ ] Test i18n locales

## Biome Config

- **Format:** Tabs, double quotes
- **VCS:** Git integration enabled
- **CSS:** Tailwind directives support
- **Assist:** Auto-organize imports

## Path Aliases

```typescript
@/*            → ./*
@/components/* → ./components/*
@/lib/*        → ./lib/*
@/app/*        → ./app/*
```
