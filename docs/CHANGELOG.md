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


## Phase 3 — Texture Extraction, Celestial Bodies & Multi-Experience Router

- Extracted all 42 base64 textures from legacy files into organized public assets (`/public/textures/`)
- Preserved strict texture color-space manifest (linear for normal/bump/roughness/night, sRGB for albedo)
- Implemented Black Hole experience (`/black-hole`) with geodesic raymarching and post-processing bloom
- Implemented comprehensive Celestial Bodies library (Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, and 24 moons) with both procedural overview materials and high-fidelity detail materials
- Implemented Planetary Inspector experience (`/bodies`) with dynamic body loader, atmosphere shaders, Saturn/Uranus ring shadows, and Earth night light attenuation
- Implemented Solar System experience (`/solar-system`) with 3000-star background, 2200-asteroid belt, multi-body hierarchy, real orbital periods, smooth camera transitions, and dynamic 2D projected labels
- Built Central Hub page (`/`) with 4 navigational cards and lucide-react iconography
- Configured React Router with lazy-loaded code-split bundles and suspense fallbacks


## Phase 4 — Animations & Parity Verification

- Extracted and modularized 10 discrete animation handlers into `src/animations/` (`orbit`, `spin`, `tidal-lock`, `camera-transition`, `inertia`, `cloud-drift`, `belt-drift`, `sun-surface`, `bh-disk-time`, `intro-dolly`)
- Created automated Playwright verification suite (`scripts/parity-check.mjs`) using headless Chromium with SwiftShader software rasterizer (`--use-angle=swiftshader --enable-unsafe-swiftshader`)
- Verified visual parity with frozen clock `?freeze=1` across desktop (1280x800) and mobile (390x844) viewports against all legacy single-file HTML benchmarks
- Captured and committed 12 parity comparison screenshots under `docs/parity/`
- Confirmed deterministic star distribution, orbital velocities, camera transitions, and relativistic raymarch convergence


## Phase 5 — Standalone Single-File Builds

- Created entry points for router-free standalone builds (`single/black-hole.html`, `single/solar-system.html`, `single/bodies.html`, and `src/entries/`)
- Engineered automatic texture-inlining Vite plugin (`inlineTexturesPlugin`) in `vite.single.config.ts` converting `/textures/` paths to base64 data URIs exclusively in standalone builds
- Automated single-bundle builds with `inlineDynamicImports` in `scripts/build-single.mjs`
- Verified file size compliance: `black-hole.html` (0.82 MB), `solar-system.html` (8.27 MB), and `bodies.html` (8.25 MB) — all strictly under the 16 MB limit
- Automated headless browser tests confirming that all three standalone files open and render cleanly via `file://` URIs with zero network requests
