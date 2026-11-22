import * as THREE from 'three';
import { createAtmosphereMaterial } from '../atmosphere';

export function createSunCorona(sunDir?: THREE.Vector3): THREE.Mesh {
  const geom = new THREE.SphereGeometry(1.45, 64, 32);
  const mat = createAtmosphereMaterial('#ff9a2a', 2.4, 1.45, true, sunDir);
  return new THREE.Mesh(geom, mat);
}
