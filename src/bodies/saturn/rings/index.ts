import * as THREE from 'three';
import { createRingGeometry } from './geometry';
import { createRingMaterial } from './material';
import { createRingShadowMaterial } from './shadow';
import { loadTexture } from '../../../shared/three/texture-loader';
import { saturnTextures } from '../textures';
import { makeProceduralRingTexture } from '../../procedural';

export async function createSaturnRingsMesh(isInspector = false): Promise<THREE.Mesh> {
  const inner = isInspector ? 1.24 : 3.5;
  const outer = isInspector ? 2.33 : 6.6;
  const geom = createRingGeometry(inner, outer, isInspector ? 192 : 128);

  let map: THREE.Texture;
  if (isInspector) {
    map = await loadTexture(saturnTextures.paths.ring, saturnTextures.colorSpaces.ring);
  } else {
    map = makeProceduralRingTexture('saturn');
  }

  const mat = createRingMaterial(map);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2;

  if (isInspector) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.customDepthMaterial = createRingShadowMaterial(map);
  }

  return mesh;
}

export * from './geometry';
export * from './material';
export * from './shadow';
