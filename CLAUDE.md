# CLAUDE.md

## Project Overview

This is a collection of creative coding experiments and interactive toys — a
single-repo Vite project with 25+ mini-apps sharing a common library. Each app
is a standalone interactive demo (drawing tools, terrain generators, blob
factories, physics simulations, WebGL experiments, etc.) served from its own
HTML entry point.

**Author:** Alex (`alex@dytry.ch`)
**Live site:** Deployed to GitHub Pages via `gh-pages` branch

## Tech Stack

- **Language:** TypeScript (strict mode)
- **UI:** React 18, React Router DOM (hash routing)
- **Styling:** Tailwind CSS 3 (custom `cyber-*` color palette)
- **Build:** Vite 5, Yarn 4 (PnP)
- **Testing:** Vitest
- **Linting:** ESLint 9 (flat config), Prettier
- **Graphics:** Three.js, Pixi.js, tldraw, raw Canvas/WebGL
- **WASM:** Rust via `wasm-pack` (two crates: `slomojs`, `sim`)
- **State:** React hooks + `@tldraw/state` (signals/atoms)

## Project Structure

```
src/
├── lib/                    # Shared utilities and hooks
│   ├── assert.ts           # Custom assertions with auto-generated messages
│   ├── schema.tsx          # Runtime type validation
│   ├── Result.ts           # Rust-style Result<T, E>
│   ├── utils.ts            # Math, array, general helpers
│   ├── signia.tsx          # Decorator-based reactive state (@memo, @reactive)
│   ├── storage.tsx         # localStorage wrapper with schema validation
│   ├── theme.tsx           # Auto-generated Tailwind color exports
│   ├── EventEmitter.tsx    # Event subscription pattern
│   ├── Ticker.tsx          # Animation frame ticker
│   ├── Spring.tsx          # Spring physics animation
│   ├── geom/               # Vector2, Vector3, AABB, Matrix, bezier, paths
│   ├── gl/                 # WebGL helpers
│   ├── hooks/              # React hooks (useEvent, useGestureDetector, etc.)
│   ├── live/               # Live reactivity system (runLive effects)
│   ├── signals/            # Signal-based state
│   └── scene/              # Scene management
├── bees/                   # Individual toy apps
├── blob-factory/
├── blob-tree/
├── emoji/
├── geometry/
├── gestureland/
├── splatapus/ splatapus2/ splatapus3/
├── terrain/
├── ... (25+ more)
├── index.html              # Landing page
└── tailwind.css
```

Each toy has its own directory with an `index.html` entry point and a
`*-main.tsx` file. Vite auto-discovers all `src/**/*.html` files as entry
points.

## Commands

```sh
yarn dev              # Start dev server (alias: yarn serve)
yarn build            # Production build
yarn types            # TypeScript type checking (tsc --build)
yarn lint             # ESLint
yarn test             # Vitest (watch mode)
yarn check            # Run all checks: types + lint + test
yarn format           # Prettier (writes changes)
yarn build:rust       # Build Rust/WASM crates via wasm-pack
```

**CI runs `yarn check`** (types → lint → test) on push to `main`.

## Code Conventions

### Imports

- **Always use `@/` path alias** for imports (maps to `src/`).
- **No relative imports.** This is enforced by ESLint
  (`no-relative-import-paths`).

```tsx
// Good
import { assertExists } from "@/lib/assert";
import { BlobFactory } from "@/blob-factory/BlobFactory";

// Bad — will fail lint
import { assertExists } from "../lib/assert";
```

### TypeScript

- Strict mode enabled. No `noImplicitAny` overrides.
- `any` is explicitly allowed (`@typescript-eslint/no-explicit-any: off`).
- Unused variables must be prefixed with `_` (warning level).
- Function arguments are never checked for unused status.

### Formatting (Prettier)

- **4-space indentation**
- `printWidth: 80`
- `trailingComma: "all"`
- `experimentalTernaries: true`
- Auto-import organization via `prettier-plugin-organize-imports`

### React

- Functional components only.
- Props are typically inlined as object types in the function signature.
- Custom hooks in `src/lib/hooks/` — use `useEvent()` for stable callbacks,
  `useResizeObserver()` for size tracking, `useGestureDetector()` for
  touch/pointer input.
- `useLive` hook is registered in the ESLint `exhaustive-deps` rule.

### Styling

- Tailwind CSS utility classes — no CSS modules, no styled-components.
- Custom color palette: `cyber-grey`, `cyber-red`, `cyber-orange`,
  `cyber-yellow`, `cyber-green`, `cyber-cyan`, `cyber-blue`, `cyber-indigo`,
  `cyber-purple`, `cyber-pink` (each with shades 0/5–100).
- Custom easing functions: `in-back`, `out-back` and `md`/`xl` variants.
- Use `classNames()` (from the `classnames` package) for conditional classes.

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- App entry files: `*-main.tsx` or `*-main.ts`
- Each toy has an `index.html` that loads its main file

### Assertions

The project uses a custom `assert()` / `assertExists()` from `@/lib/assert`.
A Babel plugin in `vite.config.ts` automatically injects the expression text
as the error message, so single-argument calls are preferred:

```tsx
assert(value !== null);     // message auto-generated at build time
assertExists(document.getElementById("root"));
```

### State Management

- Standard React hooks for simple component state.
- `@tldraw/state` signals/atoms for reactive class-based state.
- Decorator-based reactivity via `@/lib/signia.tsx`: `@memo`, `@reactive`,
  `@action`.

## Adding a New Toy

1. Create a new directory under `src/` (e.g., `src/my-toy/`).
2. Add an `index.html` that loads a main script:
   ```html
   <!doctype html>
   <html lang="en">
   <head><meta charset="UTF-8" /><title>My Toy</title></head>
   <body><div id="root"></div>
   <script type="module" src="./my-toy-main.tsx"></script>
   </body></html>
   ```
3. Create `my-toy-main.tsx` with the standard entry pattern:
   ```tsx
   import { assertExists } from "@/lib/assert";
   import { createRoot } from "react-dom/client";
   import { App } from "@/my-toy/App";

   createRoot(assertExists(document.getElementById("root"))).render(<App />);
   ```
4. Vite will auto-discover the new entry point — no config changes needed.

## CI/CD

GitHub Actions workflow (`.github/workflows/build.yml`):
- Triggers on push to `main`
- Installs Node 18, Rust (stable), wasm-pack
- Runs `yarn --immutable`, `yarn build:rust`, `yarn build`, `yarn check`
- Deploys built artifacts to `gh-pages` branch
