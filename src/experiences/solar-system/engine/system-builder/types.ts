import * as THREE from 'three';
import { BodyData } from '../../../../shared/types/body';

export interface SystemNode {
  data: BodyData;
  group: THREE.Group;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  line?: THREE.Line;
  phase: number;
  parent?: SystemNode;
  children: SystemNode[];
  clouds?: THREE.Mesh;
  corona?: THREE.Mesh;
  sunMat?: THREE.ShaderMaterial;
  uSun?: { value: THREE.Vector3 };
  atmosphere?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
}
