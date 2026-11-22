import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createVenusOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'bands',
    palette: ['#c9965a', '#e8c98f', '#f1dcae'],
    options: { f: 5, ct: 0.5 },
    radius: 1,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
