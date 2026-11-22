import * as THREE from 'three';
import { Engine } from '../../../shared/types/engine';
import { BodyData } from '../../../shared/types/body';
import { createRenderer } from '../../../shared/three/renderer';
import { handleResize } from '../../../shared/three/resize';
import { disposeObject } from '../../../shared/three/dispose';
import { createInspectorLighting } from './lighting';
import { createInspectorStarfield } from './starfield';
import { CameraControls } from './camera-controls';
import { buildInspectorBody, BuiltBody } from './body-builder';

export class BodiesEngine implements Engine {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private controls: CameraControls | null = null;
  private currentBody: BuiltBody | null = null;
  private uSun = { value: new THREE.Vector3(1, 0.3, 0.8).normalize() };
  private sunDir = new THREE.Vector3(1, 0.3, 0.8).normalize();
  private animId = 0;
  private lastTime = 0;
  private isFrozen = false;
  private loadToken = 0;
  onLoadingChange?: (loading: boolean, name: string) => void;

  mount(canvas: HTMLCanvasElement): void {
    this.isFrozen = new URLSearchParams(window.location.search).get('freeze') === '1';
    this.renderer = createRenderer(canvas, { antialias: true, shadowMap: true, exposure: 1.1 });
    if (!this.renderer) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.02, 300);

    const { sunDir } = createInspectorLighting(this.scene);
    this.sunDir = sunDir;
    this.scene.add(createInspectorStarfield(1600));

    this.controls = new CameraControls();
    this.controls.attach(canvas);

    window.addEventListener('resize', this.onResize);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private onResize = (): void => {
    if (!this.renderer || !this.camera) return;
    handleResize(this.camera, this.renderer);
  };

  async selectBody(data: BodyData): Promise<void> {
    const token = ++this.loadToken;
    this.onLoadingChange?.(true, data.name);

    if (this.controls) {
      this.controls.tDist = data.inspectorDistance || 3.4;
    }

    const built = await buildInspectorBody(data, this.sunDir, this.uSun);
    if (token !== this.loadToken || !this.scene) {
      disposeObject(built.group);
      return;
    }

    if (this.currentBody) {
      this.scene.remove(this.currentBody.group);
      disposeObject(this.currentBody.group);
    }

    this.currentBody = built;
    this.scene.add(built.group);
    this.onLoadingChange?.(false, data.name);
  }

  private loop = (time: number): void => {
    this.animId = requestAnimationFrame(this.loop);
    if (!this.renderer || !this.scene || !this.camera || !this.controls) return;

    const dt = this.isFrozen ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.controls.update(dt, this.camera);

    if (this.currentBody && !this.isFrozen) {
      this.currentBody.mesh.rotation.y += dt * this.currentBody.spinRate;
      if (this.currentBody.clouds) {
        this.currentBody.clouds.rotation.y += dt * this.currentBody.spinRate * 1.12;
      }
    }

    this.camera.updateMatrixWorld();
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert();
    this.uSun.value.copy(this.sunDir).transformDirection(this.camera.matrixWorldInverse);

    this.renderer.render(this.scene, this.camera);
  };

  dispose(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    this.controls?.detach();
    if (this.currentBody && this.scene) {
      this.scene.remove(this.currentBody.group);
      disposeObject(this.currentBody.group);
    }
    if (this.scene) {
      disposeObject(this.scene);
    }
    this.renderer?.dispose();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
  }
}
