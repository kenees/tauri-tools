import * as THREE from "three";
import * as dat from "dat.gui";

import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import World from "./world";


export interface ThreejsJourneyOption {
    config: Object,
    time: Time,
    world: World,
}

export interface CameraOption {
    time: Time,
    sizes: Sizes,
    renderer: THREE.WebGLRenderer | undefined,
    debug: dat.GUI | undefined;
    config: Object
}