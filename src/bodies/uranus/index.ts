import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { uranusData } from './data';
import { uranusTextures } from './textures';
import { createUranusOverviewMaterial } from './overview';
import { loadUranusDetailMaterial } from './detail';
import { createUranusRingsMesh } from './rings';

export const uranusDefinition: BodyDefinition = {
  data: uranusData,
  createOverviewMaterial: createUranusOverviewMaterial,
  loadDetailMaterial: loadUranusDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!uranusData.atmosphere) return null;
    const [color, scale, rad] = uranusData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  createRingsMesh: createUranusRingsMesh,
  textures: uranusTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
export * from './rings';
