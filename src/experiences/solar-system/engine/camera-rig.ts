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
  panOffset = new THREE.Vector3();
  idle = 0;
  focus: SystemNode | null = null;
  rel: SystemNode | null = null;
  hoverMode = false;

  private ptr = new Map<number, { clientX: number; clientY: number; isPan: boolean }>();
  private pinch = 0;
  private canvas: HTMLCanvasElement | null = null;
  private isSpace = false;
  private keys = new Set<string>();
  private camRight = new THREE.Vector3();
  private camUp = new THREE.Vector3();

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  detach(): void {
    if (!this.canvas) return;
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerup', this.onUp);
    this.canvas.removeEventListener('pointercancel', this.onUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.canvas = null;
    this.ptr.clear();
    this.keys.clear();
  }

  toggleHoverMode(): boolean {
    this.hoverMode = !this.hoverMode;
    return this.hoverMode;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      this.isSpace = true;
      if (this.canvas) this.canvas.style.cursor = 'grab';
    }
    this.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      this.isSpace = false;
      if (this.canvas) this.canvas.style.cursor = 'default';
    }
    this.keys.delete(e.code);
  };

  private onDown = (e: PointerEvent): void => {
    if (!this.canvas) return;
    this.canvas.setPointerCapture(e.pointerId);
    const isPan = e.button === 2 || e.button === 1 || this.isSpace || this.hoverMode;
    this.ptr.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY, isPan });
    this.idle = 0;
    if (this.ptr.size === 2) {
      const [a, b] = Array.from(this.ptr.values());
      this.pinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
  };

  private onMove = (e: PointerEvent): void => {
    const o = this.ptr.get(e.pointerId);
    if (!o) return;
    const dx = e.clientX - o.clientX;
    const dy = e.clientY - o.clientY;
    this.ptr.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY, isPan: o.isPan });
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

    if (o.isPan) {
      const factor = this.dist * 0.0014;
      this.panOffset.addScaledVector(this.camRight, -dx * factor);
      this.panOffset.addScaledVector(this.camUp, dy * factor);
    } else {
      this.yaw -= dx * 0.005;
      this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.005, -1.48, 1.48);
    }
  };

  private onUp = (e: PointerEvent): void => {
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
    this.panOffset.set(0, 0, 0);
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
    this.camRight.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
    this.camUp.set(
      -Math.sin(this.yaw) * Math.sin(this.pitch),
      Math.cos(this.pitch),
      -Math.cos(this.yaw) * Math.sin(this.pitch)
    ).normalize();

    const speed = this.dist * dt * 0.8;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) this.panOffset.addScaledVector(this.camUp, speed);
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) this.panOffset.addScaledVector(this.camUp, -speed);
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) this.panOffset.addScaledVector(this.camRight, -speed);
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) this.panOffset.addScaledVector(this.camRight, speed);
    if (this.keys.has('KeyQ')) this.yaw += dt * 0.9;
    if (this.keys.has('KeyE')) this.yaw -= dt * 0.9;

    if (this.focus) {
      this.focus.group.getWorldPosition(this.fp);
    } else {
      this.fp.set(0, 0, 0);
    }

    this.tr = Math.min(1, this.tr + dt / 1.4);
    const e = this.tr * this.tr * (3 - 2 * this.tr);
    this.target.lerpVectors(this.from, this.fp, e).add(this.panOffset);

    this.idle += dt;
    if (this.idle > 4 && !this.focus && this.panOffset.lengthSq() < 0.01) {
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
