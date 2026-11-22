import * as THREE from 'three';
import { BodyDefinition } from '../../shared/types/body';
import { createAtmosphereMaterial } from '../atmosphere';
import { neptuneData } from './data';
import { neptuneTextures } from './textures';
import { createNeptuneOverviewMaterial } from './overview';
import { loadNeptuneDetailMaterial } from './detail';

export const neptuneDefinition: BodyDefinition = {
  data: neptuneData,
  createOverviewMaterial: createNeptuneOverviewMaterial,
  loadDetailMaterial: loadNeptuneDetailMaterial,
  createAtmosphereMesh: (sunDir?: THREE.Vector3) => {
    if (!neptuneData.atmosphere) return null;
    const [color, scale, rad] = neptuneData.atmosphere;
    const geom = new THREE.SphereGeometry(scale, 96, 48);
    const mat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    return new THREE.Mesh(geom, mat);
  },
  textures: neptuneTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
