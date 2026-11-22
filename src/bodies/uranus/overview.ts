import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createUranusOverviewMaterial(): THREE.MeshStandardMaterial {
  const tex = makeProceduralTexture({
    kind: 'bands',
    palette: ['#86cfd6', '#a9e6ea', '#c2f0f1'],
    options: { f: 4, ct: 0.25 },
    radius: 1.8,
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
}
