import * as THREE from 'three';
import { SystemNode } from './system-builder';

export interface LabelItem {
  id: string;
  name: string;
  x: number;
  y: number;
  visible: boolean;
  isFocused: boolean;
  node: SystemNode;
}

export function computeVisibleLabels(
  nodes: SystemNode[],
  camera: THREE.PerspectiveCamera,
  focus: SystemNode | null,
  rel: SystemNode | null,
  width: number,
  height: number
): LabelItem[] {
  const v = new THREE.Vector3();
  const pv = new THREE.Vector3();
  const rects: [number, number, number][] = [];
  const items: LabelItem[] = [];

  const sunNode = nodes.find((n) => n.data.id === 'sun');
  const ordered = focus
    ? [focus, ...nodes.filter((n) => n !== focus)]
    : nodes;

  for (const node of ordered) {
    const isSun = node.data.id === 'sun';
    const isPlanet = node.parent === sunNode;
    const isChildOfRel = rel && node.parent === rel;

    let isNearbyMoon = false;
    if (node.parent && node.parent !== sunNode) {
      node.parent.group.getWorldPosition(pv);
      if (camera.position.distanceTo(pv) < 180) {
        isNearbyMoon = true;
      }
    }

    const shouldConsider = node === focus || isSun || isPlanet || isChildOfRel || isNearbyMoon;

    let visible = false;
    let screenX = 0;
    let screenY = 0;

    if (shouldConsider) {
      node.group.getWorldPosition(v);
      v.project(camera);

      if (v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05) {
        screenX = (v.x * 0.5 + 0.5) * width;
        screenY = (-v.y * 0.5 + 0.5) * height - 10;
        const w = node.data.name.length * 7 + 24;

        const overlaps = rects.some(
          ([rx, ry, rw]) =>
            screenX < rx + rw &&
            screenX + w > rx &&
            Math.abs(screenY - ry) < 17
        );

        if (node === focus || !overlaps) {
          rects.push([screenX, screenY, w]);
          visible = true;
        }
      }
    }

    items.push({
      id: node.data.id,
      name: node.data.name,
      x: screenX,
      y: screenY,
      visible,
      isFocused: node === focus,
      node,
    });
  }

  return items;
}
