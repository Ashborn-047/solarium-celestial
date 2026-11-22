float fresnel(vec3 normal, vec3 viewDir, float power) {
  return pow(clamp(1.0 - dot(normal, viewDir), 0.0, 1.0), power);
}
