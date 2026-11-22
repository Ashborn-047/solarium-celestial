# Celestial System

Modular Three.js solar system, body inspector, and black hole experiences — refactored from four monolithic HTML apps into a clean TypeScript + React + Vite codebase.

## Stack

- **Vite + TypeScript** (strict) + **React 18** (DOM UI only)
- **Three.js 0.160.x** from npm
- **zustand** for UI state
- **vite-plugin-glsl** with `#include` for shared GLSL chunks
- **CSS Modules** + design tokens via `@fontsource/bricolage-grotesque`
- **react-router-dom** with lazy-loaded routes

## Routes

| Path | Experience |
|---|---|
| `/` | Hub — four cards linking to each experience |
| `/solar-system` | Full solar system with time controls |
| `/bodies` | Single-body inspector with real texture maps |
| `/black-hole` | Raymarched Schwarzschild black hole |

## Quick Start

```bash
npm install
npm run dev        # Vite dev server
npm run build      # Production build
npm run build:single  # One self-contained HTML per experience
npm run lint       # ESLint (max-lines: 200 for .ts/.tsx)
npm run check-lines   # All src/ files ≤ 200 lines (.ts/.tsx/.css/.glsl/.json)
```

## Texture Extraction

Textures are extracted from the legacy file and committed to `public/textures/`.
To re-extract (requires `legacy/solar-bodies.html` locally):

```bash
node scripts/extract-textures.mjs
```

## Graphify (Code Knowledge Graph)

```bash
# Install (one-time)
uv tool install graphifyy
graphify antigravity install

# Build graph
graphify .

# Query
graphify query "how does the collapse timeline work"
graphify path "sun/surface.glsl" "black-hole/engine"

# Auto-rebuild on commit
graphify hook install
```

## Deploy

Deploy target is **Vercel**. The `vercel.json` rewrites all routes to `index.html` for the SPA router.

## TODO (for repo owner)

- [ ] Create GitHub repo and push
- [ ] Remove `legacy/` from local disk after confirming all textures are committed
  (`legacy/` is `.gitignored` and never committed)

See also:
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [AGENTS.md](AGENTS.md)
- [CREDITS.md](docs/CREDITS.md)
- [CHANGELOG.md](docs/CHANGELOG.md)
- [DECISIONS.md](docs/DECISIONS.md)
