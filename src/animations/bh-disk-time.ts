import { AnimationContext, AnimationModule } from './types';

export interface BhDiskTimeTarget {
  uniformTime: { value: number };
  speed?: number;
}

export const bhDiskTimeAnimation: AnimationModule = {
  name: 'bh-disk-time',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    const { uniformTime, speed = 1.0 } = target as unknown as BhDiskTimeTarget;
    if (!uniformTime) return;

    uniformTime.value = ctx.isFrozen ? 0 : ctx.time * speed;
  },
};
