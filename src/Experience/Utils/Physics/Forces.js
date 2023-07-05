import { Euler, Vector3 } from "three";
import AirplaneStatics from "./AirplaneStatics";
import EnvironmentPhysics from "./EnvironmentPhysics";

export default class Forces {
  constructor() {
    this.envPhysics = new EnvironmentPhysics();
    this.statics = new AirplaneStatics();
    this.vilocity = new Vector3(0, 0, 0);
  }

  weight(mass) {
    return new Vector3(
      0,
      -1 * mass * this.envPhysics.gravityAcceleration() * 0.01,
      0,
    );
  }

  drag(position) {
    // D = 1/2 * Cd * rho * A * V^2
    let vilocitySquared = this.vilocity.lengthSq();
    let A =
      Math.PI * Math.pow(this.statics.fuselageRadius, 2) +
      this.statics.vWingsArea; // frontal area
    let Cd = this.statics.dragCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let D = -0.5 * Cd * rho * A * vilocitySquared * 0.01;

    return new Vector3(0, 0, D);
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
    let T = mdot * Ve + (Pe - Pt) * Ae * 0.01;

    return new Vector3(0, 0, T);
  }

  lift(position) {
    // L = 1/2 * Cl * rho * A * V^2
    return new Vector3()
      .add(this.frontLift(position))
      .add(this.tailLift(position))
      .add(this.rightLift(position))
      .add(this.leftLift(position));
  }

  frontLift(position) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A =
      (Math.PI * this.statics.fuselageRadius * this.statics.fuselageLength) / 2;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared * 0.01;

    return new Vector3(0, dy, 0);
  }

  tailLift(position) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A =
      (Math.PI * this.statics.fuselageRadius * this.statics.fuselageLength) / 2;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared * 0.01;

    return new Vector3(0, dy, 0);
  }

  rightLift(position) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared * 0.01;

    return new Vector3(0, dy, 0);
  }

  leftLift(position) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared * 0.01;

    return new Vector3(0, dy, 0);
  }

  totalForces(mass, position) {
    return new Vector3()
      .add(this.weight(mass))
      .add(this.drag(position))
      .add(this.thrust(position))
      .add(this.lift(position));
  }

  pitch(airplane, mass) {
    if (this.lift(airplane.position).length() > this.weight(mass).length()) {
      if (airplane.rotation.x > -Math.PI / 8)
        airplane.rotation.x =
          -Math.PI * this.lift(airplane.position).length() * 0.000001;
    }
    return airplane.rotation.x;
  }

  roll(airplane) {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "d":
          airplane.rotation.z += Math.PI * 0.0001;
          break;
        case "a":
          airplane.rotation.z += -Math.PI * 0.0001;
          break;
      }
    });
    return airplane.rotation.z;
  }

  yaw(airplane) {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "e":
          airplane.rotation.y += -Math.PI * 0.0001;
          break;
        case "q":
          airplane.rotation.y += Math.PI * 0.0001;
          break;
      }
    });
    return airplane.rotation.y;
  }

  euler(airplane, mass) {
    let euler = new Euler();

    euler.set(
      this.pitch(airplane, mass),
      this.yaw(airplane),
      this.roll(airplane),
      "XYZ",
    );

    this.drag(airplane.position).applyEuler(euler);
    this.lift(airplane.position).applyEuler(euler);
    this.thrust(airplane.position).applyEuler(euler);

    console.log(euler);

    return euler;
  }

  update(dTime, airplane, mass) {
    let euler = this.euler(airplane, mass);
    let acceleration = this.totalForces(mass, airplane.position)
      .clone()
      .divideScalar(mass);
    acceleration.applyEuler(euler);
    // airplane.position.applyEuler(euler);
    console.log("weight", this.weight(mass));
    console.log("drag", this.drag(airplane.position));
    console.log("thrust", this.thrust(airplane.position));
    console.log("lift", this.lift(airplane.position));
    console.log("total forces", this.totalForces(mass, airplane.position));
    console.log("acceleration", acceleration);
    if (acceleration.z >= 1000) acceleration.z = 0;

    if (
      airplane.position.y <= 3 &&
      this.totalForces(mass, airplane.position).y <= 0
    )
      this.vilocity.y = 0;
    this.vilocity.add(acceleration.clone().multiplyScalar(dTime));
    console.log("vilocity", this.vilocity);
    airplane.position.add(this.vilocity.clone().multiplyScalar(dTime));
    console.log("position", airplane.position);
  }
}
