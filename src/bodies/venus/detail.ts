import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { venusTextures } from './textures';
import { venusData } from './data';

export async function loadVenusDetailMaterial(): Promise<THREE.MeshStandardMaterial> {
  const map = await loadTexture(venusTextures.paths.surface, venusTextures.colorSpaces.surface);
  const bump = await loadTexture(venusTextures.paths.bump, venusTextures.colorSpaces.bump);

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: venusData.bump?.[1] ?? 0.5,
    roughness: 0.95,
    metalness: 0,
  });
}
