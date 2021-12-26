import { Scene } from '/scene/scene.js';

/**
 * SceneController has a Scene object for graphical display, and keeps track
 * of movements and placement within the scene for object interactions, etc.
 * 
 * SceneController receives the summarized version of the layout as defined
 * by the LayoutManager, containing only the information needed for the UI.
 * 
 * Also has utilities for handling 3D objects, interfacing with the Scene.
 * 
 * Provides utilities to manage the scene state, for saving and loading.
 *  
 */
// var floorBuffer = 0;
var upRaycasterTestLength = 700; 
var downRaycasterTestLength = 70;
var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

export class SceneController {

    constructor(hero, layoutManager, eventDepot) {

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.hero = hero;
        this.scene = null;
        this.floor = null;
        this.upRaycasterGeneric = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, upRaycasterTestLength);
        this.downRaycasterGeneric = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength);

        this.eventDepot = eventDepot;
        this.layoutManager = layoutManager;
        this.level = layoutManager.getLevel();
        this.layout = layoutManager.getLayout();
        this.background = this.layout.background;
        this.terrain = this.layout.terrain;
        this.objects = layoutManager.getLevelObjects();  

        this.loader = new THREE.GLTFLoader();
                
        // objects3D is used for raycast intersections
        this.objects3D = [];
        this.mixers = {};
        this.actions = {};

        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        this.eventDepot.addListener('takeItem', (data) => {
            
            this.removeFromScenebyUUID(data.uuid);
        });

        this.eventDepot.addListener('dropItem', (itemName) => {
            let object = this.layoutManager.getObject(itemName);
            this.loadObject3DbyName(itemName, (gltf) => {
                let model = gltf.scene;
                model.position.copy(this.scene.controls.getObject().position);
                model.position.y = this.determineElevationGeneric(model.position.x, model.position.y, itemName) + object.attributes.elevation;
                
                // Add to layoutManager's levelObjects as well with grid coordinates, for future loads
                
                this.scene.scene.add(model);
                this.addToObjects3D(model);
                
            })
        });
    }

    determineElevationGeneric(x,z, name) {

        let yOffset = 40;

        this.upRaycasterGeneric.ray.origin.x = x;
        this.upRaycasterGeneric.ray.origin.z = z;
        this.upRaycasterGeneric.ray.origin.y = -yOffset;
        

        if (this.upRaycasterGeneric.intersectObject(this.floor, true)[0]) {
            let distanceFromBase = this.upRaycasterGeneric.intersectObject(this.floor, true)[0].distance;

            this.downRaycasterGeneric.ray.origin.copy (this.upRaycasterGeneric.ray.origin);
            this.downRaycasterGeneric.ray.origin.y += (distanceFromBase + yOffset);
            
            let distanceFromAbove = this.downRaycasterGeneric.intersectObject(this.floor, true)[0].distance;
            let genericElevation = this.downRaycasterGeneric.ray.origin.y - distanceFromAbove + 5; 
            // console.log(`genericElevation for ${name}: ${genericElevation}`);
            return (genericElevation);
        } else {
            console.error(`DEBUG for 'Cannot read property 'distance'...  FLOOR:`)
            console.error(this.floor);
            console.error(`${name} = ${x},${z}`);
        }

    }

    setElevation(uniqueId, entity) {


        var otherObjects = this.objects3D.filter(el => {
            return this.getObjectName(el) != entity.objectName
        });

        // if (uniqueId=="hero") {
        //     console.log(`entity.position.y upon setElevation: ${entity.position.y}`);
        //     console.dir(otherObjects);
        // }


        // Offset downRay
        let downRayOriginHeight = entity.position.y + 30;

        this.mixers[uniqueId].downRaycaster.ray.origin.copy(entity.position);
        this.mixers[uniqueId].downRaycaster.ray.origin.y = downRayOriginHeight;
        // Am I over an object?

        // if (uniqueId == "hero") {
        //     console.log("this.mixers[uniqueId].downRaycaster.ray.origin")
        //     console.table(this.mixers[uniqueId].downRaycaster.ray.origin);
        // }
        let downwardIntersections = this.mixers[uniqueId].downRaycaster.intersectObjects( otherObjects, true );
        if (downwardIntersections[0]) { // YES
            var topOfObject = downRayOriginHeight - downwardIntersections[0].distance + 2;
            if (entity.position.y <= topOfObject) {
                this.mixers[uniqueId].standingUpon = this.getRootObject3D(downwardIntersections[0].object);
                entity.position.y = topOfObject;
                this.mixers[uniqueId].velocity.y = Math.max( 0, this.mixers[uniqueId].velocity.y );
                this.mixers[uniqueId].canJump = true;
                this.mixers[uniqueId].justJumped = false;
            }
        } else {
            // DEBUG
            this.mixers[uniqueId].standingUpon = null;
            entity.position.y = this.determineElevationGeneric(entity.position.x, entity.position.z, uniqueId);
            // if (uniqueId == "hero") {
            //     console.log("this.controls.getObject().position");
            //     console.table(this.scene.controls.getObject().position);
            // }
        }
    }

    addToObjects3D(object) {
        this.objects3D.push(object);
    }

    removeFromScenebyUUID(uuid) {

        this.scene.scene.remove(this.scene.scene.children.find(el => {
            return el.uuid == uuid;
        }));

        this.objects3D = this.objects3D.filter(el => {
            return el.uuid != uuid;
        });
    }

    animateScene() {
        this.scene = new Scene(this.hero, this.layout.length, this.layout.width, this.terrain, this.background, this);

        this.scene.init(() => {
            this.scene.animate();
        });
    }


    deanimateScene(callback) {
        this.scene.unregisterEventListeners();
        this.scene.deanimate(() => {

            this.scene = null;
            this.objects3D.forEach(obj3D => {
                obj3D.dispose();
            })
            callback();
        });

    }

    /** This method will not set the position of the object3D, nor create a GUI.
     * The return object 'gltf' will have a model (scene) and animations if applicable.
      */
    loadObject3DbyName(objectName, callback) {

        let object = this.layoutManager.getObject(objectName);
        this.loader.load( '/models/3d/gltf/' + object.gltf, (gltf) => {
            let model = gltf.scene;
            model.scale.x = object.attributes.scale;
            model.scale.y = object.attributes.scale;
            model.scale.z = object.attributes.scale;
            model.objectName = object.name;
            model.objectType = object.type;
            model.attributes = object.attributes;
            callback(gltf);
        });
    }
    
    /** Position of the model should be set before animating */
    createGUI(gltf) {
        this.scene.createGUI( model, gltf.animations, model.uuid );
    }

    getRootObject3D = (obj) => {
        if (obj.objectName) {
            return obj;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getRootObject3D(obj.parent);
        }
    }

    getObjectName = (obj) => {
        if (obj.objectName) {
            return obj.objectName;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getObjectName(obj.parent);
        }
    }

    getObjectType = (obj) => {
        if (obj.objectType) {
            return obj.objectType;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getObjectType(obj.parent);
        }
    }

    load(object, callback) {
        
        this.loader.load( '/models/3d/gltf/' + object.gltf, (gltf) => {
        
            let model = gltf.scene;
            
            model.objectName = object.name;
            model.objectType = object.type;
            model.attributes = object.attributes;
            model.scale.x = object.attributes.scale;
            model.scale.y = object.attributes.scale;
            model.scale.z = object.attributes.scale;
            
            if (object.equipped) {
                Object.keys(object.equipped).forEach(bodyPart => {
                    this.loadObject3DbyName(object.equipped[bodyPart], (itemGltf) => {
                        object.equip(bodyPart, itemGltf.scene);
                    })
                })
            }
            
            callback(gltf);

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    createMixer( model, animations, uniqueId ) {

        var thisMixer = new THREE.AnimationMixer( model );

        let firstAnimationName = '';
        animations.forEach((animation,index) => {

            var action = thisMixer.clipAction( animation );
            if (index == 0) { firstAnimationName = animation.name };

            if ( emotes.indexOf( animation.name ) >= 0 || states.indexOf( animation.name ) >= 4) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            } else if (model.objectType=='structure') {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopPingPong;
                action.repetitions = 1;
            }

            this.actions[ uniqueId + animation.name ] = action;

        });

        var mixerObj = { 
        
            name: model.objectName, 
            mixer: thisMixer,
            activeActionName: 'Idle', // 'Idle',
            activeAction: this.actions[uniqueId + firstAnimationName],
            previousActionName: '',
            previousAction: null,
        };


        if (model.attributes.moves) {
        // if (uniqueId == "hero" || model.objectType == "friendly" || model.objectType == "beast") {
            mixerObj = {
                ...mixerObj,
                moves: true,
                absVelocity: 0,
                direction: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                downRaycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength ),
                movementRaycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 40 ),
                justJumped: false,
                standingUpon: null,
                canJump: true,
                selectedObject: null,
            }

            // DEFAULT:
            mixerObj.activeAction.play();
            
        }

        this.mixers[uniqueId] = mixerObj;
    }

    fadeToAction = ( uuid, actionName, duration ) => {
        
        // Get the mixer for this uuid:

        if ( this.mixers[uuid].activeActionName !== actionName ) {

            let newAction = this.actions[ uuid + actionName ];

            this.mixers[uuid].previousActionName = this.mixers[uuid].activeActionName;
            this.mixers[uuid].previousAction = this.mixers[uuid].activeAction;
            this.mixers[uuid].activeActionName = actionName;
            this.mixers[uuid].activeAction = newAction;

            this.mixers[uuid].previousAction.fadeOut( duration );

            this.mixers[uuid].activeAction
                .reset()
                .setEffectiveTimeScale( 1 )
                .setEffectiveWeight( 1 )
                .fadeIn( duration )
                .play();

            const restoreState = () => {
                this.mixers[uuid].mixer.removeEventListener('finished', restoreState );
                this.fadeToAction( uuid, this.mixers[uuid].previousActionName, 0.1 );
            }
    
            // After fadeToAction ({emote}, {seconds}), fadeToAction ({state}, {seconds}) again
            if (emotes.includes(actionName)) {
                this.mixers[uuid].mixer.addEventListener( 'finished', restoreState );
            }
        }
    }

    runActiveAction = (uuid, duration) => {
        // Get the mixer for this uuid:
        this.mixers[uuid].activeAction
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn( duration )
            .play();
    }

}