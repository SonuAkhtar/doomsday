# Doomsday

A cinematic web app for tracking which Marvel Cinematic Universe films to watch before **Avengers: Doomsday**.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- CSS Modules with a centralized design system (`styles/variables.css`)
- Framer Motion (confirmation dialog only)
- Vitest for unit tests

No Tailwind, no UI component libraries, no runtime data dependencies — the movie catalog is curated static data.

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest
```

## Structure

- `app/` — routes: Home, All Movies, Before Doomsday, Watched, Movie details
- `components/` — one folder per component (`.tsx` + `.module.css`)
- `data/movies.ts` — the curated MCU catalog and the Before Doomsday journey
- `lib/` — watched-state store, progress calculation, filtering, formatting
- `styles/variables.css` — colors, typography, spacing, radii, shadows, motion tokens
- `types/` — the application movie model

## Watched state

Watched films are stored in `localStorage` behind a single `useSyncExternalStore`-based
context, so progress is consistent across every page and survives refreshes.

## Data note

Avengers: Doomsday has not been released and its plot has not been officially detailed.
The "Before Doomsday" journey reflects films connected to its known cast and story threads;
it does not present speculation as confirmed fact.
