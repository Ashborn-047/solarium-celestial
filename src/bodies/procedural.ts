import * as THREE from 'three';
import { createRNG } from '../shared/math/rng';

const TAU = Math.PI * 2;
const rng = createRNG(42);

function h3(x: number, y: number, z: number): number {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}

function vn(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  let fx = x - ix, fy = y - iy, fz = z - iz;
  fx *= fx * (3 - 2 * fx);
  fy *= fy * (3 - 2 * fy);
  fz *= fz * (3 - 2 * fz);
  const L = (a: number, b: number, t: number) => a + (b - a) * t;
  return L(
    L(L(h3(ix, iy, iz), h3(ix + 1, iy, iz), fx), L(h3(ix, iy + 1, iz), h3(ix + 1, iy + 1, iz), fx), fy),
    L(L(h3(ix, iy, iz + 1), h3(ix + 1, iy, iz + 1), fx), L(h3(ix, iy + 1, iz + 1), h3(ix + 1, iy + 1, iz + 1), fx), fy),
    fz
  );
}

function fbm(x: number, y: number, z: number): number {
  let a = 0.5, s = 0;
  for (let i = 0; i < 4; i++) {
    s += a * vn(x, y, z);
    x = x * 2.03 + 5.1;
    y = y * 2.03 + 3.3;
    z = z * 2.03 + 7.7;
    a *= 0.5;
  }
  return s;
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.substring(i, i + 2), 16));
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const cl = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

function ramp(st: number[][], t: number): number[] {
  t = cl(t) * (st.length - 1);
  const i = Math.min(Math.floor(t), st.length - 2);
  return mix(st[i], st[i + 1], t - i);
}

export interface ProceduralConfig {
  kind: 'bands' | 'earth' | 'sun' | 'rock';
  palette?: string[];
  options?: {
    sc?: number;
    ct?: number;
    f?: number;
    two?: boolean;
    cap?: boolean;
  };
  radius: number;
}

export function makeProceduralTexture(cfg: ProceduralConfig): THREE.CanvasTexture {
  const { kind, palette = [], options = {}, radius } = cfg;
  const W = radius >= 1.7 ? 512 : radius >= 0.9 ? 384 : radius >= 0.3 ? 256 : 128;
  const H = W / 2;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const cx = cv.getContext('2d')!;
  const im = cx.createImageData(W, H);
  const D = im.data;
  const st = palette.map(hex);
  const sd = rng() * 50;

  for (let y = 0; y < H; y++) {
    const lat = (y / H - 0.5) * Math.PI;
    const c = Math.cos(lat);
    const py = Math.sin(lat);
    for (let x = 0; x < W; x++) {
      const lon = (x / W) * TAU;
      const px = c * Math.cos(lon);
      const pz = c * Math.sin(lon);
      let col: number[];

      if (kind === 'bands') {
        const ct = options.ct || 1;
        let t = 0.5 + 0.5 * Math.sin(py * (options.f || 8) + 4 * fbm(px * 2 + sd, py * 5, pz * 2));
        t = 0.5 + (t - 0.5) * ct + (fbm(px * 9, py * 30, pz * 9) - 0.5) * 0.3 * ct;
        col = ramp(st, t);
      } else if (kind === 'earth') {
        const n = fbm(px * 2.4 + sd, py * 2.4, pz * 2.4);
        if (n < 0.5) {
          col = mix([6, 28, 78], [24, 86, 156], n * 2);
        } else {
          const t = cl((n - 0.5) * 4);
          col = mix([46, 108, 50], [160, 132, 86], cl(t * 0.6 + Math.abs(py) * 0.25));
        }
        if (Math.abs(py) > 0.86 - 0.12 * n) col = [236, 242, 248];
        const k = fbm(px * 4 + 9, py * 7, pz * 4) - 0.55;
        if (k > 0) col = mix(col, [255, 255, 255], Math.min(1, k * 5) * 0.85);
      } else if (kind === 'sun') {
        col = ramp(st, 0.3 + fbm(px * 8 + sd, py * 8, pz * 8) * 1.1);
      } else {
        const s = options.sc || 4;
        let t =
          0.5 +
          ((fbm(px * s + sd, py * s, pz * s) - 0.5) * 1.6 +
            (fbm(px * s * 3, py * s * 3, pz * s * 3) - 0.5) * 0.5) *
            (options.ct || 1);
        if (options.two) t += -0.32 * Math.tanh(px * 5);
        col = ramp(st, t);
        if (options.cap && Math.abs(py) > 0.9 - 0.08 * fbm(px * 5, py * 5, pz * 5)) {
          col = mix(col, [240, 244, 250], 0.85);
        }
      }

      const idx = (y * W + x) * 4;
      D[idx] = col[0];
      D[idx + 1] = col[1];
      D[idx + 2] = col[2];
      D[idx + 3] = 255;
    }
  }

  cx.putImageData(im, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function makeProceduralRingTexture(kind: 'saturn' | 'uranus'): THREE.CanvasTexture {
  const W = 512;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = 1;
  const cx = cv.getContext('2d')!;
  const im = cx.createImageData(W, 1);

  for (let i = 0; i < W; i++) {
    const f = i / (W - 1);
    let a = 0;
    if (kind === 'saturn') {
      a = f < 0.1 ? 0 : f < 0.22 ? 0.25 : f < 0.5 ? 0.88 : f < 0.56 ? 0.04 : f < 0.97 ? 0.62 : 0;
      if (f > 0.88 && f < 0.9) a = 0.08;
    } else {
      for (const s of [0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) {
        if (Math.abs(f - s) < 0.012) a = 0.55;
      }
    }
    a *= 0.7 + 0.3 * vn(f * 120, 1, 2);
    const g = kind === 'saturn' ? [232, 212, 168] : [170, 185, 190];
    im.data.set([g[0], g[1], g[2], Math.round(a * 255)], i * 4);
  }

  cx.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,220,150,1)');
  g.addColorStop(0.25, 'rgba(255,160,60,.5)');
  g.addColorStop(1, 'rgba(255,120,30,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
