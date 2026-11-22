import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { sunData } from './data';
import { sunTextures } from './textures';
import { createSunOverviewMaterial } from './overview';
import { loadSunDetailMaterial } from './detail';
import { createSunCorona } from './corona';

export const sunDefinition: BodyDefinition = {
  data: sunData,
  createOverviewMaterial: createSunOverviewMaterial,
  loadDetailMaterial: loadSunDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => createSunCorona(sunDir),
  textures: sunTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
export * from './corona';
