import { create } from 'zustand';

export const SPEEDS = [0.25, 1, 3, 10, 30, 100, 365];

export interface UIState {
  selectedBodyId: string | null;
  speedIndex: number;
  paused: boolean;
  collapsed: boolean;
  showDisk: boolean;
  diving: boolean;
  phase: number;
  setSelectedBodyId: (id: string | null) => void;
  setSpeedIndex: (index: number) => void;
  stepSpeed: (delta: number) => void;
  togglePause: () => void;
  toggleCollapse: () => void;
  toggleDisk: () => void;
  toggleDiving: () => void;
  setPhase: (phase: number) => void;
}

export const useStore = create<UIState>((set) => ({
  selectedBodyId: null,
  speedIndex: 3, // default 10 days/s
  paused: false,
  collapsed: false,
  showDisk: true,
  diving: false,
  phase: -1,
  setSelectedBodyId: (id) => set({ selectedBodyId: id }),
  setSpeedIndex: (index) =>
    set({ speedIndex: Math.max(0, Math.min(SPEEDS.length - 1, index)), paused: false }),
  stepSpeed: (delta) =>
    set((s) => ({
      speedIndex: Math.max(0, Math.min(SPEEDS.length - 1, s.speedIndex + delta)),
      paused: false,
    })),
  togglePause: () => set((s) => ({ paused: !s.paused })),
  toggleCollapse: () => set((s) => ({ collapsed: !s.collapsed })),
  toggleDisk: () => set((s) => ({ showDisk: !s.showDisk })),
  toggleDiving: () => set((s) => ({ diving: !s.diving })),
  setPhase: (phase) => set({ phase }),
}));
