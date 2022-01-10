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
        
        // layout is shared by SceneController and LayoutManager
        this.layout = layout;
        this.heroTemplate = heroTemplate;
        this.eventDepot = eventDepot;
        this.allObjects = allObjects;

        this.formFactory = new FormFactory(this);
        this.loader = new THREE.GLTFLoader();

        this.forms = [];
        this.nonHeroForms = [];
        this.nonHeroModels = []; // this.forms.filter(el => el.objectType != "hero").map(el => el.model);

        this.scene = null;
        this.floor = null;

        this.fireParams = params;

        this.sprites = [];

        // Bindings:
        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.seedForms = this.seedForms.bind(this);
        
        this.addEventListeners();
    }

    animateScene() {

        this.scene = new Scene(this);
        this.scene.init(() => {
            this.addFloor(() => {
                this.addLights();
                this.addHero(() => {
                    this.seedForms(() => {
                        this.scene.animate();
                    });
                });
            });
            
        });
    }

    addToScene(form, addToForms) {
        this.scene.add( form.model );
        if (addToForms) {
            this.forms.push( form );
        }
    }

    addFloor(callback) {

        this.floor = this.formFactory.newForm("floor", this.layout.terrain);
        this.floor.load(() => {

            this.formFactory.addSconces(this.floor.model);
            
            this.addToScene(this.floor, true);
            // setTimeout(() => {
                callback();
            // }, 500);
        });
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

    addHero(callback) {

        this.hero = this.formFactory.newForm("hero", this.heroTemplate, this.scene.controls.getObject());
        
        this.hero.load(() => {

            this.forms.push( this.hero );

            this.eventDepot.fire('halt', {});
            this.eventDepot.fire('updateHeroLocation', { location: this.hero.location, offset: true });
            
            this.hero.updateHeroStats();

            callback();

        })
    }

    seedForms(callback) {
        this.layout.items.forEach((item,index) => {
            this.seedForm(item, true).then(form => {
                this.layout.items[index].uuid = form.model.uuid;
            });
        });

        this.layout.structures.forEach((structure, index) => {
            this.seedForm(structure, true).then(form => {
                this.layout.structures[index].uuid = form.model.uuid;
            });
        });

        // this.layout.entities.forEach(entity => this.seedObject3D(entity));
        this.eventDepot.fire('cacheLayout', {});

        callback();
    }

    /** 
     * Create 3D representation of each object:
     */ 
    seedForm(formTemplate, addToForms) {

        var form;
        if (formTemplate.attributes.moves) {
            form = this.formFactory.newForm("artificial", formTemplate);
        } else if (formTemplate.attributes.animates) {
            form = this.formFactory.newForm("animated", formTemplate);
        } else {
            form = this.formFactory.newForm("standard", formTemplate);
        }

        return new Promise((resolve,reject) => {
            form.load(() => {

                this.addToScene(form, addToForms);
                
                if (form.objectType != "hero") {
                    this.nonHeroForms.push(form);
                    this.nonHeroModels.push(form.model);
                }
    
                if (form.attributes.contentItems) {
                    form.attributes.contentItems.forEach(contentItem => {
    
                        this.loadFormbyName(contentItem.name, true, (contentForm) => {
                            contentForm.model.position.x = form.model.position.x;
                            contentForm.model.position.z = form.model.position.z;
                            contentForm.model.position.y = form.model.position.y + contentItem.attributes.elevation;
                            this.addToScene(contentForm, true);
                        })
                    });
                }
    
                resolve(form);
            });
                
        })
    }



    handleMovement(delta) {
        this.forms.forEach(form => {
            if (form.attributes.moves) {

                let otherForms = this.forms.filter(el => el != form);
                form.move(otherForms, delta);
            }

            if (form.attributes.animates) {
                form.animate(delta);
            }
            
        })

        this.identifySelectedObject(this.scene.controls.getObject());

        this.nonHeroModels = this.forms.filter(el => el.objectType != "hero").map(el => el.model);
        this.scene.handleAutoZoom(this.nonHeroModels);
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

        this.forms.forEach(o => {
            let distance = o.model.position.distanceTo(this.proximityLight.position);
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

        this.hero.stop(() => {
            // this.hero = null;
            this.scene.unregisterEventListeners();
            this.scene.deanimate(() => {
    
                // this.scene = null;
                this.forms.forEach(form => {
                    if (form.model.dispose) form.model.dispose();
                })
                callback();
            });
        });



    }

    getObjectByName(name) {
        return this.allObjects[name];
    }

    /** data: {itemName: ..., uuid: ...} */
    takeItemFromScene(data) {

        this.scene.removeFromScenebyUUID(data.uuid);
        this.forms = this.forms.filter(el => {
            return el.model.uuid != data.uuid;
        });

        this.eventDepot.fire('removeItemFromLayout', data.uuid);
    }

    /** data: {location ..., itemName..., } */
    dropItemToScene(data) {
        
        let itemTemplate = this.getObjectByName(data.itemName);
        this.seedForm(itemTemplate, true).then(form => {

            form.model.position.copy(this.hero.model.position);
            form.model.position.y = this.hero.determineElevationFromBase();

            data.uuid = form.model.uuid;
            this.eventDepot.fire('addItemToLayout', data);
        })
    }

    addEventListeners() {

        this.eventDepot.addListener('takeItemFromScene', this.takeItemFromScene);
        this.eventDepot.addListener('dropItemToScene', this.dropItemToScene);
        
    }

    loadFormbyName(formName, addToForms = true, callback) {

        let formTemplate = this.getObjectByName(formName);
        this.seedForm(formTemplate, addToForms).then(form => {
            callback(form);
        })
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


}