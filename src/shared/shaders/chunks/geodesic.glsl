// Performs a single step of the Schwarzschild geodesic integration
void stepGeodesic(inout vec3 pos, inout vec3 vel, float h2, float dt) {
  float r2 = dot(pos, pos);
  float r = sqrt(r2);
  vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
  pos += vel * dt;
}

// Computes adaptive integration step size based on distance r from horizon
float getGeodesicDt(float r) {
  return clamp(0.06 * (r - 0.7), 0.02, 1.2);
}
