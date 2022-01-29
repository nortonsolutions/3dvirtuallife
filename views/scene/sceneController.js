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

    constructor(heroTemplate, layout, eventDepot, allObjects, socket, firstInRoom, level) {
        
        // layout is shared by SceneController and LayoutManager
        this.layout = layout;
        this.layoutId = 0;

        this.heroTemplate = heroTemplate;
        this.eventDepot = eventDepot;
        this.allObjects = allObjects;
        this.socket = socket;
        this.firstInRoom = firstInRoom;
        this.level = level;

        this.formFactory = new FormFactory(this);
        this.loader = new THREE.GLTFLoader();

        this.forms = [];

        // Structure models tracked for basic collisions
        this.structureModels = [];

        // Artificial entities tracked for combat/convo/collision
        this.entities = [];

        // Other players tracked for movement, etc.
        this.others = [];
        
        this.scene = null;
        this.floor = null;

        this.sprites = [];
        this.projectiles = [];

        this.clock = new THREE.Clock();
        this.refractor = null;

        // Bindings:
        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.seedForms = this.seedForms.bind(this);

        this.multiplayer = false;
        this.addEventListeners();
    }

    introduce() {

        let layoutId = this.layoutId++; // pick the next layoutId to be used as uuid
        
        this.socket.emit('pullOthers', this.level, (response) => {
            if (response) {
                layoutId += response.length;
                this.seedOthers(response);
            }

            this.hero.attributes.layoutId = this.heroTemplate.attributes.layoutId = layoutId;
            let introData = { heroTemplate: this.heroTemplate, description: this.layout.description, level: this.level };
            this.socket.emit('introduce', introData);
        });
    }

    /** Accept an array of heroTemplates, calling seedForm for each one */
    seedOthers(others) {
        others.forEach(other => {
            other.subtype = "remote";
            this.seedForm(other);
        })
    }

    animateScene() {

        this.scene = new Scene(this);
        this.scene.init(() => {
            this.addFloor(() => {
                this.addWater(() => {
                    this.addLights();
                    this.addHero(() => {
                        this.seedForms(this.firstInRoom, () => {
                            this.introduce();
                            this.scene.animate();
                        })
                    });
                });
            });
        });
    }

    addEventListeners() {

        this.socket.on('multiplayer', (data) => {
            this.multiplayer = data;
        })

        /** setFirstInRoom happens if the previous first leaves the room and delegates the responsibility */
        this.socket.on('setFirstInRoom', () => {
            this.firstInRoom = true;
        })

        /** The introduction should include attributes.layoutId assigned by the introducer him/herself */
        this.socket.on('introduce', (heroTemplate) => {

            // set this.layoutId to one beyond the template, to stay current
            this.layoutId = heroTemplate.attributes.layoutId + 1;

            /** Accept heroTemplate and call seedForm(heroTemplate) */
            heroTemplate.subtype = "remote";
            this.seedForm(heroTemplate);
        })

        this.socket.on('updateEntityPositions', (entities) => {
            entities.forEach(entity => {
                // find the entity here by layoutId
                let localEntity = this.entities.find(el => el.attributes.layoutId == entity.layoutId);
                if (localEntity) {
                    let rotation = new THREE.Euler( entity.rotation._x, entity.rotation._y, entity.rotation._z, 'YXZ' );
                    localEntity.model.rotation.copy(rotation);
                    localEntity.velocity.copy(entity.velocity);
                    localEntity.model.position.copy(entity.position);
                }
            });
        });

        /** data: { layoutId: ..., rotation: ..., velocity: ..., position: ...} */
        this.socket.on('updateHeroPosition', (data) => {
            let other = this.others.find(el => el.attributes.layoutId == data.layoutId);
            if (other) {
                let rotation = new THREE.Euler( data.rotation._x, data.rotation._y, data.rotation._z, 'YXZ' );
                rotation.y += Math.PI;
                other.model.rotation.copy(rotation);
                other.velocity.copy(data.velocity);
                other.model.position.copy(data.position);
            }
        })

        this.eventDepot.addListener('takeItemFromScene', this.takeItemFromScene);
        this.eventDepot.addListener('dropItemToScene', this.dropItemToScene);
        
        this.eventDepot.addListener('querySC', (data) => {
        
            let {key, queryName, args} = data;
            let response = null;
        
            switch (queryName) {
                case 'getHeroCoordinates':
                    response = { 
                        x: this.hero.model.position.x.toFixed(2),
                        y: this.hero.model.position.y.toFixed(2),
                        z: this.hero.model.position.z.toFixed(2)
                    }
                    break;
            }
            
            this.eventDepot.fire('SCResponse' + key, response);
        })

        this.socket.on('updateEntityPosition', (data) => {
            // TODO: 
        });
    }



    addWater(callback) {
        if (this.layout.terrain.attributes.water) {
            this.refractor = null;
            this.waterElevation = this.layout.terrain.attributes.water.elevation;
            this.water = this.formFactory.newForm("water", this.layout.terrain.attributes.water);
            this.water.load(() => {
                this.addToScene(this.water, false);
                callback();
            });
        } else {
            callback();
        }
    }

    addToScene(form, addToForms = true, addToScene = true) {
        
        /* Hero is special case already added to scene via controls */
        if (addToScene) this.scene.add( form.model );
        if (addToForms) this.forms.push( form );

        if (form.objectSubtype == "remote") {
            this.others.push( form );
        } else if (form.objectType == "friendly" || form.objectType == "beast") {
            this.entities.push( form );
        } else if (form.objectType == "floor" || form.objectType == "structure") {
            this.structureModels.push ( form.model );
        }
    }

    addFloor(callback) {

        this.floor = this.formFactory.newForm("floor", this.layout.terrain);
        this.floor.load(() => {
            this.formFactory.addSconces(this.floor.model);
            if (this.layout.terrain.attributes.borderTrees) {
                this.formFactory.addBorderTrees(this.scene, this.floor.model);
            }
            this.addToScene(this.floor);
            setTimeout(() => {
                callback();
            }, 500);
        });
    }

    addLights() {

        if (this.layout.terrain.attributes.light.sunLight) {
            
            var shadowConfig = {

                shadowCameraVisible: false,
                shadowCameraNear: 750,
                shadowCameraFar: 4000,
                shadowCameraFov: 90,
                shadowBias: - 0.008
    
            };

            var sunLight = new THREE.SpotLight( 0xffffff, 2, 0, Math.PI / 2 );
            sunLight.position.set( 500, 800, 500);

            sunLight.castShadow = true;

            sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( shadowConfig.shadowCameraFov, 1, shadowConfig.shadowCameraNear, shadowConfig.shadowCameraFar ) );
            sunLight.shadow.bias = shadowConfig.shadowBias;

            this.scene.add (sunLight );

            if (shadowConfig.shadowCameraVisible) {
                var shadowCameraHelper = new THREE.CameraHelper( sunLight.shadow.camera );
                shadowCameraHelper.visible = shadowConfig.shadowCameraVisible;

                this.scene.add( shadowCameraHelper );
            }
        }

        if (this.layout.terrain.attributes.light.overheadPointLight) {
            this.overheadPointLight = new THREE.PointLight( 0xf37509, 5, 350, 3 );
            this.overheadPointLight.position.set( 0, 0, 0 );
            this.scene.add( this.overheadPointLight );
        }
    }

    addHero(callback) {

        this.hero = this.formFactory.newForm("hero", this.heroTemplate, this.scene.controls.getObject());
        
        this.hero.load(() => {

            this.addToScene( this.hero, false, false );
            this.eventDepot.fire('halt', {});
            this.eventDepot.fire('updateHeroLocation', { location: this.hero.location, offset: true });
            
            Object.keys(this.hero.attributes.stats).forEach(stat => {
                this.hero.updateHeroStats(stat);
            })

            callback();
        })
    }

    seedForms(firstInRoom, callback) {

        // Pull layout with layoutIds assigned from leader // already done in layoutManager before load
        // if (!firstInRoom) this.socket.emit('pullLayout', this.level, data => { this.layout = data; });

        this.layout.items.forEach(({name,location,attributes},index) => {
            
            let item = this.getObjectByName(name);
            if (location) item.location = location;
            if (attributes) item.attributes = {...item.attributes, ...attributes};
            let layoutId = this.layoutId++;
            
            if (firstInRoom) {
                item.attributes.layoutId = layoutId;
                if (!this.layout.items[index].attributes) this.layout.items[index].attributes = {};
                this.layout.items[index].attributes.layoutId = layoutId; // form.model.uuid;
            }

            this.seedForm(item).then(form => {
                // form.model.attributes.layoutId = layoutId;
            });
        });

        this.layout.structures.forEach(({name,location,attributes}, index) => {
            let structure = this.getObjectByName(name);
            if (location) structure.location = location;
            if (attributes) structure.attributes = {...structure.attributes, ...attributes};
            
            let layoutId = this.layoutId++;
            if (firstInRoom) {
                structure.attributes.layoutId = layoutId;
                if (!this.layout.structures[index].attributes) this.layout.structures[index].attributes = {};
                this.layout.structures[index].attributes.layoutId = layoutId; // form.model.uuid;
            }
            this.seedForm(structure).then(form => {});
        });

        this.layout.entities.forEach(({name,location,attributes}, index) => {
            let entity = this.getObjectByName(name);
            if (location) entity.location = location;
            if (attributes) entity.attributes = {...entity.attributes, ...attributes};
            
            let layoutId = this.layoutId++;
            if (firstInRoom) {
                entity.attributes.layoutId = layoutId;
                if (!this.layout.entities[index].attributes) this.layout.entities[index].attributes = {};
                this.layout.entities[index].attributes.layoutId = layoutId; // form.model.uuid;
            }
            this.seedForm(entity).then(form => {});
        });


        if (firstInRoom) { // Update layouts with layoutIds assigned....
            this.socket.emit('pushLayout', {level: this.level, layout: this.layout });
        }

        this.eventDepot.fire('cacheLayout', {}); 
        callback();
    }

    /** 
     * Load model of each form and add to scene.
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

                if (form.attributes.sprites) {
                    form.attributes.sprites.forEach(spriteConfig => {
                        this.formFactory.addSpritesGeneric(form.model, spriteConfig.name, spriteConfig.regex, spriteConfig.frames, spriteConfig.scale, spriteConfig.elevation, spriteConfig.flip);
                    })
                }

                this.addToScene(form);

                if (form.attributes.contentItems) {
                    form.attributes.contentItems.forEach(contentItemName => {
                        let contentItem = this.getObjectByName(contentItemName);
                        contentItem.location = { x: 0, y: 20, z: 0 };
                        this.loadFormbyName(contentItem.name, (contentForm) => {

                            contentForm.model.position.x = form.model.position.x;
                            contentForm.model.position.z = form.model.position.z;
                            contentForm.model.position.y = form.model.position.y + contentItem.attributes.elevation;
                            contentForm.attributes.contained = true;
                            this.addToScene(contentForm);
                        })
                        resolve(form);

                    });
                } else {
                    resolve(form);
                }
    
            });
                
        })
    }


    handleMovement(delta) {

        if (this.hero) this.hero.move(delta);
        if (this.hero) this.hero.animate(delta);
        
        if (this.firstInRoom) { 
            // this.forms.forEach(form => {
            //     if (form.attributes.moves) {
            this.entities.forEach(entity => {  
                if (entity.objectSubType != "remote") entity.move(delta);
            });

            if (Math.random() < 0.5) { // Update others 50% of the time

                let positions = this.entities.map(el => {
                    return {
                        layoutId: el.attributes.layoutId,
                        position: el.model.position,
                        rotation: el.model.rotation,
                        velocity: el.velocity
                    }
                });
    
                this.socket.emit('updateEntityPositions', { level: this.level, positions });
            }

        }
        
        this.forms.forEach(form => {
            if (form.attributes.animates) {
                form.animate(delta);
            }
        });
        
        if (this.refractor) {
            this.refractor.material.uniforms[ "time" ].value += this.clock.getDelta();
        }

        if (this.overheadPointLight) {
            let controlsObject = this.scene.controls.getObject();
            this.overheadPointLight.position.copy(controlsObject.position);
            this.overheadPointLight.rotation.copy(controlsObject.rotation);
            this.overheadPointLight.position.y = controlsObject.position.y + 60;
            this.overheadPointLight.translateZ(-80);
        }

        if (this.hero && this.scene) this.scene.handleAutoZoom();

    }

    deanimateScene(callback) {

        this.eventDepot.removeListener('takeItemFromScene', 'bound takeItemFromScene');
        this.eventDepot.removeListener('dropItemToScene', 'bound dropItemToScene');

        if (this.hero) this.hero.stop(() => {
            this.hero = null;
        });

        if (this.scene) {
            this.scene.unregisterEventListeners();
            this.scene.deanimate(() => {
            });
        }

        if (this.forms) this.forms.forEach(form => {
            if (form.model.dispose) form.model.dispose();
        })

        callback();
    }

    getObjectByName(name) {
        return this.allObjects[name];
    }

    /** data: {itemName: ..., layoutId: ...} */
    takeItemFromScene(data) {

        this.scene.removeFromScenebyLayoutId(data.layoutId);
        this.forms = this.forms.filter(el => {
            return el.model.attributes.layoutId != data.layoutId;
        });

        this.eventDepot.fire('removeItemFromLayout', data.layoutId);
    }

    /** data: {location ..., itemName..., } */
    dropItemToScene(data) {
        
        let itemTemplate = this.getObjectByName(data.itemName);
        this.seedForm(itemTemplate).then(form => {

            form.model.position.copy(this.hero.model.position);
            form.model.position.y = this.hero.determineElevationFromBase();

            let layoutId = this.layoutId++;
            data.layoutId = form.model.attributes.layoutId = layoutId;
            this.eventDepot.fire('addItemToLayout', data);
        })
    }

    loadFormbyName(formName, callback) {

        let formTemplate = this.getObjectByName(formName);
        this.seedForm(formTemplate).then(form => {
            callback(form);
        })
    }

    allFriendliesInRange(range, position) { 
        var response = [];
        this.entities.filter(el => el.objectType != "beast").forEach(entity => {
            if (position.distanceTo(entity.model.position) < range) {
                response.push(entity);
            }
        })
        return response;
    }

    allEnemiesInRange(range, position) {
        var response = [];
        this.entities.filter(el => el.objectType == "beast").forEach(entity => {
            console.log(`distanceTo ${entity.objectName} is ${position.distanceTo(entity.model.position)}`);
            
            // apply height
            let enemyPosition = new THREE.Vector3();
            enemyPosition.copy(entity.model.position);
            enemyPosition.y += entity.attributes.height;
            
            if (position.distanceTo(enemyPosition) < range) {
                console.log(`in range`)
                response.push(entity);
            }
        })
        return response;
    }

    addToProjectiles(item) {

        // Starting direction
        let direction = this.scene.controls.getDirection(new THREE.Vector3( 0, 0, 0 ));
        direction.y += item.attributes.throwableAttributes.pitch;
        
        this.projectiles.push( {
            item,
            direction,
            velocity: new THREE.Vector3(),
            distanceTraveled: 0
        } );
        this.scene.add( item.model );
    }

}