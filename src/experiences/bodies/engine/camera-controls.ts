import * as THREE from 'three';

export class CameraControls {
  yaw = 0;
  pitch = 0.12;
  dist = 3.4;
  tDist = 3.4;
  vy = 0;
  vp = 0;

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
    if (this.ptr.size === 2) {
      const [a, b] = Array.from(this.ptr.values());
      this.pinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    const o = this.ptr.get(e.pointerId);
    if (!o) return;
    this.ptr.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

    if (this.ptr.size === 2) {
      const [a, b] = Array.from(this.ptr.values());
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (this.pinch > 0 && d > 0) {
        this.tDist = THREE.MathUtils.clamp((this.tDist * this.pinch) / d, 1.3, 14);
        this.pinch = d;
      }
      return;
    }

    const k = Math.min(1, this.dist / 3);
    this.vy = -(e.clientX - o.clientX) * 0.006 * k;
    this.vp = (e.clientY - o.clientY) * 0.006 * k;
    this.yaw += this.vy;
    this.pitch = THREE.MathUtils.clamp(this.pitch + this.vp, -1.5, 1.5);
  };

  private onPointerUp = (e: PointerEvent): void => {
    this.ptr.delete(e.pointerId);
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.tDist = THREE.MathUtils.clamp(this.tDist * Math.exp(e.deltaY * 0.001), 1.3, 14);
  };

  update(dt: number, camera: THREE.PerspectiveCamera): void {
    if (this.ptr.size === 0) {
      this.yaw += this.vy;
      this.pitch = THREE.MathUtils.clamp(this.pitch + this.vp, -1.5, 1.5);
      this.vy *= 0.94;
      this.vp *= 0.94;
    }

    this.dist += (this.tDist - this.dist) * (1 - Math.exp(-dt * 4));
    const cp = Math.cos(this.pitch);
    camera.position.set(
      this.dist * cp * Math.sin(this.yaw),
      this.dist * Math.sin(this.pitch),
      this.dist * cp * Math.cos(this.yaw)
    );
    camera.lookAt(0, 0, 0);
  }
}
