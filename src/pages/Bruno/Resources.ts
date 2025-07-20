import * as THREE from "three";

import Loader from "./utils/Loader";
import EventEmitter from "./utils/EventEmitter";

export default class Resources extends EventEmitter {
  loader: Loader;
  items: {
    [key in string]: THREE.Texture;
  };
  constructor() {
    super();

    this.loader = new Loader();
    this.items = {};

    this.loader.load([
      // Matcaps
      { name: "matcapBeige", source: "./bruno/models/matcaps/beige.png", type: "texture" },
      { name: "matcapBlack", source: "./bruno/models/matcaps/black.png", type: "texture" },
      { name: "matcapOrange", source: "./bruno/models/matcaps/orange.png", type: "texture" },
      { name: "matcapRed", source: "./bruno/models/matcaps/red.png", type: "texture" },
      { name: "matcapWhite", source: "./bruno/models/matcaps/white.png", type: "texture" },
      { name: "matcapGreen", source: "./bruno/models/matcaps/green.png", type: "texture" },
      { name: "matcapBrown", source: "./bruno/models/matcaps/brown.png", type: "texture" },
      { name: "matcapGray", source: "./bruno/models/matcaps/gray.png", type: "texture" },
      { name: "matcapEmeraldGreen", source: "./bruno/models/matcaps/emeraldGreen.png", type: "texture" },
      { name: "matcapPurple", source: "./bruno/models/matcaps/purple.png", type: "texture" },
      { name: "matcapBlue", source: "./bruno/models/matcaps/blue.png", type: "texture" },
      { name: "matcapYellow", source: "./bruno/models/matcaps/yellow.png", type: "texture" },
      { name: "matcapMetal", source: "./bruno/models/matcaps/metal.png", type: "texture" },
      // { name: "matcapGold", source: "./bruno/models/matcaps/gold.png", type: "texture" },

      // Intro
      { name: "introStaticBase", source: "./bruno/models/intro/static/base.glb" },
      { name: "introStaticCollision", source: "./bruno/models/intro/static/collision.glb" },
      { name: "introStaticFloorShadow", source: "./bruno/models/intro/static/floorShadow.png", type: "texture" },

      { name: "introInstructionsLabels", source: "./bruno/models/intro/instructions/labels.glb" },
      { name: "introInstructionsArrows", source: "./bruno/models/intro/instructions/arrows.png", type: "texture" },
      { name: "introInstructionsControls", source: "./bruno/models/intro/instructions/controls.png", type: "texture" },
      { name: "introInstructionsOther", source: "./bruno/models/intro/instructions/other.png", type: "texture" },

      { name: "introArrowKeyBase", source: "./bruno/models/intro/arrowKey/base.glb" },
      { name: "introArrowKeyCollision", source: "./bruno/models/intro/arrowKey/collision.glb" },

      { name: "introBBase", source: "./bruno/models/intro/b/base.glb" },
      { name: "introBCollision", source: "./bruno/models/intro/b/collision.glb" },

      { name: "introRBase", source: "./bruno/models/intro/r/base.glb" },
      { name: "introRCollision", source: "./bruno/models/intro/r/collision.glb" },

      { name: "introUBase", source: "./bruno/models/intro/u/base.glb" },
      { name: "introUCollision", source: "./bruno/models/intro/u/collision.glb" },

      { name: "introNBase", source: "./bruno/models/intro/n/base.glb" },
      { name: "introNCollision", source: "./bruno/models/intro/n/collision.glb" },

      { name: "introOBase", source: "./bruno/models/intro/o/base.glb" },
      { name: "introOCollision", source: "./bruno/models/intro/o/collision.glb" },

      { name: "introSBase", source: "./bruno/models/intro/s/base.glb" },
      { name: "introSCollision", source: "./bruno/models/intro/s/collision.glb" },

      { name: "introIBase", source: "./bruno/models/intro/i/base.glb" },
      { name: "introICollision", source: "./bruno/models/intro/i/collision.glb" },

      { name: "introMBase", source: "./bruno/models/intro/m/base.glb" },
      { name: "introMCollision", source: "./bruno/models/intro/m/collision.glb" },

      { name: "introCreativeBase", source: "./bruno/models/intro/creative/base.glb" },
      { name: "introCreativeCollision", source: "./bruno/models/intro/creative/collision.glb" },

      { name: "introDevBase", source: "./bruno/models/intro/dev/base.glb" },
      { name: "introDevCollision", source: "./bruno/models/intro/dev/collision.glb" },

      // Intro
      { name: "crossroadsStaticBase", source: "./bruno/models/crossroads/static/base.glb" },
      { name: "crossroadsStaticCollision", source: "./bruno/models/crossroads/static/collision.glb" },
      { name: "crossroadsStaticFloorShadow", source: "./bruno/models/crossroads/static/floorShadow.png", type: "texture" },

      // Car default
      { name: "carDefaultChassis", source: "./bruno/models/car/default/chassis.glb" },
      { name: "carDefaultWheel", source: "./bruno/models/car/default/wheel.glb" },
      { name: "carDefaultBackLightsBrake", source: "./bruno/models/car/default/backLightsBrake.glb" },
      { name: "carDefaultBackLightsReverse", source: "./bruno/models/car/default/backLightsReverse.glb" },
      { name: "carDefaultAntena", source: "./bruno/models/car/default/antena.glb" },
      // { name: 'carDefaultBunnyEarLeft', source: './bruno/models/car/default/bunnyEarLeft.glb' },
      // { name: 'carDefaultBunnyEarRight', source: './bruno/models/car/default/bunnyEarRight.glb' },

      // Car cyber
      { name: "carCyberTruckChassis", source: "./bruno/models/car/cyberTruck/chassis.glb" },
      { name: "carCyberTruckWheel", source: "./bruno/models/car/cyberTruck/wheel.glb" },
      { name: "carCyberTruckBackLightsBrake", source: "./bruno/models/car/cyberTruck/backLightsBrake.glb" },
      { name: "carCyberTruckBackLightsReverse", source: "./bruno/models/car/cyberTruck/backLightsReverse.glb" },
      { name: "carCyberTruckAntena", source: "./bruno/models/car/cyberTruck/antena.glb" },

      // Project
      { name: "projectsBoardStructure", source: "./bruno/models/projects/board/structure.glb" },
      { name: "projectsBoardCollision", source: "./bruno/models/projects/board/collision.glb" },
      { name: "projectsBoardStructureFloorShadow", source: "./bruno/models/projects/board/floorShadow.png", type: "texture" },
      { name: "projectsBoardPlane", source: "./bruno/models/projects/board/plane.glb" },

      { name: "projectsDistinctionsAwwwardsBase", source: "./bruno/models/projects/distinctions/awwwards/base.glb" },
      { name: "projectsDistinctionsAwwwardsCollision", source: "./bruno/models/projects/distinctions/awwwards/collision.glb" },
      { name: "projectsDistinctionsFWABase", source: "./bruno/models/projects/distinctions/fwa/base.glb" },
      { name: "projectsDistinctionsFWACollision", source: "./bruno/models/projects/distinctions/fwa/collision.glb" },
      { name: "projectsDistinctionsCSSDABase", source: "./bruno/models/projects/distinctions/cssda/base.glb" },
      { name: "projectsDistinctionsCSSDACollision", source: "./bruno/models/projects/distinctions/cssda/collision.glb" },

      { name: "projectsLuniFloor", source: "./bruno/models/projects/luni/floorTexture.webp", type: "texture" },
      { name: "projectsBonhomme10ansFloor", source: "./bruno/models/projects/bonhomme10ans/floorTexture.webp", type: "texture" },
      { name: "projectsThreejsJourneyFloor", source: "./bruno/models/projects/threejsJourney/floorTexture.webp", type: "texture" },
      { name: "projectsMadboxFloor", source: "./bruno/models/projects/madbox/floorTexture.png", type: "texture" },
      { name: "projectsScoutFloor", source: "./bruno/models/projects/scout/floorTexture.png", type: "texture" },
      { name: "projectsChartogneFloor", source: "./bruno/models/projects/chartogne/floorTexture.png", type: "texture" },
      // { name: 'projectsZenlyFloor', source: './bruno/models/projects/zenly/floorTexture.png', type: 'texture' },
      { name: "projectsCitrixRedbullFloor", source: "./bruno/models/projects/citrixRedbull/floorTexture.png", type: "texture" },
      { name: "projectsPriorHoldingsFloor", source: "./bruno/models/projects/priorHoldings/floorTexture.png", type: "texture" },
      { name: "projectsOranoFloor", source: "./bruno/models/projects/orano/floorTexture.png", type: "texture" },
      // { name: 'projectsGleecChatFloor', source: './bruno/models/projects/gleecChat/floorTexture.png', type: 'texture' },
      // { name: 'projectsKepplerFloor', source: './bruno/models/projects/keppler/floorTexture.png', type: 'texture' },

      // Information
      { name: "informationStaticBase", source: "./bruno/models/information/static/base.glb" },
      { name: "informationStaticCollision", source: "./bruno/models/information/static/collision.glb" },
      { name: "informationStaticFloorShadow", source: "./bruno/models/information/static/floorShadow.png", type: "texture" },

      { name: "informationBaguetteBase", source: "./bruno/models/information/baguette/base.glb" },
      { name: "informationBaguetteCollision", source: "./bruno/models/information/baguette/collision.glb" },

      { name: "informationContactTwitterLabel", source: "./bruno/models/information/static/contactTwitterLabel.png", type: "texture" },
      { name: "informationContactGithubLabel", source: "./bruno/models/information/static/contactGithubLabel.png", type: "texture" },
      { name: "informationContactLinkedinLabel", source: "./bruno/models/information/static/contactLinkedinLabel.png", type: "texture" },
      { name: "informationContactMailLabel", source: "./bruno/models/information/static/contactMailLabel.png", type: "texture" },

      { name: "informationActivities", source: "./bruno/models/information/static/activities.png", type: "texture" },

      // Playground
      { name: "playgroundStaticBase", source: "./bruno/models/playground/static/base.glb" },
      { name: "playgroundStaticCollision", source: "./bruno/models/playground/static/collision.glb" },
      { name: "playgroundStaticFloorShadow", source: "./bruno/models/playground/static/floorShadow.png", type: "texture" },

      // Brick
      { name: "brickBase", source: "./bruno/models/brick/base.glb" },
      { name: "brickCollision", source: "./bruno/models/brick/collision.glb" },

      // Horn
      { name: "hornBase", source: "./bruno/models/horn/base.glb" },
      { name: "hornCollision", source: "./bruno/models/horn/collision.glb" },

      // // Distinction A
      // { name: 'distinctionAStaticBase', source: './bruno/models/distinctionA/static/base.glb' },
      // { name: 'distinctionAStaticCollision', source: './bruno/models/distinctionA/static/collision.glb' },
      // { name: 'distinctionAStaticFloorShadow', source: './bruno/models/distinctionA/static/floorShadow.png', type: 'texture' },

      // // Distinction B
      // { name: 'distinctionBStaticBase', source: './bruno/models/distinctionB/static/base.glb' },
      // { name: 'distinctionBStaticCollision', source: './bruno/models/distinctionB/static/collision.glb' },
      // { name: 'distinctionBStaticFloorShadow', source: './bruno/models/distinctionB/static/floorShadow.png', type: 'texture' },

      // // Distinction C
      // { name: 'distinctionCStaticBase', source: './bruno/models/distinctionC/static/base.glb' },
      // { name: 'distinctionCStaticCollision', source: './bruno/models/distinctionC/static/collision.glb' },
      // { name: 'distinctionCStaticFloorShadow', source: './bruno/models/distinctionC/static/floorShadow.png', type: 'texture' },

      // // Cone
      // { name: 'coneBase', source: './bruno/models/cone/base.glb' },
      // { name: 'coneCollision', source: './bruno/models/cone/collision.glb' },

      // // Awwwards trophy
      // { name: 'awwwardsTrophyBase', source: './bruno/models/awwwardsTrophy/base.glb' },
      // { name: 'awwwardsTrophyCollision', source: './bruno/models/awwwardsTrophy/collision.glb' },

      // Webby trophy
      { name: "webbyTrophyBase", source: "./bruno/models/webbyTrophy/base.glb" },
      { name: "webbyTrophyCollision", source: "./bruno/models/webbyTrophy/collision.glb" },

      // Lemon
      { name: "lemonBase", source: "./bruno/models/lemon/base.glb" },
      { name: "lemonCollision", source: "./bruno/models/lemon/collision.glb" },

      // Bownling ball
      { name: "bowlingBallBase", source: "./bruno/models/bowlingBall/base.glb" },
      { name: "bowlingBallCollision", source: "./bruno/models/bowlingBall/collision.glb" },

      // Bownling ball
      { name: "bowlingPinBase", source: "./bruno/models/bowlingPin/base.glb" },
      { name: "bowlingPinCollision", source: "./bruno/models/bowlingPin/collision.glb" },

      // Areas
      { name: "areaKeyEnter", source: "./bruno/models/area/keyEnter.png", type: "texture" },
      { name: "areaEnter", source: "./bruno/models/area/enter.png", type: "texture" },
      { name: "areaOpen", source: "./bruno/models/area/open.png", type: "texture" },
      { name: "areaReset", source: "./bruno/models/area/reset.png", type: "texture" },
      { name: "areaQuestionMark", source: "./bruno/models/area/questionMark.png", type: "texture" },

      // Tiles
      { name: "tilesABase", source: "./bruno/models/tiles/a/base.glb" },
      { name: "tilesACollision", source: "./bruno/models/tiles/a/collision.glb" },

      { name: "tilesBBase", source: "./bruno/models/tiles/b/base.glb" },
      { name: "tilesBCollision", source: "./bruno/models/tiles/b/collision.glb" },

      { name: "tilesCBase", source: "./bruno/models/tiles/c/base.glb" },
      { name: "tilesCCollision", source: "./bruno/models/tiles/c/collision.glb" },

      { name: "tilesDBase", source: "./bruno/models/tiles/d/base.glb" },
      { name: "tilesDCollision", source: "./bruno/models/tiles/d/collision.glb" },

      { name: "tilesEBase", source: "./bruno/models/tiles/e/base.glb" },
      { name: "tilesECollision", source: "./bruno/models/tiles/e/collision.glb" },

      // Konami
      { name: "konamiLabel", source: "./bruno/models/konami/label.png", type: "texture" },
      { name: "konamiLabelTouch", source: "./bruno/models/konami/label-touch.png", type: "texture" },

      // Wigs
      { name: "wig1", source: "./bruno/models/wigs/wig1.glb" },
      { name: "wig2", source: "./bruno/models/wigs/wig2.glb" },
      { name: "wig3", source: "./bruno/models/wigs/wig3.glb" },
      { name: "wig4", source: "./bruno/models/wigs/wig4.glb" },

      // // Egg
      // { name: 'eggBase', source: './bruno/models/egg/base.glb' },
      // { name: 'eggCollision', source: './bruno/models/egg/collision.glb' },
    ]);

    this.loader.on("fileEnd", (_resource: { name: string | number; type: string }, _data: any) => {
      this.items[_resource.name] = _data;

      // Texture
      if (_resource.type === "texture") {
        const texture = new THREE.Texture(_data);
        texture.needsUpdate = true;

        this.items[`${_resource.name}Texture`] = texture;
      }

      // Trigger progress
      this.trigger("progress", [this.loader.loaded / this.loader.toLoad]);
    });

    this.loader.on("end", () => {
      // Trigger ready
      this.trigger("ready");
    });
  }
}
