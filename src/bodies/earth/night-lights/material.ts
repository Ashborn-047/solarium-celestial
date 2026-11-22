import * as THREE from 'three';

export function applyNightLightsShader(
  material: THREE.MeshStandardMaterial,
  sunUniform: { value: THREE.Vector3 }
): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSun = sunUniform;
    shader.fragmentShader =
      'uniform vec3 uSun;\n' +
      shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#ifdef USE_EMISSIVEMAP
vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);
float nd = dot(normalize(vNormal), uSun);
totalEmissiveRadiance *= emissiveColor.rgb * smoothstep(0.05, -0.3, nd);
#endif`
      );
  };
}
