import * as THREE from 'three';
import { loadTexture } from '../../../shared/three/texture-loader';
import { earthTextures } from '../textures';

export async function createEarthCloudsMesh(): Promise<THREE.Mesh> {
  const map = await loadTexture(earthTextures.paths.clouds, earthTextures.colorSpaces.clouds);
  const geom = new THREE.SphereGeometry(1.007, 128, 64);
  const mat = new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    depthWrite: false,
    roughness: 1,
  });
  return new THREE.Mesh(geom, mat);
}
