import * as THREE from 'three';

export interface AnimationContext {
  time: number;
  dt: number;
  isFrozen: boolean;
  day?: number;
}

export interface AnimationModule {
  name: string;
  update(ctx: AnimationContext, target: THREE.Object3D | Record<string, unknown>): void;
}
