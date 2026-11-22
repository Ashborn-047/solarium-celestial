# AGENTS.md — Celestial System

## 200-Line Rule

Every file in `src/` must be **200 lines or fewer**, including `.ts`, `.tsx`, `.css`, `.glsl`, and `.json` data files.

**Enforcement:**
- **ESLint `max-lines`** covers `.ts` and `.tsx` files only.
- **`scripts/check-lines.mjs`** covers `.css`, `.glsl`, and `.json` as well.
- Both run in the **pre-commit hook** (husky + lint-staged) and in CI.
- Target range: 60–150 lines per file.

If a module approaches 150 lines, split it into a folder:
```
my-module/
  index.ts       ← re-exports only
  sub-a.ts       ← one responsibility
  sub-b.ts       ← one responsibility
```

## GLSL Conventions

- Shared chunks live in `src/shared/shaders/chunks/`.
- Use `#include` with **relative paths** (not the `@` alias):
  ```glsl
  #include ../../shared/shaders/chunks/noise.glsl
  ```
- One GLSL file = one function or one logical block.
- The same `noise.glsl`, `geodesic.glsl`, etc. are shared across experiences.

## Folder Template (Planet / Moon)

```
src/bodies/<name>/
  data.ts        ← BodyData: facts, radius, orbit, spin, tilt
  overview.ts    ← cheap procedural material for solar-system view
  detail.ts      ← high-fidelity material (real maps, bump, atmosphere)
  textures.ts    ← manifest: file paths + color space
  index.ts       ← assembles BodyDefinition, re-exports
```

Special bodies add sub-folders: `earth/atmosphere/`, `saturn/rings/`, `sun/collapse/`.

## How to Add a New Planet or Moon

1. Create `src/bodies/<name>/` with the five files above.
2. Add texture images to `public/textures/<group>/`.
3. Register the body in `src/bodies/index.ts`.
4. Add a `BodyData` entry with orbital parameters.
5. Create `overview.ts` with procedural canvas texture.
6. Create `detail.ts` with real texture material.
7. Add to the parent's `children` array in its `data.ts`.
8. Labels and chips appear automatically from the data registry.
9. Run `npm run check-lines` and `npm run lint`.
10. Rebuild graph: `graphify .`

## Deterministic Rendering

- All procedural textures, starfields, and asteroid belts use a **seeded RNG**
  (`mulberry32` with fixed seed) instead of `Math.random()`.
- Append `?freeze=1` to any URL to freeze time at 0 for parity screenshots.
- Minor differences from legacy (which used `Math.random()`) are expected and logged.

## Graphify Workflow

After every phase and before every commit:
```bash
graphify .              # rebuild the knowledge graph
graphify query "..."    # answer codebase questions
graphify path "A" "B"   # find connections
```

## After Each Phase

1. `npm run lint` — ESLint passes
2. `npm run check-lines` — all files ≤ 200 lines
3. `npx tsc --noEmit` — TypeScript strict passes
4. `npm run build` — Vite build succeeds
5. `graphify .` — graph refreshed
6. `git commit` — conventional commit
7. Append to `docs/CHANGELOG.md`
