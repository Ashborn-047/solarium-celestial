import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface InertiaTarget {
  yaw: number;
  pitch: number;
  vy: number;
  vp: number;
  damping?: number;
}

export const inertiaAnimation: AnimationModule = {
  name: 'inertia',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    if (ctx.isFrozen) return;
    const t = target as unknown as InertiaTarget;
    t.yaw += t.vy;
    t.pitch = THREE.MathUtils.clamp(t.pitch + t.vp, -1.5, 1.5);
    const damp = t.damping ?? 0.94;
    t.vy *= damp;
    t.vp *= damp;
  },
};
