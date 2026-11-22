import * as THREE from 'three';
import { BodyData } from '../../../../shared/types/body';
import { SOLAR_SYSTEM_BODIES } from '../../../../bodies';
import { createRNG } from '../../../../shared/math/rng';
import { SystemNode } from './types';
import { createBodyDetailMaterial } from './materials';
import { createBodyDecorations } from './decorations';
import { createOrbitLine } from './orbits';

export async function buildSolarSystemTree(rootGroup: THREE.Group): Promise<{
  nodes: SystemNode[];
  sunNode: SystemNode;
}> {
  const rng = createRNG(777);
  const flatNodes: SystemNode[] = [];

  async function buildNode(data: BodyData, parentGroup: THREE.Group, parentNode?: SystemNode): Promise<SystemNode> {
    const group = new THREE.Group();
    const pivot = new THREE.Group();
    parentGroup.add(group);
    group.add(pivot);

    if (data.tilt) {
      pivot.rotation.z = THREE.MathUtils.degToRad(data.tilt);
    }

    const { material, sunMat, uSun } = await createBodyDetailMaterial(data);
    const big = data.radius > 1.5;
    const geom = new THREE.SphereGeometry(data.radius, big ? 64 : 36, big ? 32 : 18);
    const mesh = new THREE.Mesh(geom, material);
    if (data.scale) {
      mesh.scale.set(data.scale[0], data.scale[1], data.scale[2]);
    }
    pivot.add(mesh);

    const decs = await createBodyDecorations(data);
    if (decs.clouds) pivot.add(decs.clouds);
    if (decs.corona) group.add(decs.corona);
    if (decs.atmosphere) pivot.add(decs.atmosphere);
    if (decs.ringMesh) pivot.add(decs.ringMesh);

    const isSunOrbit = !parentNode || parentNode.data.id === 'sun';
    const line = createOrbitLine(data, isSunOrbit);
    if (line) parentGroup.add(line);

    const node: SystemNode = {
      data,
      group,
      pivot,
      mesh,
      line,
      phase: rng() * Math.PI * 2,
      parent: parentNode,
      children: [],
      clouds: decs.clouds,
      corona: decs.corona,
      atmosphere: decs.atmosphere,
      ringMesh: decs.ringMesh,
      sunMat,
      uSun,
    };

    flatNodes.push(node);

    if (data.children) {
      for (const childData of data.children) {
        const childNode = await buildNode(childData, group, node);
        node.children.push(childNode);
      }
    }

    return node;
  }

  const sunDef = SOLAR_SYSTEM_BODIES[0];
  const sunNode = await buildNode(sunDef.data, rootGroup);

  for (let i = 1; i < SOLAR_SYSTEM_BODIES.length; i++) {
    const planetNode = await buildNode(SOLAR_SYSTEM_BODIES[i].data, rootGroup, sunNode);
    sunNode.children.push(planetNode);
  }

  return { nodes: flatNodes, sunNode };
}
