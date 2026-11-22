import { AnimationContext, AnimationModule } from './types';

export interface SunSurfaceTarget {
  uniformTime: { value: number };
}

export const sunSurfaceAnimation: AnimationModule = {
  name: 'sun-surface',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    const { uniformTime } = target as unknown as SunSurfaceTarget;
    if (!uniformTime) return;

    uniformTime.value = ctx.isFrozen ? 0 : ctx.time;
  },
};
