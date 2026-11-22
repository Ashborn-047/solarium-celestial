import * as THREE from 'three';

export const earthTextures = {
  paths: {
    surface: '/textures/planets/earth.jpg',
    normal: '/textures/planets/earth_n.jpg',
    roughness: '/textures/planets/earth_r.jpg',
    nightLights: '/textures/planets/earth_l.jpg',
    clouds: '/textures/planets/earth_c.png',
    moon: '/textures/moons/moon.jpg',
  },
  colorSpaces: {
    surface: THREE.SRGBColorSpace,
    normal: THREE.NoColorSpace,
    roughness: THREE.NoColorSpace,
    nightLights: THREE.SRGBColorSpace,
    clouds: THREE.SRGBColorSpace,
    moon: THREE.SRGBColorSpace,
  },
};
