import * as THREE from 'three';

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export class BlackHoleCameraRig {
  public fwd = new THREE.Vector3();
  public right = new THREE.Vector3();
  public up = new THREE.Vector3();
  public camPos = new THREE.Vector3();

  public update(dist: number, pitch: number, yaw: number): void {
    const cp = Math.cos(pitch);
    this.camPos.set(
      dist * cp * Math.sin(yaw),
      dist * Math.sin(pitch),
      dist * cp * Math.cos(yaw)
    );

    this.fwd.copy(this.camPos).negate().normalize();
    this.right.crossVectors(this.fwd, Y_AXIS).normalize();
    this.up.crossVectors(this.right, this.fwd).normalize();
  }
}
