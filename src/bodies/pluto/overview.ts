import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createPlutoOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'rock',
    palette: ['#7a5a45', '#d2b7a0', '#efe0d0'],
    options: { sc: 3, ct: 1 },
    radius: 0.35,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
