import * as THREE from "three";
import Areas from "./Areas";
import Floor from "./Floor";
import gsap from "gsap";

export default class World {
  config: any;
  debug: any;
  resources: any;
  time: any;
  sizes: any;
  camera: any;
  scene: any;
  renderer: any;
  debugFolder: any;
  container: THREE.Object3D<THREE.Object3DEventMap>;
  areas: Areas | undefined;
  startingScreen: any;
  floor: Floor | undefined;

  constructor(_options: any) {
    this.config = _options.config;
    this.debug = _options.debug;
    this.resources = _options.resources;
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.camera = _options.camera;
    this.scene = _options.scene;
    this.renderer = _options.renderer;
    // this.passes = _options.passes

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder("world");
      this.debugFolder.open();
    }

    // Set up
    this.container = new THREE.Object3D(); // 将场景中所有的东西都加到这个容器内统一控制
    this.container.matrixAutoUpdate = false; // 关闭自动更新矩阵（会根据坐标，缩放，等自动更新），需要自己控制

    // TODO
    // this.setSounds();
    // this.setControls();
    this.setFloor(); // 背景色
    this.setAreas();
    this.setStartingScreen();
  }

  start() {}

  setReveal() {}

  setStartingScreen() {
    this.startingScreen = {};

    // Area
    this.startingScreen.area = this.areas?.add({
      position: new THREE.Vector2(0, 0),
      halfExtents: new THREE.Vector2(2.35, 1.5),
      hasKey: false,
      testCar: false,
      active: false,
    });

    // Loading label
    const loadingLabel: any = {};
    loadingLabel.geometry = new THREE.PlaneGeometry(2.5, 2.5 / 4);
    loadingLabel.image = new Image();
    loadingLabel.image.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABABAMAAAAHc7SNAAAAMFBMVEUAAAD///9ra2ucnJzR0dH09PQmJiaNjY24uLjp6end3d1CQkLFxcVYWFiqqqp9fX3nQ5qrAAAEVUlEQVRo3u3YT08TQRQA8JEtW6CATGnDdvljaTwYE2IBI/HGRrwSetGTsZh4MPFQYiQe229gE++WePFY9Oqh1cRzieEDYIgXLxjPJu5M33vbZQszW+fgoS+B7ewO836znRl2lg1jGMP4P2Okw0yFvaKsklr3I99Tvl3iPPelGbQhKqxB4eN6N/7gVcsvbEAz1F4RLn67zzl/v6/oLvejGBQ9LsNphio4UFjmEAsVJuOK/zkDtc6w+gyTcZ3LyP6IAzjBDA+pj6LkEgAjW4kANsMAC6vmOvqAMU5RgVOTskQACicCmCcA9AXjkT5gj1MswqlxWcoTgKJ6HuAQAD5guNoAu8QpMnBul1ONMGD2PCBbRgDAKYq6AEtmXvtdj3S6GhRyW1t1DvkAgM0ggG7mu1t3xWFHFzAqv3wYCi0mY1UCGgiQPU+1oWIY8LoXcAA3qeYfr+kClvHW14PJ5OfCAgHYNAoDAORBQIrDvHjqH5c0ANTbORzBacbAQgUC2IAKAzI9gCSHlWEMLmgBPJxMvyARpIICALDm4nkAbwIA71EZx5UOgO48JnLoOhQIAN9sOgKoBoAE5r0aB8ARcNhtFzrg0VQmwCp8CAMeAADGc44S5GMBsF1aCEU2LcAcAPDCvwFytBDehCaUgJxRAKeF8BNUUQJ43iiAUlqwFKoBrTCAHjiagwEgU0YM5IYWYD4KoIgPwIXQwUbVgCXzgLpIBJNeDciWTQNskVsq1ADX/6kYBdCTjse5owbMiX+IpgGWOCPSuWpA2vN/TAMm5QTYg5IC4FdbMA0YF5Nb5s2rAaLyhzBgektGZWDArrgqi0U1QHxf38OABDwUDgTAjGfyPlTVgJT/67FBACbqyGYaaoBctQwD2vI4DecVAPkgZRhQlxPQks2rAePGAbZsRlaa1QBYEQBUHRCAmaXD0QDYxgFWdye05R9cDQCrmQYkeBA6gGXTgNEeQF4DMG4S4MLjOUZRA5A0CcjADgmjqgGwSwSg9wK1GIBS74KTgTxv/EHoiaVQsTOS5RoCJuiZyosB8EIrHpyowFiYofO0i4wCjhCQwL0hq2sCaFNM22S4JXloLk0AuLDTBzCBAAt3xykeA7CHe/mDbgdTvQ9GswSAwdbqA0giYASHjQUJnhQKhQ6z/d8rDA4hAG2Dsk042ejubHMM2nV6AMf93pCkaRjhh0WsWuz+6aasl2FwiAImReEts1/CSaFfwFouAJxC4RW+I4oCThBQE1X2WbKkBFDkqYDtJ0SHaYKq3pJJwCECjjiFPoC1w+2P0gumurgeBjT6AhIIGKOelGIAngWlFnRnMZjMIYBb7gtIIsAuYU+8GICpEhYyZVgIZ2g9rYYAX1lfAKvjnxzjnWrHALDn9K1h2k2aoI1ewGd2AWAVAVMHcKdW4wDYje739pNufJXhkJohgLu9zy4CHCKAJYUge4ddCojGyPrp9kaHmYjUi9N7+2wYwxjGZfEXMKxGE0GkkfIAAAAASUVORK5CYII=";
    loadingLabel.texture = new THREE.Texture(loadingLabel.image);
    loadingLabel.texture.magFilter = THREE.NearestFilter;
    loadingLabel.texture.minFilter = THREE.LinearFilter;
    loadingLabel.texture.needsUpdate = true;
    loadingLabel.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: loadingLabel.texture });
    loadingLabel.mesh = new THREE.Mesh(loadingLabel.geometry, loadingLabel.material);
    loadingLabel.mesh.matrixAutoUpdate = false;
    this.startingScreen.loadingLabel = loadingLabel;
    this.container.add(loadingLabel.mesh);

    // Start label
    const startLabel: any = {};
    startLabel.geometry = new THREE.PlaneGeometry(2.5, 2.5 / 4);
    startLabel.image = new Image();
    startLabel.image.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABABAMAAAAHc7SNAAAAMFBMVEUAAAD///+cnJxra2vR0dHd3d0mJib09PRYWFjp6em4uLhCQkKqqqqNjY19fX3FxcV3XeRgAAADsklEQVRo3u3YsU9TQRwH8KNgLSDQg9ZCAak1IdE4PKPu1NTEsSzOMDl3I3GpcXAxBhLjXFxNjJgQJ2ON0Rnj4uAAEyv8B/L7tV++5/VN+CM69Ldwfa+534d7d793VzeIQQzi/49c4v5lPF/1vvhFm++rjIpcyErrmrSCuz+cxng1iL/If8drPJD2Lc/Iy4VhaZWlFd4tLPfuMc6e/5LvRilJA2SkVSQA8c0OsI0uNtIAU9rsB8y1rAAZjyimAUa1mQDAeGwF+MA+9lIA69qs9AMKVoDP8vhf35A+NiMAc7YJKFSrX7tcI8BW9+k/O/kz6zSunjSnncMHiQYBcmdXrh3xCVbc2WO8N/YZZI0AxxwMArKivmwAwFKSPmV0UwBbCpj5E+C+yzUbQAaJVwUSA9SFjwFgHQ0jAMrBWgzAPCtHgFFbQAlpEwKC2zWUQgJGbAH+naSdu/fTxQAthPL5/ADD6OCpQwCAsb6LsbEGcBluOAYBmG2fkMIawHVWXEsDIGUGpZCAIRsAS93DPgDbhUmUQgKe2NUB90hfhK0YwEJYHkYpJGDbqBKiB86CGLAlzd6/S8CEvh8sACiBvrSXCshKblWEgNy2vkAMAHwGfjECcJHOu5qUQgDm6vXulshZAXJNL9GJAeg+LxeKPQBj1gzgdlnuCWAhbOi7LwaU9u0A2VWPpUgAC+GR5k0iwBtnB3Bj3qMaRYB17X0IOQhYcjYA7guxxyIAGfd1HNqchPfly7aACQUshAA2W1r5G1yG415YpgB3qIIkAHBH2D075QnQ10fHDsCl+CoGSKpiN8kMAVqIN00BsitnVgKyPIBMB4ADKU92AA5BKQIgszjKBGBLagpwB5xZBGS6pbcuizQAXMA6NAK86OCQ3okAI55BQPe7VoDxXzU/iwPASgS4GAASAiYxWgYAzvAa1loA2AkAFQIU2zEELCJtDDgIAG0CFLvp7LblC2kAtF6eTEJJ2CBAr88bAXKY4WkASbzXmwt5AvTvohHA4WSUBmj2Jt+IThQChrAOLQC13vPFMAOAQwuyTAeAKVQto3OBDOdESh2YxNZPbpYBQNbEAoBfod7e1i1BiwB0voSZWgwAOWgtAGPhD18E8ASIiRIAXNPwXJBtcqMbAFAIr5weIJMAcIx1aAAIqk0lAuycompyFwBMHAsAZlj/lgw0rsy2AkhbsgK4Q+70CUBjxeFXsUb0G1HJDJC9rketZRcCWCJwHM8DgJm7b7ch+XizXm25QQxiEOcXvwGCWOhbCZC0qAAAAABJRU5ErkJggg==";
    startLabel.texture = new THREE.Texture(startLabel.image);
    startLabel.texture.magFilter = THREE.NearestFilter; // 一个纹素覆盖多个像素，采用最接近的纹素的值
    startLabel.texture.minFilter = THREE.LinearFilter; // 当纹素覆盖不到一个像素时，它会取四个最接近的纹素，并在它们之间进行双线性插值
    startLabel.texture.needsUpdate = true;
    startLabel.material = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: startLabel.texture });
    startLabel.material.opacity = 0;
    startLabel.mesh = new THREE.Mesh(startLabel.geometry, startLabel.material);
    startLabel.mesh.matrixAutoUpdate = false;
    this.startingScreen.startLabel = startLabel;
    this.container.add(startLabel.mesh);

    // Progress
    this.resources.on("progress", (_progress: number) => {
      this.startingScreen.area.floorBorder.material.uniforms.uAlpha.value = 1;
      this.startingScreen.area.floorBorder.material.uniforms.uLoadProgress.value = _progress;
    });

    // Ready
    this.resources.on("ready", () => {
      window.requestAnimationFrame(() => {
        this.startingScreen.area.activate();
        // 边框变淡
        gsap.to(this.startingScreen.area.floorBorder.material.uniforms.uAlpha, { value: 0.3, duration: 0.3 });
        // 隐藏loading 文字
        gsap.to(this.startingScreen.loadingLabel.material, { opacity: 0, duration: 0.3 });
        // 显示start
        gsap.to(this.startingScreen.startLabel.material, { opacity: 1, duration: 0.3, delay: 0.3 });
      });
    });

    // On interact, reveal
    this.startingScreen.area.on("interact", () => {
      //   this.startingScreen.area.deactivate();
    });
  }

  setSounds() {}

  setAxes() {}

  setControls() {}

  setMaterials() {}

  setFloor() {
    this.floor = new Floor({
      debug: this.debugFolder,
    });
    this.container.add(this.floor.container);
  }

  setShadows() {}

  setPhysics() {}

  setZones() {}

  setAreas() {
    this.areas = new Areas({
      config: this.config,
      time: this.time,
      camera: this.camera,
    });
    this.container.add(this.areas.container);
  }

  setTiles() {}

  setWalls() {}

  setObjects() {}

  setCar() {}

  setSections() {}

  setEasterEggs() {}
}
