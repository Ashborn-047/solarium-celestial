import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { marsData } from './data';
import { marsTextures } from './textures';
import { createMarsOverviewMaterial } from './overview';
import { loadMarsDetailMaterial } from './detail';

export const marsDefinition: BodyDefinition = {
  data: marsData,
  createOverviewMaterial: createMarsOverviewMaterial,
  loadDetailMaterial: loadMarsDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!marsData.atmosphere) return null;
    const [color, scale, rad] = marsData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  textures: marsTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
