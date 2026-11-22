# Changelog

All notable changes to this project are documented here.

## Phase 1 — Scaffold

- Initialized Vite + TypeScript (strict) + React 18 project
- Installed Three.js 0.160.x, zustand, react-router-dom, lucide-react
- Installed @fontsource/bricolage-grotesque
- Created ESLint config with max-lines: 200 (for .ts/.tsx)
- Created `scripts/check-lines.mjs` (covers .css, .glsl, .json too)
- Created `scripts/extract-textures.mjs` (base64 → image files)
- Set up husky pre-commit hook with lint-staged
- Created directory skeleton matching target architecture
- Created README.md, AGENTS.md, docs/DECISIONS.md, docs/CHANGELOG.md
- Set up .gitignore (legacy/ excluded from repo)
- Installed and configured Graphify (graphifyy via uv)
- Created .graphifyignore
- Added vercel.json for SPA deployment
- Copied four legacy HTML files to legacy/ (local-only)

## Phase 2 — Shared Layer

- Added design tokens (`tokens.css`) and global typography styles (`base.css`)
- Implemented deterministic seeded RNG (`createRNG`, `mulberry32`, seed 42)
- Added Three.js engine lifecycle utilities: WebGL2 detection, context lost/restored handling, mobile-optimized pixel ratio (`renderer.ts`)
- Added window resize subscription handler (`resize.ts`)
- Added RAF RenderLoop with `?freeze=1` time-freezing support (`render-loop.ts`)
- Implemented multi-touch drag, pinch-to-zoom, and inertia orbit controls (`orbit-controls.ts`)
- Added robust texture loader with 20s timeout and flat-grey fallback (`texture-loader.ts`)
- Added recursive scene/material/texture/geometry resource disposal (`dispose.ts`)
- Created thin `useEngine` React hook bridging Three.js engines to React lifecycle
- Created shared Zustand store for simulation state, speed, selection, and collapse flags (`store.ts`)
- Built modular UI components: `Chip`, `InfoCard`, `SpeedControl`, `BodyChips`, `Loader`
- Extracted and organized shared GLSL chunks (`noise.glsl`, `tonemap.glsl`, `fresnel.glsl`, `stars.glsl`, `doppler.glsl`, `disk.glsl`, `geodesic.glsl`)
