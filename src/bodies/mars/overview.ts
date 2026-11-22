import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createMarsOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'rock',
    palette: ['#6e2f1a', '#b85a34', '#d98a55'],
    options: { sc: 3, ct: 1, cap: true },
    radius: 0.6,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
