import * as THREE from 'three';
import { createRNG } from '../../../shared/math/rng';

export function createInspectorStarfield(count = 1600): THREE.Points {
  const rng = createRNG(42);
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = rng() * 2 - 1;
    const theta = rng() * Math.PI * 2;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    positions[i * 3] = 80 * s * Math.cos(theta);
    positions[i * 3 + 1] = 80 * u;
    positions[i * 3 + 2] = 80 * s * Math.sin(theta);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.5,
    sizeAttenuation: false,
    color: 0xbfc6d8,
    depthWrite: false,
  });

  return new THREE.Points(geom, mat);
}
