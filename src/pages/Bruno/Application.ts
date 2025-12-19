import * as THREE from "three";
import * as dat from "dat.gui";

import Time from "./utils/Time";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import World from "./world";
import Resources from "./Resources";
import ThreejsJourney from "./ThreejsJourney";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import BlurPass from "./passes/Blur.ts";
import GlowsPass from "./passes/Glows.ts";
export default class Application {
  $canvas: any;
  time: Time;
  sizes: Sizes;
  resources: Resources;
  conifg: any;
  world: any;
  threejsJourney: ThreejsJourney | undefined;
  config: any;
  debug: dat.GUI | undefined;
  scene: THREE.Scene | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  camera: any; // Camera | undefined;
  passes: any;

  constructor(_options: any) {
    console.log(_options);
    // Options
    this.$canvas = _options.$canvas;

    // Set up
    this.time = new Time(); // 不停的触发 requestAnimationFrame
    this.sizes = new Sizes();
    this.resources = new Resources();

    this.setConfig();
    this.setDebug();
    this.setRenderer();
    this.setCamera();
    this.setPasses();
    this.setWorld();
    this.setTitle();
    this.setThreejsJourney();
  }

  /**
   * Set config
   */
  setConfig() {
    this.config = {};
    this.config.debug = window.location.hash === "#debug"; // 开启debug模式
    this.config.cyberTruck = window.location.hash === "#cybertruck"; // 切换另一个车模型
    this.config.touch = false;

    window.addEventListener(
      "touchstart",
      () => {
        this.conifg.touch = true;
        this.world.controls.setTouch();

        this.passes.horizontalBlurPass.strength = 1;
        this.passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(this.passes.horizontalBlurPass.strength, 0);
        this.passes.verticalBlurPass.strength = 1;
        this.passes.verticalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(0, this.passes.verticalBlurPass.strength);
      },
      { once: true }
    ); // 只触发一次就会被卸载
  }

  /**
   * Set debug
   */
  setDebug() {
    if (this.config.debug) {
      this.debug = new dat.GUI({ width: 420 });
    }
  }

  /**
   * Set renderer
   */
  setRenderer() {
    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(2); // 像素比
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
    this.renderer.autoClear = false; // 定义渲染器是否应在渲染帧之前自动清除其输出。默认值为true

    // Resize event
    this.sizes.on("resize", () => {
      this.renderer?.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
    });
  }

  /**
   * Set camera
   */
  setCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
      config: this.config,
    });

    this.scene?.add(this.camera.container);

    this.time.on("tick", () => {
      if (this.world && this.world.car && this.camera) {
        this.camera.target.x = this.world.car.chassis.object.position.x;
        this.camera.target.y = this.world.car.chassis.object.position.y;
      }
    });
  }

  /**
   * 多通道渲染
   */
  setPasses() {
    this.passes = {};

    // Debug
    if (this.debug) {
      this.passes.debugFolder = this.debug.addFolder("postprocess");
    }

    this.passes.composer = new EffectComposer(this.renderer!);

    // Create passes
    console.log(this.camera);
    this.passes.renderPass = new RenderPass(this.scene!, this.camera.instance);

    this.passes.horizontalBlurPass = new ShaderPass(BlurPass);
    this.passes.horizontalBlurPass.strength = this.config.touch ? 0 : 1;
    this.passes.horizontalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
    this.passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(this.passes.horizontalBlurPass.strength, 0);

    this.passes.verticalBlurPass = new ShaderPass(BlurPass);
    this.passes.verticalBlurPass.strength = this.config.touch ? 0 : 1;
    this.passes.verticalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
    this.passes.verticalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(0, this.passes.verticalBlurPass.strength);

    this.passes.glowsPass = new ShaderPass(GlowsPass);
    this.passes.glowsPass.color = "#ffcfe0";
    this.passes.glowsPass.material.uniforms.uPosition.value = new THREE.Vector2(0, 0.25);
    this.passes.glowsPass.material.uniforms.uRadius.value = 0.7;
    this.passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(this.passes.glowsPass.color);
    this.passes.glowsPass.material.uniforms.uColor.value.convertLinearToSRGB();
    this.passes.glowsPass.material.uniforms.uAlpha.value = 0.55;

    // Add passes
    this.passes.composer.addPass(this.passes.renderPass);
    this.passes.composer.addPass(this.passes.horizontalBlurPass);
    this.passes.composer.addPass(this.passes.verticalBlurPass);
    this.passes.composer.addPass(this.passes.glowsPass);

    // Time tick
    this.time.on("tick", () => {
      this.passes.horizontalBlurPass.enabled = this.passes.horizontalBlurPass.material.uniforms.uStrength.value.x > 0;
      this.passes.verticalBlurPass.enabled = this.passes.verticalBlurPass.material.uniforms.uStrength.value.y > 0;

      // Renderer
      this.passes.composer.render();
      // this.renderer?.render(this.scene!, this.camera);
    });

    // Resize event
    this.sizes.on("resize", () => {
      this.renderer?.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
      this.passes.composer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
      this.passes.horizontalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
      this.passes.verticalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
    });
  }

  /**
   * Set world
   */
  setWorld() {
    this.world = new World({
      config: this.config,
      debug: this.debug,
      resources: this.resources,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      passes: this.passes,
    });
    // console.log(this.world.container);
    this.scene?.add(this.world.container);
  }

  /**
   * Set title
   */
  setTitle() {}

  /**
   * Set Three.js Journey
   */
  setThreejsJourney() {
    this.threejsJourney = new ThreejsJourney({
      config: this.conifg,
      time: this.time,
      world: this.world,
    });
  }

  /**
   * Destructor
   */
  desturctor() {
    this.time.off("tick");
    this.sizes.off("resize");

    this.camera.orbitControls.dispose();
    this.renderer?.dispose();
    this.debug?.destroy();
  }
}
