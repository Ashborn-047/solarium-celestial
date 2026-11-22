import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface BeltDriftTarget {
  belt: THREE.Points;
  rate?: number;
}

export const beltDriftAnimation: AnimationModule = {
  name: 'belt-drift',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    if (ctx.isFrozen) return;
    const { belt, rate = 0.0004 } = target as unknown as BeltDriftTarget;
    if (!belt) return;

    const day = ctx.day ?? ctx.time;
    belt.rotation.y = -day * rate;
  },
};
