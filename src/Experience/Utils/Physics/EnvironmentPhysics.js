import { Vector3 } from "three";

export default class EnvironmentPhysics {
  constructor() {
    this.earthRedius = 6378139.99; //m
    this.gravitationalConstant = 6.6743;
    this.earthMass = 5.972e13;
  }

  gravityAcceleration() {
    return (
      (this.gravitationalConstant * this.earthMass) /
      Math.pow(this.earthRedius, 2)
    );
  }

  atm_pressure(height) {
    let R = 8.3145;
    let Md = 0.0289644; // (kg/mol) mass of u air molecule
    let P0 = 101325; // 1bar =100000pa
    let Tb = 288.15; // [kelven]
    let Lb = -0.0065; // [kelven/m]
    let base = 1 + (Lb / Tb) * height;
    let exponent = -(this.gravityAcceleration() * Md) / (R * Lb);
    return P0 * Math.pow(base, exponent);
  }

  temperature(height) {
    let Tb = 288.15; //[kelvin]
    let Lb = -0.0065; //[kelvin/m]
    return Tb - Lb * height;
  }

  air_rho(height) {
    let Rspecific = 287.058; //specific gas constant for dry air
    let Tt = this.temperature(height);
    let P = this.atm_pressure(height);
    let rho = P / (Rspecific * Tt);
    return rho;
  }
}
