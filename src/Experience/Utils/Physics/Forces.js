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
    let A = Math.PI * Math.pow(this.statics.fuselageRadius, 2); // frontal area
    let Cd = this.statics.dragCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let dx = -0.5 * Cd * rho * A * vilocitySquared.x;
    let dy = -0.5 * Cd * rho * A * vilocitySquared.y;
    let dz = -0.5 * Cd * rho * A * vilocitySquared.z;

    return new Vector3(dx, dy, dz);
  }

  thrust(position) {
    var velocity = this.getAirplaneVelocity() // get the airplane's velocity vector
    var speed = velocity.length(); // get the magnitude of the velocity vector
    var direction = velocity.clone().normalize(); // get the unit vector in the direction of the velocity

    // T = mdot * Ve + (pe - pt) * Ae
    let Ae = 1; //unknown..
    let y = 1.4;
    let R = 8.3145;
    let Te = this.envPhysics.temperature_e(position.y);
    let mdot = this.envPhysics.m_dot(position.y);
    let Pt = this.envPhysics.atm_pressure(position.y);
    let Pe = this.envPhysics.pressure_e(position.y);
    let Ve = sqrt(y * R * Te);
    let T = mdot * Ve + (Pe - Pt) * Ae;

    let Thrust = direction.multiplyScalar(T);
    return Thrust;
  }

  lift(position) {
    // L = 1/2 * Cl * rho * A * V^2
    let vilocitySquared = this.vilocity.clone().multiply(this.vilocity);
    let A = this.statics.wingArea;
    let Cl = this.statics.liftCoefficient;
    let rho = this.envPhysics.air_rho(position.y - 3);

    let dx = 0.5 * Cl * rho * A * vilocitySquared.x;
    let dy = 0.5 * Cl * rho * A * vilocitySquared.y;
    let dz = 0.5 * Cl * rho * A * vilocitySquared.z;

    return new Vector3(dx, dy, dz);
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

    if (position.y <= 0) this.vilocity.y = 0;
    this.vilocity.add(acceleration).multiplyScalar(dTime);
    position.add(this.vilocity).multiplyScalar(dTime);
  }

  getAirplaneVelocity(){
    // get the airplane's current position
  currentPosition = this.aeroplane.position.clone();

    // to allow the airplane to move
  setTimeout(function() {

    // get the airplane's new position
  var newPosition = this.position.clone();

    // calculate the velocity vector
    var deltaTime = 0.1; // time elapsed between positions
    var velocity = newPosition.clone().sub(currentPosition).divideScalar(deltaTime);

    }, 100);
    return velocity;
  }
}
