import * as THREE from 'three';
import { createRNG } from '../../../shared/math/rng';

export function createAsteroidBelt(count = 2200): THREE.Points {
  const rng = createRNG(1337);
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = 34 + rng() * 6;
    const t = rng() * Math.PI * 2;
    pos[i * 3] = Math.cos(t) * r;
    pos[i * 3 + 1] = (rng() - 0.5) * 1.4;
    pos[i * 3 + 2] = Math.sin(t) * r;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x9a928a,
    size: 1.4,
    sizeAttenuation: false,
  });

  return new THREE.Points(geom, mat);
}
