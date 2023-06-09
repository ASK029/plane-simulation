import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    instance = this;

    //Options
    this.canvas = canvas;

    //Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.Time = new Time();
    this.scene = new THREE.Scene();
    this.scene.rotateY((2 * Math.PI) / 5);
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    //Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    //Time tick event
    this.Time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}
