import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { venusData } from './data';
import { venusTextures } from './textures';
import { createVenusOverviewMaterial } from './overview';
import { loadVenusDetailMaterial } from './detail';

export const venusDefinition: BodyDefinition = {
  data: venusData,
  createOverviewMaterial: createVenusOverviewMaterial,
  loadDetailMaterial: loadVenusDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!venusData.atmosphere) return null;
    const [color, scale, rad] = venusData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  textures: venusTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
