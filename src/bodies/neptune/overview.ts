import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createNeptuneOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'bands',
    palette: ['#22389a', '#3a62d9', '#6b93f0'],
    options: { f: 6, ct: 0.8 },
    radius: 1.75,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
