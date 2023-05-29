import * as THREE from "three";
import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Airplane from "./Airplane";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial(),
    );
    this.scene.add(testMesh);

    //wait for resources
    this.resources.on("ready", () => {
      //Setup
      this.floor = new Floor();
      this.airplane = new Airplane();
      this.environment = new Environment();
    });

    //Setup
    this.environment = new Environment();
  }
}
