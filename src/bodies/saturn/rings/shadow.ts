import * as THREE from 'three';

export function createRingShadowMaterial(map: THREE.Texture): THREE.MeshDepthMaterial {
  return new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map,
    alphaTest: 0.5,
  });
}
