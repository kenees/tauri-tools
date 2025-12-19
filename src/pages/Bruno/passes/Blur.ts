import shaderFragment from "../shaders/blur/fragment.ts";
import shaderVertex from "../shaders/blur/vertex.ts";

export default {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    uResolution: { type: "v2", value: null },
    uStrength: { type: "v2", value: null },
  },
  vertexShader: shaderVertex,
  fragmentShader: shaderFragment,
};
