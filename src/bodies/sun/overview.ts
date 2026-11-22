import * as THREE from 'three';
import surfaceGlsl from './surface.glsl';

const SV = `
varying vec3 vP, vN;
void main() {
  vP = position;
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SF = `
uniform float t;
varying vec3 vP, vN;

${surfaceGlsl}

void main() {
  vec3 p = normalize(vP);
  float sp = smoothstep(0.6, 0.72, fbm(p * 2.6 + 3.1));
  vec3 col = computeSunSurface(p, normalize(vN), sp, t, 1.0, 1.0);
  gl_FragColor = vec4(col * 1.25, 1.0);
}
`;

export function createSunOverviewMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      t: { value: 0 },
    },
    vertexShader: SV,
    fragmentShader: SF,
  });
}
