import { Euler, Vector3 } from "three";
import AirplaneStatics from "./AirplaneStatics";
import EnvironmentPhysics from "./EnvironmentPhysics";
import RotationalMotion from "./RotationalMotion";

export default class Forces {
  constructor() {
    this.envPhysics = new EnvironmentPhysics();
    this.statics = new AirplaneStatics();
    this.vilocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
    this.rotations = new RotationalMotion();
  }

  weight(mass) {
    return new Vector3(0, -1 * mass * this.envPhysics.gravityAcceleration(), 0);
  }

  drag(position) {
    // D = 1/2 * Cd * rho * A * V^2
    let vilocitySquared = this.vilocity.lengthSq();
    let A =
      Math.PI * Math.pow(this.statics.fuselageRadius, 2) +
      this.statics.vWingsArea; // frontal area
    let Cd = this.statics.dragCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let D = -0.5 * Cd * rho * A * vilocitySquared;

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
    if (position.y >= 12496) Ve *= 0.5;
    let T = mdot * Ve + (Pe - Pt) * Ae;

    return new Vector3(0, 0, T);
  }

  lift(position, backNForth, sides) {
    // L = 1/2 * Cl * rho * A * V^2
    return new Vector3()
      .add(this.frontLift(position, backNForth))
      .add(this.tailLift(position, -backNForth))
      .add(this.rightLift(position, sides))
      .add(this.leftLift(position, -sides));
  }

  frontLift(position, scalar) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A =
      (Math.PI * this.statics.fuselageRadius * this.statics.fuselageLength) / 2;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  tailLift(position, scalar) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A =
      (Math.PI * this.statics.fuselageRadius * this.statics.fuselageLength) / 2;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  rightLift(position, scalar) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  leftLift(position, scalar) {
    let vilocitySquared = this.vilocity.lengthSq();
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * vilocitySquared + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  totalForces(mass, position, backNForth, sides) {
    return new Vector3()
      .add(this.weight(mass))
      .add(this.drag(position))
      .add(this.thrust(position))
      .add(this.lift(position, backNForth, sides));
  }

  pitch(airplane, mass, backNForth) {
    if (
      this.lift(airplane.position, backNForth, 0).length() >
      this.weight(mass).length()
    ) {
      airplane.rotation.x = this.rotations.pitch(
        this.frontLift(airplane.position, backNForth),
        this.tailLift(airplane.position, -backNForth),
        mass,
      );
    }
    return airplane.rotation.x;
  }

  roll(airplane, mass, sides) {
    airplane.rotation.z = this.rotations.roll(
      this.rightLift(airplane.position, sides),
      this.leftLift(airplane.position, -sides),
      mass,
    );

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

  euler(airplane, mass, backNForth, sides) {
    let euler = new Euler();

    euler.set(
      this.pitch(airplane, mass, backNForth),
      this.yaw(airplane),
      this.roll(airplane, mass, sides),
      "XYZ",
    );

    this.drag(airplane.position).applyEuler(euler);
    this.lift(airplane.position, backNForth, sides).applyEuler(euler);
    this.frontLift(airplane.position, backNForth).applyEuler(euler);
    this.tailLift(airplane.position, -backNForth).applyEuler(euler);
    this.rightLift(airplane.position, sides).applyEuler(euler);
    this.leftLift(airplane.position, -sides).applyEuler(euler);
    this.thrust(airplane.position).applyEuler(euler);

    return euler;
  }

  // cruise(airplane,)

  update(dTime, airplane, mass, backNForth, sides) {
    if (airplane.position.y >= 1000) {
      this.acceleration = new Vector3(0, 0, 0);
      this.vilocity.y = 0;
      this.lift(airplane.position, backNForth, sides).copy(
        this.weight(mass).clone().multiplyScalar(-1),
      );
      this.drag(airplane.position).copy(
        this.thrust(airplane.position).clone().multiplyScalar(-1),
      );
    } else {
      this.acceleration = this.totalForces(
        mass,
        airplane.position,
        backNForth,
        sides,
      )
        .clone()
        .divideScalar(mass);
    }
    this.acceleration.applyEuler(this.euler(airplane, mass, backNForth, sides));
    console.log("bnf", backNForth);
    console.log("rotation", airplane.rotation.x);

    if (
      airplane.position.y <= 3 &&
      this.totalForces(mass, airplane.position, backNForth, sides).y <= 0
    )
      this.vilocity.y = 0;
    if (airplane.position.y <= 3 && backNForth < 5000) this.vilocity.y = 0;
    console.log("v", this.vilocity);
    this.vilocity.add(this.acceleration.clone().multiplyScalar(dTime));
    airplane.position.add(this.vilocity.clone().multiplyScalar(dTime));
  }
}
