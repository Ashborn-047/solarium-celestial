#include ../../shared/shaders/chunks/noise.glsl

vec3 computeSunSurface(
  vec3 posNorm,
  vec3 viewDir,
  float spotFactor,
  float time,
  float uHeat,
  float uRedshift
) {
  float gr = fbm(posNorm * 14.0 + vec3(0.0, 0.0, time * 0.25));
  float cl = fbm(posNorm * 5.0 + vec3(time * 0.03, 0.0, time * 0.05));
  float heat = 0.55 + 0.75 * gr + 0.4 * cl;
  vec3 c = mix(vec3(1.0, 0.36, 0.04), vec3(1.0, 0.86, 0.5), clamp(heat - 0.4, 0.0, 1.0)) * (0.5 + 0.7 * heat);
  c *= 1.0 - 0.85 * spotFactor;
  float mu = max(dot(viewDir, vec3(0.0, 0.0, 1.0)), 0.0);
  c *= 0.3 + 0.7 * pow(mu, 0.5);
  c = mix(c, vec3(1.0, 0.92, 0.82) * dot(c, vec3(0.33)), clamp(uHeat - 1.0, 0.0, 1.0) * 0.7);
  return c * 1.5 * uHeat * uRedshift * uRedshift;
}
