import * as THREE from 'three';
import { createUranusRingGeometry } from './geometry';
import { createUranusRingMaterial } from './material';
import { loadTexture } from '../../../shared/three/texture-loader';
import { uranusTextures } from '../textures';
import { makeProceduralRingTexture } from '../../procedural';

export async function createUranusRingsMesh(isInspector = false): Promise<THREE.Mesh> {
  const inner = isInspector ? 1.65 : 2.3;
  const outer = isInspector ? 2.1 : 3.4;
  const geom = createUranusRingGeometry(inner, outer, isInspector ? 192 : 128);

  let map: THREE.Texture;
  if (isInspector) {
    map = await loadTexture(uranusTextures.paths.ring, uranusTextures.colorSpaces.ring);
  } else {
    map = makeProceduralRingTexture('uranus');
  }

  const mat = createUranusRingMaterial(map);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2;

  return mesh;
}

export * from './geometry';
export * from './material';
