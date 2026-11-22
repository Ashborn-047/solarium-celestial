import * as THREE from 'three';

export interface InspectorLighting {
  light: THREE.DirectionalLight;
  ambient: THREE.AmbientLight;
  sunDir: THREE.Vector3;
}

export function createInspectorLighting(scene: THREE.Scene): InspectorLighting {
  const sunDir = new THREE.Vector3(1, 0.3, 0.8).normalize();
  const light = new THREE.DirectionalLight(0xfff4e6, 3.4);
  light.position.copy(sunDir).multiplyScalar(20);
  scene.add(light, light.target);

  light.castShadow = true;
  light.shadow.bias = -0.0006;
  light.shadow.normalBias = 0.03;
  light.shadow.mapSize.set(2048, 2048);

  const d = 3.4;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.near = 5;
  light.shadow.camera.far = 40;

  const ambient = new THREE.AmbientLight(0x1a2236, 0.35);
  scene.add(ambient);

  return { light, ambient, sunDir };
}
