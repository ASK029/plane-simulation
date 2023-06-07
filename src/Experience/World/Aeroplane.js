import { Vector3 } from "three";
import Experience from "../Experience";

export default class Aeroplane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Airplane");
    }

    //setup
    this.resource = this.resources.items.airplaneModel;
    this.model = this.resource.scene;
    this.setModel();
  }

  setModel() {
    this.model.position.y = 3;
    this.setDebug();
    this.camera.setInstance(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z,
    );
    this.model.add(this.camera.instance);
    this.scene.add(this.model);
  }

  setDebug() {
    const debugObject = {
      moveForword: () => {
        const direction = new Vector3(0, 0, 100);
        const speed = 0.01;
        this.model.position.add(direction.multiplyScalar(speed));
      },
    };
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          debugObject.moveForword();
          break;
      }
    });
    if (this.debug.active) {
      this.debugFolder.add(debugObject, "moveForword");
      this.debugFolder.add(this.model.position, "x", -50, 50, 0.01);
      this.debugFolder.add(this.model.position, "y", 0, 100, 0.01);
      this.debugFolder.add(this.model.position, "z", 0, 100, 0.01);
    }
  }
}
