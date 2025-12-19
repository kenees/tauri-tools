import * as THREE from "three";
import gsap from "gsap";

import EventEmitter from "../utils/EventEmitter";
import AreaFloorBorderGeometry from "../geometries/AreaFloorBorderGeometry";
import AreaFloorBorderMaterial from "../materials/AreaFloorBorder";
import AreaFenceGeometry from "../geometries/AreaFenceGeometry";
import AreaFenceMaterial from "../materials/AreaFence";

export default class Area extends EventEmitter {
  container: THREE.Object3D<THREE.Object3DEventMap>;
  position: THREE.Vector3;
  mouseMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> | undefined;
  time: any;
  halfExtents: any;
  active: boolean | undefined;
  isIn: boolean | undefined;
  config: any;
  floorBorder: any;
  hasKey: any;
  fence: any;
  sounds: any;

  constructor(_options: any) {
    super();

    // Options
    this.config = _options.conifg;
    this.time = _options.time;
    this.position = _options.position || new THREE.Vector3(0, 0, 0);
    this.halfExtents = _options.halfExtents;
    this.sounds = _options.sounds;

    // Set up
    this.container = new THREE.Object3D();
    this.container.position.x = this.position.x;
    this.container.position.y = this.position.y;
    this.container.matrixAutoUpdate = false;
    this.container.updateMatrix();

    this.isIn = false;

    this.setFloorBorder();
    this.setFence();
    this.setInsteractions();

    // if (this.hasKey) {
    //   this.setKey();
    // }
  }

  activate() {
    this.active = true;

    if (this.isIn) {
      this.in();
    }
  }

  deactivate() {
    this.active = false;

    if (this.isIn) {
      this.out();
    }
  }

  // 启动页面Loading & Staring 文字外边的边框
  setFloorBorder() {
    this.floorBorder = {};

    this.floorBorder.geometry = new AreaFloorBorderGeometry(this.halfExtents.x * 2, this.halfExtents.y * 2, 0.25).geometry;
    this.floorBorder.material = AreaFloorBorderMaterial();
    this.floorBorder.material.uniforms.uColor.value = new THREE.Color(0xffffff);
    this.floorBorder.material.uniforms.uAlpha.value = 0.5;
    this.floorBorder.material.uniforms.uLoadProgress.value = 1;
    this.floorBorder.material.uniforms.uProgress.value = 1;
    this.floorBorder.mesh = new THREE.Mesh(this.floorBorder.geometry, this.floorBorder.material);
    this.floorBorder.mesh.matrixAutoUpdate = false;

    this.container.add(this.floorBorder.mesh);
  }

  // 启动页面围栏
  setFence() {
    // Set up
    this.fence = {};
    this.fence.depth = 0.5;
    this.fence.offset = 0.5;

    // Geometry
    this.fence.geometry = new AreaFenceGeometry(this.halfExtents.x * 2, this.halfExtents.y * 2, this.fence.depth).geometry;

    // Material
    this.fence.material = AreaFenceMaterial();
    this.fence.material.uniforms.uBorderAlpha.value = 0.5;
    this.fence.material.uniforms.uStrikeAlpha.value = 0.25;

    // Mesh
    this.fence.mesh = new THREE.Mesh(this.fence.geometry, this.fence.material);
    this.fence.mesh.position.z = -this.fence.depth;
    this.container.add(this.fence.mesh);

    // Time tick
    this.time.on("tick", () => {
      this.fence.material.uniforms.uTime.value = this.time.elapsed;
    });
  }

  setKey() {}

  // 互动
  interact(_showKey = true) {
    console.log("interact...", this.active);
    if (!this.active) {
      return;
    }

    // Kill tweens
    gsap.killTweensOf(this.fence.mesh.position);
    gsap.killTweensOf(this.floorBorder.material.uniforms.uAlpha);
    gsap.killTweensOf(this.fence.mesh.material.uniforms.uBorderAlpha);

    // Animate
    gsap.to(this.fence.mesh.position, {
      z: 0,
      duration: 0.05,
      onComplete: () => {
        // 悬浮边框碰底后再次上浮
        gsap.to(this.fence.mesh.position, { z: 0.5, duration: 0.25, ease: "back.out(2)" });
        // 悬浮边框碰到底的瞬间底部平面边框开始透明度 1 ～0.5
        gsap.fromTo(this.floorBorder.material.uniforms.uAlpha, { value: 1 }, { value: 0.5, duration: 1.5 });
        // 悬浮框的边框透明度 1 ～ 0.5
        gsap.fromTo(this.fence.material.uniforms.uBorderAlpha, { value: 1 }, { value: 0.5, duration: 1.5 });
      },
    });

    // Play Sound
    this.sounds.play("uiArea");
    this.trigger("interact");
  }

  in(_showKey = true) {
    console.log("xxxxx in", this.active);
    this.isIn = true;

    // Not active
    if (!this.active) {
      return;
    }

    // Fence
    gsap.killTweensOf(this.fence.mesh.position); // 终止 位置移动动画
    gsap.to(this.fence.mesh.position, { z: this.fence.offset, duration: 0.35, ease: "back.out(3)" }); // 重新启动动画
  }

  out() {
    this.isIn = false;
    console.log("out...");

    // Fence
    gsap.killTweensOf(this.fence.mesh.position);
    gsap.to(this.fence.mesh.position, { z: -this.fence.depth, duration: 0.35, ease: "back.in(4)" });
  }

  setInsteractions() {
    this.mouseMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.halfExtents.x * 2, this.halfExtents.y * 2, 1, 1),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }) // 透明材质，透明度； 因需特殊处理，会在非透明对象之后渲染
      // new THREE.MeshBasicMaterial({ color: "red" })
    );
    this.mouseMesh.position.z = -0.01;
    this.mouseMesh.matrixAutoUpdate = false;
    this.mouseMesh.updateMatrix();
    this.container.add(this.mouseMesh);

    // this.time.on("tick", () => {});

    // window.addEventListener("keydown", (_event: Event) => {});
  }
}
