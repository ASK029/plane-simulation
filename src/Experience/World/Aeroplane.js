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
    let x = 0,
      y = 0,
      z = 0,
      rotateX = 0,
      rotateY = 0,
      rotateZ = 0;
    let speed = 0;
    let isMoveing = false;
    const debugObject = {
      moveForword: () => {
        speed += 0.01;
        this.model.translateZ(speed);

        // z = 100;
      },
      moveSides: (side) => {
        if (side === "R") {
          rotateY += -Math.PI / 100;
          rotateZ += Math.PI / 100;
        } else if (side === "L") {
          // x = 100;
          rotateY += Math.PI / 100;
          rotateZ += -Math.PI / 100;
        }
        this.model.rotateY(rotateY);
        this.model.rotateZ(rotateZ);
      },
      moveUp: () => {
        rotateX += -Math.PI / 100;
        this.model.rotateX(rotateX);
      },
      moveDown: () => {
        rotateX += Math.PI / 100;
        this.model.rotateX(rotateX);
      },
    };
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case " ":
          isMoveing ? (isMoveing = false) : (isMoveing = true);
          break;
        case "d":
          debugObject.moveSides("R");
          break;
        case "a":
          debugObject.moveSides("L");
          break;
        case "w":
          debugObject.moveUp();
          break;
        case "s":
          debugObject.moveDown();
          break;
      }
      // console.log(this.model.position);
    });

    let forces = new Forces();
    // this.model.position.y = 100;
    this.time.on("tick", () => {
      if (isMoveing) {
        // debugObject.moveForword();
        forces.update(0.005, this.model.position, 10000);
      }
      console.log(this.model.position);
    });
    speed = 0.01;
  }

  setDebug() {
    if (this.debug.active) {
      // this.debugFolder.add(debugObject, "moveForword");
      this.debugFolder.add(this.model.position, "x", -50, 50, 0.01);
      this.debugFolder.add(this.model.position, "y", 0, 100, 0.01);
      this.debugFolder.add(this.model.position, "z", 0, 100, 0.01);
    }
  }
}
