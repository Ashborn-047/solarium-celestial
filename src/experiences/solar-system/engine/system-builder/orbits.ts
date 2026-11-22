import * as THREE from 'three';
import { BodyData } from '../../../../shared/types/body';

export function createOrbitLine(data: BodyData, isSunOrbit: boolean): THREE.Line | undefined {
  if (!data.orbitRadius) return undefined;

  const pts: THREE.Vector3[] = [];
  const segments = 200;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(t) * data.orbitRadius, 0, Math.sin(t) * data.orbitRadius));
  }

  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.Line(
    geom,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: isSunOrbit ? 0.2 : 0.28,
    })
  );
}
