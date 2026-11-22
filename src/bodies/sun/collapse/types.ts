export interface CollapseUniforms {
  uR: { value: number };
  uHeat: { value: number };
  uDisk: { value: number };
  uROUT: { value: number };
}

export interface CollapseState {
  collapsed: boolean;
  showDisk: boolean;
  progress: number;
  phase: number;
}
