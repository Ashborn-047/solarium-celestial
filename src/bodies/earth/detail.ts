import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { earthTextures } from './textures';
import { applyNightLightsShader } from './night-lights';

export async function loadEarthDetailMaterial(
  sunUniform = { value: new THREE.Vector3(1, 0.3, 0.8).normalize() }
): Promise<THREE.MeshStandardMaterial> {
  const [map, normalMap, roughnessMap, emissiveMap] = await Promise.all([
    loadTexture(earthTextures.paths.surface, earthTextures.colorSpaces.surface),
    loadTexture(earthTextures.paths.normal, earthTextures.colorSpaces.normal),
    loadTexture(earthTextures.paths.roughness, earthTextures.colorSpaces.roughness),
    loadTexture(earthTextures.paths.nightLights, earthTextures.colorSpaces.nightLights),
  ]);

  const mat = new THREE.MeshStandardMaterial({
    map,
    normalMap,
    normalScale: new THREE.Vector2(0.9, 0.9),
    roughnessMap,
    roughness: 1,
    metalness: 0,
    emissiveMap,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.7,
  });

  applyNightLightsShader(mat, sunUniform);
  return mat;
}
