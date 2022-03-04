
/** 
 * StandardForm is a base class for all forms,
 * inanimate or animate (structures, items, entities)
 * provides basic positioning and template information;
 * subclasses include Animated.
 * 
 * Knows how to create its own model based on template.
 */

var upRaycasterTestLength = 700; 
var downRaycasterTestLength = 80;


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

        this.firstMaterial = null;
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

            if (this.template.attributes.rotateY) model.rotateY(degreesToRadians(this.template.attributes.rotateY));
            this.model = model;
            this.animations = gltf.animations;
           
            if (this.template.location) {
                this.model.position.x = this.template.location.x * multiplier;
                this.model.position.z = this.template.location.z * multiplier;

                if (!this.template.attributes.staticStartingElevation) {
                    this.model.position.y = this.determineElevationFromBase() + this.attributes.elevation;
                } else {
                    this.model.position.y = this.template.location.y * multiplier;
                }
                // this.tweakPosition();

                
            } else if (this.objectName == "floor") { // floor is the only form without location
                this.setRoofToSingleSided();
                this.setFloorToReceiveShadow();
                
            }

            if (this.objectName == "balloon") {
                this.setToFrontSided(this.model);
            }

            if (this.attributes.transparentWindows) {
                let windows = this.model.getObjectByName('windows');
                this.setMaterialRecursive(windows, "transparent", true);
                this.setMaterialRecursive(windows, "opacity", 0.1);
            } else if (this.objectName == 'orb') {
                this.model.children[1].material.opacity = 0.5;
            } else if (this.model.objectName == 'ghostGhoul') {
                this.model.children[0].children[1].material.opacity = 0.3;
            } 

            // this.computeVertexNormals(this.model);
            // this.setToCastShadows();
            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    setMaterialRecursive(el, property, value) {
        if (el.material) {
            el.material[property] = value;
        } else if (el.children && el.children.length > 0) {
            for (let i = 0; i < el.children.length; i++) {
                this.setMaterialRecursive(el.children[i], property, value);
            }
        }
    }

    findFirstMaterial(el) {
        if (!this.firstMaterial && el.material) {
            this.firstMaterial = el.material;
        } else if (!this.firstMaterial) {
            for (let i = 0; i < el.children.length; i++) {
                this.findFirstMaterial(el.children[i]);
            }
        }
    }

    /** 
     * Test the position to ensure it is not inside a wall;
     * test all four directions (+/- x, +/- z); if three intersect,
     * then move some distance in the direction of the shortest vector.
     * 
     */
    tweakPosition() {

        
        let directions = [
            new THREE.Vector3( 1, 0, 0 ),
            new THREE.Vector3( -1, 0, 0 ),
            new THREE.Vector3( 0, 0, 1 ),
            new THREE.Vector3( 0, 0, -1 )
        ]

        let tweakRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 40 );
        tweakRaycaster.ray.origin.copy(this.model.position);

        let hits = 0;
        let result = null;
        let minDist = Infinity;

        for (let d = 0; d < 4; d++) {
            tweakRaycaster.ray.direction = directions[d];

            let tweakIntersections = tweakRaycaster.intersectObject( this.sceneController.floor.model, true );
            if (tweakIntersections && tweakIntersections.length>0) {
                hits++;
                if (tweakIntersections[0].distance < minDist) {
                    minDist = tweakIntersections[0].distance;
                    result = directions[d];
                };
            }
        }

        hits = 0;
        result = null;
        minDist = Infinity;

        if (hits>=3) {
            // Move the item in the direction of the shortest vector (min)
            this.model.translateOnAxis(result, minDist);
            console.log(`Tweaking ${this.objectName} ${minDist} on axis ${result.x},${result.z}`);
        }

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

        this.upRaycaster.ray.origin.copy(this.model.position);
        this.upRaycaster.ray.origin.y = -200;
        
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

    setToFrontSided(root) {
        
        if (!root) root = this.model;
        if (root.material) { 
                root.material.side = THREE.FrontSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setToFrontSided(e)); 
        }
    }

    setToCastShadows(root) {
        if (!root) root = this.model;
        if (typeof root.castShadow == "boolean") {
            
            if (root.name.match(new RegExp('pointlight|torch|torso|head|table|house|body|boy|cube|Icosphere', 'i'))) {  //
                root.castShadow = true;

                let showShadowCamera = false;
                if (root.shadow) {

                    // root.decay = 2;
                    // root.intensity = 10;
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


    // sample payload: {locked: newLockstateControlled, position: newPositionControlled, animations}
    updateAttributes(payload, local = true) {
        this.attributes = {...this.attributes, ...payload};
        this.model.attributes = {...this.attributes, ...payload};
        this.sceneController.eventDepot.fire('updateStructureAttributes', {layoutId: this.model.attributes.layoutId, attributes: payload});

        if (payload.animations && this.activeAction) {
            payload.animations.forEach(animation => {
                let [animationName,duration,fadeOutDuration,fadeOutDelay,autorestore,concurrent] = animation.split('/');
                this.runAction(animationName, Number(duration), Number(fadeOutDuration), Number(fadeOutDelay), Boolean(autorestore=="autorestore"), Boolean(concurrent=="concurrent"));
            })
        } else if (this.activeAction) { // for objects with a singular default action
            this.runAction(this.activeAction._clip.name, 3, 3, 1, false);
        }

        if (local) this.sceneController.socket.emit('updateStructureAttributes', {layoutId: this.model.attributes.layoutId, payload, level: this.sceneController.level });
    }


}