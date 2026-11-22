import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { uranusTextures } from './textures';

export async function loadUranusDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(uranusTextures.paths.surface, uranusTextures.colorSpaces.surface);

  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.95,
    metalness: 0,
  });
}
