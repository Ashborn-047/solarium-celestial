import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createSaturnOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'bands',
    palette: ['#b89b64', '#e2cd94', '#f3e6c0'],
    options: { f: 9, ct: 0.6 },
    radius: 2.9,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
