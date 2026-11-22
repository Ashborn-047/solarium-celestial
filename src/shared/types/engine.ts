export interface Engine {
  mount(canvas: HTMLCanvasElement): void;
  dispose(): void;
}
