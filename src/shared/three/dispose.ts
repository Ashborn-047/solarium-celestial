import * as THREE from 'three';

export function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(child.material);
        }
      }
    } else if (child instanceof THREE.Points || child instanceof THREE.Line) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

export function disposeMaterial(material: THREE.Material): void {
  Object.keys(material).forEach((prop) => {
    const value = (material as unknown as Record<string, unknown>)[prop];
    if (value && typeof value === 'object' && 'isTexture' in value) {
      (value as THREE.Texture).dispose();
    }
  });
  material.dispose();
}
