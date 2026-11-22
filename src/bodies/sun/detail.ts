import * as THREE from 'three';
import { loadTexture } from '../../shared/three/texture-loader';
import { sunTextures } from './textures';

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

float h(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vn(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(h(i), h(i + vec3(1, 0, 0)), f.x), mix(h(i + vec3(0, 1, 0)), h(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(h(i + vec3(0, 0, 1)), h(i + vec3(1, 0, 1)), f.x), mix(h(i + vec3(0, 1, 1)), h(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}
float fb(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vn(p);
    p = p * 2.03 + 7.1;
    a *= 0.5;
  }
  return s;
}

void main() {
  vec3 p = normalize(vP);
  float g = fb(p * 16.0 + vec3(0.0, 0.0, t * 0.25));
  float c = fb(p * 5.0 + vec3(t * 0.03, 0.0, t * 0.05));
  float l = dot(texture2D(map, vUv).rgb, vec3(0.333));
  float sp = smoothstep(0.8, 0.25, l);
  float heat = 0.55 + 0.75 * g + 0.4 * c;
  vec3 col = mix(vec3(1.0, 0.36, 0.04), vec3(1.0, 0.86, 0.5), clamp(heat - 0.4, 0.0, 1.0)) * (0.5 + 0.7 * heat);
  col *= 1.0 - 0.85 * sp;
  float mu = max(dot(normalize(vN), vec3(0.0, 0.0, 1.0)), 0.0);
  col *= 0.3 + 0.7 * pow(mu, 0.5);
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
