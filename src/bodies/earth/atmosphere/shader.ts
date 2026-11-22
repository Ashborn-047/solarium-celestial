import * as THREE from 'three';
import { createAtmosphereMaterial } from '../../atmosphere';

export function createEarthAtmosphereMesh(sunDir?: THREE.Vector3): THREE.Mesh {
  const geom = new THREE.SphereGeometry(1.045, 96, 48);
  const mat = createAtmosphereMaterial('#5aa0ff', 2.2, 1.045, false, sunDir);
  return new THREE.Mesh(geom, mat);
}
