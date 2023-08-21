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
    this.floor = this.experience.world.floor;
    this.physics = new EnvironmentPhysics();
    this.debug = this.experience.debug;
    this.deltaTime = 0.009;

    if (this.debug.active) {
      this.debugUI = this.debug.ui;
    }

    //setup
    this.resource = this.resources.items.airplaneModel;
    this.model = this.resource.scene;
    this.model.mass = 10000;
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
    let backNForth = 0,
      sides = 0;

    this.forces = new Forces();

    document.addEventListener("keydown", (event) => {
      if (event.key == " ") isMoveing = !isMoveing;

      switch (event.key) {
        case "w":
          backNForth += 1000;
          break;
        case "s":
          if (this.forces.isLanding) backNForth -= 1000;
          break;
        case "d":
          sides += 5;
          break;
        case "a":
          sides -= 5;
          break;
      }
    });

    this.time.on("tick", () => {
      if (isMoveing) {
        if (this.model.position.y <= 50 && backNForth < -10) backNForth += 100;
        if (this.model.position.y >= 900 && backNForth > 0) backNForth -= 50;
        this.forces.update(
          this.deltaTime,
          this.model,
          this.model.mass,
          backNForth,
          sides,
        );
        this.scene.add(this.forces.forcesArrow);
      }
    });
  }

  setDebug() {
    if (this.debug.active) {
      this.debugUI.add(this.model, "mass", 1000, 1000000, 0.01);
      this.debugUI.add(this, "deltaTime", 0.0001, 0.1, 0.00001);
    }
  }
}
