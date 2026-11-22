import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { marsTextures } from './textures';
import { marsData } from './data';

export async function loadMarsDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(marsTextures.paths.surface, marsTextures.colorSpaces.surface);
  const bump = await loadTexture(marsTextures.paths.bump, marsTextures.colorSpaces.bump);

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: marsData.bump?.[1] ?? 0.8,
    roughness: 0.95,
    metalness: 0,
  });
}
