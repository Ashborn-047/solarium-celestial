import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { jupiterData } from './data';
import { jupiterTextures } from './textures';
import { createJupiterOverviewMaterial } from './overview';
import { loadJupiterDetailMaterial } from './detail';

export const jupiterDefinition: BodyDefinition = {
  data: jupiterData,
  createOverviewMaterial: createJupiterOverviewMaterial,
  loadDetailMaterial: loadJupiterDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!jupiterData.atmosphere) return null;
    const [color, scale, rad] = jupiterData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  textures: jupiterTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
