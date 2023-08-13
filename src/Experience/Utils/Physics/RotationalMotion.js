import AirplaneStatics from "./AirplaneStatics";

export default class RotationalMotion {
  constructor() {
    this.statics = new AirplaneStatics();
  }

  UpNDownTorque(fuselageLift) {
    return fuselageLift.length() * (this.statics.fuselageLength / 2);
  }

  SidesTorque(wingLift) {
    return wingLift.length() * this.statics.wingLength;
  }

  roll(rightLift, leftLift, mass) {
    return (
      (this.SidesTorque(rightLift) - this.SidesTorque(leftLift)) /
      (0.5 * mass * Math.pow(this.statics.fuselageRadius, 2))
    );
  }

  pitch(frontLift, tailLift, mass) {
    console.log(
      "pitch",
      (this.UpNDownTorque(tailLift) - this.UpNDownTorque(frontLift)) /
        ((1 / 12) *
          mass *
          (3 * Math.pow(this.statics.fuselageRadius, 2) +
            Math.pow(this.statics.fuselageLength, 2))),
    );
    return (
      (this.UpNDownTorque(tailLift) - this.UpNDownTorque(frontLift)) /
      ((1 / 12) *
        mass *
        (3 * Math.pow(this.statics.fuselageRadius, 2) +
          Math.pow(this.statics.fuselageLength, 2)))
    );
  }
}
