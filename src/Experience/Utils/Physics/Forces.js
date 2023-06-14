import AirplaneStatics from "./AirplaneStatics";
import EnvironmentPhysics from "./EnvironmentPhysics";

export default class Forces {
  constructor() {
    this.envPhysics = new EnvironmentPhysics();
    this.statics = new AirplaneStatics();
  }

  weight(mass) {
    return new Vector3(0, -1 * mass * this.envPhysics.gravityAcceleration(), 0);
  }

  drag(height) {
    // R = 1/2 * Cd * rho * A * V^2
    let vilocitySquared;
    let A = Math.PI * Math.pow(this.statics.fuselageRadius, 2);
    let Cd = this.statics.dragCoefficient;
    let rho = this.envPhysics.air_rho(height);

    let dx = -0.5 * Cd * rho * A * vilocitySquared;
  }
}
