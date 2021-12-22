import { Scene } from '/scene/scene.js';
import { Hero } from '/hero.js'

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

var downRaycasterTestLength = 350;
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
        this.addEventListeners();
    }

    addEventListeners() {
        this.eventDepot.addListener('takeItem', (itemName) => {
            this.removeFromScenebyName(itemName);
        });

        this.eventDepot.addListener('dropItem', (itemName) => {
            let object = this.layoutManager.getObject(itemName);
            this.loadObject3DbyName(itemName, (gltf) => {
                let model = gltf.scene;
                model.position.copy(this.scene.controls.getObject().position);
                model.position.y = this.determineElevationGeneric(model.position.x, model.position.y) + object.attributes.elevation;
                
                // Add to layoutManager's levelObjects as well with grid coordinates, for future loads
                
                this.addToObjects3D(model);
                this.scene.scene.add(model);
                
            })
        });
    }

    determineElevationGeneric(x,z, uniqueId) {
        this.downRaycasterGeneric.ray.origin.x = x;
        this.downRaycasterGeneric.ray.origin.z = z;
        this.downRaycasterGeneric.ray.origin.y = downRaycasterTestLength - 10;

        if (! this.downRaycasterGeneric.intersectObject(this.floor, true)[0]) {
            console.error(`DEBUG for 'Cannot read property 'distance'...  FLOOR:`)
            console.error(this.floor);
            console.error(`${uniqueId} = ${x},${z}`);
        }
        return this.downRaycasterGeneric.ray.origin.y - this.downRaycasterGeneric.intersectObject(this.floor, true)[0].distance;
    }

    castDownrayAndDetemineElevation(uniqueId, entity) {

        let thisMixer = this.mixers[uniqueId];

        let downRaycaster = thisMixer.downRaycaster;
        downRaycaster.ray.origin.copy(entity.position);
        downRaycaster.ray.origin.y = downRaycasterTestLength - 10;

        let downwardIntersections = downRaycaster.intersectObjects( this.objects3D, true ).filter(el => {
            return this.getObjectName(el.object) != entity.objectName;
        });
        // console.dir(downwardIntersections);
        if (thisMixer.justJumped || thisMixer.jumpedOnObject) {
            thisMixer.jumpedOnObject = downwardIntersections.length > 0;
        }


        if (downwardIntersections[0]) {
            thisMixer.standingUpon = this.getRootObject3D(downwardIntersections[0].object);
        } else {
            thisMixer.standingUpon = null;
        }

        // if (thisMixer.standingUpon) console.dir(thisMixer.standingUpon);

        // Accomodate for hero height (special case due to controls object)
        var elevation = (uniqueId == "hero") ? this.hero.attributes.height : 0;

        if ( thisMixer.jumpedOnObject === true ) {
            elevation += (thisMixer.downRaycaster.ray.origin.y - downwardIntersections[0].distance);
        } else {
            elevation += (downRaycaster.ray.origin.y - downRaycaster.intersectObject(this.floor, true)[0].distance);
        }
        
        return elevation;
    }

    addToObjects3D(object) {
        this.objects3D.push(object);
    }

    removeFromScenebyName(objectName) {

        this.scene.scene.remove(this.scene.scene.children.find(el => {
            return el.objectName == objectName;
        }));

        this.objects3D = this.objects3D.filter(el => {
            return el.objectName != objectName;
        });
    }

    animateScene() {
        this.scene = new Scene(this.hero, this.layout.length, this.layout.width, this.terrain, this.background, this);

        this.scene.init(() => {
            this.scene.animate();
        });
    }

    deanimateScene() {
        this.scene.deanimate();
        this.scene.unregisterEventListeners();

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

        animations.forEach(animation => {

            var action = thisMixer.clipAction( animation );

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
            activeActionName: 'Idle',
            activeAction: this.actions[Object.keys(this.actions)[0]],
            previousActionName: '',
            previousAction: null,
        };

        if (uniqueId == "hero" || model.objectType == "friendly" || model.objectType == "beast") {
            mixerObj = {
                ...mixerObj,
                moves: true,
                absVelocity: 0,
                direction: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                downRaycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength ),
                movementRaycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 40 ),
                jumpedOnObject: false,
                justJumped: false,
                canJump: true,
                selectedObject: null,
                onObject: false
            }
        }

        this.mixers[uniqueId] = mixerObj;

        // DEFAULT:
        if (mixerObj.activeAction) mixerObj.activeAction.play();
    }

    fadeToAction = ( uuid, actionName, duration ) => {
        
        // Get the mixer for this uuid:
        let thisMixer = this.mixers[uuid];

        if ( thisMixer.activeActionName !== actionName ) {

            let newAction = this.actions[ uuid + actionName ];

            thisMixer.previousActionName = thisMixer.activeActionName;
            thisMixer.previousAction = thisMixer.activeAction;
            thisMixer.activeActionName = actionName;
            thisMixer.activeAction = newAction;

            thisMixer.previousAction.fadeOut( duration );

            thisMixer.activeAction
                .reset()
                .setEffectiveTimeScale( 1 )
                .setEffectiveWeight( 1 )
                .fadeIn( duration )
                .play();

            const restoreState = () => {
                thisMixer.mixer.removeEventListener('finished', restoreState );
                this.fadeToAction( uuid, thisMixer.previousActionName, 0.1 );
            }
    
            // After fadeToAction ({emote}, {seconds}), fadeToAction ({state}, {seconds}) again
            if (emotes.includes(actionName)) {
                thisMixer.mixer.addEventListener( 'finished', restoreState );
            }
        }
    }

    runActiveAction = (uuid, duration) => {
        // Get the mixer for this uuid:
        let thisMixer = this.mixers[uuid];
        thisMixer.activeAction
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn( duration )
            .play();
    }

}