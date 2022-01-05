import { Scene } from '/scene/scene.js';
import { FormFactory } from '/forms/formFactory.js';

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

import { Fire, params } from '/forms/fire.js' 

export class SceneController {

    constructor(heroTemplate, layout, eventDepot, allObjects) {
        
        this.layout = layout;
        this.heroTemplate = heroTemplate;
        this.eventDepot = eventDepot;
        this.allObjects = allObjects;

        this.formFactory = new FormFactory(eventDepot);
        this.forms = [];

        this.scene = null;
        this.floor = null;

        this.upRaycasterGeneric = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, upRaycasterTestLength);
        this.downRaycasterGeneric = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength);

        this.fireParams = params;


        // To be removed:
        this.objects3D = [];
        this.sprites = [];

        // Bindings:
        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.equipItem = this.equipItem.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        
        this.hero = this.formFactory.newForm("hero", this.heroTemplate);
        
        this.addEventListeners();
    }

    animateScene() {

        this.scene = new Scene(this);
        this.scene.init(() => {
            this.addFloor(() => {
                // this.seedObjects3D();
                this.addHero3D();
                this.addLights();
                this.scene.animate();
            });
            
        });
    }

    addFloor(callback) {

        this.floor = this.formFactory.newForm("floor", this.layout.terrain);
        this.floor.load(() => {
            this.addToScene(this.floor.model);
            callback();
        });

        // setTimeout(() => {
        // }, 200);
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

        this.hero.load(() => {
            // this.addToScene(this.hero.model);

            if (this.hero.equipped) {
                Object.keys(this.hero.equipped).forEach(bodyPart => {
                    this.eventDepot.fire('equipItem', {bodyPart, itemName: this.hero.equipped[bodyPart]});
                })
            }

            let controlsObj = this.scene.controls.getObject();

            // Adjustments for hero:
            this.hero.model.rotation.y = Math.PI;

            // Set hero location:
            controlsObj.translateX( this.hero.location.x * multiplier );
            controlsObj.translateZ( this.hero.location.z * multiplier );
            controlsObj.translateY( this.determineElevationGeneric(
                this.hero.location.x * multiplier, this.hero.location.z * multiplier, "hero")
            );
            
            controlsObj.attributes = this.hero.attributes;
            controlsObj.add( this.hero.model );

            this.updateHeroLocation(true);
            this.updateHeroStats();

        })
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

    addToScene(model) {

        this.scene.scene.add( model );
        this.forms.push( model );

    }

    removeFromScenebyUUID(uuid) {

        this.scene.scene.remove(this.scene.scene.children.find(el => {
            return el.uuid == uuid;
        }));

        this.forms = this.forms.filter(el => {
            return el.uuid != uuid;
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
        this.loadFormbyName(data.itemName, (gltf) => {
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
        this.loadFormbyName(data.itemName, (itemGltf) => {

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
        

        if (this.upRaycasterGeneric.intersectObject(this.floor.model, true)[0]) {
            let distanceFromBase = this.upRaycasterGeneric.intersectObject(this.floor.model, true)[0].distance;

            this.downRaycasterGeneric.ray.origin.copy (this.upRaycasterGeneric.ray.origin);
            this.downRaycasterGeneric.ray.origin.y += (distanceFromBase + yOffset);
            
            let distanceFromAbove = this.downRaycasterGeneric.intersectObject(this.floor.model, true)[0].distance;
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

    /** This method will not set the position of the object3D, nor create a GUI.
     * The return object 'gltf' will have a model (scene) and animations if applicable.
     */
    loadFormbyName(objectName, callback) {

        let object = this.getObjectByName(objectName);
        this.formFactory.load( object, (gltf) => {
            callback(gltf);
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

        this.formFactory.load(object, (gltf) => {

            let model = gltf.scene;

            object.uuid = model.uuid;
            model.position.x = object.location.x * multiplier;
            model.position.z = object.location.z * multiplier;
            model.position.y = this.determineElevationGeneric(model.position.x, model.position.z,object.name) + object.attributes.elevation;
            
            // // Set movable objects rotation to 180 to match the Hero
            // if (object.attributes.moves) {
            //     model.rotation.y = Math.PI;
            // }

            if (object.attributes.animates) {
                this.createMixer( model, gltf.animations, model.uuid );
                if (object.attributes.unlocked) {
                    this.mixers[model.uuid].activeAction.play();
                }
            }

            if (object.attributes.contentItems) {
                object.attributes.contentItems.forEach(contentItem => {
                    this.formFactory.load(contentItem, (iGltf) => {
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

    handleAnimated(delta) {

    }

    handleHeroMovement(delta) {
        this.hero.handleMovement(delta, this.objects3D);
    }

}