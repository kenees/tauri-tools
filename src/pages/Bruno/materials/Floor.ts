import * as THREE from "three";
import shaderFragment from "../shaders/floor/fragment.ts";
import shaderVertex from "../shaders/floor/vertex.ts";

function FloorMaterial() {
  const uniforms = {
    tBackground: { value: null },
  };

  const material = new THREE.ShaderMaterial({
    wireframe: false,
    transparent: false,
    uniforms,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });

  return material;
}

export default FloorMaterial;
