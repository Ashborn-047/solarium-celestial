import { BodyDefinition } from '../shared/types/body';
import { sunDefinition } from './sun';
import { mercuryDefinition } from './mercury';
import { venusDefinition } from './venus';
import { earthDefinition } from './earth';
import { marsDefinition } from './mars';
import { jupiterDefinition } from './jupiter';
import { saturnDefinition } from './saturn';
import { uranusDefinition } from './uranus';
import { neptuneDefinition } from './neptune';
import { plutoDefinition } from './pluto';

export const BODIES: Record<string, BodyDefinition> = {
  sun: sunDefinition,
  mercury: mercuryDefinition,
  venus: venusDefinition,
  earth: earthDefinition,
  mars: marsDefinition,
  jupiter: jupiterDefinition,
  saturn: saturnDefinition,
  uranus: uranusDefinition,
  neptune: neptuneDefinition,
  pluto: plutoDefinition,
};

export const SOLAR_SYSTEM_BODIES: BodyDefinition[] = [
  sunDefinition,
  mercuryDefinition,
  venusDefinition,
  earthDefinition,
  marsDefinition,
  jupiterDefinition,
  saturnDefinition,
  uranusDefinition,
  neptuneDefinition,
  plutoDefinition,
];

export const INSPECTOR_BODIES: BodyDefinition[] = [
  sunDefinition,
  mercuryDefinition,
  venusDefinition,
  earthDefinition,
  marsDefinition,
  jupiterDefinition,
  saturnDefinition,
  uranusDefinition,
  neptuneDefinition,
  plutoDefinition,
];

export {
  sunDefinition,
  mercuryDefinition,
  venusDefinition,
  earthDefinition,
  marsDefinition,
  jupiterDefinition,
  saturnDefinition,
  uranusDefinition,
  neptuneDefinition,
  plutoDefinition,
};
