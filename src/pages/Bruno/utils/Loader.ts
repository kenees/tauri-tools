import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

export default class Resources extends EventEmitter {
  toLoad: number;
  loaded: number;
  items: {
    [key in string]: any;
  };
  loaders: any[];

  constructor() {
    super();

    this.loaders = [];
    this.setLoaders();

    this.toLoad = 0;
    this.loaded = 0;
    this.items = {};
  }

  setLoaders() {
    this.loaders = [];

    // Images
    this.loaders.push({
      extensions: ["jpg", "png", "webp"],
      action: (_resource: { source: string }) => {
        const image = new Image();
        image.addEventListener("load", () => {
          this.fileLoadEnd(_resource, image);
        });

        image.addEventListener("error", () => {
          this.fileLoadEnd(_resource, image);
        });

        image.src = _resource.source;
      },
    });

    // Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./bruno/draco/");
    dracoLoader.setDecoderConfig({ type: "js" });

    this.loaders.push({
      extensions: ["drc"],
      action: (_resource: { source: string }) => {
        dracoLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // GLTF
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.loaders.push({
      extensions: ["glb", "gltf"],
      action: (_resource: { source: string }) => {
        gltfLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // FBX
    const fbxLoader = new FBXLoader();
    this.loaders.push({
      extensions: ["fbx"],
      action: (_resource: { source: string }) => {
        fbxLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });
  }

  load(_resources: { source: string; name: string; type?: "texture" }[] = []) {
    for (const _resource of _resources) {
      this.toLoad++;
      const extensionMatch = _resource.source.match(/\.([a-z]+)$/);
      if (extensionMatch && typeof extensionMatch[1] != "undefined") {
        const extension = extensionMatch[1];
        // 找到该文件资源对应的loader
        const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension: string) => _extension === extension));
        if (loader) {
          loader.action(_resource);
        } else {
          console.warn(`Cannot found loader for ${_resource}`);
        }
      } else {
        console.warn(`Cannot found extension of ${_resource}`);
      }
    }
  }

  /**
   * File load end
   */
  fileLoadEnd(_resource: any, _data: any) {
    this.loaded++;
    this.items[_resource.name] = _data;

    this.trigger("fileEnd", [_resource, _data]);

    if (this.loaded === this.toLoad) {
      this.trigger("end");
    }
  }
}
