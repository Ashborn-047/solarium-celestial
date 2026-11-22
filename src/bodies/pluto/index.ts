import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { plutoData } from './data';
import { plutoTextures } from './textures';
import { createPlutoOverviewMaterial } from './overview';
import { loadPlutoDetailMaterial } from './detail';

export const plutoDefinition: BodyDefinition = {
  data: plutoData,
  createOverviewMaterial: createPlutoOverviewMaterial,
  loadDetailMaterial: loadPlutoDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!plutoData.atmosphere) return null;
    const [color, scale, rad] = plutoData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  textures: plutoTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
