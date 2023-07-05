import AirplaneStatics from "./AirplaneStatics";

export default class RotationalMotion {
  constructor() {
    this.statics = new AirplaneStatics();
  }

  UpNDownTorque(fuselageLift) {
    return (fuselageLift.length() * this.statics.fuselageLength) / 2;
  }

  SidesTorque(wingLift) {
    return wingLift.length() * this.statics.wingLength;
  }
}
