# Architecture

## Overview

Celestial System is a modular Three.js application with four experiences:

1. **Hub** (`/`) — landing page with cards linking to each experience
2. **Solar System** (`/solar-system`) — full system with time controls
3. **Bodies Inspector** (`/bodies`) — single-body viewer with real textures
4. **Black Hole** (`/black-hole`) — raymarched Schwarzschild black hole

## Design Principles

### Three.js Engines Are Plain TS Classes

React handles DOM UI only. Three.js render loops and per-frame state live in
plain TypeScript "engine" classes with two methods:

```ts
interface Engine {
  mount(canvas: HTMLCanvasElement): void;
  dispose(): void;
}
```

A thin `useEngine` hook connects them to React's lifecycle.

### One GLSL Source, Multiple Experiences

Shared shader chunks live in `src/shared/shaders/chunks/`. The geodesic
raymarching loop in `geodesic.glsl` serves both the black-hole and
collapse-the-sun experiences via uniforms (`uR`, `uHeat`, `uDisk`, `uROUT`).

### Per-Body Folders

Each celestial body is a folder under `src/bodies/`:
```
<body>/
  data.ts       — typed orbital/physical data
  overview.ts   — cheap procedural material (solar-system view)
  detail.ts     — high-fidelity material (inspector view)
  textures.ts   — file paths + color space
  index.ts      — assembles BodyDefinition
```

### 200-Line Limit

No file exceeds 200 lines. When a module grows, split it into a folder
with an `index.ts` that re-exports. Enforced by ESLint (`.ts`/`.tsx`)
and `scripts/check-lines.mjs` (all file types).

## Folder Rules

```
src/
  app/           → Router, layout, hub page
  shared/
    three/       → Renderer, resize, loop, orbit controls, texture loader
    shaders/     → GLSL chunks shared across experiences
    ui/          → React UI components (Chip, InfoCard, SpeedControl, etc.)
    styles/      → Design tokens (tokens.css) and reset (base.css)
    types/       → TypeScript interfaces (BodyData, etc.)
    store.ts     → Zustand store (UI state only)
  bodies/        → One folder per body, shared by solar-system + inspector
  animations/    → One file per animation type
  experiences/   → Route-level pages with engine + UI sub-folders
```

## How to Add a New Planet or Moon

1. Create folder: `src/bodies/<name>/`
2. Write `data.ts` with `BodyData` (orbital params, facts)
3. Add texture files to `public/textures/<group>/`
4. Write `textures.ts` listing paths + color space
5. Write `overview.ts` (procedural `CanvasTexture`)
6. Write `detail.ts` (real texture `MeshStandardMaterial`)
7. Write `index.ts` re-exporting everything
8. Register in parent's `children` array
9. Register in `src/bodies/index.ts`
10. Run checks: `npm run lint && npm run check-lines && npm run tsc`

## Deterministic Mode

Append `?freeze=1` to any URL to freeze animation time at 0.
All procedural generation uses a seeded RNG (`mulberry32`, seed 42).

## WebGL Resilience

The app handles `webglcontextlost` and `webglcontextrestored` events
by rebuilding the engine. If WebGL2 is unavailable, a plain message is shown.
