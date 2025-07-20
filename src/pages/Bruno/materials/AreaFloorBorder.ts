import * as THREE from "three";

import shaderFragment from "../shaders/areaFloorBorder/fragment.ts";
import shaderVertex from "../shaders/areaFloorBorder/vertex.ts";

function AreaFloorBorder() {
  const uniforms = {
    uColor: { value: null },
    uAlpha: { value: null },
    uLoadProgress: { value: null },
    uProgress: { value: null },
  };

  const material = new THREE.ShaderMaterial({
    wireframe: false,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    uniforms,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });

  return material;
}

export default AreaFloorBorder;
