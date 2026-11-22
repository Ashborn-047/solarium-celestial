import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { mercuryTextures } from './textures';
import { mercuryData } from './data';

export async function loadMercuryDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(mercuryTextures.paths.surface, mercuryTextures.colorSpaces.surface);
  const bump = await loadTexture(mercuryTextures.paths.bump, mercuryTextures.colorSpaces.bump);

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: mercuryData.bump?.[1] ?? 0.6,
    roughness: 0.95,
    metalness: 0,
  });
}
