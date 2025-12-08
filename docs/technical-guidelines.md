# Technical Guidelines

This document defines the conventions and best practices for developing and maintaining the Leaply codebase.  It should be updated as the project evolves.

## Tech stack

The demo uses the following core technologies:

- **Next.js 16 with App Router** – emphasises React Server Components and Server Actions for data mutations. Use server components by default and add the `'use client'` directive only when interactive behaviour is required.
- **TypeScript** – all components and functions must be written in TypeScript. Prefer interfaces over type aliases when defining object shapes.
- **Tailwind 4** – primary styling solution. Avoid CSS modules or styled components. Utility classes should be used to compose layouts and spacing.
- **shadcn/ui** – base UI component library built on Radix UI and Tailwind 4. Whenever you need a new component, use the shadcn CLI, for example `npx shadcn@latest add button`, to fetch component into `components/ui` and customise as needed.
- **Framer Motion** – library for animations. Use it for page transitions, hover effects and list staggering.
- **Zustand** – lightweight global state management library. Use for any state shared across pages (e.g., user profile, saved universities). Keep state local with React hooks when possible.

## Project structure

- **App directory** (`app/`): Contains Next.js routes using the App Router. Each folder under `app/` corresponds to a URL path. Use `page.tsx` for route entry points and `layout.tsx` for nested layouts.
- **Components** (`components/`): Reusable presentational components such as navigation bars, footers and common UI widgets. Prefer extracting common UI into this folder instead of duplicating markup.
- **Lib** (`lib/`): Helper functions, API wrappers, models and utility classes. Business logic that is not UI‑specific belongs here.
- **Docs** (`docs/`): Internal documentation, including feature specifications, data requirements and coding guidelines.

## Development workflow

- Use **TypeScript** for all source files (`.ts`/`.tsx`). Keep types explicit where possible to catch errors early and prefer interfaces for object definitions.
- Run the development server with `npm run dev`. The Next.js 16 app router provides hot‑reloading via Turbopack, which significantly speeds up startup and code updates.
- Use `npm run build` to generate a production build.
- Environment variables should be stored in a `.env.local` file at the project root. Do **not** commit secrets to version control. Use `process.env` to reference variables.
- Ensure that server‑side code (API routes or Server Actions) is declared inside `app/` or `pages/api`. Server Actions require the `'use server'` directive inside asynchronous functions. Use Server Components by default and annotate components with `'use client'` only when you need interactive features (e.g., event handlers, stateful hooks).
- When integrating third‑party AI services, wrap API calls in functions under `lib/` and isolate credentials via environment variables. Avoid hard‑coding API keys.

## State management

- Use **Zustand** for global application state such as user profile, saved universities and application progress. Create a store in `lib/store.ts` and export hooks to access state.
- Keep component state local with `useState`/`useEffect` whenever the state does not need to persist across pages. Initialise demo data within the store to pre‑populate the UI without API calls.

## Animation guidelines

- Use Framer Motion for page transitions and interactive animations. Page transitions should run between **300–400 ms**. Hover effects should last around **200 ms**.
- Use easing functions: `easeOut` for elements entering the viewport and `easeIn` for exiting. Stagger children animations within lists or grids for a polished appearance.
- Implement skeleton loaders using shadcn/ui `Skeleton` or a custom component while data is “loading” (for the demo, skeletons can be simulated before showing pre‑populated data).

## Performance considerations

- Use the Next.js `Image` component for all images to leverage automatic optimisation. Provide width and height attributes.
- Implement lazy loading for content below the fold (e.g., long lists or details) using dynamic imports or the `loading="lazy"` attribute on images.
- Ensure animations change only `transform` and `opacity` properties to take advantage of GPU acceleration and avoid layout thrashing.

## Demo‑specific rules

These guidelines apply specifically to the two‑minute demo prototype:

- **No real API calls** – all data should be mocked and pre‑populated to ensure consistent and fast demo behaviour.
- **Pre‑populate user data** – fill out forms and lists with example information so the flow appears complete.
- **Disable form validation** – forms should accept any input without showing errors to avoid distracting from the visual flow.
- **Update UI state only** – button and link handlers should modify local or global state without sending network requests.
- **Focus on visual polish** – prioritise smooth animations, responsive layouts and accurate representation of final UI over full functionality.

## Coding conventions

- **Functional components**: Use React functional components exclusively. Compose behaviour with hooks instead of class components. Extract logic into custom hooks when it’s reused.
- **Naming**: Use descriptive, camelCase names for variables and functions. Component names should be PascalCase.
- **Folder naming**: Route folders mirror the URL structure (e.g., `app/dashboard/tasks/page.tsx` corresponds to `/dashboard/tasks`). Use lowercase folder names.
- **Imports**: Prefer absolute imports using the configured path aliases (e.g., `@/components/Navbar`) instead of relative paths like `../../../components/Navbar`.
- **State management**: Use local state via hooks for component‑specific behaviour and Zustand for global state. Avoid prop drilling by reading from the store via custom hooks. See the “State management” section above.
- **Styling**: Use Tailwind CSS for all styling. Compose layouts with utility classes; avoid writing custom CSS where possible. Use shadcn/ui components as a base, and extend them with Tailwind classes. Keep CSS confined to a small number of utility overrides when necessary.
- **Testing**: Add unit tests for critical business logic under a `tests/` directory. Use a testing framework such as Jest and React Testing Library.
- **Commit messages**: Follow the conventional commits style (`feat:`, `fix:`, `docs:`, `refactor:`…) to maintain a clean git history.

## Deployment

- The project targets deployment on **Vercel** or compatible Node.js hosting. The default `next.config.js` is configured with the app router. Update the configuration if you need redirects or custom headers.
- Configure environment variables in the hosting dashboard (e.g., `NEXT_PUBLIC_API_URL`, `AI_API_KEY`).
- Use `npm run build` followed by `npm start` in production. Ensure that build artifacts are not committed.