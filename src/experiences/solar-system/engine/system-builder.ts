import * as THREE from 'three';
import { BodyData } from '../../../shared/types/body';
import { SOLAR_SYSTEM_BODIES } from '../../../bodies';
import { createRNG } from '../../../shared/math/rng';
import { makeProceduralRingTexture } from '../../../bodies/procedural';

export interface SystemNode {
  data: BodyData;
  group: THREE.Group;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  line?: THREE.Line;
  phase: number;
  parent?: SystemNode;
  children: SystemNode[];
}

export function buildSolarSystemTree(rootGroup: THREE.Group): {
  nodes: SystemNode[];
  sunNode: SystemNode;
} {
  const rng = createRNG(777);
  const flatNodes: SystemNode[] = [];

  function buildNode(data: BodyData, parentGroup: THREE.Group, parentNode?: SystemNode): SystemNode {
    const group = new THREE.Group();
    const pivot = new THREE.Group();
    parentGroup.add(group);
    group.add(pivot);

    if (data.tilt) {
      pivot.rotation.z = THREE.MathUtils.degToRad(data.tilt);
    }

    const def = SOLAR_SYSTEM_BODIES.find((b) => b.data.id === data.id);
    let mat: THREE.Material;
    if (data.id === 'sun') {
      mat = def ? def.createOverviewMaterial() : new THREE.MeshBasicMaterial({ color: 0xffd277 });
      if (mat instanceof THREE.MeshBasicMaterial) {
        mat.color.setScalar(1.25);
      }
    } else {
      mat = def ? def.createOverviewMaterial() : new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 1 });
    }

    const big = data.radius > 1.5;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, big ? 64 : 36, big ? 32 : 18), mat);
    pivot.add(mesh);

    let line: THREE.Line | undefined;
    if (data.orbitRadius) {
      const pts: THREE.Vector3[] = [];
      const segments = 200;
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(t) * data.orbitRadius, 0, Math.sin(t) * data.orbitRadius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const isSunOrbit = !parentNode || parentNode.data.id === 'sun';
      line = new THREE.Line(
        geom,
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: isSunOrbit ? 0.2 : 0.28,
        })
      );
      parentGroup.add(line);
    }

    if (data.ring) {
      const [inner, outer, kind] = data.ring;
      const rGeom = new THREE.RingGeometry(inner, outer, 128, 1);
      const pos = rGeom.attributes.position;
      const uv = rGeom.attributes.uv;
      for (let j = 0; j < pos.count; j++) {
        const r = Math.hypot(pos.getX(j), pos.getY(j));
        uv.setXY(j, (r - inner) / (outer - inner), 0.5);
      }
      const ringMat = new THREE.MeshStandardMaterial({
        map: makeProceduralRingTexture(kind as 'saturn' | 'uranus'),
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 1,
        depthWrite: false,
      });
      const rMesh = new THREE.Mesh(rGeom, ringMat);
      rMesh.rotation.x = -Math.PI / 2;
      pivot.add(rMesh);
    }

    const node: SystemNode = {
      data,
      group,
      pivot,
      mesh,
      line,
      phase: rng() * Math.PI * 2,
      parent: parentNode,
      children: [],
    };

    flatNodes.push(node);

    if (data.children) {
      for (const childData of data.children) {
        node.children.push(buildNode(childData, group, node));
      }
    }

    return node;
  }

  const sunDef = SOLAR_SYSTEM_BODIES[0];
  const sunNode = buildNode(sunDef.data, rootGroup);

  for (let i = 1; i < SOLAR_SYSTEM_BODIES.length; i++) {
    sunNode.children.push(buildNode(SOLAR_SYSTEM_BODIES[i].data, rootGroup, sunNode));
  }

  return { nodes: flatNodes, sunNode };
}
