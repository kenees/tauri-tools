import * as THREE from "three";

export default class PlaygroundSection {
  time: any;
  resources: any;
  objects: any;
  areas: any;
  walls: any;
  tiles: any;
  debug: any;
  x: number;
  y: number;
  container: THREE.Object3D<THREE.Object3DEventMap>;
  constructor(_options: { time: any; resources: any; objects: any; areas: any; walls: any; tiles: any; debug: any; x: number; y: number }) {
    // Options
    this.time = _options.time;
    this.resources = _options.resources;
    this.objects = _options.objects;
    this.areas = _options.areas;
    this.walls = _options.walls;
    this.tiles = _options.tiles;
    this.debug = _options.debug;
    this.x = _options.x;
    this.y = _options.y;

    // Debug
    if (this.debug) {
    }

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    // this.resources.items.areaResetTexture.magFilter = THREE.NearestFilter;
    // this.resources.items.areaResetTexture.minFilter = THREE.LinearFilter;

    this.setStatic();
    // this.setBricksWalls();
    // this.setBowling();
  }

  setStatic() {
    this.objects.add({});
  }
}
