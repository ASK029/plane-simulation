im
import Experience from "../Experience"

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({color: 0xff0000})
    }

    setMesh()
    {
        this.mesh = new Three.Mesh()
    }
}