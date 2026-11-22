import * as THREE from 'three';

const COMPOSITE_VS = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const COMPOSITE_FS = `
precision highp float;
varying vec2 vUv;

uniform sampler2D tScene;
uniform sampler2D tDepth;
uniform vec3 uCam, uFwd, uRight, uUp;
uniform float uAspect, uTan, uNear, uFar;
uniform float uR, uHeat, uDisk, uROUT, uBoundRadius;

float linearizeDepth(float d) {
  return (2.0 * uNear) / (uFar + uNear - d * (uFar - uNear));
}

void main() {
  vec4 sceneCol = texture2D(tScene, vUv);
  float rawDepth = texture2D(tDepth, vUv).r;
  float sceneDist = linearizeDepth(rawDepth) * uFar;

  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uAspect, 1.0) * uTan;
  vec3 rd = normalize(uFwd + uRight * uv.x + uUp * uv.y);

  // Analytical ray-sphere intersection with bounding sphere at origin
  float b = dot(uCam, rd);
  float c = dot(uCam, uCam) - uBoundRadius * uBoundRadius;
  float d = b * b - c;

  if (d < 0.0) {
    gl_FragColor = sceneCol;
    return;
  }

  float t0 = -b - sqrt(d);
  if (t0 < 0.0 || (sceneDist > 0.0 && sceneDist < t0)) {
    // Ray misses, camera inside, or foreground object occludes hole
    gl_FragColor = sceneCol;
    return;
  }

  // Raymarch within bounding sphere starting at entry point t0
  vec3 pos = uCam + rd * t0;
  vec3 vel = rd;
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float trans = 1.0;
  float escRadius = uBoundRadius + 1.0;

  for (int i = 0; i < 90; i++) {
    float r2 = dot(pos, pos);
    float r = sqrt(r2);
    if (r < 1.0) { trans = 0.0; break; }
    if (r > escRadius && dot(pos, vel) > 0.0) break;

    float dt = clamp(0.08 * (r - 0.7), 0.03, 0.9);
    vec3 prev = pos;
    vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
    pos += vel * dt;

    // Faint accretion glow
    if (prev.y * pos.y < 0.0 && uDisk > 0.01) {
      float t = prev.y / (prev.y - pos.y);
      vec3 hp = mix(prev, pos, t);
      float R = length(hp.xz);
      if (R > 3.0 && R < uROUT) {
        float dens = 0.4 + 0.6 * sin(R * 5.0);
        float edge = smoothstep(3.0, 3.4, R) * smoothstep(uROUT, uROUT - 1.5, R);
        vec3 diskCol = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.85, 0.5), smoothstep(3.0, uROUT, R));
        col += trans * diskCol * edge * dens * 0.8 * uDisk;
        trans *= 1.0 - clamp(edge * 0.7 * uDisk, 0.0, 0.9);
      }
    }
  }

  gl_FragColor = vec4(col + trans * sceneCol.rgb, 1.0);
}
`;

export class SolarCollapseComposite {
  readonly renderTarget: THREE.WebGLRenderTarget;
  private quadScene = new THREE.Scene();
  private dummyCam = new THREE.Camera();
  private material: THREE.ShaderMaterial;
  private quad: THREE.Mesh;

  constructor(width: number, height: number) {
    this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      depthTexture: new THREE.DepthTexture(width, height),
    });

    this.material = new THREE.ShaderMaterial({
      vertexShader: COMPOSITE_VS,
      fragmentShader: COMPOSITE_FS,
      uniforms: {
        tScene: { value: this.renderTarget.texture },
        tDepth: { value: this.renderTarget.depthTexture },
        uCam: { value: new THREE.Vector3() },
        uFwd: { value: new THREE.Vector3() },
        uRight: { value: new THREE.Vector3() },
        uUp: { value: new THREE.Vector3() },
        uAspect: { value: width / height },
        uTan: { value: Math.tan(THREE.MathUtils.degToRad(25)) },
        uNear: { value: 0.05 },
        uFar: { value: 6000 },
        uR: { value: 6.0 },
        uHeat: { value: 1.0 },
        uDisk: { value: 0.0 },
        uROUT: { value: 9.0 },
        uBoundRadius: { value: 10.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quadScene.add(this.quad);
  }

  setSize(width: number, height: number): void {
    this.renderTarget.setSize(width, height);
    this.material.uniforms.uAspect.value = width / height;
  }

  render(
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    uniforms: { uR: number; uHeat: number; uDisk: number }
  ): void {
    const u = this.material.uniforms;
    (u.uCam.value as THREE.Vector3).copy(camera.position);
    camera.getWorldDirection(u.uFwd.value as THREE.Vector3);
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    right.crossVectors(u.uFwd.value as THREE.Vector3, camera.up).normalize();
    up.crossVectors(right, u.uFwd.value as THREE.Vector3).normalize();
    (u.uRight.value as THREE.Vector3).copy(right);
    (u.uUp.value as THREE.Vector3).copy(up);
    u.uTan.value = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    u.uNear.value = camera.near;
    u.uFar.value = camera.far;
    u.uR.value = uniforms.uR;
    u.uHeat.value = uniforms.uHeat;
    u.uDisk.value = uniforms.uDisk;

    renderer.setRenderTarget(null);
    renderer.render(this.quadScene, this.dummyCam);
  }

  dispose(): void {
    this.renderTarget.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
