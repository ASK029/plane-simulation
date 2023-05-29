import * as THREE from "three";
import Experience from "../Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(100, 10000);
  }

  setTexture() {
    this.textures = {};
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  }

  setMesh() {
    this.mesh = new Three.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.mesh);
  }
}
