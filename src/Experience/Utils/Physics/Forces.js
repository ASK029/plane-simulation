import { ArrowHelper, Euler, Vector3 } from "three";
import Experience from "./../../Experience";
import AirplaneStatics from "./AirplaneStatics";
import EnvironmentPhysics from "./EnvironmentPhysics";
import RotationalMotion from "./RotationalMotion";

export default class Forces {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.envPhysics = new EnvironmentPhysics();
    this.statics = new AirplaneStatics();
    this.velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
    this.rotations = new RotationalMotion();
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugUI = this.debug.ui;
    }

    this.isMars = false;
    this.TeScalar = 1;
    this.isLanding = false;
    this.setDebug();
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
    let velocitySquared = this.velocity.lengthSq();
    let A =
      Math.PI * Math.pow(this.statics.fuselageRadius, 2) +
      this.statics.vWingsArea; // frontal area
    let Cd = this.statics.dragCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let D = -0.5 * Cd * rho * A * velocitySquared * 0.01;

    return new Vector3(0, 0, D);
  }

  thrust(position, x = 1) {
    // T = mdot * Ve + (pe - pt) * Ae
    let Ae = 1; //unknown..
    let y = 1.4;
    let R = 8.3145;
    let Te = this.envPhysics.temperature_e(position.y, this.TeScalar);
    let mdot = this.envPhysics.m_dot(position.y);
    let Pt = this.envPhysics.atm_pressure(position.y);
    let Pe = this.envPhysics.pressure_e(position.y);
    let Ve = Math.sqrt(y * R * Te);
    if (position.y >= 12496) Ve *= 0.5;
    let T = mdot * Ve + (Pe - Pt) * Ae * 0.01 * x;

    return new Vector3(0, 0, T);
  }

  lift(position, backNForth, sides, x = 1) {
    // L = 1/2 * Cl * rho * A * V^2
    return new Vector3()
      .add(this.frontLift(position, backNForth))
      .add(this.tailLift(position, -backNForth))
      .add(this.rightLift(position, sides))
      .add(this.leftLift(position, -sides))
      .multiplyScalar(x);
  }

  frontLift(position, scalar) {
    let velocitySquared = this.velocity.lengthSq();
    let A =
      (Math.PI * this.statics.fuselageRadius * this.statics.fuselageLength) / 2;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * velocitySquared * 0.01 + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  tailLift(position, scalar) {
    let velocitySquared = this.velocity.lengthSq();
    let A =
      (Math.PI * this.statics.fuselageRadius * this.statics.fuselageLength) / 2;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * velocitySquared * 0.01 + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  rightLift(position, scalar) {
    let velocitySquared = this.velocity.lengthSq();
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * velocitySquared * 0.01 + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  leftLift(position, scalar) {
    let velocitySquared = this.velocity.lengthSq();
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);
    let dy = 0.5 * Cl * rho * A * velocitySquared * 0.01 + scalar;

    return new Vector3(0, dy / 4, 0);
  }

  totalForces(mass, position, backNForth, sides, x = 1) {
    return new Vector3()
      .add(this.weight(mass))
      .add(this.drag(position))
      .add(this.thrust(position, x))
      .add(this.lift(position, backNForth, sides, x));
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
          airplane.rotation.y += -Math.PI * 0.00001;
          break;
        case "q":
          airplane.rotation.y += Math.PI * 0.00001;
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

  update(dTime, airplane, mass, backNForth, sides) {
    this.mars();
    let x = 1;
    this.euler(airplane, mass, backNForth, sides);
    if (backNForth <= 0 && this.isLanding) {
      x = 0;
    }
    if (airplane.position.y >= 1100 && backNForth >= 0) {
      this.acceleration = new Vector3(0, 0, 0);
      this.velocity.y = 0;
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
        x,
      )
        .clone()
        .divideScalar(mass);
    }
    this.acceleration.applyEuler(this.euler(airplane, mass, backNForth, sides));

    if (
      airplane.position.y <= 3 &&
      this.totalForces(mass, airplane.position, backNForth, sides, x).y <= 0
    )
      this.velocity.y = 0;
    if (airplane.position.y <= 3 && backNForth < 5000) this.velocity.y = 0;
    this.velocity.add(this.acceleration.clone().multiplyScalar(dTime));
    airplane.position.add(this.velocity.clone().multiplyScalar(dTime));

    this.forcesArrow = new ArrowHelper(
      this.totalForces(mass, airplane.position, backNForth, sides),
      airplane.position,
      1,
      0xff0000,
    );
    this.forcesArrow.setRotationFromEuler(
      this.euler(airplane, mass, backNForth, sides),
    );

    console.log(
      "total Forces",
      this.totalForces(mass, airplane.position, backNForth, sides, x),
    );
    console.log("accelaration", this.acceleration);
    console.log("velocity", this.velocity);
    console.log("position", airplane.position);
  }

  mars() {
    if (this.isMars) {
      this.envPhysics.planetRedius = 3390000; // m
      this.envPhysics.planetMass = 6.42e12; // kg
    }
  }

  setDebug() {
    if (this.debug.active) {
      this.debugUI.add(this, "isMars");
      this.debugUI.add(this, "TeScalar", 0.1, 10, 0.01);
      this.debugUI.add(this, "isLanding");
    }
  }
}
