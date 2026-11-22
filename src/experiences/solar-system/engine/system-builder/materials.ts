import * as THREE from 'three';
import { BodyData } from '../../../../shared/types/body';
import { BODIES } from '../../../../bodies';
import { loadTexture } from '../../../../shared/three/texture-loader';

export interface BuiltMaterialResult {
  material: THREE.Material;
  sunMat?: THREE.ShaderMaterial;
  uSun?: { value: THREE.Vector3 };
}

export async function createBodyDetailMaterial(data: BodyData): Promise<BuiltMaterialResult> {
  if (data.id === 'sun') {
    const sunDef = BODIES.sun;
    const mat = (await sunDef.loadDetailMaterial()) as THREE.ShaderMaterial;
    return { material: mat, sunMat: mat };
  }

  if (data.id === 'earth') {
    const earthDef = BODIES.earth;
    const uSun = { value: new THREE.Vector3(1, 0, 0) };
    const mat = await earthDef.loadDetailMaterial();
    if (mat instanceof THREE.MeshStandardMaterial) {
      mat.onBeforeCompile = (s) => {
        s.uniforms.uSun = uSun;
        s.fragmentShader =
          'uniform vec3 uSun;\n' +
          s.fragmentShader.replace(
            '#include <emissivemap_fragment>',
            `#ifdef USE_EMISSIVEMAP
vec4 emissiveColor=texture2D(emissiveMap,vEmissiveMapUv);
float nd=dot(normalize(vNormal),uSun);
totalEmissiveRadiance*=emissiveColor.rgb*smoothstep(.05,-.3,nd);
#endif`
          );
      };
    }
    return { material: mat, uSun };
  }

  const def = BODIES[data.id];
  if (def && !data.parentId) {
    const mat = await def.loadDetailMaterial();
    return { material: mat };
  }

  const texPath = `/textures/moons/${data.id}.jpg`;
  try {
    const tex = await loadTexture(texPath);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.95,
      metalness: 0,
    });
    if (data.bump) {
      mat.bumpMap = tex;
      mat.bumpScale = typeof data.bump[1] === 'number' ? data.bump[1] : 0.3;
    }
    return { material: mat };
  } catch {
    const fallbackMat = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.9,
      metalness: 0,
    });
    return { material: fallbackMat };
  }
}
