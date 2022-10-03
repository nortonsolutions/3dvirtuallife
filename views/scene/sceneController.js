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
        this.points = [];
        this.materials = [];
        
        this.scene = null;
        this.floor = null;

        // Optional arrays to designate where NPC or Boss characters spawn
        this.floorNPClocations = [];
        this.floorBossLocations = [];

        // if (this.firstInRoom) this.layout.dayTime = Math.random() < .9;
        
        this.sprites = [];
        this.projectiles = [];

        // Bindings:
        this.addEventListeners = this.addEventListeners.bind(this);
        this.deanimateScene = this.deanimateScene.bind(this);
        this.takeItemFromScene = this.takeItemFromScene.bind(this);
        this.dropItemToScene = this.dropItemToScene.bind(this);
        this.seedForms = this.seedForms.bind(this);

        this.multiplayer = false;
        this.addEventListeners();

        // An array of waterSources -- [[{position},radius],[{position},radius]]
        this.waterSources = [];
        this.mineralSources = [];
        this.ponds = [];

        this.dayPhase = 0;
        this.countDowns = [];
        // this.refractors = [];
        // this.dudvMap = new THREE.TextureLoader().load( '/textures/waterdudv.jpg' );
        // this.dudvMap.wrapS = this.dudvMap.wrapT = THREE.RepeatWrapping;

        // proximity to nearest Hero to animate
        this.proximityToAnimate = 0;
    }

    addToIntervals(minutes, recurring, fn) {
        this.countDowns.push({
            cur: new Date(),
            minutes,
            recurring,
            fn
        })
    }

    processIntervals() { 
        setInterval(() => {
            this.countDowns.forEach(c => { // only run this about once a minute
                // test to see if the time has passed
                let timePassed = (new Date() - c.cur)/1000/60; //minutes
                if (timePassed >= c.minutes) c.fn();
                if (!c.recurring) this.countDowns = this.countDowns.filter(e => e != c);
            });
        }, 60000);
    }

    introduce() {

        this.socket.emit('pullOthers', this.level, (response) => {
            if (response) {
                this.seedOthers(response);
            }

            this.socket.emit('nextLayoutId', this.level, (layoutId) => {
                this.hero.attributes.layoutId = this.heroTemplate.attributes.layoutId = layoutId;
                let introData = { heroTemplate: this.heroTemplate, description: this.layout.description, level: this.level };
                this.socket.emit('introduce', introData);
            })
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
            this.proximityToAnimate = this.scene.cameraReach/4;
            this.addFloor(() => {
                this.scene.animate();
                this.addWater(() => {
                    this.addGrass(() => {
                        this.addLights();
                        this.addHero(() => {
                            this.seedForms(this.firstInRoom, () => {

                                if (this.floor.attributes.snowflakes) this.addSnowflakes();
                                this.introduce();
                                this.scene.readyForLock = true;

                                this.processIntervals();
                            });
                        });
    
                    })
                });
            });
        });
    }

    /** 
     * Technically not just for 'items'; provide 'type' to take entities/structures
     * data: {itemName: ..., layoutId: ..., quantity: ..., type: ...., [uuid: ....]}
     * 
     * uuid is only included for local/temp items that are not part of the layout. 
     * 
     */
    takeItemFromScene(data, local = true) {

        if (data.layoutId != undefined && parseInt(data.layoutId) != "NaN") {
            this.scene.removeFromScenebyLayoutId(data.layoutId);
            this.forms = this.forms.filter(el => {
                return el.model.attributes.layoutId != data.layoutId;
            });
    
            if (data.type == "entity" || data.type == "beast" || data.type == "friendly") {
                this.entities = this.entities.filter(el => {
                    return el.model.attributes.layoutId != data.layoutId;
                });
            }
    
            this.eventDepot.fire('removeFromLayoutByLayoutId', data.layoutId);

            if (local) {
                data.level = this.level;
                this.socket.emit('takeItemFromScene', data);
            }

        } else { // remove by uuid, for temp local items like arrows, fruit

            this.scene.removeFromScenebyModel(data.model);
            this.forms = this.forms.filter(el => {
                return el.model != data.model;
            });
    
            if (data.type == "entity" || data.type == "beast" || data.type == "friendly") {
                this.entities = this.entities.filter(el => {
                    return el.model != data.model;
                });
            }
        }
    }

    /** 
     * data: {location ..., itemName..., keyCode..., type..., position...} 
     * @local means it happened in this system and will be broadcast
     * @data.type allows dropping non-items like entities or structures
     */
    dropItemToScene(data, local = true) {

        let itemTemplate = this.getTemplateByName(data.itemName);

        if (data.attributes) itemTemplate.attributes = {...itemTemplate.attributes, ...data.attributes};

        if (data.layoutId) itemTemplate.attributes.layoutId = data.layoutId;
        if (data.keyCode) itemTemplate.attributes.keyCode = data.keyCode;
        if (typeof data.stage == "number") itemTemplate.attributes.stage = data.stage;

        this.seedForm(itemTemplate).then(form => {

            if (!data.position) {
                data.position = new THREE.Vector3();
                data.position.copy(this.hero.model.position);

                if (data.itemName == "fishingBoat") {
                    data.position.y = this.hero.determinePondElevation() + itemTemplate.attributes.elevation;
                } else {
                    data.position.y = this.hero.determineElevationFromBase() + itemTemplate.attributes.elevation;
                }
            }

            form.model.position.copy(data.position);

            if (local) {
                this.socket.emit('nextLayoutId', this.level, layoutId => {
                    data.layoutId = form.attributes.layoutId = form.model.attributes.layoutId = layoutId;
                    data.location = this.getLocationFromPosition(data.position);
                    if (typeof form.model.attributes.stage == "number") data.stage = form.model.attributes.stage;
                    this.eventDepot.fire('addItemToLayout', data);
    
                    data.level = this.level;
                    data.position = form.model.position;
                    this.socket.emit('dropItemToScene', data);
                })
    
            } else {
                this.eventDepot.fire('addItemToLayout', data);
            }
        })

    }
    
    addEventListeners() {
        
        this.socket.on('updateDayPhase', data => {

            if (this.layout?.terrain?.attributes?.alwaysDaytime) return;
            this.dayPhase = data;

            // Adjust sunLight intensity and color 0x7777ff, change backgroundMesh, fog 
            switch (this.dayPhase) {

                case 0: // early AM
                    if (this.sunLight) this.sunLight.intensity = 2;
                    if (this.scene.backgroundNight) {
                        this.scene.backgroundMesh.material = this.scene.backgroundNightMaterial;
                        this.scene.scene.background = "red";
                        this.scene.scene.fog.color = new THREE.Color( 'black' );
                    }
                    break;
                case 1: // noon
                    if (this.sunLight) this.sunLight.intensity = 2.4;
                    if (this.scene.backgroundNight) {
                        this.scene.backgroundMesh.material = this.scene.backgroundMaterial;
                        this.scene.scene.background = "white";
                        this.scene.scene.fog.color = new THREE.Color( this.layout.terrain.attributes.fog.color );
                    }
                    break;
                case 2: // afternoon
                    if (this.sunLight) this.sunLight.intensity = 2;
                    if (this.scene.backgroundNight) {
                        this.scene.backgroundMesh.material = this.scene.backgroundMaterial;
                        this.scene.scene.background = "green";
                        this.scene.scene.fog.color = new THREE.Color( this.layout.terrain.attributes.fog.color );
                    }
                    break;
                case 3: // late PM
                    if (this.sunLight) this.sunLight.intensity = 1.6;
                    if (this.scene.backgroundNight) {
                        this.scene.backgroundMesh.material = this.scene.backgroundNightMaterial;
                        this.scene.scene.background = "black";
                        this.scene.scene.fog.color = new THREE.Color( 'black' );
                    }
                    break;
            }

        })

        this.socket.on('cleanupForms', data => {
            this.cleanupForms(false);
        })
        
        // data { level, stat, layoutId, hitPointReduction });
        this.socket.on('changeStat', data => {
            if (data.layoutId == this.hero.attributes.layoutId) {
                this.hero.changeStat(data.stat, data.hitPointReduction, false);
            } else {
                this.getFormByLayoutId(data.layoutId).changeStat(data.stat, data.hitPointReduction, false);
            }
        })

        // data: { level: this.sceneController.level, spriteConfig, spritePosition });
        // addSprites = (model, spriteConfig, scene = null, broadcast = false, position = null) => {
        this.socket.on('addSprites', data => {
            this.formFactory.addSprites(null, data.spriteConfig, this.scene, false, data.spritePosition);
        })
        
        this.socket.on('updateHeroTemplate', heroTemplate => {
            this.scene.removeFromScenebyLayoutId(heroTemplate.attributes.layoutId);
            heroTemplate.subtype = "remote";
            this.seedForm(heroTemplate, true, true); // no need to re-add to forms?
        });


        // data: { level, layoutId, attributes }
        this.socket.on('updateHeroAttributes', data => {
            this.scene.removeFromScenebyLayoutId(heroTemplate.attributes.layoutId);
            heroTemplate.subtype = "remote";
            this.seedForm(heroTemplate, true, true); // no need to re-add to forms?
        });

        // data: { itemName, position: item.model.position, rotation: item.model.rotation, hostile })
        this.socket.on('launch', data => {
            this.hero.launch(data.itemName, null, [], false, data, data.hostile);
        });

        this.socket.on('updateAttributes', (data) => {

            let entity = this.forms.find(el => el.attributes.layoutId == data.layoutId);
            if (entity) entity.updateAttributes(data.payload, false);

        });

        // data: {layoutId: this.attributes.layoutId, hero: this.objectType=="hero"};
        this.socket.on('death', (data) => {
            if (data.hero) {
                let other = this.others.find(el => el.attributes.layoutId == data.layoutId);
                this.others = this.others.filter(el => el.attributes.layoutId != data.layoutId);
                if (other) other.death(false);
            } else {
                let entity = this.entities.find(el => el.attributes.layoutId == data.layoutId);
                this.entities = this.entities.filter(el => el.attributes.layoutId != data.layoutId);
                if (entity) entity.death(false);
            }
        });

        this.socket.on('dropItemToScene', (data) => {
            this.dropItemToScene(data, false);
        });

        this.socket.on('takeItemFromScene', (data) => {
            this.takeItemFromScene(data, false);
        });

        this.socket.on('removeHero', (heroTemplate) => {
            this.scene.removeFromScenebyLayoutId(heroTemplate.attributes.layoutId);
            this.others = this.others.filter(el => el.attributes.layoutId != heroTemplate.attributes.layoutId);
        });

        this.socket.on('multiplayer', (data) => {
            this.multiplayer = data;
        });

        /** setFirstInRoom happens if the previous first leaves the room and delegates the responsibility */
        this.socket.on('setFirstInRoom', () => {
            this.firstInRoom = true;
        });

        /** The introduction should include attributes.layoutId assigned by the introducer him/herself */
        this.socket.on('introduce', (heroTemplate) => {
            /** Accept heroTemplate and call seedForm(heroTemplate) */
            heroTemplate.subtype = "remote";
            this.seedForm(heroTemplate);
        });

        this.socket.on('updateEntityPositions', (entities) => {
            entities.forEach(entity => {
                // find the entity here by layoutId
                let localEntity = this.entities.find(el => el.attributes.layoutId == entity.layoutId);
                if (localEntity) {
                    let rotation = new THREE.Euler( entity.rotation._x, entity.rotation._y, entity.rotation._z, 'YXZ' );
                    localEntity.model.rotation.copy(rotation);
                    if (localEntity.velocity && entity.velocity) localEntity.velocity.copy(entity.velocity);
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

        this.eventDepot.addListener('takeItemFromSceneAndAddToInventory', this.takeItemFromScene);
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
    }

    addWater(callback) {
        if (this.layout.terrain.attributes.water) {
            this.waterElevation = this.layout.terrain.attributes.water.attributes.elevation;
            this.water = this.formFactory.newForm("water", this.layout.terrain.attributes.water);
            this.water.load(() => {
                this.addToScene(this.water, false);
                callback();
            });
        } else {
            callback();
        }
    }

    addSnowflakes() {
        var geometry = new THREE.BufferGeometry();
        var vertices = [];

        var textureLoader = new THREE.TextureLoader();

        var sprite1 = textureLoader.load( '/textures/sprites/snowflake1.png' );
        var sprite2 = textureLoader.load( '/textures/sprites/snowflake2.png' );
        var sprite3 = textureLoader.load( '/textures/sprites/snowflake3.png' );
        var sprite4 = textureLoader.load( '/textures/sprites/snowflake4.png' );
        var sprite5 = textureLoader.load( '/textures/sprites/snowflake5.png' );

        for ( var i = 0; i < 10000; i ++ ) {

            var x = Math.random() * 2000 - 1000;
            var y = Math.random() * 2000 - 1000;
            var z = Math.random() * 2000 - 1000;

            vertices.push( x, y, z );

        }

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        this.parameters = [
            [[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
            [[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
            [[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
            [[ 0.85, 0, 0.5 ], sprite5, 8 ],
            [[ 0.80, 0, 0.5 ], sprite4, 5 ]
        ];

        for ( var i = 0; i < this.parameters.length; i ++ ) {

            var color = this.parameters[ i ][ 0 ];
            var sprite = this.parameters[ i ][ 1 ];
            var size = this.parameters[ i ][ 2 ];

            this.materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
            this.materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

            var particles = new THREE.Points( geometry, this.materials[ i ] );

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            this.hero.model.add(particles);
            this.points.push(particles);
        }
    }

    addGrass(callback) {
        if (this.layout.terrain.attributes.grass) {
            this.grass = this.formFactory.newForm("grass", this.layout.terrain.attributes.grass);
            this.grass.load(() => {
                this.addToScene(this.grass, false);
                callback();
            });
        } else {
            callback();
        }
    }

    cleanupForms(local = true) {
        this.forms = this.forms.filter(el => el.attributes.layoutId);

        if (local) this.socket.emit('cleanupForms', this.level);
    }

    addToScene(form, addToForms = true, addToScene = true, reseed = false, trackEntity = true) {
        
        if (reseed) {
            this.forms = this.forms.filter(el => el.attributes.layoutId != form.attributes.layoutId);
            
            if (form.objectSubtype == "remote") {
                this.others = this.others.filter(el => el.attributes.layoutId != form.attributes.layoutId);
            } else if (form.objectType == "friendly" || form.objectType == "beast") {
                this.entities = this.entities.filter(el => el.attributes.layoutId != form.attributes.layoutId);
            } else if (form.objectType == "floor" || form.objectType == "structure") {
                this.structureModels = this.structureModels.filter(el => el.attributes.layoutId != form.attributes.layoutId);
            }
        }

        
        if (addToScene) this.scene.add( form.model );
        if (addToForms) this.forms.push( form );

        if (form.objectSubtype == "remote") {
            this.others.push( form );
        } else if (form.objectType == "friendly" || form.objectType == "beast" || form.objectType == "entity") {
            if (trackEntity) this.entities.push( form );
        } else if (form.objectType == "floor" || form.objectType == "structure" || form.attributes.addToStructureModels ) {
            this.structureModels.push ( form.model );
        } 
    }

    addFloor(callback) {

        this.floor = this.formFactory.newForm("floor", this.layout.terrain);
        this.floor.load(() => {

            if (this.floor.attributes.emissiveIntensity) {
                this.floor.findFirstMaterial(this.floor.model);
                this.floor.firstMaterial.emissiveIntensity = this.floor.attributes.emissiveIntensity;
            }
            
            this.formFactory.addSconces(this.floor.model, (100/this.layout.terrain.attributes.scale));
            if (this.layout.terrain.attributes.borderTrees) {
                this.formFactory.addBorderTrees(this.scene, this.floor.model);
            }

            if (this.layout.terrain.attributes.grassSprites) {
                this.formFactory.addGrassSprites(this.scene, this.floor.model);
            }

            if (this.layout.terrain.attributes.leaves) {
                this.formFactory.addLeaves(this.scene, this.floor.model);
            }

            if (this.layout.terrain.attributes.designateNPCs) {
                this.populateNPCnulls(this.floor.model);
                this.populateBossNulls(this.floor.model);
            }

            if (this.layout.terrain.attributes.addPonds) {
                this.formFactory.addPonds(this.floor.model);
            }

            this.addWaterSources();
            this.addMineralSources();

            this.addToScene(this.floor);
            setTimeout(() => {
                callback();
            }, 500);
        });
    }

    addWaterSources() {
        if (this.floor.attributes.waterSources) {
            for (let waterSource of this.floor.attributes.waterSources) {
                this.waterSources.push(waterSource);
            }
        }
    }

    addMineralSources() {
        if (this.floor.attributes.mineralSources) {
            for (let mineralSource of this.floor.attributes.mineralSources) {
                this.mineralSources.push(mineralSource);
            }
        }
    }

    // Fill the following if applicable; scan for 'npc' nodes
    // this.floorNPClocations = [];
    populateNPCnulls(model) {
        if (/npc/i.test(model.name)) {
            this.floorNPClocations.push(model.position);
        } else {
            if (model.children) {
                model.children.forEach(m => {
                    this.populateNPCnulls(m);
                })
            }
        }
    }

    // Fill the following if applicable; scan for 'boss nodes
    // this.floorBossLocations = [];
    populateBossNulls(model) {
        if (/boss/i.test(model.name)) {
            this.floorBossLocations.push(model.position);
        } else {
            if (model.children) {
                model.children.forEach(m => {
                    this.populateBossNulls(m);
                })
            }
        }
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

            this.sunLight = new THREE.SpotLight( 0xffffff, 2, 0, Math.PI / 1.2 );
            this.sunLight.position.set( 500, 1000, 500);
            this.sunLight.castShadow = true;

            this.sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( shadowConfig.shadowCameraFov, 1, shadowConfig.shadowCameraNear, shadowConfig.shadowCameraFar ) );
            this.sunLight.shadow.bias = shadowConfig.shadowBias;

            this.scene.add (this.sunLight );

            if (shadowConfig.shadowCameraVisible) {
                var shadowCameraHelper = new THREE.CameraHelper( this.sunLight.shadow.camera );
                shadowCameraHelper.visible = shadowConfig.shadowCameraVisible;

                this.scene.add( shadowCameraHelper );
            }

            // var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
            // this.scene.add( ambientLight );
    
            // var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
            // this.scene.camera.add( pointLight );
            
        }

        if (this.layout.terrain.attributes.light.overheadPointLight || this.layout.dayTime == false) {
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

        var nextLayoutId = 0; // only for tracking the firstInRoom tally

        this.layout.items.forEach(({name,location,attributes},index) => {
            
            let template = this.getTemplateByName(name);
            if (location) template.location = location;
            if (attributes) template.attributes = {...template.attributes, ...attributes};
            
            if (firstInRoom) {
                if (!this.layout.items[index].attributes) this.layout.items[index].attributes = {};
                this.layout.items[index].attributes.layoutId = template.attributes.layoutId = nextLayoutId++;
            }
            this.seedForm(template).then(form => {});

        });

        this.layout.structures.forEach(({name,location,attributes}, index) => {

            let template = this.getTemplateByName(name);
            if (location) template.location = location;
            if (attributes) template.attributes = {...template.attributes, ...attributes};
            
            if (firstInRoom) {
                if (!this.layout.structures[index].attributes) this.layout.structures[index].attributes = {};
                this.layout.structures[index].attributes.layoutId = template.attributes.layoutId = nextLayoutId++;
            }
            this.seedForm(template).then(form => {});
        });

        // Update the location for each party member to match the hero, and 
        // filter this.layout.entities to avoid dupes:
        this.hero.partyTemplates.forEach(member => {
            member.location = this.hero.location;
            this.layout.entities = this.layout.entities.filter(el => el.name != member.name);
        });

        let comboEntities = [...this.layout.entities, ...this.hero.partyTemplates];

        comboEntities.forEach(({name,location,attributes}, index) => {
            let template = this.getTemplateByName(name);
            if (location) template.location = location;
            if (attributes) template.attributes = {...template.attributes, ...attributes};
            
            if (firstInRoom) {
                if (!comboEntities[index].attributes) comboEntities[index].attributes = {};
                comboEntities[index].attributes.layoutId = template.attributes.layoutId = nextLayoutId++;

                if (this.layout.terrain.attributes.designateNPCs && template.type == "beast" && template.subtype != "fish" && index < this.floorNPClocations.length) {
                    template.location = this.getLocationFromPosition(this.floorNPClocations[index], 100/this.layout.terrain.attributes.scale);
                    comboEntities[index].location = template.location;
                }

                if (this.layout.terrain.attributes.designateNPCs && template.attributes.boss ) {
                    template.location = this.getLocationFromPosition(this.floorBossLocations[0], 100/this.layout.terrain.attributes.scale);
                    comboEntities[index].location = template.location;
                }
            }
            this.seedForm(template).then(form => {
                if (form.attributes.follower && form.attributes.loyalTo == this.hero.objectName) {
                    this.hero.addToParty(form);
                } 
            });
        });

        if (firstInRoom) { // Update layouts with layoutIds assigned....
            this.socket.emit('pushLayout', {level: this.level, layout: this.layout, nextLayoutId });
        }

        this.eventDepot.fire('cacheLayout', {}); 

        callback();

    }

    addProducer(position, fruit) {
        this.addToIntervals(1, true, () => {
            // Drop items to scene locally, non-broadcast; everybody gets their own
            this.loadFormByName(fruit, (form) => {
                form.model.position.copy(position);
                form.model.translateZ(Math.random() * 20);
                form.model.translateX(Math.random() * 20);
            },true,false,false);
        });
    }

    addWaterSource(p, radius) {
        this.waterSources.push([p, radius]);
    }

    removeWaterSource(p) {
        this.waterSources = this.waterSources.filter(el => {
            return (el[0].x != p.x && el[0].y != p.y && el[0].z != p.z)
        });
    }

    /** 
     * Load model of each form and add to scene.
     * 
     * reseed is set for updates as when character equips/unequips
     * addToForms indicates that the form will be added to this.forms
     * trackEntity is for entities only; specify false if the entity is only equipped
     * 
     */ 
    seedForm(formTemplate, reseed = false, addToForms = true, trackEntity = true) {

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
                    if (spriteConfig.showOnSeed) this.formFactory.addSprites(form.model, spriteConfig);
                })
            }

            if (form.attributes.stage && form.attributes.stage >= 4) {
                this.addProducer(form.model.position, form.attributes.bears);
            }

            this.addToScene(form, addToForms, true, reseed, trackEntity);

            if (this.firstInRoom && form.attributes.contentItems) {
                form.attributes.contentItems.forEach(contentItemName => {
                    let contentItem = this.getTemplateByName(contentItemName);

                    /** data: {location ..., itemName..., } */
                    /** local means it happened in this system and will be broadcast */ 
                    
                    let position = new THREE.Vector3();
                    position.copy(form.model.position);
                    position.y += contentItem.attributes.elevation;
                    
                    let data = {
                        itemName: contentItem.name,
                        location: this.getLocationFromPosition(position), 
                        position,
                        attributes: {contained: true}
                    }
                    
                    this.dropItemToScene(data);

                    resolve(form);

                });
            } else {
                resolve(form);
            }

            });

        })    
    }

    handleMovement(delta) {
        if (this.hero && this.scene.controls) {
            if (this.hero) this.hero.move(delta);
            if (this.hero) this.hero.animate(delta);
            
            // Only the firstInRoom can move the AI entities to avoid competing updates
            if (this.firstInRoom) { 
                
                this.entities.forEach(entity => {  
                    if (entity.objectSubtype != "remote" && entity.objectSubtype != "tree") entity.move(delta);
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
                
                if (form.attributes.animates && !form.attributes.controlled) {
                    // if the entity is within this.proximityToAnimate of the hero, animate it
                    if (form.model.position.distanceTo(this.hero.model.position) < this.proximityToAnimate) {
                        // log all the variables
                        // console.log(`entity ${form.objectName} is within ${this.proximityToAnimate} of hero ${this.hero.objectName}`);
                        if (!form.attributes.shouldAnimate) form.attributes.shouldAnimate = true;
                        form.animate(delta);
                    } else {
                        if (form.attributes.shouldAnimate) form.attributes.shouldAnimate = false;
                    }
                }
            });
            
            if (this.overheadPointLight && this.scene.controls) {
                let controlsObject = this.scene.controls.getObject();
                this.overheadPointLight.position.copy(controlsObject.position);
                this.overheadPointLight.rotation.copy(controlsObject.rotation);
                this.overheadPointLight.position.y = controlsObject.position.y + 60;
                this.overheadPointLight.translateZ(-80);
            }
    
            if (this.scene && this.scene.controls) this.scene.handleCameraMovement();
        }
    }

    deanimateScene(callback) {
        
        if (this.scene) {
            this.scene.unregisterEventListeners();
            this.scene.deanimate(() => {
                // this.scene = null;
            });
        }

        this.eventDepot.removeListener('takeItemFromSceneAndAddToInventory', 'bound takeItemFromScene');
        this.eventDepot.removeListener('dropItemToScene', 'bound dropItemToScene');

        if (this.hero) this.hero.stop(() => {
            this.hero = null;
        });

        if (this.forms) this.forms.forEach(form => {
            if (form.model.dispose) form.model.dispose();
        })

        callback();
    }

    getTemplateByName(name) {
        return JSON.parse(JSON.stringify(this.allObjects[name]));
    }

    /** 
     * loadFormByName is useful for loading objects in the local VM,
     * as with launching or equipping.  Use dropItemToScene to broadcast
     * with a shared layoutId.  No layoutId!!!
     */
    loadFormByName(formName, callback, addToForms, reseed = false, trackEntity = true) {

        let formTemplate = this.getTemplateByName(formName);
        // this.socket.emit('nextLayoutId', this.level, layoutId => {
        //     formTemplate.attributes.layoutId = layoutId;

            // if (formTemplate.type == "spell") addToForms = false;
            this.seedForm(formTemplate, reseed, addToForms, trackEntity).then(form => {
               callback(form);
            });
        // })
    }

    positionOfClosestStructure(position) {
        var response = null;
        let shortestDistance = Infinity;
        this.structureModels.forEach(structureModel => {
            if (position.distanceTo(structureModel.position) < shortestDistance) {
                shortestDistance = position.distanceTo(structureModel.position);
                response = new THREE.Vector3().copy(structureModel.position);
            }
        })
        return response;
    }

    allFriendliesInRange(range, position, includeHero = false) { 
        
        let diff = new THREE.Vector3();
        let entityPosition = new THREE.Vector3();
        let arr = [...this.entities.filter(el => el.objectType != "beast"), ...this.others];
        if (includeHero) arr.push(this.hero);
        
        var response = [];
        arr.forEach(entity => {
            entityPosition.copy(entity.model.position);
            entityPosition.y += entity.attributes.height;
            diff.subVectors(position, entityPosition);

            // if (diff.length() < 60) {
            //     console.log(`entityPosition: ${entityPosition.x},${entityPosition.y},${entityPosition.z}; proPosition: ${position.x},${position.y},${position.z}, diff: ${diff.length()}; range: ${range}`)
            // }
            if ( diff.length() < range ) {
                response.push(entity);
            }
        })
        
        return response;
    }

    allEnemiesInRange(range, position) {
        var response = [];
        var entityPosition = new THREE.Vector3();

        this.entities.filter(el => el.objectType == "beast").forEach(entity => {
            // apply height
            
            entityPosition.copy(entity.model.position);
            entityPosition.y += entity.attributes.height;
            
            
            // if (range < 100 && position.distanceTo(entityPosition) < 60) {
            //     console.log(`entityPosition: ${entityPosition.x},${entityPosition.y},${entityPosition.z}; proPosition: ${position.x},${position.y},${position.z}, diff: ${position.distanceTo(entityPosition)}; range: ${range}`)
            // }
            if (position.distanceTo(entityPosition) < range) {
                response.push(entity);
            }
        })
        return response;
    }

    heroInRange(range, position) {
        return (position.distanceTo(this.hero.model.position) < range);
    }

    addToProjectiles(item, local = true, hostile = false) {

        /**
         * 
         * Sprites may be configured in attributes. e.g.,
         * 
         * continuousSprites: true,
         * sprites: [{ 
                name: "greenExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 30,
                flip: false,
            }]
         */

        if (item.attributes.continuousSprites) {
            item.attributes.sprites.forEach(spriteConfig => {
                spriteConfig.time = 3;
                this.formFactory.addSprites(item.model, spriteConfig);
            })
        }
        
        this.projectiles.push( {
            item,
            direction: item.direction,
            velocity: new THREE.Vector3(),
            distanceTraveled: 0,
            local,
            hostile
        } );
        this.scene.add( item.model );
    }

    // Calculate hero location using grid coordinates
    // divideByMultiplier is optional for getting coordinates pre-scaling, i.e. during level loading
    getLocationFromPosition(position, m = multiplier) {
        var location = {};
        location.x = position.x / m;
        location.y = position.y / m;
        location.z = position.z / m;
        return location;
    }

    getHeroByLayoutId(layoutId) {
        if (layoutId == this.hero.attributes.layoutId) {
            return this.hero;
        } else {
            let others = [...this.others, ...this.hero.party];
            return others.find(el => el.attributes.layoutId == layoutId);
        }
    }

    getFormByLayoutId(layoutId) {
        return this.forms.find(el => el.attributes.layoutId == layoutId);
    }

    getFormByModel(model) {
        return this.forms.find(el => el.model == model)
    }

    confirm(question) {
        return confirm(question);
    }

}