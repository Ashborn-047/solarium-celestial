/**
 * Seeded pseudo-random number generator (mulberry32).
 * Guarantees deterministic rendering for procedural textures,
 * star fields, and asteroid belts across runs.
 */

export function createRNG(seed = 42): () => number {
  let s = seed >>> 0;
  return function (): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const defaultRNG = createRNG(42);
