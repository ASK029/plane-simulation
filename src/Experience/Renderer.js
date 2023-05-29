import * as THREE from "three"
import Experience from "./Experience";

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({canvas: this.canvas , antialias: true})
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setClearColor('#211d20')
        this.instance.physicallyCorrectLights = true
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene,this.camera.instance)
    }
}