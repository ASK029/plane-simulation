import { Vector3 } from "three";
import AirplaneStatics from "./AirplaneStatics";
import EnvironmentPhysics from "./EnvironmentPhysics";
import Experience from "../../Experience";

export default class Forces {
  constructor() {
    this.envPhysics = new EnvironmentPhysics();
    this.statics = new AirplaneStatics();
    this.vilocity = new Vector3(0, 0, 0);

    this.experience = new Experience();
    this.aeroplane = this.experience.world.aeroplane;
  }

  weight(mass) {
    return new Vector3(0, -1 * mass * this.envPhysics.gravityAcceleration(), 0);
  }

  drag(position) {
    // D = 1/2 * Cd * rho * A * V^2
    let vilocitySquared = this.vilocity.clone().multiply(this.vilocity);
    let A =
      Math.PI * Math.pow(this.statics.fuselageRadius, 2) +
      this.statics.vWingsArea; // frontal area
    let Cd = this.statics.dragCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let dz = -0.5 * Cd * rho * A * vilocitySquared.z;

    return new Vector3(0, 0, dz);
  }

  thrust(position) {
    // T = mdot * Ve + (pe - pt) * Ae
    let Ae = 1; //unknown..
    let y = 1.4;
    let R = 8.3145;
    let Te = this.envPhysics.temperature_e(position.y);
    let mdot = this.envPhysics.m_dot(position.y);
    let Pt = this.envPhysics.atm_pressure(position.y);
    let Pe = this.envPhysics.pressure_e(position.y);
    let Ve = Math.sqrt(y * R * Te);
    let T = mdot * Ve + (Pe - Pt) * Ae;

    return new Vector3(0, 0, T);
  }

  lift(position) {
    // L = 1/2 * Cl * rho * A * V^2
    let vilocitySquared = this.vilocity.clone().multiply(this.vilocity);
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let dy = 0.5 * Cl * rho * A * vilocitySquared.length();

    return new Vector3(0, dy, 0);
  }

  totalForces(mass, position) {
    return new Vector3()
      .add(this.weight(mass))
      .add(this.drag(position))
      .add(this.thrust(position))
      .add(this.lift(position));
  }

  update(dTime, position, mass) {
    let acceleration = this.totalForces(mass, position)
      .clone()
      .divideScalar(mass);
    console.log("weight", this.weight(mass));
    console.log("drag", this.drag(position));
    console.log("thrust", this.thrust(position));
    console.log("lift", this.lift(position));
    console.log("total forces", this.totalForces(mass, position));
    console.log("acceleration", acceleration);
    if (acceleration.z >= 1000) acceleration.z = 1000;

    if (position.y <= 3 && this.totalForces(mass, position).y <= 0)
      this.vilocity.y = 0;
    this.vilocity.add(acceleration.clone().multiplyScalar(dTime));
    console.log("vilocity", this.vilocity);
    position.add(this.vilocity.clone().multiplyScalar(dTime));
    console.log("position", position);
  }
}
