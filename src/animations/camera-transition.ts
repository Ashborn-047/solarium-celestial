import * as THREE from 'three';
import { AnimationContext, AnimationModule } from './types';

export interface CameraTransitionTarget {
  from: THREE.Vector3;
  target: THREE.Vector3;
  dest: THREE.Vector3;
  tr: number;
  duration?: number;
}

export const cameraTransitionAnimation: AnimationModule = {
  name: 'camera-transition',
  update(ctx: AnimationContext, target: Record<string, unknown>) {
    const t = target as unknown as CameraTransitionTarget;
    if (!t.target || !t.from || !t.dest) return;

    const dur = t.duration || 1.4;
    t.tr = Math.min(1, t.tr + ctx.dt / dur);
    const smooth = t.tr * t.tr * (3 - 2 * t.tr);
    t.target.lerpVectors(t.from, t.dest, smooth);
  },
};
