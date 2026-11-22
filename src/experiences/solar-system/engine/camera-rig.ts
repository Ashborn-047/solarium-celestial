import * as THREE from 'three';
import { SystemNode } from './system-builder';

export class SolarCameraRig {
  yaw = 0.6;
  pitch = 0.55;
  dist = 900;
  tDist = 300;
  tr = 1;
  from = new THREE.Vector3();
  target = new THREE.Vector3();
  fp = new THREE.Vector3();
  idle = 0;
  focus: SystemNode | null = null;
  rel: SystemNode | null = null;

  private ptr = new Map<number, { clientX: number; clientY: number }>();
  private pinch = 0;
  private canvas: HTMLCanvasElement | null = null;

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
  }

  detach(): void {
    if (!this.canvas) return;
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas = null;
    this.ptr.clear();
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (!this.canvas) return;
    this.canvas.setPointerCapture(e.pointerId);
    this.ptr.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    this.idle = 0;
    if (this.ptr.size === 2) {
      const [a, b] = Array.from(this.ptr.values());
      this.pinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    const o = this.ptr.get(e.pointerId);
    if (!o) return;
    this.ptr.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    this.idle = 0;

    if (this.ptr.size === 2) {
      const [a, b] = Array.from(this.ptr.values());
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (this.pinch > 0 && d > 0) {
        this.tDist = THREE.MathUtils.clamp((this.tDist * this.pinch) / d, 0.4, 2500);
        this.pinch = d;
      }
      return;
    }

    const dx = e.clientX - o.clientX;
    const dy = e.clientY - o.clientY;
    this.yaw -= dx * 0.005;
    this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.005, -1.4, 1.4);
  };

  private onPointerUp = (e: PointerEvent): void => {
    this.ptr.delete(e.pointerId);
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.idle = 0;
    this.tDist = THREE.MathUtils.clamp(this.tDist * Math.exp(e.deltaY * 0.001), 0.4, 2500);
  };

  ovDist(aspect: number): number {
    return THREE.MathUtils.clamp(125 / (0.466 * Math.min(aspect, 1.1)), 150, 560);
  }

  setFocus(node: SystemNode | null, aspect: number): void {
    this.focus = node;
    this.rel = node && node.data.id !== 'sun' ? (!node.parent || node.parent.data.id === 'sun' ? node : node.parent) : null;
    this.from.copy(this.target);
    this.tr = 0;

    if (!node) {
      this.tDist = this.ovDist(aspect);
      this.pitch = 0.55;
    } else if (node.data.id === 'sun') {
      this.tDist = node.data.radius * 3.6;
    } else if (node.children.length > 0) {
      const maxOrbit = Math.max(...node.children.map((c) => c.data.orbitRadius || 1));
      this.tDist = Math.max(node.data.radius * 5, (maxOrbit * 1.15) / (0.466 * Math.min(aspect, 1.2)));
    } else {
      this.tDist = Math.max(node.data.radius * 7, 1.5);
    }
  }

  update(dt: number, camera: THREE.PerspectiveCamera): void {
    if (this.focus) {
      this.focus.group.getWorldPosition(this.fp);
    } else {
      this.fp.set(0, 0, 0);
    }

    this.tr = Math.min(1, this.tr + dt / 1.4);
    const e = this.tr * this.tr * (3 - 2 * this.tr);
    this.target.lerpVectors(this.from, this.fp, e);

    this.idle += dt;
    if (this.idle > 4 && !this.focus) {
      this.yaw += 0.02 * dt;
    }

    this.dist += (this.tDist - this.dist) * (1 - Math.exp(-dt * 3));
    const cp = Math.cos(this.pitch);
    camera.position.set(
      this.target.x + this.dist * cp * Math.sin(this.yaw),
      this.target.y + this.dist * Math.sin(this.pitch),
      this.target.z + this.dist * cp * Math.cos(this.yaw)
    );
    camera.lookAt(this.target);
  }
}
