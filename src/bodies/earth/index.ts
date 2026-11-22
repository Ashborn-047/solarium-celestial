import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { earthData } from './data';
import { earthTextures } from './textures';
import { createEarthOverviewMaterial } from './overview';
import { loadEarthDetailMaterial } from './detail';
import { createEarthAtmosphereMesh } from './atmosphere';
import { createEarthCloudsMesh } from './clouds';

export const earthDefinition: BodyDefinition = {
  data: earthData,
  createOverviewMaterial: createEarthOverviewMaterial,
  loadDetailMaterial: loadEarthDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => createEarthAtmosphereMesh(sunDir),
  createCloudsMesh: createEarthCloudsMesh,
  textures: earthTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
export * from './atmosphere';
export * from './clouds';
export * from './night-lights';
