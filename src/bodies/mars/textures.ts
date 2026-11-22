import * as THREE from 'three';

export const marsTextures = {
  paths: {
    surface: '/textures/planets/mars.jpg',
    bump: '/textures/planets/mars_b.jpg',
    phobos: '/textures/moons/phobos.jpg',
    deimos: '/textures/moons/deimos.jpg',
  },
  colorSpaces: {
    surface: THREE.SRGBColorSpace,
    bump: THREE.NoColorSpace,
    phobos: THREE.SRGBColorSpace,
    deimos: THREE.SRGBColorSpace,
  },
};
