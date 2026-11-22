import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface CloudDriftTarget {
  cloudsMesh: THREE.Mesh;
  baseSpinRate: number;
  driftMultiplier?: number;
}

export const cloudDriftAnimation: AnimationModule = {
  name: 'cloud-drift',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    if (ctx.isFrozen) return;
    const { cloudsMesh, baseSpinRate, driftMultiplier = 1.12 } = target as unknown as CloudDriftTarget;
    if (!cloudsMesh) return;

    cloudsMesh.rotation.y += ctx.dt * baseSpinRate * driftMultiplier;
  },
};
