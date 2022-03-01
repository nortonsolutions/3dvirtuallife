

export class GrassForm {

    constructor(template, sceneController, useTHREE) {
        this.template = template;
        this.sceneController = sceneController;
        this.useTHREE = useTHREE;
        
    }

    load(callback) {
        this.sceneController.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
            if (this.useTHREE == "Grass") {

            } else {

                this.model = gltf.scene;
                this.model.receiveShadow = true;

            }

            this.model.scale.x = this.template.attributes.scale;
            this.model.scale.y = this.template.attributes.scale;
            this.model.scale.z = this.template.attributes.scale;
            this.model.objectName = 'water';
            this.model.objectType = 'water';
            this.attributes = this.model.attributes = this.template.attributes;

            this.animations = gltf.animations;
           
            this.model.position.y = this.template.attributes.elevation;
            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }
}