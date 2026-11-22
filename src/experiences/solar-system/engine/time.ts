export const TIME_SPEEDS = [0.25, 1, 3, 10, 30, 100, 365];
export const DEFAULT_SPEED_INDEX = 3;

export class TimeController {
  day = 0;
  paused = false;
  speedIndex = DEFAULT_SPEED_INDEX;

  get currentSpeed(): number {
    return TIME_SPEEDS[this.speedIndex];
  }

  togglePause(): boolean {
    this.paused = !this.paused;
    return this.paused;
  }

  stepSpeed(): number {
    this.speedIndex = (this.speedIndex + 1) % TIME_SPEEDS.length;
    return this.currentSpeed;
  }

  update(dt: number): number {
    if (!this.paused) {
      this.day += dt * this.currentSpeed;
    }
    return this.day;
  }
}
