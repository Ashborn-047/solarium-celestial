import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { neptuneTextures } from './textures';

export async function loadNeptuneDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(neptuneTextures.paths.surface, neptuneTextures.colorSpaces.surface);

  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.95,
    metalness: 0,
  });
}
