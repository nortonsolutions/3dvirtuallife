
/** 
 * StandardForm is a base class for all forms,
 * inanimate or animate (structures, items, entities)
 * provides basic positioning and template information;
 * subclasses include Animated.
 * 
 * Knows how to create its own model based on template.
 */

var upRaycasterTestLength = 700; 
var downRaycasterTestLength = 70;


export class StandardForm {
    
    constructor(template, eventDepot, loader, floorModel) {

        this.template = template;
        this.eventDepot = eventDepot;
        this.floorModel = floorModel;

        this.upRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, upRaycasterTestLength);
        this.downRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength );

        this.attributes = this.template.attributes;
        this.model = null;

        switch (loader) {
            case "gltf":
            default: 
                this.loader = new THREE.GLTFLoader();
                break;
        }

        this.load = this.load.bind(this);
    }

    load(callback) {
        
        this.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
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

    determineElevationFromBase() {

        var model;
        if (this.type == "hero") {
            model = this.controls;
        } else {
            model = this.model;
        }

        let yOffset = 40;

        this.upRaycaster.ray.origin.x = model.position.x;
        this.upRaycaster.ray.origin.z = model.position.z;
        this.upRaycaster.ray.origin.y = -yOffset;
        

        if (this.upRaycaster.intersectObject(this.floorModel, true)[0]) {
            let distanceFromBase = this.upRaycaster.intersectObject(this.floorModel, true)[0].distance;

            this.downRaycaster.ray.origin.copy (this.upRaycaster.ray.origin);
            this.downRaycaster.ray.origin.y += (distanceFromBase + yOffset);
            
            let distanceFromAbove = this.downRaycaster.intersectObject(this.floorModel, true)[0].distance;
            let elevation = this.downRaycaster.ray.origin.y - distanceFromAbove + 5; 
            return (elevation);
        } else {

            return -1;
            // console.error(`DEBUG for 'Cannot read property 'distance'...  FLOOR:`)
            // console.error(this.floor);
            // console.error(`${name} = ${x},${z}`);
        }

    }

}