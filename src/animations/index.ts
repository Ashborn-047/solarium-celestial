export * from './types';
export * from './orbit';
export * from './spin';
export * from './tidal-lock';
export * from './camera-transition';
export * from './inertia';
export * from './cloud-drift';
export * from './belt-drift';
export * from './sun-surface';
export * from './bh-disk-time';
export * from './intro-dolly';

import { orbitAnimation } from './orbit';
import { spinAnimation } from './spin';
import { tidalLockAnimation } from './tidal-lock';
import { cameraTransitionAnimation } from './camera-transition';
import { inertiaAnimation } from './inertia';
import { cloudDriftAnimation } from './cloud-drift';
import { beltDriftAnimation } from './belt-drift';
import { sunSurfaceAnimation } from './sun-surface';
import { bhDiskTimeAnimation } from './bh-disk-time';
import { introDollyAnimation } from './intro-dolly';
import { AnimationModule } from './types';

export const ANIMATIONS: Record<string, AnimationModule> = {
  orbit: orbitAnimation,
  spin: spinAnimation,
  tidalLock: tidalLockAnimation,
  cameraTransition: cameraTransitionAnimation,
  inertia: inertiaAnimation,
  cloudDrift: cloudDriftAnimation,
  beltDrift: beltDriftAnimation,
  sunSurface: sunSurfaceAnimation,
  bhDiskTime: bhDiskTimeAnimation,
  introDolly: introDollyAnimation,
};
