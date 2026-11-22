import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createJupiterOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'bands',
    palette: ['#8a5a36', '#d9b98d', '#f1e3c9', '#b5754a', '#e8d3ae'],
    options: { f: 16, ct: 1 },
    radius: 3.4,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
