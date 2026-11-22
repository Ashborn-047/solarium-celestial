import * as THREE from 'three';

export type FrameCallback = (dt: number, elapsedTime: number) => void;

export class RenderLoop {
  private clock = new THREE.Clock();
  private callbacks = new Set<FrameCallback>();
  private animationId: number | null = null;
  private running = false;
  private isFrozen = false;
  private totalElapsed = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      this.isFrozen = params.get('freeze') === '1';
    }
  }

  public addCallback(cb: FrameCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.start();

    const loop = () => {
      if (!this.running) return;
      const rawDt = this.clock.getDelta();
      const dt = this.isFrozen ? 0 : Math.min(rawDt, 0.05);
      if (!this.isFrozen) {
        this.totalElapsed += dt;
      }
      this.callbacks.forEach((cb) => cb(dt, this.totalElapsed));
      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }

  public stop(): void {
    this.running = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.clock.stop();
  }

  public getElapsedTime(): number {
    return this.totalElapsed;
  }
}
