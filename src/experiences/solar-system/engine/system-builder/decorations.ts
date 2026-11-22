import * as THREE from 'three';
import { BodyData } from '../../../../shared/types/body';
import { loadTexture } from '../../../../shared/three/texture-loader';
import { createAtmosphereMaterial } from '../../../../bodies/atmosphere';
import { saturnTextures } from '../../../../bodies/saturn/textures';
import { uranusTextures } from '../../../../bodies/uranus/textures';
import { createRingGeometry } from '../../../../bodies/saturn/rings/geometry';
import { createRingMaterial } from '../../../../bodies/saturn/rings/material';

export interface BuiltDecorations {
  clouds?: THREE.Mesh;
  corona?: THREE.Mesh;
  atmosphere?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
}

export async function createBodyDecorations(data: BodyData): Promise<BuiltDecorations> {
  const result: BuiltDecorations = {};

  if (data.id === 'sun') {
    // Sun uses its shader surface and natural feathered sprite glow, no harsh 3D shell
    return result;
  }

  if (data.id === 'earth') {
    try {
      const cTex = await loadTexture('/textures/planets/earth_c.png');
      result.clouds = new THREE.Mesh(
        new THREE.SphereGeometry(data.radius * 1.008, 128, 64),
        new THREE.MeshStandardMaterial({
          map: cTex,
          transparent: true,
          depthWrite: false,
          roughness: 1,
        })
      );
    } catch {
      // cloud texture optional
    }
  }

  if (data.atmosphere) {
    const [color, scale, rad] = data.atmosphere;
    const atmRadius = data.radius * scale;
    const atmGeom = new THREE.SphereGeometry(atmRadius, 64, 32);
    const atmMat = createAtmosphereMaterial(color, rad, scale, true);
    result.atmosphere = new THREE.Mesh(atmGeom, atmMat);
  }

  if (data.ring) {
    const [inner, outer, kind] = data.ring;
    const geom = createRingGeometry(inner, outer, 128);
    const texPath = kind === 'saturn' ? saturnTextures.paths.ring : uranusTextures.paths.ring;
    const colorSpace = kind === 'saturn' ? saturnTextures.colorSpaces.ring : uranusTextures.colorSpaces.ring;
    const ringTex = await loadTexture(texPath, colorSpace);
    const ringMat = createRingMaterial(ringTex);
    const rMesh = new THREE.Mesh(geom, ringMat);
    rMesh.rotation.x = -Math.PI / 2;
    result.ringMesh = rMesh;
  }

  return result;
}
