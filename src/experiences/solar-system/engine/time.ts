export const TIME_SPEEDS = [0.1, 0.25, 0.5, 1, 2, 5, 10, 30];
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

  stepSpeed(delta = 1): number {
    this.speedIndex = (this.speedIndex + delta + TIME_SPEEDS.length) % TIME_SPEEDS.length;
    return this.currentSpeed;
  }

  setSpeedIndex(index: number): number {
    this.speedIndex = Math.max(0, Math.min(TIME_SPEEDS.length - 1, index));
    return this.currentSpeed;
  }

  update(dt: number): number {
    if (!this.paused) {
      this.day += dt * this.currentSpeed;
    }
    return this.day;
  }
}
