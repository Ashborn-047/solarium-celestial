import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createEarthOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'earth',
    radius: 1.05,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
