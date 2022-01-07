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

import { Fire, params } from '/forms/fire.js' 

export class SceneController {

    constructor(heroTemplate, layout, eventDepot, allObjects) {
        
        this.layout = layout;
        this.heroTemplate = heroTemplate;
        this.eventDepot = eventDepot;
        this.allObjects = allObjects;

        this.formFactory = new FormFactory(this);
        this.loader = new THREE.GLTFLoader();

        this.forms = [];

        this.scene = null;
        this.floor = null;

        this.fireParams = params;


        // To be removed:
        this.objects3D = [];
        this.sprites = [];

        // Bindings:
        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.seedObjects3D = this.seedObjects3D.bind(this);
        
        
        
        this.addEventListeners();
    }

    animateScene() {

        this.scene = new Scene(this);
        this.scene.init(() => {
            this.addFloor(() => {

                // this.seedObjects3D();
                this.addLights();
                this.addHero3D(() => {
                    this.scene.animate();
                });
            });
            
        });
    }

    addToScene(form) {
        this.scene.add( form.model );
        this.forms.push( form );
    }

    addFloor(callback) {

        this.floor = this.formFactory.newForm("floor", this.layout.terrain);
        this.floor.load(() => {
            this.addToScene(this.floor);
            callback();
        });

        // setTimeout(() => {
        // }, 200);
    }

    addLights() {

        if (this.layout.terrain.hemisphereLight) {
            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, .75 );
            light.position.set( 0.5, 1, 0.75 );
            this.scene.add( light );
        }

        if (this.layout.terrain.overheadPointLight) {
            this.overheadPointLight = new THREE.PointLight( 0xf37509, 15, 350, 3 );
            this.overheadPointLight.position.set( 0, 0, 0 );
            this.scene.add( this.overheadPointLight );
        }

        // Proximity Light is used for object selection/identification
        this.proximityLight = new THREE.PointLight( 0x00ff00, 5, 250, 30 );
        this.proximityLight.position.set( 0, 0, 0 );
        this.scene.add( this.proximityLight );
    }

    addHero3D(callback) {

        this.hero = this.formFactory.newForm("hero", this.heroTemplate);

        this.hero.load(() => {
            
            this.hero.controls = this.scene.controls.getObject();

            // Adjustments for hero:
            this.hero.model.rotation.y = Math.PI;

            // Set hero location:
            this.hero.controls.translateX( this.hero.location.x * multiplier );
            this.hero.controls.translateZ( this.hero.location.z * multiplier );
            // this.hero.controls.translateY( this.determineElevationFromBase(
            //     this.hero.location.x * multiplier, this.hero.location.z * multiplier, "hero")
            // );
            
            this.hero.controls.attributes = this.hero.attributes;
            this.hero.controls.add( this.hero.model );
            
            this.hero.controls.objectName = this.hero.name;
            this.hero.controls.objectType = "hero";
            this.forms.push( this.hero );

            this.eventDepot.fire('haltMovement', {});
            this.eventDepot.fire('updateHeroLocation', { location: this.hero.location, offset: true });
            
            this.hero.updateHeroStats();

            callback();

        })
    }

    handleMovement(delta) {
        this.forms.forEach(form => {
            if (form.moves) {

                let otherForms = this.forms.filter(el => el != form);
                form.move(otherForms, delta);
            }

            if (form.animations && form.animations.length != 0) {
                form.animate(delta);
            }
            
        })

        this.identifySelectedObject(this.scene.controls.getObject());
        
        let nonHeroModels = this.forms.filter(el => el.type != "hero").map(el => el.model);
        this.scene.handleAutoZoom(nonHeroModels);
    }

    identifySelectedObject(controlsObject) {

        if (this.layout.terrain.overheadPointLight) {
            this.overheadPointLight.position.copy(controlsObject.position);
            this.overheadPointLight.rotation.copy(controlsObject.rotation);
            this.overheadPointLight.position.y = controlsObject.position.y + 60;
            this.overheadPointLight.translateZ(-80);
        }

        this.proximityLight.rotation.copy(controlsObject.rotation);
        this.proximityLight.position.copy(controlsObject.position);
        this.proximityLight.translateZ(-40);
        this.proximityLight.translateY(40);

        let closest = Infinity;

        this.objects3D.forEach(o => {
            let distance = o.position.distanceTo(this.proximityLight.position);
            if (distance <= 50 && distance < closest) {
                // If the object is unlocked, exclude to allow selecting the contents
                if (!o.attributes.contentItems || (o.attributes.contentItems && !o.attributes.unlocked))  {
                    closest = distance;
                    this.hero.selectedObject = o;
                    this.eventDepot.fire('showDescription', { objectType: getObjectType(o), objectName: getObjectName(o) }); 
                }
            }
        })

        if (closest > 50) {
            this.hero.selectedObject = null;
            this.eventDepot.fire('hideDescription', {}); 
        }

    }

    deanimateScene(callback) {

        this.eventDepot.removeListener('takeItemFromScene', 'bound takeItemFromScene');
        this.eventDepot.removeListener('dropItemToScene', 'bound dropItemToScene');

        this.scene.unregisterEventListeners();
        this.scene.deanimate(() => {

            this.scene = null;
            this.objects3D.forEach(obj3D => {
                obj3D.dispose();
            })
            callback();
        });

    }

    removeFromScenebyUUID(uuid) {

        this.scene.removeFromScenebyUUID(uuid);
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
            model.position.y = this.determineElevationFromBase(model.position.x, model.position.y, data.itemName) + object.attributes.elevation;
            this.scene.add(model);
            this.addToObjects3D(model);

            data.uuid = model.uuid;
            this.eventDepot.fire('addItemToLayout', data);
        })
    }

    addEventListeners() {

        this.eventDepot.addListener('takeItemFromScene', this.takeItemFromScene);
        this.eventDepot.addListener('dropItemToScene', this.dropItemToScene);
        
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
            model.position.y = this.determineElevationFromBase(model.position.x, model.position.z,object.name) + object.attributes.elevation;
            
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
                        this.scene.add( iModel );
                    })
                });
            }

            this.objects3D.push( model );
            this.scene.add( model );

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    updateStructureAttributes = (object, payload) =>  {
        object.attributes = {...object.attributes, ...payload};
        this.eventDepot.fire('updateStructureAttributes', {uuid: object.uuid, attributes: payload});
    }

}