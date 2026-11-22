vec3 stars(vec3 d) {
  vec3 col = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float sc = 38.0 + float(i) * 42.0;
    vec3 p = d * sc;
    vec3 id = floor(p);
    vec3 f = p - id;
    vec3 h = h33(id + float(i) * 19.3);
    vec3 pos = 0.2 + 0.6 * h33(id.zxy + 3.7);
    float dist = length(f - pos);
    float pick = h.x;
    if (pick > 0.86) {
      float mag = pow((pick - 0.86) / 0.14, 3.0);
      float sz = 0.045 + 0.06 * mag;
      float s = smoothstep(sz, 0.0, dist) * (0.5 + 4.5 * mag);
      vec3 tint = mix(vec3(1.0, 0.72, 0.5), vec3(0.65, 0.78, 1.0), h.y);
      col += tint * s;
    }
  }
  // faint milky band
  float band = exp(-pow(dot(d, normalize(vec3(0.25, 1.0, 0.35))), 2.0) * 9.0);
  float n = fbm(d * 3.2 + 2.0);
  col += vec3(0.55, 0.5, 0.7) * band * n * n * 0.35;
  col += vec3(0.9, 0.6, 0.45) * band * pow(fbm(d * 7.0 + 9.0), 3.0) * 0.35;
  return col;
}
