import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface SpinTarget {
  mesh: THREE.Mesh | THREE.Object3D;
  spinPeriod?: number;
  spinRate?: number;
}

export const spinAnimation: AnimationModule = {
  name: 'spin',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    if (ctx.isFrozen) return;
    const { mesh, spinPeriod, spinRate } = target as unknown as SpinTarget;
    if (!mesh) return;

    if (typeof spinRate === 'number') {
      mesh.rotation.y += ctx.dt * spinRate;
    } else if (spinPeriod) {
      const day = ctx.day ?? ctx.time;
      mesh.rotation.y = -(Math.PI * 2 * day) / spinPeriod;
    }
  },
};
