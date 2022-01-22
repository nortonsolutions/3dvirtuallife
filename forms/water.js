

export class WaterForm {

    constructor(template, sceneController) {
        this.template = template;
        this.sceneController = sceneController;
    }

    load(callback) {
        this.sceneController.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
            let model = gltf.scene;
            
            model.objectName = 'water';
            model.objectType = 'water';

            model.scale.x = this.template.scale;
            model.scale.y = this.template.scale;
            model.scale.z = this.template.scale;

            this.model = model;
            this.animations = gltf.animations;
           
            this.model.position.y = this.template.elevation;
            this.model.receiveShadow = true;
            
            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }
}