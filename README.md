<div align="center">

# 🪐 Solarium Celestial

**A state-of-the-art WebGL astronomical sandbox, multi-body solar system simulator, and relativistic Schwarzschild black hole visualizer.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://ashborn-047.github.io/solarium-celestial/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.dot.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![GLSL](https://img.shields.io/badge/GLSL-Shaders-555555?style=for-the-badge&logo=opengl)](https://www.khronos.org/opengl/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**Live Application**](https://ashborn-047.github.io/solarium-celestial/) • [**Architecture**](#-system-architecture) • [**Experiences**](#-core-experiences) • [**Controls**](#-controls--navigation) • [**Offline Bundles**](#-offline-distribution) • [**Topics**](#-topics--tags)

</div>

---

## 🌟 Overview

**Solarium Celestial** brings together high-precision celestial mechanics, custom GLSL astrophysics shaders, and responsive UI into a unified simulation suite. Built entirely from modular TypeScript and Three.js, it replaces legacy monolithic scripts with a scalable, componentized architecture adhering to a strict **200-line-per-file engineering standard**.

---

## 🌌 Core Experiences

### 1. 🪐 The Solar System (Primary Simulator)
- **Scale & Motion**: Real orbital periods, axial tilts, and semi-major axes for the Sun, 8 planets, Pluto, and 24 major moons.
- **Asteroid Belt**: Procedurally generated 2,200+ particle toroidal asteroid field with deterministic orbital distribution (`mulberry32`).
- **Dynamic Camera**: Toggle between smooth orbital body tracking and free-flight hover mode with Spacebar or Right-Click drag.
- **Proximity Moons**: Moon orbits and identity markers dynamically reveal themselves when cruising within close proximity (<180 units) or when focusing parent worlds.
- **Atmospheric & Lighting Realism**: Soft radial solar corona, dynamic shadow toggles, cloud drift layers, and planetary ring shadows.

### 2. 🌍 Planetary Inspector (`Solar Bodies`)
- **Photorealistic Texturing**: High-resolution albedo, displacement, night-side city emissions, and specular ocean maps.
- **Atmospheric Scattering**: Custom multi-layer Rayleigh & Mie glow shaders with sunset-rim coloration.
- **Deep Exploration**: Jump instantly to any planet or moon with one-click data chips displaying radius, semi-major axis, orbital period, and facts.

### 3. 🕳️ Gargantua (Relativistic Black Hole)
- **Null Geodesics**: Real-time raymarched curved spacetime around a Schwarzschild black hole.
- **Gravitational Lensing**: Light bending around the photon sphere ($r = 1.5 r_s$) with an Einstein ring and secondary Einstein images.
- **Accretion Disk**: Physically based volumetric disk with Keplerian orbital velocities, Doppler blue/red shifting, and relativistic beaming.

### 4. 💥 Collapse the Sun
- **Gravitational Collapse**: Interactive multi-stage timeline visualizing the catastrophic collapse of a G-type main-sequence star into a relativistic black hole.
- **Dynamic Transition**: Watch solar surface granulation stretch, compress, and ignite into an ultra-dense accretion disk.

---

## 🏗️ System Architecture

```
solarium-celestial/
├── src/
│   ├── app/                      # Application shell & routing
│   │   ├── hub/                  # Main visual portal & hero experience cards
│   │   ├── layout/               # Global navigation, ambient header & brand
│   │   └── router.tsx            # Lazy-loaded routes with GitHub Pages base
│   ├── bodies/                   # Planetary registry & body definitions
│   │   ├── <planet>/             # One folder per world (data, overview, detail, textures)
│   │   ├── definitions.ts        # Typed BodyDefinition interface
│   │   └── registry.ts           # Central body dictionary & hierarchical graph
│   ├── experiences/              # High-level simulation experiences
│   │   ├── solar-system/         # System engine, camera controller, HUD, HUD controls
│   │   ├── bodies/               # High-fidelity single-world inspector
│   │   └── black-hole/           # Raymarched relativistic spacetime renderer
│   └── shared/                   # Shared math, shaders, controls & utilities
│       ├── camera/               # OrbitControls & smooth lerp targets
│       ├── math/                 # Deterministic seeded RNG (mulberry32), Keplerian solvers
│       ├── shaders/              # Reusable GLSL chunks (noise, geodesic, atmosphere)
│       └── ui/                   # Cyberpunk glass HUD chips, sliders, loaders
├── public/                       # Assets, textures, and fonts
└── scripts/                      # Build scripts, line verification & offline bundlers
```

### 🔬 Shader Pipeline & Physics

```
               [ Solar Surface Shader ]
              /                        \
      Simplex 3D Noise           Limb Darkening (Lambert-Euler)
              \                        /
               --> Active Corona Glow <--

         [ Gargantua Raymarching Pipeline ]
                         │
              Screen Ray Direction
                         │
            Curved Null Geodesic Step (RK4)
            ┌────────────┴────────────┐
       Impacts Event Horizon     Misses (Skybox Lens)
            │                         │
     Total Absorption          Doppler-Shifted
      (Black Silhouette)       Accretion Lensing
```

---

## 🎮 Controls & Navigation

| Control | Action |
|---|---|
| **Left Click + Drag** | Orbit around the focused planet or system center |
| **Right Click + Drag** | Free hover look-around (dynamic camera orientation) |
| **Spacebar (Hold or Tap)** | Instantly enter/exit Free Flight Look mode |
| **Scroll Wheel** | Smooth zoom in / out with logarithmic boundaries |
| **`W` `A` `S` `D` / `Q` `E`** | Pan or elevate camera position |
| **`+` / `-` Buttons** | Adjust simulation time rate (`0.1d/s` to `30d/s`) |
| **Shadows Toggle** | Switch realistic planetary shadow casters on / off |
| **World Chips** | Focus on any planet, dwarf planet, or moon |

---

## ⚡ Engineering Standards

- **Strict 200-Line Limit**: Every single file (`.ts`, `.tsx`, `.css`, `.glsl`, `.json`) in `src/` is capped at $\le 200$ lines. Verified via ESLint and `scripts/check-lines.mjs`.
- **Deterministic Rendering**: All procedural surfaces, starfields, and asteroid distributions use seeded `mulberry32` PRNG for pixel-perfect deterministic reproduction across sessions.
- **Pure Dependency Stack**: Zero external CDN runtime dependencies — fully bundled via npm, Tree-shaken with Terser and Rollup code splitting.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

```bash
# Clone the repository
git clone https://github.com/Ashborn-047/solarium-celestial.git
cd solarium-celestial

# Install dependencies
npm install

# Start development server
npm run dev

# Run quality & line checks
npm run check-lines
npm run lint
npm run tsc

# Build production bundle
npm run build
```

---

## 📦 Offline Distribution

Solarium Celestial includes an offline packager that compiles individual experiences into completely standalone, single-file HTML applications with embedded textures and shaders.

```bash
npm run build:single
```

Outputs self-contained HTML files in `dist-single/`:
- `dist-single/solar-system.html`
- `dist-single/bodies.html`
- `dist-single/black-hole.html`

Double-click to run in any modern web browser without an internet connection or web server!

---

## 🏷️ Topics & Tags

`threejs` • `webgl` • `glsl` • `react` • `typescript` • `astronomy` • `solar-system` • `black-hole` • `gravitational-lensing` • `space-simulation` • `vite` • `procedural-generation`

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
