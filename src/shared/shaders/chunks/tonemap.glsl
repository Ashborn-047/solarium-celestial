vec3 blackbody(float t) {
  vec3 c = mix(vec3(0.55, 0.04, 0.0), vec3(1.0, 0.42, 0.07), smoothstep(0.0, 0.55, t));
  c = mix(c, vec3(1.0, 0.82, 0.58), smoothstep(0.45, 1.05, t));
  c = mix(c, vec3(0.78, 0.88, 1.0), smoothstep(1.05, 2.2, t));
  return c;
}
