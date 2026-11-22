import * as THREE from 'three';

export interface OrbitState {
  yaw: number;
  pitch: number;
  dist: number;
  targetDist: number;
  vYaw: number;
  vPitch: number;
  dragging: boolean;
  idle: number;
  minDist: number;
  maxDist: number;
  minPitch: number;
  maxPitch: number;
}

export class OrbitControls {
  public state: OrbitState;
  private canvas: HTMLCanvasElement;
  private pointers = new Map<number, { clientX: number; clientY: number }>();
  private lastX = 0;
  private lastY = 0;
  private pinchDist = 0;
  private onPointerDownBound: (e: PointerEvent) => void;
  private onPointerMoveBound: (e: PointerEvent) => void;
  private onPointerUpBound: (e: PointerEvent) => void;
  private onWheelBound: (e: WheelEvent) => void;

  constructor(canvas: HTMLCanvasElement, initial?: Partial<OrbitState>) {
    this.canvas = canvas;
    this.state = {
      yaw: initial?.yaw ?? 0.6,
      pitch: initial?.pitch ?? 0.09,
      dist: initial?.dist ?? 70,
      targetDist: initial?.targetDist ?? 30,
      vYaw: 0,
      vPitch: 0,
      dragging: false,
      idle: 0,
      minDist: initial?.minDist ?? 8,
      maxDist: initial?.maxDist ?? 70,
      minPitch: initial?.minPitch ?? -1.45,
      maxPitch: initial?.maxPitch ?? 1.45,
    };

    this.onPointerDownBound = this.onPointerDown.bind(this);
    this.onPointerMoveBound = this.onPointerMove.bind(this);
    this.onPointerUpBound = this.onPointerUp.bind(this);
    this.onWheelBound = this.onWheel.bind(this);

    this.attach();
  }

  private attach(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDownBound);
    this.canvas.addEventListener('pointermove', this.onPointerMoveBound);
    this.canvas.addEventListener('pointerup', this.onPointerUpBound);
    this.canvas.addEventListener('pointercancel', this.onPointerUpBound);
    this.canvas.addEventListener('wheel', this.onWheelBound, { passive: false });
  }

  private onPointerDown(e: PointerEvent): void {
    this.canvas.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    this.state.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.state.idle = 0;
    this.canvas.classList.add('drag');

    if (this.pointers.size === 2) {
      const [a, b] = Array.from(this.pointers.values());
      this.pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) return;
    this.pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    this.state.idle = 0;

    if (this.pointers.size === 2) {
      const [a, b] = Array.from(this.pointers.values());
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (this.pinchDist > 0 && d > 0) {
        this.state.targetDist = THREE.MathUtils.clamp(
          (this.state.targetDist * this.pinchDist) / d,
          this.state.minDist,
          this.state.maxDist
        );
        this.pinchDist = d;
      }
      return;
    }

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    this.state.vYaw = -dx * 0.0052;
    this.state.vPitch = dy * 0.0052;
    this.state.yaw += this.state.vYaw;
    this.state.pitch = THREE.MathUtils.clamp(
      this.state.pitch + this.state.vPitch,
      this.state.minPitch,
      this.state.maxPitch
    );
  }

  private onPointerUp(e: PointerEvent): void {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size === 0) {
      this.state.dragging = false;
      this.canvas.classList.remove('drag');
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    this.state.targetDist = THREE.MathUtils.clamp(
      this.state.targetDist * Math.exp(e.deltaY * 0.001),
      this.state.minDist,
      this.state.maxDist
    );
  }

  public update(dt: number, autoRotate = true): void {
    if (!this.state.dragging) {
      this.state.yaw += this.state.vYaw;
      this.state.pitch = THREE.MathUtils.clamp(
        this.state.pitch + this.state.vPitch,
        this.state.minPitch,
        this.state.maxPitch
      );
      this.state.vYaw *= 0.94;
      this.state.vPitch *= 0.94;
      this.state.idle += dt;

      if (autoRotate && this.state.idle > 2) {
        this.state.yaw += 0.025 * dt * Math.min(1, (this.state.idle - 2) / 3);
      }
    }

    this.state.dist += (this.state.targetDist - this.state.dist) * (1 - Math.exp(-dt * 1.6));
  }

  public dispose(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDownBound);
    this.canvas.removeEventListener('pointermove', this.onPointerMoveBound);
    this.canvas.removeEventListener('pointerup', this.onPointerUpBound);
    this.canvas.removeEventListener('pointercancel', this.onPointerUpBound);
    this.canvas.removeEventListener('wheel', this.onWheelBound);
    this.pointers.clear();
  }
}
