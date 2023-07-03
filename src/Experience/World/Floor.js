import * as THREE from "three";
import Experience from "../Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTexture();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(56.16, 37440);
    this.geometry2 = new THREE.PlaneGeometry(40960, 40960);
  }

  setTexture() {
    this.roadTextures = {};
    this.grassTextures = {};

    this.roadTextures.color = this.resources.items.roadColorTexture;
    this.roadTextures.color.encoding = THREE.sRGBEncoding;
    this.roadTextures.color.repeat.set(1, 1000);
    this.roadTextures.color.wrapS = THREE.RepeatWrapping;
    this.roadTextures.color.wrapT = THREE.RepeatWrapping;

    this.roadTextures.normal = this.resources.items.roadNormalTexture;
    this.roadTextures.normal.repeat.set(1, 1000);
    this.roadTextures.normal.wrapS = THREE.RepeatWrapping;
    this.roadTextures.normal.wrapT = THREE.RepeatWrapping;

    this.grassTextures.color = this.resources.items.grassColorTexture;
    this.grassTextures.color.encoding = THREE.sRGBEncoding;
    this.grassTextures.color.repeat.set(1000, 1000);
    this.grassTextures.color.wrapS = THREE.RepeatWrapping;
    this.grassTextures.color.wrapT = THREE.RepeatWrapping;

    this.grassTextures.normal = this.resources.items.grassNormalTexture;
    this.grassTextures.normal.repeat.set(1000, 1000);
    this.grassTextures.normal.wrapS = THREE.RepeatWrapping;
    this.grassTextures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.roadTextures.color,
      normalMap: this.roadTextures.normal,
    });
    this.material2 = new THREE.MeshStandardMaterial({
      map: this.grassTextures.color,
      normalMap: this.grassTextures.normal,
    });
  }

  setMesh() {
    this.group = new THREE.Group();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh2 = new THREE.Mesh(this.geometry2, this.material2);
    this.mesh2.rotation.x = -Math.PI / 2;
    this.mesh.rotation.x = (3 * Math.PI) / 2;
    this.mesh.position.y = -3;
    this.mesh2.position.y = -6;
    this.group.add(this.mesh, this.mesh2);
    this.scene.add(this.group);
  }
}
