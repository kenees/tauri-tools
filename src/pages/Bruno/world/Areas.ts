import * as THREE from "three";
import Area from "./Area";

export default class Areas {
  config: Object;
  items: any[];
  container: THREE.Object3D<THREE.Object3DEventMap>;
  time: any;
  mouse: any;
  camera: any;
  sounds: any;
  resources: any;
  car: any;
  renderer: any;
  debug: any;
  constructor(_options: any) {
    // Options
    this.config = _options.config;
    this.resources = _options.resources;
    this.car = _options.car;
    this.sounds = _options.sounds;
    this.renderer = _options.renderer;
    this.camera = _options.camera;
    this.time = _options.time;
    this.debug = _options.debug;

    // Set up
    this.items = [];
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setMouse();

    // Test
    // this.add({});
  }

  setMouse() {
    // Set up
    this.mouse = {};
    this.mouse.raycaster = new THREE.Raycaster();
    this.mouse.coordinates = new THREE.Vector2();
    this.mouse.currentArea = null;
    this.mouse.needsUpdate = false;

    window.addEventListener("mousemove", (_event) => {
      // 修正为直角坐标系范围
      this.mouse.coordinates.x = (_event.clientX / window.innerWidth) * 2 - 1; // 修正为 -1 0 1 的范围
      this.mouse.coordinates.y = -(_event.clientY / window.innerHeight) * 2 + 1; // 修正为 1 0 -1

      this.mouse.needsUpdate = true;
    });

    window.addEventListener("mousedown", (_event) => {
      if (this.mouse.currentArea) {
        this.mouse.currentArea.interact(false);
      }
    });

    this.time.on("tick", () => {
      if (this.mouse.needsUpdate) {
        this.mouse.needsUpdate = true;

        // Set up
        this.mouse.raycaster.setFromCamera(this.mouse.coordinates, this.camera.instance);
        const objects = this.items.map((_area) => _area.mouseMesh);
        const intersects = this.mouse.raycaster.intersectObjects(objects);

        if (intersects.length) {
          // Find the area
          const area = this.items.find((_area) => _area.mouseMesh === intersects[0].object);

          // Area did change
          if (area !== this.mouse.currentArea) {
            // Was previously over an area
            if (this.mouse.currentArea !== null) {
              this.mouse.currentArea.out(); // 从上一个物体移除，执行相关操作
              this.mouse.currentArea.testCar = this.mouse.currentArea.initialTestCar; // ???
            }

            // Play in
            this.mouse.currentArea = area;
            this.mouse.currentArea.in(false);
            this.mouse.currentArea.testCar = false;
          }
        }
        // No intersetions found but was previously over an area
        else if (this.mouse.currentArea !== null) {
          // Play out
          this.mouse.currentArea.out();
          this.mouse.currentArea.testCar = this.mouse.currentArea.initialTestCar; // ???
          this.mouse.currentArea = null;
        }
      }
    });
  }

  add(_options: any) {
    const area = new Area({
      config: this.config,
      time: this.time,
      sounds: this.sounds,
      ..._options,
    });

    this.container.add(area.container);
    this.items.push(area);
    return area;
  }
}
