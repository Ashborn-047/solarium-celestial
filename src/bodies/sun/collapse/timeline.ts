import { CollapseUniforms, CollapseState } from './types';

const clamp = (x: number, a = 0, b = 1): number => Math.min(b, Math.max(a, x));

const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export class CollapseTimeline {
  state: CollapseState = {
    collapsed: false,
    showDisk: true,
    progress: 0,
    phase: 0,
  };

  update(dt: number, uniforms: CollapseUniforms): void {
    const target = this.state.collapsed ? 7 : 0;
    if (this.state.progress < target) {
      this.state.progress = Math.min(target, this.state.progress + dt);
    } else {
      this.state.progress = Math.max(target, this.state.progress - 2 * dt);
    }

    const ct = this.state.progress;
    const u = clamp((ct - 1) / 3.2);
    const e = u * u * (3 - 2 * u);
    const base = 6 * (1 + 0.07 * Math.sin(Math.PI * clamp(ct)));

    uniforms.uR.value = base * (1 - e) + e;
    uniforms.uHeat.value = 1 + 1.6 * Math.sin(Math.PI * clamp(u * 1.05));
    uniforms.uDisk.value = (this.state.showDisk ? 1 : 0) * smoothstep(3.9, 5.8, ct);

    this.state.phase = ct < 0.15 ? 0 : ct < 4.2 ? 1 : 2;
  }
}
