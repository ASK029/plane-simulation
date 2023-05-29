import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Experience from "./Experience"


export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height)
        this.instance.position.set(0,10,-30)

        this.scene.add(this.instance)
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = 1.5
        this.controls.maxDistance = 10
        this.controls.minDistance = 1
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update()
    {
        this.controls.update()
    }

}