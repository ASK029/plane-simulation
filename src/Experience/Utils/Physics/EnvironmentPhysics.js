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

  //Pt
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

  //Pe
  pressure_e(height) {
    let y = 1.4;
    let Pt = this.atm_pressure(height);
    let base = 1 + (y - 1) / 2;
    let exponent = -y / (y - 1);
    return Pt * Math.pow(base, exponent);
  }

  //Tt
  temperature(height) {
    let Tb = 288.15; //[kelvin]
    let Lb = -0.0065; //[kelvin/m]
    return Tb - Lb * height;
  }

  //Te
  temperature_e(height) {
    let y = 1.4;
    let Tt = this.temperature(height);
    return Tt / (1 + (y - 1) / 2);
  }

  air_rho(height) {
    let Rspecific = 287.058; //specific gas constant for dry air
    let Tt = this.temperature(height);
    let P = this.atm_pressure(height);
    return P / (Rspecific * Tt);
  }

  m_dot(height) {
    let R = 8.3145;
    let y = 1.4;
    let A = 1;
    let Pt = this.atm_pressure(height);
    let Tt = this.temperature(height);
    let exponent = (y + 1) / (2 * y - 2);
    let base = (y + 1) / 2;
    return (
      ((A * Pt) / Math.sqrt(Tt)) * Math.sqrt(y / R) * Math.pow(base, exponent)
    );
  }
}
