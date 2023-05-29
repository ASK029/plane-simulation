import Experience from "../Experience";

export default class Airplane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.airplaneModel;
    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);
  }
}
