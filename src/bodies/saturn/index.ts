import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { saturnData } from './data';
import { saturnTextures } from './textures';
import { createSaturnOverviewMaterial } from './overview';
import { loadSaturnDetailMaterial } from './detail';
import { createSaturnRingsMesh } from './rings';

export const saturnDefinition: BodyDefinition = {
  data: saturnData,
  createOverviewMaterial: createSaturnOverviewMaterial,
  loadDetailMaterial: loadSaturnDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!saturnData.atmosphere) return null;
    const [color, scale, rad] = saturnData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  createRingsMesh: createSaturnRingsMesh,
  textures: saturnTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
export * from './rings';
