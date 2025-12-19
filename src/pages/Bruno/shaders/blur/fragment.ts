export default `#define M_PI 3.1415926535897932384626433832795

uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uStrength;

varying vec2 vUv;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 strength) {
    vec2 texel = strength / resolution;

    vec4 color = vec4(0.0);
    color += texture2D(image, uv + texel * -4.0) * 0.0162162162;
    color += texture2D(image, uv + texel * -3.0) * 0.0540540541;
    color += texture2D(image, uv + texel * -2.0) * 0.1216216216;
    color += texture2D(image, uv + texel * -1.0) * 0.1945945946;
    color += texture2D(image, uv)             * 0.2270270270;
    color += texture2D(image, uv + texel *  1.0) * 0.1945945946;
    color += texture2D(image, uv + texel *  2.0) * 0.1216216216;
    color += texture2D(image, uv + texel *  3.0) * 0.0540540541;
    color += texture2D(image, uv + texel *  4.0) * 0.0162162162;

    return color;
}

void main()
{
    vec4 diffuseColor = texture2D(tDiffuse, vUv);
    vec4 blurColor = blur9(tDiffuse, vUv, uResolution, uStrength);
    float blurStrength = 1.0 - sin(vUv.y * M_PI);
    gl_FragColor = mix(diffuseColor, blurColor, blurStrength);
}
`;
