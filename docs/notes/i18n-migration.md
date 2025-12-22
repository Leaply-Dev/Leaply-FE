# Internationalization (i18n) Migration Guide

This document describes the migration from the old client-side i18n setup to the recommended Next.js server-side i18n pattern.

## Overview

The application now uses the recommended Next.js i18n pattern with:
- URL-based locale routing (`/en/...`, `/vi/...`)
- Server-side dictionary loading
- Automatic locale detection and redirection via middleware

## Architecture

### File Structure

```
app/
  [lang]/                          # Dynamic locale segment
    dictionaries.ts                # Dictionary loader and locale types
    layout.tsx                     # Root layout with lang validation
    (app)/                         # App route group
    (auth)/                        # Auth route group
    (marketing)/                   # Marketing route group
    globals.css                    # Global styles
    
dictionaries/
  en.json                          # English translations
  vi.json                          # Vietnamese translations
  
proxy.ts                           # Middleware for locale detection/redirection

components/
  LocaleSync.tsx                   # Syncs URL locale with language store
  LanguageSwitcher.tsx             # Client component for language switching
```

### Key Components

#### 1. Locale Detection (proxy.ts)

The middleware automatically:
- Detects user's preferred language from `Accept-Language` header
- Redirects requests without a locale to the appropriate locale path
- Example: `/dashboard` → `/vi/dashboard` (for Vietnamese users)

#### 2. Dictionary System

**Server-Side Loading:**
```typescript
// app/[lang]/dictionaries.ts
import "server-only";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  vi: () => import("@/dictionaries/vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
```

**Usage in Server Components:**
```typescript
import { getDictionary, type Locale } from "../dictionaries";
import type { PageProps } from "next";

export default async function MyPage({ params }: PageProps<"[lang]">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  return <h1>{dict.common.title}</h1>;
}
```

#### 3. Language Switcher

The `LanguageSwitcher` component now uses Next.js router navigation:
- Preserves the current path while changing the locale
- Example: Switching from `/en/dashboard` to `/vi/dashboard`

**Usage:**
```typescript
<LanguageSwitcher currentLocale={locale} />
```

#### 4. Compatibility Layer

For components still using the old `useTranslation` hook, a compatibility layer exists:

**LocaleSync Component:**
- Syncs the URL locale with the Zustand language store
- Included in the root layout
- Allows existing components to continue working during migration

## Migration Path

### For New Components

**Server Components (Recommended):**
```typescript
import { getDictionary, type Locale } from "@/app/[lang]/dictionaries";

export default async function MyComponent({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  
  return <div>{dict.section.key}</div>;
}
```

**Client Components:**
```typescript
"use client";

type Dictionary = Record<string, any>;

interface MyComponentProps {
  locale: Locale;
  translations: Dictionary;
}

export function MyComponent({ locale, translations }: MyComponentProps) {
  const t = (section: string, key: string) => {
    return translations[section]?.[key] || key;
  };
  
  return <div>{t("section", "key")}</div>;
}
```

### For Existing Components (Temporary)

Components using `useTranslation()` will continue to work thanks to:
1. `LocaleSync` component syncing URL locale → language store
2. Existing `lib/i18n/translations.ts` and `useTranslation.ts` files

**Gradual Migration:**
- Priority 1: Update Navbar and major layout components
- Priority 2: Update page components
- Priority 3: Update smaller client components
- Keep compatibility layer until all components are migrated

## Adding New Translations

1. Add to `dictionaries/en.json`:
```json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

2. Add to `dictionaries/vi.json`:
```json
{
  "newSection": {
    "newKey": "Vietnamese text"
  }
}
```

3. Use in components:
```typescript
// Server component
const dict = await getDictionary(locale);
<p>{dict.newSection.newKey}</p>

// Client component (old way - still works)
const { t } = useTranslation();
<p>{t("newSection", "newKey")}</p>
```

## Routing

All routes are now under the `[lang]` segment:

| Old Route | New Route |
|-----------|-----------|
| `/` | `/vi/` or `/en/` |
| `/dashboard` | `/vi/dashboard` or `/en/dashboard` |
| `/explore` | `/vi/explore` or `/en/explore` |

Links should include the locale:
```typescript
// In client components with locale prop
<Link href={`/${locale}/dashboard`}>Dashboard</Link>

// Or let the middleware handle it (will redirect based on user preference)
<Link href="/dashboard">Dashboard</Link>
```

## Static Generation

The root layout defines static params for both locales:

```typescript
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}
```

This enables static generation for both language versions at build time.

## Benefits

1. **SEO**: Each language has its own URL
2. **Performance**: Translations loaded server-side, reduced client bundle
3. **Shareable**: Users can share language-specific URLs
4. **Next.js Standard**: Follows official Next.js recommendations
5. **Type Safety**: Strong typing for locales with TypeScript

## Troubleshooting

### Issue: Component shows wrong language
**Solution**: Ensure `LocaleSync` is included in root layout and component receives correct `locale` prop

### Issue: Links don't preserve language
**Solution**: Include locale in Link href: `href={/${locale}/path}` or use router.push with locale

### Issue: "not found" error
**Solution**: Check that route is under `app/[lang]/` directory and locale validation is working

## Future Improvements

1. Remove old i18n files (`lib/i18n/*`) after full migration
2. Remove `useLanguageStore` and Zustand language state
3. Add more locales by updating `dictionaries.ts` and `proxy.ts`
4. Consider dynamic imports for dictionary chunks to optimize bundle size


