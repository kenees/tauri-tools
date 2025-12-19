import { Howl, Howler } from "howler";

export default class Sounds {
  time: any;
  debug: any;
  // velocityMin: 播放速度；velocityMultiplier: 速度倍增器
  // rate：Number optional播放速率。0.5 到 4.0，其中 1.0 为正常速度。
  // volume: Number 音量 0.0 到 1.0
  // 多次播放最小间隔时间
  settings: { name: string; sounds: string[]; minDelta: number; velocityMin: number; velocityMultiplier: number; volumeMin: number; volumeMax: number; rateMin: number; rateMax: number }[] | undefined;
  items: Array<any>;
  masterVolume: number;
  engine: any;
  debugFolder: any;
  muted: boolean;

  constructor(_options: { time: any; debug: any }) {
    // Options
    this.time = _options.time;
    this.debug = _options.debug;

    this.masterVolume = 0;
    this.muted = true;

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder("sounds");
    }

    // Set up
    this.items = [];

    this.setSettings();
    this.setMasterVolume();
    this.setMute(); // 是否静音
    this.setEngine(); // 引擎声音
  }

  setSettings() {
    this.settings = [
      {
        name: "reveal",
        sounds: ["./bruno/sounds/reveal/reveal-1.mp3"],
        minDelta: 100,
        velocityMin: 0,
        velocityMultiplier: 1,
        volumeMin: 1,
        volumeMax: 1,
        rateMin: 1,
        rateMax: 1,
      },
      {
        name: "brick",
        sounds: ["./bruno/sounds/bricks/brick-1.mp3", "./bruno/sounds/bricks/brick-2.mp3", "./bruno/sounds/bricks/brick-4.mp3", "./bruno/sounds/bricks/brick-6.mp3", "./bruno/sounds/bricks/brick-7.mp3", "./bruno/sounds/bricks/brick-8.mp3"],
        minDelta: 100,
        velocityMin: 1,
        velocityMultiplier: 0.75,
        volumeMin: 0.2,
        volumeMax: 0.85,
        rateMin: 0.5,
        rateMax: 0.75,
      },
      {
        name: "bowlingPin",
        sounds: ["./bruno/sounds/bowling/pin-1.mp3"],
        minDelta: 0,
        velocityMin: 1,
        velocityMultiplier: 0.5,
        volumeMin: 0.35,
        volumeMax: 1,
        rateMin: 0.1,
        rateMax: 0.85,
      },
      {
        name: "bowlingBall",
        sounds: ["./bruno/sounds/bowling/pin-1.mp3", "./bruno/sounds/bowling/pin-1.mp3", "./bruno/sounds/bowling/pin-1.mp3"],
        minDelta: 0,
        velocityMin: 1,
        velocityMultiplier: 0.5,
        volumeMin: 0.35,
        volumeMax: 1,
        rateMin: 0.1,
        rateMax: 0.2,
      },
      {
        name: "carHit",
        sounds: ["./bruno/sounds/car-hits/car-hit-1.mp3", "./bruno/sounds/car-hits/car-hit-3.mp3", "./bruno/sounds/car-hits/car-hit-4.mp3", "./bruno/sounds/car-hits/car-hit-5.mp3"],
        minDelta: 100,
        velocityMin: 2,
        velocityMultiplier: 1,
        volumeMin: 0.2,
        volumeMax: 0.6,
        rateMin: 0.35,
        rateMax: 0.55,
      },
      {
        name: "woodHit",
        sounds: ["./bruno/sounds/wood-hits/wood-hit-1.mp3"],
        minDelta: 30,
        velocityMin: 1,
        velocityMultiplier: 1,
        volumeMin: 0.5,
        volumeMax: 1,
        rateMin: 0.75,
        rateMax: 1.5,
      },
      {
        name: "screech",
        sounds: ["./bruno/sounds/screeches/screech-1.mp3"],
        minDelta: 1000,
        velocityMin: 0,
        velocityMultiplier: 1,
        volumeMin: 0.75,
        volumeMax: 1,
        rateMin: 0.9,
        rateMax: 1.1,
      },
      {
        name: "uiArea",
        sounds: ["./bruno/sounds/ui/area-1.mp3"],
        minDelta: 100,
        velocityMin: 0,
        velocityMultiplier: 1,
        volumeMin: 0.75,
        volumeMax: 1,
        rateMin: 0.95,
        rateMax: 1.05,
      },
      {
        name: "carHorn1",
        sounds: ["./bruno/sounds/car-horns/car-horn-1.mp3"],
        minDelta: 0,
        velocityMin: 0,
        velocityMultiplier: 1,
        volumeMin: 0.95,
        volumeMax: 1,
        rateMin: 1,
        rateMax: 1,
      },
      {
        name: "carHorn2",
        sounds: ["./bruno/sounds/car-horns/car-horn-2.mp3"],
        minDelta: 0,
        velocityMin: 0,
        velocityMultiplier: 1,
        volumeMin: 0.95,
        volumeMax: 1,
        rateMin: 1,
        rateMax: 1,
      },
      {
        name: "horn",
        sounds: ["./bruno/sounds/horns/horn-1.mp3", "./bruno/sounds/horns/horn-2.mp3", "./bruno/sounds/horns/horn-3.mp3"],
        minDelta: 100,
        velocityMin: 1,
        velocityMultiplier: 0.75,
        volumeMin: 0.5,
        volumeMax: 1,
        rateMin: 0.75,
        rateMax: 1,
      },
    ];

    for (const _settings of this.settings) {
      this.add(_settings);
    }
  }

  setMasterVolume() {
    // Set up
    this.masterVolume = 0.5;
    Howler.volume(this.masterVolume);

    window.requestAnimationFrame(() => {
      Howler.volume(this.masterVolume ?? 0);
    });

    if (this.debug) {
      this.debugFolder
        .add(this, "masterVolume")
        .step(0.001)
        .min(0)
        .max(1)
        .onChange(() => {
          Howler.volume(this.masterVolume);
        });
    }
  }

  setMute() {
    // Set up
    this.muted = typeof this.debug !== "undefined";
    console.log("this.muted: ", this.muted);
    Howler.mute(this.muted);

    // M Key
    window.addEventListener("keydown", (_event) => {
      console.log("keydown...");
      if (_event.key === "m") {
        this.muted = !this.muted;
        Howler.mute(this.muted);
      }
    });

    // Tab focus / blur
    document.addEventListener("visibilitychange", () => {
      console.log("visibility...");
      if (document.hidden) {
        Howler.mute(true);
      } else {
        Howler.mute(this.muted);
      }
    });

    if (this.debug) {
      this.debugFolder
        .add(this, "muted")
        .listen()
        .onChange(() => {
          Howler.mute(this.muted);
        });
    }
  }

  setEngine() {
    // Set up
    this.engine = {};

    this.engine.progress = 0;
    this.engine.progressEasingUp = 0.3;
    this.engine.progressEasingDown = 0.15;

    this.engine.speed = 0;
    this.engine.speedMultiplier = 2.5;
    this.engine.acceleration = 0;
    this.engine.accelerationMultiplier = 0.4;

    this.engine.rate = {};
    this.engine.rate.min = 0.4;
    this.engine.rate.max = 1.4;

    this.engine.volume = {};
    this.engine.volume.min = 0.4;
    this.engine.volume.max = 1;
    this.engine.volume.master = 0;

    this.engine.sound = new Howl({
      src: ["./bruno/sounds/engines/1/low_off.mp3"],
      loop: true,
    });

    this.engine.sound.play();

    // Time tick
    this.time.on("tick", () => {
      let progress = Math.abs(this.engine.speed) * this.engine.speedMultiplier + Math.max(this.engine.acceleration, 0) * this.engine.accelerationMultiplier;
      progress = Math.min(Math.max(progress, 0), 1);

      this.engine.progress += (progress - this.engine.progress) * this.engine[progress > this.engine.progress ? "progressEasingUp" : "progressEasingDown"];

      // Rate
      const rateAmplitude = this.engine.rate.max - this.engine.rate.min;
      this.engine.sound.rate(this.engine.rate.min + rateAmplitude * this.engine.progress); // 设置播放速率

      // Volume
      const volumeAmplitude = this.engine.volume.max - this.engine.volume.min;
      // 设置音量
      this.engine.sound.volume((this.engine.volume.min + volumeAmplitude * this.engine.progress) * this.engine.volume.master);
    });
  }

  add(_options: { name: string; sounds: string[]; minDelta: number; velocityMin: number; velocityMultiplier: number; volumeMin: number; volumeMax: number; rateMin: number; rateMax: number }) {
    const item: any = {
      name: _options.name,
      minDelta: _options.minDelta, // ??
      velocityMin: _options.velocityMin, // ??
      velocityMultiplier: _options.velocityMultiplier, // ??
      volumeMin: _options.volumeMin,
      volumeMax: _options.volumeMax,
      rateMin: _options.rateMin, // ??
      rateMax: _options.rateMax, // ??
      lastTime: 0, // ??
      sounds: [],
    };

    for (const _sound of _options.sounds) {
      const sound = new Howl({ src: [_sound] });

      item.sounds.push(sound);
    }

    this.items.push(item);
  }

  play(_name: string, _velocity?: number) {
    const item = this.items.find((_item) => _item.name === _name);
    const time = Date.now();
    const velocity = typeof _velocity === "undefined" ? 0 : _velocity;

    if (item && time > item.lastTime + item.minDelta && (item.velocityMin === 0 || velocity > item.velocityMin)) {
      // Find random sound
      const sound = item.sounds[Math.floor(Math.random() * item.sounds.length)]; // 随机获取一个

      // Update volume
      let volume = Math.min(Math.max((velocity - item.velocityMin) * item.velocityMultiplier, item.volumeMin), item.volumeMax); // 将音量规范到Max ~ Min 之间
      volume = Math.pow(volume, 2);
      sound.volume(volume);

      // Update rate
      const rateAmplitude = item.rateMax - item.rateMin;
      sound.rate(item.rateMin + Math.random() * rateAmplitude);

      // Play
      sound.play();

      // Save last play time
      item.lastTime = time;
    }
  }
}
