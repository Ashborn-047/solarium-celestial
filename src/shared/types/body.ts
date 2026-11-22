export interface BodyFact {
  label: string;
  value: string;
}

export interface BodyData {
  id: string;
  name: string;
  radius: number;
  orbitRadius: number;
  orbitalPeriod: number;
  spinPeriod: number;
  tilt: number;
  diameter: string;
  distance: string;
  orbitDesc: string;
  moonCount: string;
  note: string;
  facts: [string, string][];
  parentId?: string;
  children?: BodyData[];
  ring?: [number, number, string];
  scale?: [number, number, number];
  bump?: [string, number];
  hours?: number;
}
