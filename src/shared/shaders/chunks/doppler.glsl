// Calculates Doppler factor and gravitational redshift for orbiting gas
float calcDopplerRedshift(vec3 hp, vec3 vel, float R) {
  vec3 n = normalize(-vel);                     // photon heading to viewer
  vec3 tang = normalize(vec3(-hp.z, 0.0, hp.x)); // orbital direction
  float beta = sqrt(0.5 / (R - 1.0));
  float D = sqrt(1.0 - beta * beta) / (1.0 - beta * dot(tang, n)); // Doppler factor
  return D * sqrt(max(1.0 - 1.0 / R, 0.02));     // plus gravitational redshift
}
