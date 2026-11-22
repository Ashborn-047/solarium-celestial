import * as THREE from 'three';

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
  inspectorDistance?: number;
  atmosphere?: [string, number, number]; // [color, scale, radius]
}

export interface BodyDefinition {
  data: BodyData;
  createOverviewMaterial: () => THREE.Material;
  loadDetailMaterial: () => Promise<THREE.Material>;
  createAtmosphereMesh?: (sunDir?: THREE.Vector3) => THREE.Mesh | null;
  createCloudsMesh?: () => Promise<THREE.Mesh | null>;
  createRingsMesh?: (isInspector?: boolean) => Promise<THREE.Mesh | null>;
  textures: {
    paths: Record<string, string>;
    colorSpaces: Record<string, THREE.ColorSpace>;
  };
}
