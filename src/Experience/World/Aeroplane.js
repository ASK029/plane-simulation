import Experience from "../Experience"

export default class Aeroplane
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        //setup
        this.resource = this.resources.items.airplaneModel
        
        this.setModel()
    }
    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)
    }
}