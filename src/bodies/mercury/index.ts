import { BodyDefinition } from '../../shared/types/body';
import { mercuryData } from './data';
import { mercuryTextures } from './textures';
import { createMercuryOverviewMaterial } from './overview';
import { loadMercuryDetailMaterial } from './detail';

export const mercuryDefinition: BodyDefinition = {
  data: mercuryData,
  createOverviewMaterial: createMercuryOverviewMaterial,
  loadDetailMaterial: loadMercuryDetailMaterial,
  textures: mercuryTextures,
};

export * from './data';
export * from './textures';
export * from './overview';
export * from './detail';
