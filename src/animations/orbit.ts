import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface OrbitTarget {
  group: THREE.Group;
  orbitRadius: number;
  orbitalPeriod: number;
  phase: number;
}

export const orbitAnimation: AnimationModule = {
  name: 'orbit',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    if (ctx.isFrozen) return;
    const { group, orbitRadius, orbitalPeriod, phase } = target as unknown as OrbitTarget;
    if (!orbitRadius || !orbitalPeriod || !group) return;

    const day = ctx.day ?? ctx.time;
    const angle = phase + (Math.PI * 2 * day) / orbitalPeriod;
    group.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);
  },
};
