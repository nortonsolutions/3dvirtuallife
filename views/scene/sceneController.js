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

        // Structure models tracked for basic collisions
        this.structureModels = [];

        // Entities tracked for combat/convo/collision
        this.entities = [];
        
        this.scene = null;
        this.floor = null;

        this.sprites = [];

        // Bindings:
        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.seedFormsAll = this.seedFormsAll.bind(this);
        
        this.addEventListeners();
    }

    animateScene() {

        this.scene = new Scene(this);
        this.scene.init(() => {
            this.addFloor(() => {
                this.addLights();
                this.addHero(() => {
                    this.seedFormsAll().then(layouts => {
                        this.eventDepot.fire('formsFinished', layouts);
                        this.scene.animate();
                    })
                });
            });
            
        });
    }

    addToScene(form) {
        
        /* Hero is special case already added to scene via controls */
        if (form.objectType != "hero") this.scene.add( form.model );

        this.forms.push( form );

        if (form.objectType == "hero" || form.objectType == "friendly" || form.objectType == "beast") {
            this.entities.push( form );
        } else if (form.objectType == "floor" || form.objectType == "structure") {
            this.structureModels.push ( form.model );
        }
    }

    addFloor(callback) {

        this.floor = this.formFactory.newForm("floor", this.layout.terrain);
        this.floor.load(() => {

            this.formFactory.addSconces(this.floor.model);

            this.addToScene(this.floor);
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

    }

    addHero(callback) {

        this.hero = this.formFactory.newForm("hero", this.heroTemplate, this.scene.controls.getObject());
        
        this.hero.load(() => {

            this.addToScene( this.hero );

            this.eventDepot.fire('halt', {});
            this.eventDepot.fire('updateHeroLocation', { location: this.hero.location, offset: true });
            
            this.hero.updateHeroStats();

            callback();

        })
    }

    seedFormsAll() {

        var promiseArray = [];
        let items = this.seedForms("items");
        let structures = this.seedForms("structures");
        let entities = this.seedForms("entities");
        
        promiseArray.push(items);
        promiseArray.push(structures);
        promiseArray.push(entities);

        return Promise.all(promiseArray)
    
    }

    seedForms(type) {
        return new Promise((resolve, reject) => {

            let remaining = this.layout[type].length;
            for (let index = 0; index < this.layout[type].length; index++) {
                this.seedForm(this.layout[type][index]).then(form => {
                    this.layout[type][index].uuid = form.model.uuid;

                    remaining--;
                    if (remaining == 0) resolve(this.layout[type])

                });
            }
        })
    }

    /** 
     * Load 3D model of each form and add to scene.
     */ 
    seedForm(formTemplate) {

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

                this.addToScene(form);
    
                if (form.attributes.contentItems) {
                    form.attributes.contentItems.forEach(contentItem => {
    
                        this.loadFormbyName(contentItem.name, (contentForm) => {
                            contentForm.model.position.x = form.model.position.x;
                            contentForm.model.position.z = form.model.position.z;
                            contentForm.model.position.y = form.model.position.y + contentItem.attributes.elevation;
                            this.addToScene(contentForm);
                        })
                    });
                }
    
                resolve(form);
            });
                
        })
    }



    handleMovement(delta) {

        this.hero.move(delta);
        this.hero.animate(delta);

        this.forms.forEach(form => {
            if (form.attributes.moves) {
                form.move(delta);
            }

            if (form.attributes.animates) {
                form.animate(delta);
            }
            
        })

        if (this.layout.terrain.overheadPointLight) {
            let controlsObject = this.scene.controls.getObject();
            this.overheadPointLight.position.copy(controlsObject.position);
            this.overheadPointLight.rotation.copy(controlsObject.rotation);
            this.overheadPointLight.position.y = controlsObject.position.y + 60;
            this.overheadPointLight.translateZ(-80);
        }

        this.scene.handleAutoZoom();
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

    loadFormbyName(formName, callback) {

        let formTemplate = this.getObjectByName(formName);
        this.seedForm(formTemplate).then(form => {
            callback(form);
        })
    }

}