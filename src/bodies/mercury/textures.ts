import * as THREE from 'three';

export const mercuryTextures = {
  paths: {
    surface: '/textures/planets/mercury.jpg',
    bump: '/textures/planets/mercury_b.jpg',
  },
  colorSpaces: {
    surface: THREE.SRGBColorSpace,
    bump: THREE.NoColorSpace,
  },
};
