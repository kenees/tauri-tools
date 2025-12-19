import * as THREE from "three";

export default class Car {
  time: any;
  resources: any;
  objects: any;
  physics: any;
  shadows: any;
  materials: any;
  controls: any;
  sounds: any;
  renderer: any;
  camera: any;
  debug: any;
  config: any;
  container: THREE.Object3D<THREE.Object3DEventMap>;
  position: THREE.Vector3;
  debgFolder: any;
  models: any;
  chassis: any;

  constructor(_options: { time: any; resources: any; object: any; physics: any; shadows: any; materials: any; controls: any; sounds: any; renderer: any; camera: any; debug: any; config: any }) {
    // Options
    this.time = _options.time;
    this.resources = _options.resources;
    this.objects = _options.object;
    this.physics = _options.physics;
    this.shadows = _options.shadows;
    this.materials = _options.materials;
    this.controls = _options.controls;
    this.sounds = _options.sounds;
    this.renderer = _options.renderer;
    this.camera = _options.camera;
    this.debug = _options.debug;
    this.config = _options.config;

    // Set up
    this.container = new THREE.Object3D();
    this.position = new THREE.Vector3();

    // Debug
    if (this.debug) {
      this.debgFolder = this.debug.addFolder("car");
    }

    this.setModels();
    this.setMovement();
    this.setChassis();
  }

  setModels() {
    this.models = {};

    // Cyber truck
    if (this.config.cyberTruck) {
    }
    // Default
    else {
      this.models.chassis = this.resources.items.carDefaultChassis; // 底盘
      this.models.antena = this.resources.items.carDefaultAntena; // 天线
      this.models.backLightsBrake = this.resources.items.carDefaultBackLightsBrake; // 刹车灯
      this.models.backLightsReverse = this.resources.items.carDefaultBackLightsReverse; // 倒车灯
      this.models.wheel = this.resources.items.carDefaultWheel; // 车轮
    }
  }

  // 设定动作
  setMovement() {}

  setChassis() {
    this.chassis = {};
    this.chassis.offset = new THREE.Vector3(0, 0, -0.28);
    this.chassis.object = this.objects.getConvertedMesh(this.models.chassis.scene.children);
  }
}
