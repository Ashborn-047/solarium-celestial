import * as THREE from 'three';
import { BodyData } from '../../../shared/types/body';
import { BODIES } from '../../../bodies';
import { loadTexture } from '../../../shared/three/texture-loader';
import { createAtmosphereMaterial } from '../../../bodies/atmosphere';

export interface BuiltBody {
  group: THREE.Group;
  mesh: THREE.Mesh;
  clouds?: THREE.Mesh;
  spinRate: number;
}

export async function buildInspectorBody(
  data: BodyData,
  sunDir: THREE.Vector3,
  uSun: { value: THREE.Vector3 }
): Promise<BuiltBody> {
  const group = new THREE.Group();
  group.rotation.z = THREE.MathUtils.degToRad(data.tilt);

  const def = BODIES[data.id] || (data.parentId ? BODIES[data.parentId] : null);
  let mesh: THREE.Mesh;
  let clouds: THREE.Mesh | undefined;

  if (data.id === 'sun') {
    const sunDef = BODIES.sun;
    const mat = await sunDef.loadDetailMaterial();
    mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 80), mat);
    group.add(mesh);
    const coronaGeom = new THREE.SphereGeometry(1.45, 64, 32);
    const coronaMat = createAtmosphereMaterial('#ff9a2a', 2.4, 1.45, true);
    group.add(new THREE.Mesh(coronaGeom, coronaMat));
  } else if (data.id === 'earth') {
    const earthDef = BODIES.earth;
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
    mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 80), mat);
    group.add(mesh);
    const cTex = await loadTexture('/textures/planets/earth_clouds.jpg');
    clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.007, 128, 64),
      new THREE.MeshStandardMaterial({ map: cTex, transparent: true, depthWrite: false, roughness: 1 })
    );
    group.add(clouds);
  } else {
    let mat: THREE.MeshStandardMaterial;
    if (def && !data.parentId) {
      mat = (await def.loadDetailMaterial()) as THREE.MeshStandardMaterial;
    } else {
      const texPath = `/textures/moons/${data.id}.jpg`;
      const tex = await loadTexture(texPath);
      mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 });
      if (data.bump) {
        mat.bumpMap = tex;
        mat.bumpScale = typeof data.bump[1] === 'number' ? data.bump[1] : 0.3;
      }
    }
    mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 80), mat);
    group.add(mesh);
  }

  if (data.scale) {
    mesh.scale.set(data.scale[0], data.scale[1], data.scale[2]);
  }

  if (data.atmosphere) {
    const [color, scale, rad] = data.atmosphere;
    const atmGeom = new THREE.SphereGeometry(scale, 96, 48);
    const atmMat = createAtmosphereMaterial(color, rad, scale, false, sunDir);
    group.add(new THREE.Mesh(atmGeom, atmMat));
  }

  if (def?.createRingsMesh && !data.parentId) {
    const ringMesh = await def.createRingsMesh(true);
    if (ringMesh) {
      group.add(ringMesh);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  }

  const hrs = data.hours || data.spinPeriod * 24 || 24;
  const spinRate = (2 * Math.PI) / Math.max(14, Math.min(260, hrs * 1.2));

  return { group, mesh, clouds, spinRate };
}
