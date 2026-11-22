import * as THREE from 'three';

export function createRingGeometry(
  innerRadius: number,
  outerRadius: number,
  thetaSegments = 192
): THREE.RingGeometry {
  const geom = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, 1);
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;

  for (let j = 0; j < pos.count; j++) {
    const r = Math.hypot(pos.getX(j), pos.getY(j));
    uv.setXY(j, (r - innerRadius) / (outerRadius - innerRadius), 0.5);
  }

  return geom;
}
