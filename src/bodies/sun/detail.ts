import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { sunTextures } from './textures';
import surfaceGlsl from './surface.glsl';

const SV = `
varying vec3 vP, vN;
varying vec2 vUv;
void main() {
  vP = position;
  vN = normalize(normalMatrix * normal);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SF = `
uniform float t;
uniform sampler2D map;
varying vec3 vP, vN;
varying vec2 vUv;

${surfaceGlsl}

void main() {
  vec3 p = normalize(vP);
  float l = dot(texture2D(map, vUv).rgb, vec3(0.333));
  float sp = smoothstep(0.8, 0.25, l);
  vec3 col = computeSunSurface(p, normalize(vN), sp, t, 1.0, 1.0);
  gl_FragColor = vec4(col * 1.25, 1.0);
}
`;

export async function loadSunDetailMaterial(): Promise<THREE.ShaderMaterial> {
  const map = await loadTexture(sunTextures.paths.surface, sunTextures.colorSpaces.surface);
  return new THREE.ShaderMaterial({
    uniforms: {
      t: { value: 0 },
      map: { value: map },
    },
    vertexShader: SV,
    fragmentShader: SF,
  });
}
