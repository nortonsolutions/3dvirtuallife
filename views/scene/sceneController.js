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

import { Fire, params } from './fire.js' 

export class SceneController {

    constructor(hero, layout, eventDepot, allObjects) {

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.hero = hero;
        this.layout = layout;
        this.eventDepot = eventDepot;
        this.allObjects = allObjects;

        this.scene = null;
        this.floor = null;
        this.upRaycasterGeneric = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, upRaycasterTestLength);
        this.downRaycasterGeneric = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength);

        this.fireParams = params;
        this.loader = new THREE.GLTFLoader();
                
        // objects3D is used for raycast intersections
        this.objects3D = [];
        this.mixers = {};
        this.actions = {};

        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.addEventListeners();
    }

    animateScene() {
        this.scene = new Scene(this);

        this.scene.init(() => {
            this.scene.animate();
        });
    }

    deanimateScene(callback) {

        this.eventDepot.removeListeners('takeItemFromScene');
        this.eventDepot.removeListeners('dropItemToScene');
        this.eventDepot.removeListeners('equipItem');

        this.scene.unregisterEventListeners();
        this.scene.deanimate(() => {

            this.scene = null;
            this.objects3D.forEach(obj3D => {
                obj3D.dispose();
            })
            callback();
        });

    }

    getObjectByName(name) {
        return this.allObjects[name];
    }

    addEventListeners() {

        this.eventDepot.addListener('takeItemFromScene', (data) => {
            this.removeFromScenebyUUID(data.uuid);
            this.eventDepot.fire('removeItemFromLayout', data.uuid);
        });

        this.eventDepot.addListener('dropItemToScene', (data) => {
            let object = this.getObjectByName(data.itemName);
            this.loadObject3DbyName(data.itemName, (gltf) => {
                let model = gltf.scene;
                model.position.copy(this.scene.controls.getObject().position);
                model.position.y = this.determineElevationGeneric(model.position.x, model.position.y, data.itemName) + object.attributes.elevation;
                this.scene.scene.add(model);
                this.addToObjects3D(model);

                data.uuid = model.uuid;
                this.eventDepot.fire('addItemToLayout', data);
            })
        });

        this.eventDepot.addListener('equipItem', (data) => {

            let area = data.bodyPart;
            this.loadObject3DbyName(data.itemName, (itemGltf) => {

                let item = itemGltf.scene;
                item.position.set(0,0,0);
                item.rotation.y = Math.PI;
                item.scale.copy(new THREE.Vector3( .1,.1,.1 ));
        
                if (item.objectName == "torch") {
        
                    let fireObj = this.getFire();

                    // this.fireParams.Torch();
                    fireObj.scale.set(.04, .01, .04);
                    fireObj.translateY(.08);
                    fireObj.translateZ(-.32);
                    fireObj.translateX(.01);
                    fireObj.rotateX(-Math.PI/5);
                    fireObj.rotateZ(-Math.PI/20);
    
                    item.add(fireObj);
    
                    switch (area) {
                        case "Middle2R_end": 
                            item.rotation.z = -Math.PI/5;
                            break;
                        case "Middle2L_end":
                            //item.rotation.z = Math.PI/8;
                            break;
                        default:
                    }

                } 
                
                this.hero.model.getObjectByName(area).add(item);
                
            });
        })
        
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

        let downRayOriginHeight = entity.position.y + 30;

        this.mixers[uniqueId].downRaycaster.ray.origin.copy(entity.position);
        this.mixers[uniqueId].downRaycaster.ray.origin.y = downRayOriginHeight;

        let downwardIntersections = this.mixers[uniqueId].downRaycaster.intersectObjects( otherObjects, true );
        if (downwardIntersections[0]) { 
            var topOfObject = downRayOriginHeight - downwardIntersections[0].distance + 2;
            if (entity.position.y <= topOfObject) {
                this.mixers[uniqueId].standingUpon = this.getRootObject3D(downwardIntersections[0].object);
                entity.position.y = topOfObject;
                this.mixers[uniqueId].velocity.y = Math.max( 0, this.mixers[uniqueId].velocity.y );
                this.mixers[uniqueId].canJump = true;
                this.mixers[uniqueId].justJumped = false;
            }
        } else {

            this.mixers[uniqueId].standingUpon = null;
            entity.position.y = this.determineElevationGeneric(entity.position.x, entity.position.z, uniqueId);

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

    /** This method will not set the position of the object3D, nor create a GUI.
     * The return object 'gltf' will have a model (scene) and animations if applicable.
      */
    loadObject3DbyName(objectName, callback) {

        let object = this.getObjectByName(objectName);
        this.load( object, (gltf) => {
            callback(gltf);
        });
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

    getFire(params) {

        if (!params) params = this.fireParams;

        let fireObj = new THREE.Group;

        let fire = new Fire();
        fire.single();
        fire.updateAll(params);
        
        let fire2 = new Fire();
        fire2.single();
        fire2.updateAll(params);

        fire2.fire.rotation.y = Math.PI/2;

        fireObj.add( fire.fire );
        fireObj.add( fire2.fire );

        return fireObj;
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

            mixerObj.activeAction.play();
            
        }

        this.mixers[uniqueId] = mixerObj;
    }

    fadeToAction = ( uuid, actionName, duration ) => {
        
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

            if (emotes.includes(actionName)) {
                this.mixers[uuid].mixer.addEventListener( 'finished', restoreState );
            }
        }
    }

    runActiveAction = (uuid, duration) => {

        this.mixers[uuid].activeAction
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn( duration )
            .play();
    }

}