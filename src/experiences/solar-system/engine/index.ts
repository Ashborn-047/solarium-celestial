import * as THREE from 'three';
import { Engine } from '../../../shared/types/engine';
import { createRenderer } from '../../../shared/three/renderer';
import { handleResize } from '../../../shared/three/resize';
import { disposeObject } from '../../../shared/three/dispose';
import { createSolarStarfield } from './starfield';
import { createAsteroidBelt } from './asteroid-belt';
import { TimeController } from './time';
import { SolarCameraRig } from './camera-rig';
import { buildSolarSystemTree, SystemNode } from './system-builder';
import { computeVisibleLabels, LabelItem } from './labels';
import { makeGlowTexture } from '../../../bodies/procedural';
import { SolarCollapseManager } from './collapse-manager';

export class SolarSystemEngine implements Engine {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private sysGroup: THREE.Group | null = null;
  private belt: THREE.Points | null = null;
  private nodes: SystemNode[] = [];
  private sunNode: SystemNode | null = null;
  private ambientLight: THREE.AmbientLight | null = null;
  private sunLight: THREE.PointLight | null = null;
  private shadowsEnabled = true;
  private animId = 0;
  private lastTime = 0;
  private isFrozen = false;
  private tempPos = new THREE.Vector3();
  private tempDir = new THREE.Vector3();

  readonly time = new TimeController();
  readonly cameraRig = new SolarCameraRig();
  readonly collapseManager = new SolarCollapseManager();

  onLabelsUpdate?: (labels: LabelItem[]) => void;
  onFocusChange?: (node: SystemNode | null) => void;
  onDiveReady?: (yaw: number, pitch: number, dist: number) => void;

  mount(canvas: HTMLCanvasElement): void {
    this.isFrozen = new URLSearchParams(window.location.search).get('freeze') === '1';
    this.renderer = createRenderer(canvas, { antialias: true, exposure: 1.0 });
    if (!this.renderer) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 6000);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(this.ambientLight);
    this.scene.add(createSolarStarfield(3000));

    this.sysGroup = new THREE.Group();
    this.scene.add(this.sysGroup);

    this.sunLight = new THREE.PointLight(0xfff0dc, 4, 0, 0);
    this.sysGroup.add(this.sunLight);

    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        color: 0xffaa44,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glowSprite.scale.set(22, 22, 1);
    this.sysGroup.add(glowSprite);

    this.belt = createAsteroidBelt(2200);
    this.sysGroup.add(this.belt);

    this.cameraRig.attach(canvas);
    this.cameraRig.setFocus(null, this.camera.aspect);

    window.addEventListener('resize', this.onResize);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
    this.initTree();
  }

  toggleShadows(): boolean {
    this.shadowsEnabled = !this.shadowsEnabled;
    if (this.ambientLight) this.ambientLight.intensity = this.shadowsEnabled ? 0.25 : 1.35;
    if (this.sunLight) this.sunLight.intensity = this.shadowsEnabled ? 4.0 : 1.0;
    return this.shadowsEnabled;
  }

  toggleHoverMode(): boolean {
    return this.cameraRig.toggleHoverMode();
  }

  private async initTree(): Promise<void> {
    if (!this.sysGroup) return;
    const { nodes, sunNode } = await buildSolarSystemTree(this.sysGroup);
    this.nodes = nodes;
    this.sunNode = sunNode;
    this.collapseManager.init(window.innerWidth, window.innerHeight, this.sysGroup);
  }

  private onResize = (): void => {
    if (!this.renderer || !this.camera) return;
    handleResize(this.camera, this.renderer);
    this.collapseManager.setSize(window.innerWidth, window.innerHeight);
    if (!this.cameraRig.focus) this.cameraRig.tDist = this.cameraRig.ovDist(this.camera.aspect);
  };

  setFocus(node: SystemNode | null): void {
    if (!this.camera) return;
    this.cameraRig.setFocus(node, this.camera.aspect);
    this.onFocusChange?.(node);
  }

  getSunNode(): SystemNode | null {
    return this.sunNode;
  }

  private loop = (time: number): void => {
    this.animId = requestAnimationFrame(this.loop);
    if (!this.renderer || !this.scene || !this.camera || !this.sysGroup || !this.belt) return;

    const dt = this.isFrozen ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    const currentDay = this.isFrozen ? 0 : this.time.update(dt);

    for (const d of this.nodes) {
      if (d.data.orbitRadius && d.data.orbitalPeriod) {
        const a = d.phase + (Math.PI * 2 * currentDay) / d.data.orbitalPeriod;
        d.group.position.set(Math.cos(a) * d.data.orbitRadius, 0, Math.sin(a) * d.data.orbitRadius);
      }
      const s = d.data.spinPeriod || d.data.orbitalPeriod || 1;
      d.mesh.rotation.y = -(Math.PI * 2 * currentDay) / s;
      if (d.clouds) d.clouds.rotation.y = -(Math.PI * 2 * currentDay * 1.15) / s;
      if (d.sunMat) d.sunMat.uniforms.t.value = time * 0.001;
      if (d.uSun) {
        d.pivot.getWorldPosition(this.tempPos);
        this.tempDir.copy(this.tempPos).negate().normalize().transformDirection(this.camera.matrixWorldInverse);
        d.uSun.value.copy(this.tempDir);
      }
      if (d.line) {
        if (!d.parent || d.parent === this.sunNode) {
          d.line.visible = true;
        } else {
          d.parent.group.getWorldPosition(this.tempPos);
          d.line.visible = this.camera.position.distanceTo(this.tempPos) < 220 || d.parent === this.cameraRig.rel;
        }
      }
    }

    this.belt.rotation.y = -currentDay * 0.0004;
    this.collapseManager.update(dt, this.nodes);
    this.scene.updateMatrixWorld();
    this.cameraRig.update(dt, this.camera);

    if (this.cameraRig.focus === this.sunNode && this.cameraRig.dist <= 30.5) {
      this.onDiveReady?.(this.cameraRig.yaw, this.cameraRig.pitch, 30);
    }

    if (this.onLabelsUpdate) {
      const labels = computeVisibleLabels(
        this.nodes,
        this.camera,
        this.cameraRig.focus,
        this.cameraRig.rel,
        window.innerWidth,
        window.innerHeight
      );
      this.onLabelsUpdate(labels);
    }

    const handled = this.collapseManager.render(this.renderer, this.scene, this.camera);
    if (!handled) this.renderer.render(this.scene, this.camera);
  };

  dispose(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    this.cameraRig.detach();
    this.collapseManager.dispose();
    if (this.scene) disposeObject(this.scene);
    this.renderer?.dispose();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }
}
