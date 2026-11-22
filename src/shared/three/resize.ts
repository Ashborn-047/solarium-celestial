export type ResizeCallback = (width: number, height: number, aspect: number) => void;

export class WindowResizeHandler {
  private callbacks = new Set<ResizeCallback>();
  private onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / Math.max(h, 1);
    this.callbacks.forEach((cb) => cb(w, h, aspect));
  };

  constructor() {
    window.addEventListener('resize', this.onResize);
  }

  public subscribe(cb: ResizeCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.callbacks.clear();
  }
}
