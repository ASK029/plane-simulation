import * as THREE from "three"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from "./Camera"
import Renderer from "./Renderer"

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        if(instance)
        {
            return instance
        }

        instance = this

        //Options
        this.canvas = canvas

        //Setup
        this.sizes = new Sizes()
        this.Time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()

        //Sizes resize event
        this.sizes.on('resize',()=>
        {
            this.resize()
        })

        //Time tick event
        this.Time.on('tick',()=>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
    }

}