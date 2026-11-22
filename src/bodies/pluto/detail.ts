import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { plutoTextures } from './textures';

export async function loadPlutoDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(plutoTextures.paths.surface, plutoTextures.colorSpaces.surface);

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: map,
    bumpScale: 0.3,
    roughness: 0.95,
    metalness: 0,
  });
}
