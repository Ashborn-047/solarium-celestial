import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { saturnTextures } from './textures';

export async function loadSaturnDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(saturnTextures.paths.surface, saturnTextures.colorSpaces.surface);

  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.95,
    metalness: 0,
  });
}
