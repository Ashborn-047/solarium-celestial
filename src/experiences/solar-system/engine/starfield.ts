import * as THREE from 'three';
import { createRNG } from '../../../shared/math/rng';

export function createSolarStarfield(count = 3000): THREE.Points {
  const rng = createRNG(42);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = rng() * 2 - 1;
    const t = rng() * Math.PI * 2;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    const r = 3000;
    pos[i * 3] = r * s * Math.cos(t);
    pos[i * 3 + 1] = r * u;
    pos[i * 3 + 2] = r * s * Math.sin(t);

    const b = 0.35 + rng() * 0.65;
    const w = rng();
    col[i * 3] = b * (0.8 + 0.2 * w);
    col[i * 3 + 1] = b * 0.9;
    col[i * 3 + 2] = b * (1 - 0.25 * w);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.5,
    sizeAttenuation: false,
    vertexColors: true,
    depthWrite: false,
  });

  return new THREE.Points(geom, mat);
}
