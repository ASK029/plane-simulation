import Experience from "../Experience"
import Environment from "./Environment"
import Floor from "./Floor"
import Aeroplane from "./Aeroplane";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

  
    //wait for resources
    this.resources.on("loaded", () => {
      //Setup
      this.floor = new Floor()
      this.aeroplane = new Aeroplane()
      this.environment = new Environment()
    })
  }
}