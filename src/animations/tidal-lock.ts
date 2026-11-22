import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface TidalLockTarget {
  mesh: THREE.Mesh | THREE.Object3D;
  orbitalPeriod: number;
}

export const tidalLockAnimation: AnimationModule = {
  name: 'tidal-lock',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    if (ctx.isFrozen) return;
    const { mesh, orbitalPeriod } = target as unknown as TidalLockTarget;
    if (!mesh || !orbitalPeriod) return;

    const day = ctx.day ?? ctx.time;
    mesh.rotation.y = -(Math.PI * 2 * day) / orbitalPeriod;
  },
};
