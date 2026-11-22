import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { jupiterTextures } from './textures';

export async function loadJupiterDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(jupiterTextures.paths.surface, jupiterTextures.colorSpaces.surface);

  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.95,
    metalness: 0,
  });
}
