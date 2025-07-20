import * as THREE from "three";
import FloorMaterial from "../materials/Floor";

export default class Floor {
  debug: any;
  container: THREE.Object3D<THREE.Object3DEventMap>;
  geometry: THREE.PlaneGeometry;
  material: any;
  updateMaterial: () => void;
  mesh: THREE.Mesh<THREE.PlaneGeometry, any, THREE.Object3DEventMap>;
  colors: { topLeft: string; topRight: string; bottomLeft: string; bottomRight: string };
  backgroundTexture: THREE.DataTexture | undefined;

  constructor(_options: any) {
    // Options
    this.debug = _options.debug;

    // Container
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    // Geometry
    this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10);

    // Colors
    this.colors = {
      topLeft: "#f5883c",
      topRight: "#ff9043",
      bottomLeft: "#fccf92",
      bottomRight: "#f5aa58",
    };

    // Material
    this.material = FloorMaterial();

    this.updateMaterial = () => {
      const topLeft = new THREE.Color(this.colors.topLeft).convertLinearToSRGB(); //// 将此颜色从线性空间转换成sRGB空间。
      const topRight = new THREE.Color(this.colors.topRight).convertLinearToSRGB();
      const bottomLeft = new THREE.Color(this.colors.bottomLeft).convertLinearToSRGB();
      const bottomRight = new THREE.Color(this.colors.bottomRight).convertLinearToSRGB();

      const data = new Uint8Array([
        Math.round(bottomLeft.r * 255),
        Math.round(bottomLeft.g * 255),
        Math.round(bottomLeft.b * 255),
        255,
        Math.round(bottomRight.r * 255),
        Math.round(bottomRight.g * 255),
        Math.round(bottomRight.b * 255),
        255,
        Math.round(topLeft.r * 255),
        Math.round(topLeft.g * 255),
        Math.round(topLeft.b * 255),
        255,
        Math.round(topRight.r * 255),
        Math.round(topRight.g * 255),
        Math.round(topRight.b * 255),
        255,
      ]);

      this.backgroundTexture = new THREE.DataTexture(data, 2, 2); // data, width, height
      this.backgroundTexture.magFilter = THREE.LinearFilter;
      this.backgroundTexture.needsUpdate = true;

      this.material.uniforms.tBackground.value = this.backgroundTexture;
    };

    this.updateMaterial();

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false; // 物体无论是否在视锥体内都会被渲染，可能增加渲染负担但能避免因位置更新不及时导致的显示问题。
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.container.add(this.mesh);

    // Debug
    if (this.debug) {
      const folder = this.debug.addFolder("floor");
      folder.open();

      folder.addColor(this.colors, "topLeft").onChange(this.updateMaterial);
      folder.addColor(this.colors, "topRight").onChange(this.updateMaterial);
      folder.addColor(this.colors, "bottomRight").onChange(this.updateMaterial);
      folder.addColor(this.colors, "bottomLeft").onChange(this.updateMaterial);
    }
  }
}
