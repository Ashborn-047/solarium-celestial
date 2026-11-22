import * as THREE from 'three';

export const venusTextures = {
  paths: {
    surface: '/textures/planets/venus.jpg',
    bump: '/textures/planets/venus_b.jpg',
  },
  colorSpaces: {
    surface: THREE.SRGBColorSpace,
    bump: THREE.NoColorSpace,
  },
};
