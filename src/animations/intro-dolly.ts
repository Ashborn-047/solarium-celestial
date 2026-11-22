import { AnimationContext, AnimationModule } from './types';

export interface IntroDollyTarget {
  dist: number;
  tDist: number;
  rate?: number;
}

export const introDollyAnimation: AnimationModule = {
  name: 'intro-dolly',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    const t = target as unknown as IntroDollyTarget;
    const rate = t.rate || 3.0;
    t.dist += (t.tDist - t.dist) * (1 - Math.exp(-ctx.dt * rate));
  },
};
