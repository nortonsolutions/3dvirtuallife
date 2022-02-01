

export class WaterForm {

    constructor(template, sceneController, useTHREE) {
        this.template = template;
        this.sceneController = sceneController;
        this.useTHREE = useTHREE;
        
    }

    load(callback) {
        this.sceneController.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
            if (this.useTHREE == "Water") {

                var params = {
                    color: '#ffffff',
                    scale: 4,
                    flowX: .1,
                    flowY: .1
                };

                //var waterGeometry = gltf.scene.children[0].geometry;
                var waterGeometry = new THREE.PlaneBufferGeometry( 44, 44 );
                let water = new THREE.Water( waterGeometry, {
                    color: params.color,
                    scale: params.scale,
                    flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
                    textureWidth: 1024,
                    textureHeight: 1024
                } );
        
    
                water.rotation.x = - Math.PI / 2;
                this.model = water;

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