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
