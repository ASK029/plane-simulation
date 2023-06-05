import * as THREE from "three"
import Experience from "../Experience"

export default class Floor {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(100, 10000)
  }

  setTexture() {
    this.textures = {}
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = (3 * Math.PI) / 2
    this.scene.add(this.mesh)
  }
}
