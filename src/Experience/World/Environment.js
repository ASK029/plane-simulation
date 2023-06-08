import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.Time;
    this.resources = this.experience.resources;
    this.aeroplane = this.experience.world.aeroplane;

    this.setSunLight();
    this.setFog();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
    this.sunLight.position.set(0.25, 2, -2.25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.scene.add(this.sunLight);
  }

  setFog() {
    let fogDensity = 0;
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture2 = this.resources.items.skyMapTexture;
    this.environmentMap.encoding = THREE.sRGBEncoding;

    this.time.on("tick", () => {
      this.aeroplane.model.position.y > 100
        ? (this.scene.background = this.environmentMap.texture2)
        : (this.scene.background = this.environmentMap.texture);
    });

    this.scene.environment = this.environmentMap.texture;

    this.setEnvironmentMap.updateAllMaterials = () => {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
  }
}
