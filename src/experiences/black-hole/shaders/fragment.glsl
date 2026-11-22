precision highp float;

varying vec2 vP;
uniform vec3 uCam, uFwd, uRight, uUp;
uniform float uAspect, uTan, uTime;
uniform float uR, uHeat, uDisk, uROUT;

const float RIN = 3.0; // innermost stable orbit (Rs = 1)

#include ../../../shared/shaders/chunks/noise.glsl
#include ../../../shared/shaders/chunks/tonemap.glsl
#include ../../../shared/shaders/chunks/stars.glsl

vec3 sunSurf(vec3 hp, vec3 vel) {
  vec3 p = normalize(hp), v = -normalize(vel);
  float gn = clamp((1.0 - 1.0 / uR) / 0.8333, 0.0, 1.25);
  float gr = fbm(p * 14.0 + vec3(0.0, 0.0, uTime * 0.25));
  float cl = fbm(p * 5.0 + vec3(uTime * 0.03, 0.0, uTime * 0.05));
  float sp = smoothstep(0.6, 0.72, fbm(p * 2.6 + 3.1 + vec3(0.0, uTime * 0.02, 0.0)));
  float heat = 0.55 + 0.75 * gr + 0.4 * cl;
  vec3 c = mix(vec3(1.0, 0.36, 0.04), vec3(1.0, 0.86, 0.5), clamp(heat - 0.4, 0.0, 1.0)) * (0.5 + 0.7 * heat);
  c *= 1.0 - 0.8 * sp;
  c *= 0.3 + 0.7 * pow(max(dot(p, v), 0.0), 0.5); // limb darkening
  c = mix(c, vec3(1.0, 0.92, 0.82) * dot(c, vec3(0.33)), clamp(uHeat - 1.0, 0.0, 1.0) * 0.7);
  return c * 1.5 * uHeat * gn * gn;
}

void main() {
  vec2 uv = vP * vec2(uAspect, 1.0) * uTan;
  vec3 rd = normalize(uFwd + uRight * uv.x + uUp * uv.y);
  vec3 pos = uCam, vel = rd;
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float trans = 1.0;
  bool escaped = false;
  float minR = 1e9;
  float route = uROUT > 0.0 ? uROUT : 15.0;

  for (int i = 0; i < STEPS; i++) {
    float r2 = dot(pos, pos), r = sqrt(r2);
    if (r < 1.0) {
      trans = 0.0;
      break;
    }
    if (r > 60.0 && dot(pos, vel) > 0.0) {
      escaped = true;
      break;
    }

    minR = min(minR, r);
    float dt = clamp(0.06 * (r - 0.7), 0.02, 1.2);
    vec3 prev = pos;
    vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
    pos += vel * dt;

    if (uR > 1.02) {
      float rn = length(pos);
      if (rn < uR) {
        float rp = length(prev);
        float tt = clamp((rp - uR) / max(rp - rn, 1e-4), 0.0, 1.0);
        col += trans * sunSurf(mix(prev, pos, tt), vel);
        trans = 0.0;
        break;
      }
    }

    // Faint hot gas haze hugging the disk plane
    float rr = length(pos.xz);
    col += uDisk * trans * vec3(1.0, 0.5, 0.2) * 0.0035 * dt * exp(-abs(pos.y) * 2.2)
         * smoothstep(RIN - 0.8, RIN + 1.0, rr) * smoothstep(route + 3.0, RIN + 2.0, rr);

    if (prev.y * pos.y < 0.0) {
      float t = prev.y / (prev.y - pos.y);
      vec3 hp = mix(prev, pos, t);
      float R = length(hp.xz);
      if (R > RIN && R < route) {
        vec3 n = normalize(-vel);
        vec3 tang = normalize(vec3(-hp.z, 0.0, hp.x));
        float beta = sqrt(0.5 / (R - 1.0));
        float D = sqrt(1.0 - beta * beta) / (1.0 - beta * dot(tang, n));
        float g = D * sqrt(max(1.0 - 1.0 / R, 0.02));

        float ang = uTime * 2.6 * pow(R, -1.5);
        float c = cos(ang), s = sin(ang);
        vec2 q = mat2(c, -s, s, c) * hp.xz;
        vec2 u = q / R;
        float nz = fbm(vec3(R * 1.5, u * 6.0));
        float fine = fbm(vec3(R * 5.0, u * 14.0) + 11.0);
        float rings = 0.5 + 0.5 * sin(R * 8.0 + nz * 5.0);
        float dens = 0.35 + 0.75 * nz + 0.35 * fine * rings;

        float edge = smoothstep(RIN, RIN + 0.35, R) * smoothstep(route, route - 5.0, R);
        float emis = pow(RIN / R, 2.3) * 6.5;
        float T = 0.95 * pow(RIN / R, 0.75) * g;
        vec3 bb = blackbody(T);
        float I = emis * pow(g, 3.3) * dens * edge * uDisk;
        float a = clamp(0.8 * edge * dens, 0.0, 0.96) * uDisk;
        col += trans * bb * I * a;
        trans *= 1.0 - a;
      }
    }
  }

  float gc = clamp((1.0 - 1.0 / uR) / 0.8333, 0.0, 1.2);
  col += trans * vec3(1.0, 0.55, 0.22) * exp(-max(minR - uR, 0.0) * 1.1) * 0.45 * gc * gc * step(1.02, uR);

  if (escaped) {
    col += trans * stars(normalize(vel));
  }

  gl_FragColor = vec4(col, 1.0);
}
