import * as THREE from "three";

import shaderFragment from "../shaders/shadow/fragment.ts";
import shaderVertex from "../shaders/shadow/vertex.ts";

function Shadow() {
  const uniforms = {
    uColor: { value: null },
    uAlpha: { value: null },
    uFadeRadius: { value: null },
  };

  const material = new THREE.ShaderMaterial({
    wireframe: false,
    transparent: true,
    uniforms,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });

  return material;
}
export default Shadow;
