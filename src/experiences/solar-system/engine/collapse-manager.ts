import * as THREE from 'three';
import { CollapseTimeline } from '../../../bodies/sun/collapse';
import { LightDelayShockwave } from './shockwave';
import { SolarCollapseComposite } from './collapse-composite';
import { SystemNode } from './system-builder';

export class SolarCollapseManager {
  readonly timeline = new CollapseTimeline();
  readonly shockwave = new LightDelayShockwave();
  private composite: SolarCollapseComposite | null = null;
  private shockwaveTriggered = false;

  init(width: number, height: number, sysGroup: THREE.Group): void {
    this.composite = new SolarCollapseComposite(width, height);
    sysGroup.add(this.shockwave.mesh);
  }

  setSize(width: number, height: number): void {
    this.composite?.setSize(width, height);
  }

  triggerCollapse(): void {
    this.timeline.state.collapsed = true;
    if (!this.shockwaveTriggered) {
      this.shockwave.trigger();
      this.shockwaveTriggered = true;
    }
  }

  restore(): void {
    this.timeline.state.collapsed = false;
    this.shockwave.reset();
    this.shockwaveTriggered = false;
  }

  update(dt: number, nodes: SystemNode[]): void {
    const uniforms = {
      uR: { value: 6 },
      uHeat: { value: 1 },
      uDisk: { value: 0 },
      uROUT: { value: 9 },
    };
    this.timeline.update(dt, uniforms);
    const swRadius = this.shockwave.update(dt);

    if (swRadius > 0) {
      for (const node of nodes) {
        if (node.data.orbitRadius && node.mesh.material instanceof THREE.MeshStandardMaterial) {
          if (swRadius > node.data.orbitRadius) {
            const factor = Math.max(0.05, 1 - (swRadius - node.data.orbitRadius) * 0.1);
            node.mesh.material.color.setScalar(factor);
          }
        }
      }
    }
  }

  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): boolean {
    if (!this.composite || (!this.timeline.state.collapsed && this.timeline.state.progress === 0)) {
      return false;
    }

    renderer.setRenderTarget(this.composite.renderTarget);
    renderer.clear();
    renderer.render(scene, camera);

    const ct = this.timeline.state.progress;
    const u = Math.min(1, Math.max(0, (ct - 1) / 3.2));
    const e = u * u * (3 - 2 * u);
    const base = 6 * (1 + 0.07 * Math.sin(Math.PI * Math.min(1, ct)));

    this.composite.render(renderer, camera, {
      uR: base * (1 - e) + e,
      uHeat: 1 + 1.6 * Math.sin(Math.PI * Math.min(1, u * 1.05)),
      uDisk: this.timeline.state.showDisk ? 1 : 0,
    });

    return true;
  }

  dispose(): void {
    this.composite?.dispose();
    this.composite = null;
  }
}
