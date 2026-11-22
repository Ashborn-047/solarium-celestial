import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createMercuryOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'rock',
    palette: ['#4f4b47', '#8b8680', '#b5aea4'],
    options: { sc: 4, ct: 1.1 },
    radius: 0.5,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
