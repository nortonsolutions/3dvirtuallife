
/** 
 * StandardForm is a base class for all forms,
 * inanimate or animate (structures, items, entities)
 * provides basic positioning and template information;
 * subclasses include Animated.
 * 
 * Knows how to create its own model based on template.
 */

export class StandardForm {

    constructor(template, formFactory) {

        this.template = template;
        this.attributes = this.template.attributes;
        this.formFactory = formFactory;
        this.loader = new THREE.GLTFLoader();
        this.model = null;

        this.load = this.load.bind(this);
    }

    load(callback) {
        
        this.formFactory.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
            let model = gltf.scene;
            
            model.objectName = this.template.name;
            model.objectType = this.template.type;
            model.attributes = this.template.attributes;
            model.scale.x = this.template.attributes.scale;
            model.scale.y = this.template.attributes.scale;
            model.scale.z = this.template.attributes.scale;
            
            this.model = model;
            this.animations = gltf.animations;

            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

}