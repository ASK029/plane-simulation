import { Vector3 } from "three";
import Experience from "../Experience";
import EnvironmentPhysics from "../Utils/Physics/EnvironmentPhysics";
import Forces from "../Utils/Physics/Forces";

export default class Aeroplane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.Time;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.physics = new EnvironmentPhysics();
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Airplane");
    }

    //setup
    this.resource = this.resources.items.airplaneModel;
    this.model = this.resource.scene;
    this.setDebug();
    this.setModel();
  }

  setModel() {
    // this.model.position.y = 3;
    this.setMovement();
    this.camera.setInstance(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z,
    );
    this.model.add(this.camera.instance);
    this.scene.add(this.model);
  }

  setMovement() {
    let isMoveing = false;

    document.addEventListener("keydown", (event) => {
      if (event.key == " ")
        isMoveing ? (isMoveing = false) : (isMoveing = true);
    });

    this.forces = new Forces();
    this.time.on("tick", () => {
      if (isMoveing) {
        this.forces.update(0.009, this.model, 1000);
      }
    });
  }

  setDebug() {
    if (this.debug.active) {
      // this.debugFolder.add(debugObject, "moveForword");
      this.debugFolder.add(this.model.position, "x", -50, 50, 0.01);
      this.debugFolder.add(this.model.position, "y", 0, 1000, 0.01);
      this.debugFolder.add(this.model.position, "z", 0, 100, 0.01);
    }
  }
}
