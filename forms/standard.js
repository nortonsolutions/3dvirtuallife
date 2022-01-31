
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
    
    constructor(template, sceneController) {

        this.template = template;
        this.sceneController = sceneController;

        this.upRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, upRaycasterTestLength);
        this.downRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength );

        this.objectName = this.template.name;
        this.objectType = this.template.type;
        this.objectSubtype = this.template.subtype;
        
        this.attributes = this.template.attributes;
        this.random = Math.random();
        
        this.model = null;

        this.setRoofToSingleSided = this.setRoofToSingleSided.bind(this);
        this.load = this.load.bind(this);
    }

    /** load is for loading the model and animations specifically */
    load(callback) {
        
        this.sceneController.loader.load( '/models/3d/gltf/' + this.template.gltf, (gltf) => {
        
            let model = gltf.scene;
            
            model.objectName = this.template.name;
            model.objectType = this.template.type;
            model.attributes = this.template.attributes;

            model.scale.x = this.template.attributes.scale;
            model.scale.y = this.template.attributes.scale;
            model.scale.z = this.template.attributes.scale;

            this.model = model;
            this.animations = gltf.animations;
           

            if (this.template.location) {
                this.model.position.x = this.template.location.x * multiplier;
                this.model.position.z = this.template.location.z * multiplier;
                this.model.position.y = this.determineElevationFromBase() + this.attributes.elevation;

                console.log(`Placing ${this.objectName} @ ${this.model.position.x},${this.model.position.y},${this.model.position.z}` );
            
            } else if (this.objectName == "floor") { // floor is the only form without location
                this.setRoofToSingleSided();
                this.setFloorToReceiveShadow();
                
            }
            this.computeVertexNormals(this.model);
            this.setToCastShadows();
            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    computeVertexNormals(el) {

        if (el.geometry) {
            el.geometry.computeVertexNormals();
        } 
        
        if (el.children) {
            el.children.forEach(child => {
                this.computeVertexNormals(child);
            })
        }
    }

    determineElevationFromBase() {

        let yOffset = 40;

        this.upRaycaster.ray.origin.x = this.model.position.x;
        this.upRaycaster.ray.origin.z = this.model.position.z;
        this.upRaycaster.ray.origin.y = -yOffset;
        

        if (this.upRaycaster.intersectObject(this.sceneController.floor.model, true)[0]) {
            let distanceFromBase = this.upRaycaster.intersectObject(this.sceneController.floor.model, true)[0].distance;

            this.downRaycaster.ray.origin.copy (this.upRaycaster.ray.origin);
            this.downRaycaster.ray.origin.y += (distanceFromBase + yOffset);
            
            let distanceFromAbove = this.downRaycaster.intersectObject(this.sceneController.floor.model, true)[0].distance;
            let elevation = this.downRaycaster.ray.origin.y - distanceFromAbove + 5; 
            return (elevation);
        } else {
            // console.error(`DEBUG for 'Cannot read property 'distance'...  FLOOR:`)
            // console.error(this.sceneController.floor);
            // console.error(`${this.objectName} = ${this.model.position.x},${this.model.position.z}`);
            return -1;
        }

    }
    
    setRoofToSingleSided(root) {

        if (!root) root = this.model;
        if (root.material && root.material.name == "Roof") { 
                root.material.side = THREE.FrontSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setRoofToSingleSided(e)); 
        }
    }

    setToDoubleSided(root) {
        
        if (!root) root = this.model;
        if (root.material) { 
                root.material.side = THREE.DoubleSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setToDoubleSided(e)); 
        }
    }

    setToCastShadows(root) {
        if (!root) root = this.model;
        if (typeof root.castShadow == "boolean") {
            // console.log((root.name));
            if (root.name.match(new RegExp('pointlight|torch|torso|head|table|house|body|boy|cube', 'i'))) {  //
                root.castShadow = true;

                let showShadowCamera = false;
                if (root.shadow) {

                    // root.decay = 2;
                    // // root.intensity = 10;
                    // root.distance = 600;

                    root.shadow.bias = - 0.005;  
                    root.shadow.camera.fov = 70;
                    root.shadow.camera.far = 600;
                    
                    if (showShadowCamera) {
                        var shadowCameraHelper = new THREE.CameraHelper( root.shadow.camera );
                        shadowCameraHelper.visible = true;
                        this.sceneController.scene.add( shadowCameraHelper );
                    }

                };
            }
        }

        if (root.children) {
            root.children.forEach(e => this.setToCastShadows(e)); 
        }
    }

    setFloorToReceiveShadow() {
        if (this.model.getObjectByName("Floor")) this.model.getObjectByName("Floor").receiveShadow = true;
    }


    updateAttributes(payload, local = true) {
        this.attributes = {...this.attributes, ...payload};
        this.model.attributes = {...this.attributes, ...payload};
        this.sceneController.eventDepot.fire('updateStructureAttributes', {layoutId: this.model.attributes.layoutId, attributes: payload});

        if (this.activeAction) {
            this.runActiveAction(0.2);
        }

        if (local) this.sceneController.socket.emit('updateStructureAttributes', {layoutId: this.model.attributes.layoutId, payload, level: this.sceneController.level });
    }


}