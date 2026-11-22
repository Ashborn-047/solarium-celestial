// Computes accretion disk radiance at hit point hp on equatorial plane
vec4 calcDiskSample(
  vec3 hp,
  vec3 vel,
  float R,
  float rIn,
  float rOut,
  float time,
  float diskIntensity
) {
  float g = calcDopplerRedshift(hp, vel, R);

  float ang = time * 2.6 * pow(R, -1.5);
  float c = cos(ang), s = sin(ang);
  vec2 q = mat2(c, -s, s, c) * hp.xz;
  vec2 u = q / R;
  float nz = fbm(vec3(R * 1.5, u * 6.0));
  float fine = fbm(vec3(R * 5.0, u * 14.0) + 11.0);
  float rings = 0.5 + 0.5 * sin(R * 8.0 + nz * 5.0);
  float dens = 0.35 + 0.75 * nz + 0.35 * fine * rings;

  float edge = smoothstep(rIn, rIn + 0.35, R) * smoothstep(rOut, rOut - 5.0, R);
  float emis = pow(rIn / R, 2.3) * 6.5;
  float T = 0.95 * pow(rIn / R, 0.75) * g;
  vec3 bb = blackbody(T);
  float I = emis * pow(g, 3.3) * dens * edge * diskIntensity;
  float a = clamp(0.8 * edge * dens, 0.0, 0.96) * diskIntensity;

  return vec4(bb * I * a, a);
}
