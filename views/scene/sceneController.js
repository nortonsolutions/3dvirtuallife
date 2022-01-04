import { Scene } from '/scene/scene.js';
import { FormFactory } from '/forms/formFactory.js';
import { Hero } from '/forms/hero.js';

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

var multiplier = 100;
var upRaycasterTestLength = 700; 
var downRaycasterTestLength = 70;

var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

import { Fire, params } from '/forms/fire.js' 

export class SceneController {

    constructor(heroTemplate, layout, eventDepot, allObjects) {

        this.hero = new Hero(heroTemplate, eventDepot); // Eventually use FormFactory to create hero
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
        this.sprites = [];

        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);

        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.equipItem = this.equipItem.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        
        this.addEventListeners();
    }

    animateScene() {
        this.scene = new Scene(this);
        this.scene.init(() => {

            this.addFloor(() => {
                this.seedObjects3D();
                this.addHero3D();
                this.addLights();
                this.scene.animate();
            });
            
        });
    }

    deanimateScene(callback) {

        this.eventDepot.removeListener('takeItemFromScene', 'bound takeItemFromScene');
        this.eventDepot.removeListener('dropItemToScene', 'bound dropItemToScene');
        this.eventDepot.removeListener('equipItem', 'bound equipItem');
        this.eventDepot.removeListeners('mouse0click');
        

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

    takeItemFromScene(data) {
        this.removeFromScenebyUUID(data.uuid);
        this.eventDepot.fire('removeItemFromLayout', data.uuid);
    }

    dropItemToScene(data) {
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
    }

    equipItem(data) {

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
                        break;
                    default:
                }

            } 
            
            this.hero.model.getObjectByName(area).add(item);
            
        });
    }

    addEventListeners() {

        this.eventDepot.addListener('takeItemFromScene', this.takeItemFromScene);
        this.eventDepot.addListener('dropItemToScene', this.dropItemToScene);
        this.eventDepot.addListener('equipItem', this.equipItem)
        this.eventDepot.addListener('mouse0click', () => {
            let mixers = this.mixers;
                if (mixers.hero && mixers.hero.selectedObject) {

                let thisObj = mixers.hero.selectedObject;

                let objectName = this.getObjectName(thisObj);
                let objectType = this.getObjectType(thisObj);
                
                if (objectType == "item") {
                    this.eventDepot.fire('takeItemFromScene', {itemName: objectName, uuid: thisObj.uuid});

                } else if (objectType == "friendly") {
                    
                    // TODO: conversation
                    this.eventDepot.fire('unlockControls', {});
                    this.eventDepot.fire('modal', { name: objectName });
                
                } else if (objectType == "beast") {

                    // TODO: combat
                    this.fadeToAction("hero", "Punch", 0.2)

                } else if (objectType == "structure") {
                    
                    var accessible = thisObj.attributes.key ? 
                        this.hero.inventory.map(el => {
                            return el? el.itemName: null;
                        }).includes(thisObj.attributes.key) :
                        true;
                    
                    if (accessible) {
                        this.updateStructureAttributes(thisObj, {unlocked: true});
                        if (mixers[thisObj.uuid] && mixers[thisObj.uuid].activeAction) {
                            this.runActiveAction(thisObj.uuid, 0.2);
                        }
                    }
                }
            }
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

            return -1;
            // console.error(`DEBUG for 'Cannot read property 'distance'...  FLOOR:`)
            // console.error(this.floor);
            // console.error(`${name} = ${x},${z}`);
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
            
            let newYposition = this.determineElevationGeneric(entity.position.x, entity.position.z, uniqueId);

            while (newYposition == -1) { // move toward center until ground found
                entity.position.x = this.shiftTowardCenter(entity.position.x);
                entity.position.z = this.shiftTowardCenter(entity.position.rotateZ);
                newYposition = this.determineElevationGeneric(entity.position.x, entity.position.z, uniqueId);
            }
            entity.position.y = newYposition;
            
        }
    }

    shiftTowardCenter(value) {
        if (value != 0) {
            if (value > 0) {
                return value--;
            } else return value++;
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


    getSprite(name, spriteNumber, frames) {
        
        let spriteMap = new THREE.TextureLoader().load( '/models/png/' + name + '.png' );
        // How much a single repetition of the texture is offset from the beginning
        spriteMap.offset = {x: 1 / frames * spriteNumber, y: 0};
        // How many times the texture is repeated across the surface
        spriteMap.repeat = {x: 1 / frames, y: 1};

        var spriteMaterial = new THREE.SpriteMaterial({
            opacity: 1,
            transparent: true,
            map: spriteMap,
            rotation: Math.PI
        });

        var sprite = new THREE.Sprite(spriteMaterial);
        this.sprites.push({ sprite, frames });
        return sprite;
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

    setToRenderDoubleSided(object) {


        if (object.material) {
            if (object.material.name != "Roof") { 
                object.material.side = THREE.DoubleSide;
            } else {
                object.material.side = THREE.FrontSide;
            }
        }

        if (object.children) {
            object.children.forEach(e => this.setToRenderDoubleSided(e)); 
        }
    }

    addFloor(callback) {

        this.load(this.layout.terrain, (gltf) => {
            
            this.floor = gltf.scene;
            this.floor.objectName = "floor";
            this.floor.objectType = "floor"; 
            this.setToRenderDoubleSided(this.floor);

            this.addSconces(this.floor);
            this.scene.scene.add( this.floor );
            this.objects3D.push(this.floor);
            setTimeout(() => {
                callback();
            }, 200);
        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    addSconces = (object) => {
        if (/sconce/i.test(object.name)) {

            // let fireObj = this.getFire();
            // this.fireParams.Torch();

            let fireObj = this.getSprite("flame", 0, 40);
            fireObj.scale.set(.3, .4, .3);
            fireObj.translateY(.15);
            object.add(fireObj);

        } else {
            if (object.children) {
                object.children.forEach(el => {
                    this.addSconces(el);
                })
            }
        }
    }

    addLights() {

        if (this.layout.terrain.hemisphereLight) {
            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
            light.position.set( 0.5, 1, 0.75 );
            this.scene.scene.add( light );
        }

        if (this.layout.terrain.overheadPointLight) {
            this.overheadPointLight = new THREE.PointLight( 0xf37509, 15, 350, 3 );
            this.overheadPointLight.position.set( 0, 0, 0 );
            this.scene.scene.add( this.overheadPointLight );
        }
        
        this.proximityLight = new THREE.PointLight( 0x00ff00, 5, 250, 30 );
        this.proximityLight.position.set( 0, 0, 0 );
        this.scene.scene.add( this.proximityLight );

    }

    addHero3D = () => {

        this.load(this.hero, (gltf) => {
            let model = gltf.scene;
            
            this.hero.model = model;

            if (this.hero.equipped) {
                Object.keys(this.hero.equipped).forEach(bodyPart => {
                    this.eventDepot.fire('equipItem', {bodyPart, itemName: this.hero.equipped[bodyPart]});
                })
            }

            let controlsObj = this.scene.controls.getObject();

            // Adjustments for hero:
            model.rotation.y = Math.PI;

            // Set hero location:
            controlsObj.translateX( this.hero.location.x * multiplier );
            controlsObj.translateZ( this.hero.location.z * multiplier );
            controlsObj.translateY( this.determineElevationGeneric(
                this.hero.location.x * multiplier, this.hero.location.z * multiplier, "hero")
            );
            
            controlsObj.attributes = this.hero.attributes;
            controlsObj.add( model );

            this.createMixer( model, gltf.animations, "hero" );
            
            this.updateHeroLocation(true);
            this.updateHeroStats();

        })
    }

    updateHeroStats = () => {

        Object.keys(this.hero.attributes.stats).forEach(stat => {
            
            let points = this.hero.attributes.stats[stat].split('/')
            let cur = points[0];
            let max = points[1];

            this.eventDepot.fire('setHeroStatMax', { type: stat, points: max});
            this.eventDepot.fire('setHeroStat', { type: stat, points: cur});

        })

        this.eventDepot.fire('showHeroStats', {});
        
    }

    // Calculate hero location using grid coordinates
    updateHeroLocation = (offset = false) => {

        let { x, y, z } = this.scene.controls.getObject().position;
        
        if (offset) {
            z = z + (z < 0) ? 20 : -20;
            x = x + (x < 0) ? 20 : -20;
        }

        this.eventDepot.fire('updateHeroLocation', { x: x / multiplier, y, z: z / multiplier });

        this.mixers.hero.velocity.x = 0;
        this.mixers.hero.velocity.z = 0;

    }

    seedObjects3D = () => {
        this.layout.items.forEach(item => this.seedObject3D(item));
        this.layout.structures.forEach(structure => this.seedObject3D(structure));
        this.layout.entities.forEach(entity => this.seedObject3D(entity));
        this.eventDepot.fire('cacheLayout', {});

    }

    /** 
     * Create 3D representation of each object:
     */ 
    seedObject3D = (object) => {

        this.load(object, (gltf) => {

            let model = gltf.scene;

            object.uuid = model.uuid;
            model.position.x = object.location.x * multiplier;
            model.position.z = object.location.z * multiplier;
            model.position.y = this.determineElevationGeneric(model.position.x, model.position.z,object.name) + object.attributes.elevation;
            
            if (object.attributes.animates) {
                this.createMixer( model, gltf.animations, model.uuid );
                if (object.attributes.unlocked) {
                    this.mixers[model.uuid].activeAction.play();
                }
            }

            if (object.attributes.contentItems) {
                object.attributes.contentItems.forEach(contentItem => {
                    this.load(contentItem, (iGltf) => {
                        let iModel = iGltf.scene;
                        iModel.position.x = model.position.x;
                        iModel.position.z = model.position.z;
                        iModel.position.y = model.position.y + contentItem.attributes.elevation;
                        this.objects3D.push( iModel );
                        this.scene.scene.add( iModel );
                    })
                });
            }

            this.objects3D.push( model );
            this.scene.scene.add( model );

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

            mixerObj = {
                ...mixerObj,
                moves: true,
                absVelocity: 0,
                direction: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                downRaycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength ),
                movementRaycaster: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, model.attributes.length/2 + 20 ),
                justJumped: false,
                standingUpon: null,
                canJump: true,
                selectedObject: null,
            }

            // Add side raycasters for AIs for enhanced movement
            if (uniqueId != "hero") {
                mixerObj.movementRaycasterR = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, model.attributes.width/2 + 20 )
                mixerObj.movementRaycasterL = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, model.attributes.width/2 + 20 )
            }

            mixerObj.activeAction.play();
            
        }

        this.mixers[uniqueId] = mixerObj;
    }

    handleMixers(delta) {
        if ( this.mixers ) {

            let mixers = this.mixers;
            Object.keys(mixers).forEach(key => {
                

                if (mixers[key].moves) {
                    mixers[key].absVelocity = Math.max(Math.abs(mixers[key].velocity.x), Math.abs(mixers[key].velocity.z));

                    if (mixers[key].absVelocity < .1 && (mixers[key].activeActionName == 'Walking' || mixers[key].activeActionName == 'Running')) {
                        this.fadeToAction( key, 'Idle', 0.2);
                    } else if (mixers[key].absVelocity >= .1 && mixers[key].activeActionName == 'Idle') {
                        this.fadeToAction( key, 'Walking', 0.2);
                    } else if (mixers[key].absVelocity >= 199 && mixers[key].activeActionName == 'Walking') {
                        this.fadeToAction( key, 'Running', 0.2);
                    }
                }

                mixers[key].mixer.update( delta );
            })
        }
    }

    identifySelectedObject(heroObj) {

        this.proximityLight.rotation.copy(heroObj.rotation);
        this.proximityLight.position.copy(heroObj.position);
        this.proximityLight.translateZ(-40);
        this.proximityLight.translateY(40);

        // console.table(this.proximityLight.position);

        let closest = Infinity;

        this.objects3D.forEach(o => {
            let distance = o.position.distanceTo(this.proximityLight.position);
            if (distance <= 50 && distance < closest) {
                // If the object is unlocked, exclude to allow selecting the contents
                if (!o.attributes.contentItems || (o.attributes.contentItems && !o.attributes.unlocked))  {
                    closest = distance;
                    this.mixers.hero.selectedObject = o;
                    this.eventDepot.fire('showDescription', { objectType: this.getObjectType(o), objectName: this.getObjectName(o) }); 
                }
            }
        })

        if (closest > 50) {
            this.mixers.hero.selectedObject = null;
            this.eventDepot.fire('hideDescription', {}); 
        }

    }

    handleHeroMovement(delta) {

        if (this.mixers.hero) {

            let heroObj = this.scene.controls.getObject();

            // INERTIA
            this.mixers.hero.velocity.x -= this.mixers.hero.velocity.x * 10.0 * delta;
            this.mixers.hero.velocity.z -= this.mixers.hero.velocity.z * 10.0 * delta;
            this.mixers.hero.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            this.mixers.hero.direction.z = Number( this.scene.moveForward ) - Number( this.scene.moveBackward );
            this.mixers.hero.direction.x = Number( this.scene.moveLeft ) - Number( this.scene.moveRight );
            this.mixers.hero.direction.normalize(); // this ensures consistent movements in all directions
            
            let agility = this.hero.attributes.stats.agility.substring(0,2);

            if ( this.scene.moveForward || this.scene.moveBackward ) this.mixers.hero.velocity.z -= this.mixers.hero.direction.z * 1000.0 * agility * delta;
            if ( this.scene.moveLeft || this.scene.moveRight ) this.mixers.hero.velocity.x -= this.mixers.hero.direction.x * 1000.0 * agility * delta;

            this.identifySelectedObject(heroObj);
            this.handleMovement( "hero", heroObj, delta );
            
            if (this.mixers.hero.standingUpon && this.mixers.hero.standingUpon.attributes.routeTo && typeof this.mixers.hero.standingUpon.attributes.routeTo.level == "number") {
                if (this.mixers.hero.standingUpon.attributes.unlocked) {
                    
                    this.eventDepot.fire('cacheLayout', {});

                    let loadData = {

                        level: this.mixers.hero.standingUpon.attributes.routeTo.level,
                        location: this.mixers.hero.standingUpon.attributes.routeTo.location,
                    }

                    this.eventDepot.fire('loadLevel', loadData);
                }
            }

            this.scene.handleAutoZoom();

            if (this.layout.terrain.overheadPointLight) {
                this.overheadPointLight.position.copy(heroObj.position);
                this.overheadPointLight.rotation.copy(heroObj.rotation);
                this.overheadPointLight.position.y = heroObj.position.y + 60;
                this.overheadPointLight.translateZ(-80);
            }
        }
    }

    handleEntityMovement(delta) {
        this.objects3D.filter(el => el.objectType == 'friendly' || el.objectType == 'beast').forEach(entity => {
            
            if (this.mixers[entity.uuid]) {
            
                // Make a random rotation (yaw)
                entity.rotateY(getRndInteger(-5,5)/100);
                
                // GRAVITY
                this.mixers[entity.uuid].velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
                this.mixers[entity.uuid].velocity.z = getRnd(.2,entity.attributes.stats.agility.substring(0,2)) * 100;

                // Basic movement always in the z-axis direction for this entity
                this.mixers[entity.uuid].velocity.x = 0;
                this.mixers[entity.uuid].direction.z = 0.2; // getRnd(0,.2);

                this.handleMovement(entity.uuid, entity, delta);
            }
        });
    }


    /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    handleMovement = ( uniqueId, entity, delta ) => {

        var yAxisRotation = new THREE.Euler( 0, entity.rotation.y, 0, 'YXZ' );
        let worldDirection = new THREE.Vector3().copy(this.mixers[uniqueId].direction).applyEuler( yAxisRotation );
        
        let mRaycaster = this.mixers[uniqueId].movementRaycaster;
        mRaycaster.ray.origin.copy( entity.position );
        mRaycaster.ray.origin.y += entity.attributes.height;
        mRaycaster.ray.direction.x = worldDirection.x;
        mRaycaster.ray.direction.z = worldDirection.z;
        
        if (uniqueId == "hero") { // hero's direction is 180 reversed
        
            mRaycaster.ray.direction.x = - mRaycaster.ray.direction.x;
            mRaycaster.ray.direction.z = - mRaycaster.ray.direction.z;

            // Can I avoid the filter here using object attributes.length and width as the starting point for the ray?
            let fIntersects = mRaycaster.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);
            
            if (fIntersects.length == 0) {

                entity.translateX( this.mixers[uniqueId].velocity.x * delta );
                entity.translateY( this.mixers[uniqueId].velocity.y * delta );
                entity.translateZ( this.mixers[uniqueId].velocity.z * delta );          
    
            } else {
    
                console.log(`Hero fIntersects:`);
                console.dir(fIntersects[0]);
                this.mixers[uniqueId].velocity.x = 0;
                this.mixers[uniqueId].velocity.y = 0;
                this.mixers[uniqueId].velocity.z = 0;

                this.scene.helper.position.copy(fIntersects[0].point);
            }

        } else { // handle side raycasters for AI's

            // movementIntersects = movementIntersects.sort((a,b) => a.distance < b.distance);
            let worldDirectionL = new THREE.Vector3(1,0,0).applyEuler( yAxisRotation );
        
            let mRaycasterL = this.mixers[uniqueId].movementRaycasterL;
            mRaycasterL.ray.origin.copy( entity.position );
            mRaycasterL.ray.origin.y += entity.attributes.height;
            mRaycasterL.ray.direction.x = worldDirectionL.x;
            mRaycasterL.ray.direction.z = worldDirectionL.z;

            let worldDirectionR = new THREE.Vector3(-1,0,0).applyEuler( yAxisRotation );
        
            let mRaycasterR = this.mixers[uniqueId].movementRaycasterR;
            mRaycasterR.ray.origin.copy( entity.position );
            mRaycasterR.ray.origin.y += entity.attributes.height;
            mRaycasterR.ray.direction.x = worldDirectionR.x;
            mRaycasterR.ray.direction.z = worldDirectionR.z;

            // Can I avoid the filter here using object attributes.length and width as the starting point for the ray?
            let fIntersects = mRaycaster.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);
            let rIntersects = mRaycasterR.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);
            let lIntersects = mRaycasterL.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);

            if (fIntersects.length == 0) {
                entity.translateZ( this.mixers[uniqueId].velocity.z * delta );
            } else {

                console.log(`${entity.objectName} fIntersects:`);
                console.dir(fIntersects[0]);
                this.mixers[uniqueId].velocity.z = 0;
                entity.rotateY(Math.PI);
                this.scene.helper.position.copy(fIntersects[0].point);
                this.scene.helper.material.color = { r: 0, g: 0, b: 1 };
            }

            if (rIntersects.length != 0 && lIntersects.length != 0) {
                // If intersections are both on left and right, stay the course.
            } else {
                if (rIntersects.length != 0) {
                    entity.translateX( 2 );
                    console.log(`${entity.objectName} rIntersects:`);
                    console.dir(rIntersects[0]);
                    this.scene.helper.position.copy(rIntersects[0].point);
                    this.scene.helper.material.color = { r: 1, g: 0, b: 0 };
                }
                
                if (lIntersects.length != 0) {
                    entity.translateX( -2 );       
                    console.log(`${entity.objectName} lIntersects:`);
                    console.dir(lIntersects[0]);
                    this.scene.helper.position.copy(lIntersects[0].point);
                    this.scene.helper.material.color = { r: 0, g: 1, b: 0 };
                }  

            }



            entity.translateY( this.mixers[uniqueId].velocity.y * delta );
        }

        this.setElevation( uniqueId, entity );

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

    updateStructureAttributes = (object, payload) =>  {
        object.attributes = {...object.attributes, ...payload};
        this.eventDepot.fire('updateStructureAttributes', {uuid: object.uuid, attributes: payload});
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