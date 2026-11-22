import * as THREE from 'three';
import { makeProceduralTexture } from '../procedural';

export function createSunOverviewMaterial(): THREE.MeshBasicMaterial {
  const tex = makeProceduralTexture({
    kind: 'sun',
    palette: ['#ffd36b', '#ff9a1f', '#e2560c'],
    radius: 6,
  });
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  mat.color.setScalar(1.25);
  return mat;
}
