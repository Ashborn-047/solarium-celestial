import * as THREE from 'three';

export function createUranusRingMaterial(map: THREE.Texture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    side: THREE.DoubleSide,
    roughness: 1,
    depthWrite: false,
  });
}
