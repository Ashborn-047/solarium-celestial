import * as THREE from 'three';

export class LightDelayShockwave {
  readonly mesh: THREE.Mesh;
  private material: THREE.MeshBasicMaterial;
  radius = 0;
  active = false;
  speed = 18; // units per simulation second

  constructor() {
    const geom = new THREE.RingGeometry(0.1, 1.2, 128);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.mesh = new THREE.Mesh(geom, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.visible = false;
  }

  trigger(): void {
    this.active = true;
    this.radius = 0;
    this.mesh.visible = true;
  }

  reset(): void {
    this.active = false;
    this.radius = 0;
    this.mesh.visible = false;
    this.material.opacity = 0;
  }

  update(dt: number): number {
    if (!this.active) return 0;
    this.radius += dt * this.speed;

    const inner = Math.max(0.1, this.radius - 1.2);
    const outer = this.radius + 1.2;
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.RingGeometry(inner, outer, 128);

    // Fade out as it expands past outer solar system
    const opacity = Math.max(0, 1 - this.radius / 130) * 0.8;
    this.material.opacity = opacity;

    if (this.radius > 150) {
      this.mesh.visible = false;
    }

    return this.radius;
  }
}
