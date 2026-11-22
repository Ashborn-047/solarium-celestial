import * as THREE from 'three';

const VERTEX_SHADER = `
varying vec3 vN, vW;
void main() {
  vN = normalize(normalMatrix * normal);
  vW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform vec3 c, sun;
uniform float s, lim, fl;
varying vec3 vN, vW;
void main() {
  float d = -dot(vN, vec3(0.0, 0.0, 1.0));
  float g = pow(smoothstep(0.0, lim, d), 1.7);
  float lit = mix(0.1 + 0.9 * smoothstep(-0.3, 0.5, dot(vW, sun)), 1.0, fl);
  gl_FragColor = vec4(c * g * s * lit, 1.0);
}
`;

export function createAtmosphereMaterial(
  color: string,
  strength: number,
  radius: number,
  fullLight = false,
  sunDirection: THREE.Vector3 = new THREE.Vector3(1, 0.3, 0.8).normalize()
): THREE.ShaderMaterial {
  const lim = Math.sqrt(Math.max(0, 1.0 - 1.0 / (radius * radius)));

  return new THREE.ShaderMaterial({
    uniforms: {
      c: { value: new THREE.Color(color) },
      s: { value: strength },
      sun: { value: sunDirection },
      lim: { value: lim },
      fl: { value: fullLight ? 1.0 : 0.0 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}
