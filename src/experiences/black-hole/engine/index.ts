import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { Engine } from '../../../shared/types/engine';
import { createRenderer, isMobile } from '../../../shared/three/renderer';
import { WindowResizeHandler } from '../../../shared/three/resize';
import { RenderLoop } from '../../../shared/three/render-loop';
import { OrbitControls } from '../../../shared/three/orbit-controls';
import { BlackHoleCameraRig } from './camera';
import { createBlackHolePost } from './post';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

const FOV = 48;

export class BlackHoleEngine implements Engine {
  private renderer: THREE.WebGLRenderer | null = null;
  private composer: EffectComposer | null = null;
  private scene = new THREE.Scene();
  private dummyCam = new THREE.Camera();
  private controls: OrbitControls | null = null;
  private rig = new BlackHoleCameraRig();
  private loop = new RenderLoop();
  private resizeHandler = new WindowResizeHandler();
  private uniforms: Record<string, { value: unknown }> = {};
  private quad: THREE.Mesh | null = null;

  public mount(canvas: HTMLCanvasElement): void {
    this.renderer = createRenderer(canvas, {
      antialias: false,
      exposure: 1.05,
      mobilePixelRatio: 0.85,
      desktopPixelRatioMax: 1.25,
    });
    if (!this.renderer) return;

    const mobile = isMobile();
    const steps = mobile ? 220 : 340;

    this.uniforms = {
      uCam: { value: new THREE.Vector3() },
      uFwd: { value: new THREE.Vector3() },
      uRight: { value: new THREE.Vector3() },
      uUp: { value: new THREE.Vector3() },
      uAspect: { value: window.innerWidth / window.innerHeight },
      uTan: { value: Math.tan(THREE.MathUtils.degToRad(FOV / 2)) },
      uTime: { value: 0 },
      uR: { value: 1.0 },
      uHeat: { value: 1.0 },
      uDisk: { value: 1.0 },
      uROUT: { value: 15.0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader: `#define STEPS ${steps}\n${fragmentShader}`,
      depthTest: false,
      depthWrite: false,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);

    this.composer = createBlackHolePost(this.renderer, this.scene, this.dummyCam);
    this.controls = new OrbitControls(canvas, {
      yaw: 0.6,
      pitch: 0.09,
      dist: 70,
      targetDist: 30,
      minDist: 8,
      maxDist: 70,
      minPitch: -1.45,
      maxPitch: 1.45,
    });

    this.resizeHandler.subscribe((w, h, aspect) => {
      this.renderer?.setSize(w, h);
      this.composer?.setSize(w, h);
      (this.uniforms.uAspect.value as number) = aspect;
    });

    this.loop.addCallback((dt) => {
      if (!this.controls || !this.composer) return;
      (this.uniforms.uTime.value as number) += dt;
      this.controls.update(dt);

      const { dist, pitch, yaw } = this.controls.state;
      this.rig.update(dist, pitch, yaw);

      (this.uniforms.uCam.value as THREE.Vector3).copy(this.rig.camPos);
      (this.uniforms.uFwd.value as THREE.Vector3).copy(this.rig.fwd);
      (this.uniforms.uRight.value as THREE.Vector3).copy(this.rig.right);
      (this.uniforms.uUp.value as THREE.Vector3).copy(this.rig.up);

      this.composer.render();
    });

    this.loop.start();
  }

  public setCollapseUniforms(r: number, heat: number, disk: number): void {
    if (this.uniforms.uR) this.uniforms.uR.value = r;
    if (this.uniforms.uHeat) this.uniforms.uHeat.value = heat;
    if (this.uniforms.uDisk) this.uniforms.uDisk.value = disk;
  }

  public getControls(): OrbitControls | null {
    return this.controls;
  }

  public dispose(): void {
    this.loop.stop();
    this.resizeHandler.dispose();
    this.controls?.dispose();
    if (this.quad) {
      this.quad.geometry.dispose();
      (this.quad.material as THREE.Material).dispose();
      this.scene.remove(this.quad);
    }
    this.composer?.dispose();
    this.renderer?.dispose();
  }
}
