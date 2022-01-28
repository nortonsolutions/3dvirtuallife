import { IntelligentForm } from './intelligent.js'

/**
 * The Hero is a significant extension of the
 * IntelligentForm which has hooks for all the
 * Hero interactions, saved games, etc.
 * 
 * It keeps track of its own template for caching,
 * including inventory, spells, equipped items,
 * and attributes/statistics.
 */
export class Hero extends IntelligentForm {

    constructor(template, sceneController, controls) {

        super(template, sceneController);

        this.controls = controls;
        this.name = this.template.name;
        this.selectedObject = null;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

        // Actually just a starting/saved location
        this.location = this.template.location? this.template.location : { x: 0, y: 0, z: 0 };
        this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        // Proximity Light is used for object selection/identification
        this.proximityLight = new THREE.PointLight( 0x00ff00, 5, 250, 30 );
        
        this.cacheHero();

    }

    load(callback) {

        super.load(() => {

            /** For the hero, the controls obj IS the model, which contains the gltf model */
            let modelCopy = this.model;
            modelCopy.rotation.y = Math.PI;
            modelCopy.position.set(0,0,0); // hero model is always centered in the controls

            this.model = this.controls;

            this.model.add( modelCopy );
            this.model.add( this.proximityLight );

            if (this.template.location) {
                this.model.position.x = this.template.location.x * multiplier;
                this.model.position.z = this.template.location.z * multiplier;
                this.model.position.y = this.determineElevationFromBase();
            }

            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }



    cacheHero() {
        if (this.model) this.updateHeroLocationFromPosition();
        localStorage.setItem('gameHeroTemplate', JSON.stringify(this.returnTemplate()));

    }

    // Calculate hero location using grid coordinates
    updateHeroLocationFromPosition() {

        this.location.x = this.model.position.x / multiplier,
        this.location.y = this.model.position.y / multiplier,
        this.location.z = this.model.position.z / multiplier
        
    }

    addEventListeners() {

        this.sceneController.eventDepot.addListener('hotkey', (data) => { // key = number, i.e. 1 => equipped.f1key

            // Item or spell use
            let keyString = 'f' + data.key + 'key';
            let itemName = this.equipped[keyString][0];

            if (itemName) {
                let item = this.gameObjects[itemName];
                let itemType = item.type;
    
                if (itemType == "spell" && this.getStat("mana") < item.attributes.manaCost) return;

                // Using this will diminish the item quantity in inventory for items, or mana for spells
                if (itemType == "item" || itemType == "spell") {
    
                    // What is the item effect?
                    let [stat, change] = item.attributes.effect.split("/");
    
                    switch (stat) {

                        case "scale":

                            // Find the head
                            // let head = this.model.getObjectByName('Head');
                            // head.scale.x *= change;
                            // head.scale.y *= change;
                            // head.scale.z *= change;

                            let torso = this.model.getObjectByName('Torso');
                            torso.scale.x *= change;
                            torso.scale.y *= change;
                            torso.scale.z *= change;

                            this.attributes.height *= change;
                            this.changeStatBoost("strength", 2);
                            this.changeStat("health", 2);
                            break;
                        case "mana": 
                            this.fadeToAction("ThumbsUp", 0.2); // TODO: Use sprites to spritz things up
                            this.changeStat(stat, change, false);
                            break;
    
                        case "damage":
                            this.fadeToAction("Yes", 0.2);
                            
                            if (item.attributes.range) { // general attack against all in range
                                let entitiesInRange = this.sceneController.allEnemiesInRange(item.attributes.range, this.model.position);
                                entitiesInRange.forEach(entity => {
                                    this.inflictDamage(entity, change);
                                })

                            } else { // standard attack upon 'selectedObject'
                                this.inflictDamage(this.selectedObject, change);
                            }

                            break;

                        case "health":
                            this.fadeToAction("Yes", 0.2);
                                
                            if (item.attributes.range) { // general effect against all in range
                                let entitiesInRange = this.sceneController.allFriendliesInRange(item.attributes.range, this.model.position);
                                entitiesInRange.forEach(entity => {
                                    if (entity.changeStat(stat, change, false) <= 0) {
                                        // this.fadeToAction("Dance", 0.2);
                                    }
                                })

                            } else { // standard effect upon self
                                if (this.changeStat(stat, change, false) <= 0) {
                                    this.fadeToAction("Dance", 0.2);
                                }
                            }

                            break;
                    }

                    // Sprite effects:
                    if (item.attributes.sprites) {
                        item.attributes.sprites.forEach(spriteConfig => {
                            // addSpritesGeneric = (model, name, regexString, frames = 10, scale = 1, elevation = 5, flip = false, time, animates = true) 
                            this.sceneController.formFactory.addSpritesGeneric(this.model, spriteConfig.name, spriteConfig.regex, spriteConfig.frames, spriteConfig.scale, spriteConfig.elevation, spriteConfig.flip, spriteConfig.time);
                        })
                    }
                    
                    if (itemType == "item") {
                        if (this.removeFromInventory(itemName) == -1) this.unequip(keyString);
                    } else if (itemType == "spell") {
                        this.changeStat('mana', -item.attributes.manaCost);
                    }
                } 
            }
        })

        this.sceneController.eventDepot.addListener('updateHeroLocation', data => {

            let { x, y, z } = data.location;
        
            if (data.offset) {
                z = z + (z < 0) ? 1 : -1;
                x = x + (x < 0) ? 1 : -1;
            }

            this.location.x = x;
            this.location.y = y;
            this.location.z = z;
            this.cacheHero();

        })

        this.sceneController.eventDepot.addListener('halt', () => {

            this.velocity.x = 0;
            this.velocity.z = 0;

            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;

        })

        this.sceneController.eventDepot.addListener('swapInventoryPositions', (data) => {
            this.swapInventoryPositions(data.first, data.second);
        });

        this.sceneController.eventDepot.addListener('unequipItem', (data) => {
            this.unequip(data);
        });

        this.sceneController.eventDepot.addListener('equipItem', (data) => {
            this.equip(data.bodyPart, data.itemName, data.throwable, data.throws);
        });

        this.sceneController.eventDepot.addListener('placeItem', (data) => {
            this.addToInventory(data.itemName, data.desiredIndex);
        });

        this.sceneController.eventDepot.addListener('takeItemFromScene', (data) => {
            this.addToInventory(data.itemName, undefined, data.quantity);
        });

        this.sceneController.eventDepot.addListener('removeItem', (itemName) => {
            this.removeFromInventory(itemName);
        });

        this.sceneController.eventDepot.addListener('dropItemToScene', (data) => {
            
            if (data.source.length < 3) {  // inventory
                this.removeFromInventory(data.itemName);
            } else { // equipped
                this.unequip(data.source);
            }
        });

        this.sceneController.eventDepot.addListener('mouse0click', () => {

            if (this.alive) {
                
                if (this.selectedObject) {

                    let objectType = this.selectedObject.objectType;
                    
                    if (objectType == "item") {
                        this.sceneController.eventDepot.fire('takeItemFromScene', {
                            itemName: this.selectedObject.attributes.baseItemName? this.selectedObject.attributes.baseItemName : this.selectedObject.objectName, 
                            quantity: this.selectedObject.attributes.quantity? this.selectedObject.attributes.quantity : 1,
                            layoutId: this.selectedObject.model.attributes.layoutId
                        });
    
                    } else if (objectType == "friendly") {
                        
                        // TODO: conversation
                        this.sceneController.eventDepot.fire('unlockControls', {});
                        this.sceneController.eventDepot.fire('modal', { type: 'dialog', title: this.selectedObject.objectName, entity: this.selectedObject, hero: this });
                    
                    } else if (objectType == "beast") {
    
                        if (this.selectedObject.alive) {
    
                            this.fadeToAction("Punch", 0.2)
    
                            let chanceToHit = this.getEffectiveStat('agility') / 10;
                            let hitPointReduction = getRandomArbitrary(0,this.getEffectiveStat('strength'));
    
                            // console.dir(this.selectedObject);
                            if (Math.random() < chanceToHit) {
                                this.inflictDamage(this.selectedObject, hitPointReduction);
                            }
                        }
    
                    } else if (objectType == "structure") {
                        
                        var accessible = this.selectedObject.attributes.key ? 
                            this.inventory.map(el => el? el.itemName: null).includes(this.selectedObject.attributes.key) :
                            true;
                        
                        if (accessible) {
                            this.selectedObject.updateAttributes({unlocked: true});
                            if (this.selectedObject.activeAction) {
                                this.selectedObject.runActiveAction(0.2);
                            }
                        }
                    }
                } 
           }
        })

        this.sceneController.eventDepot.addListener('mouse1click', () => {

            if (this.alive) {

                let throws = this.equippedThrows();
                if (throws.length > 0) {
                    throws.forEach(([bodyPart,item]) => {

                        // animate weapon (if applicable) and launch item
                        let tool = this.animatedSubforms.find(el => el[0] == bodyPart)[1];
                        if (tool) tool.runActiveAction(2);
                        this.fadeToAction('ThumbsUp', 0.2);
                        
                        setTimeout(() => {
                            this.launch(item, null, [bodyPart, tool.objectName]);
                        }, 500)
                    })
                } else {
                    Object.entries(this.equipped).forEach(([bodyPart,value]) => {
                        if (bodyPart.indexOf('key') == -1) { // for body parts only (non-hotkey equipped)
                            let [item,throwable] = value;
                            if (throwable) {
                                this.launch(item, bodyPart);
                            }
                        }
                    })
    
                }
            }
        })

        this.sceneController.eventDepot.addListener('unlockControls', () => {
            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
        })

        this.sceneController.eventDepot.addListener('jump', () => {
            if ( this.canJump === true ) {
                this.velocity.y += 350;
                this.fadeToAction('Jump', 0.2)
            }
            this.canJump = false;
            this.justJumped = true;
        })

        // data: { category, nextLevel }
        this.sceneController.eventDepot.addListener('levelUp', (data) => {
            this.attributes.xpLevels[data.category] = data.nextLevel;
            this.sceneController.eventDepot.fire('statusUpdate', { message: `Advanced in ${data.category} to level ${data.nextLevel}`});
            
            // Lookup up xpLevels in gameObjects, then apply the effect:
            let effect = this.gameObjects.xpLevels[data.category][data.nextLevel]? this.gameObjects.xpLevels[data.category][data.nextLevel].effect : `${data.category}/1`;
            let spell = this.gameObjects.xpLevels[data.category][data.nextLevel]? this.gameObjects.xpLevels[data.category][data.nextLevel].spell : null;

            if (effect) {
                let [stat, change] = effect.split("/");
                this.changeStat(stat, change, true);
            }

            if (spell) {
                this.grantSpell(spell);
            }

            this.cacheHero();
        })
    }




    dispose(item) {
        if (item.children.length == 0) {
            if (item.dispose) item.dispose();
            return;
        } else {
            item.children.forEach(child => {
                this.dispose(child);
            })
        }
        if (item.dispose) item.dispose();
    }

    stop(callback) {
        
        this.sceneController.eventDepot.removeListeners('updateHeroLocation');
        this.sceneController.eventDepot.removeListeners('halt');
        this.sceneController.eventDepot.removeListeners('swapInventoryPositions');
        this.sceneController.eventDepot.removeListeners('unequipItem');
        this.sceneController.eventDepot.removeListeners('equipItem');
        this.sceneController.eventDepot.removeListeners('placeItem');
        this.sceneController.eventDepot.removeListeners('takeItemFromScene');
        this.sceneController.eventDepot.removeListeners('removeItem');
        this.sceneController.eventDepot.removeListeners('dropItemToScene');
        this.sceneController.eventDepot.removeListeners('mouse0click');
        this.sceneController.eventDepot.removeListeners('mouse1click');
        this.sceneController.eventDepot.removeListeners('unlockControls');
        this.sceneController.eventDepot.removeListeners('jump');
        this.sceneController.eventDepot.removeListeners('levelUp');
        this.dispose(this.model);
        callback();
    }


    
    returnTemplate() {

        return {
            name: this.name,
            type: "hero",
            location: this.location,
            attributes: this.attributes,
            gltf: this.template.gltf,
            inventory: this.inventory,
            spells: this.spells,
            equipped: this.equipped
        }
    }

    /** updateHeroStats sends hero statistics out; effective is connsidered the stat */
    updateHeroStats = (stat) => {

        this.sceneController.eventDepot.fire('setHeroStatMax', { type: stat, points: this.getStatMax(stat)});
        this.sceneController.eventDepot.fire('setHeroStat', { type: stat, points: this.getEffectiveStat(stat)});
        this.sceneController.eventDepot.fire('showHeroStats', {});
        
    }

    identifySelectedForm() {

        this.proximityLight.rotation.copy(this.model.rotation);
        this.proximityLight.position.copy(this.model.position);
        this.proximityLight.translateZ(-40);
        this.proximityLight.translateY(40);

        let closest = Infinity;

        this.sceneController.forms.forEach(o => {
            let distance = o.model.position.distanceTo(this.proximityLight.position);

            if (o.attributes.contained) distance += 20;

            if (distance <= 50 && distance < closest) {
                
                if (!o.attributes.contentItems || (o.attributes.contentItems && !o.attributes.unlocked)) {
                    closest = distance;
                    this.selectedObject = o;
                    this.sceneController.eventDepot.fire('showDescription', { objectType: o.objectType, objectName: o.objectName }); 
                }
            }
        })

        if (closest > 50) {
            this.selectedObject = null;
            this.sceneController.eventDepot.fire('hideDescription', {}); 
        }

    }

    move(delta) {
        if (this.alive) {

            // INERTIA
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            this.direction.z = Number( this.moveBackward ) - Number( this.moveForward );
            this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
            this.direction.normalize(); // this ensures consistent movements in all directions
            
            let agility = this.getEffectiveStat('agility');

            if ( this.moveForward || this.moveBackward ) this.velocity.z += this.direction.z * 1000.0 * agility * delta;
            if ( this.moveLeft || this.moveRight ) this.velocity.x += this.direction.x * 1000.0 * agility * delta;

            this.movementRaycaster.ray.origin.copy( this.model.position );
            this.rotation.copy(this.model.rotation);

            super.move(delta);

            // entity.translateY( this.mixers[uniqueId].velocity.y * delta );
            if (this.setElevation() == -1) {

                this.model.translateX( -this.velocity.x * delta );
                this.model.translateY( -this.velocity.y * delta );
                this.model.translateZ( -this.velocity.z * delta );

                this.velocity.x = 0;
                this.velocity.y = 0;
                this.velocity.z = 0;

            };
            
            if (this.standingUpon && this.standingUpon.attributes.routeTo && typeof this.standingUpon.attributes.routeTo.level == "number") {
                if (this.standingUpon.attributes.unlocked) {
                    
                    this.sceneController.eventDepot.fire('cacheLayout', {});

                    let loadData = {

                        level: this.standingUpon.attributes.routeTo.level,
                        location: this.standingUpon.attributes.routeTo.location,
                    }

                    this.sceneController.eventDepot.fire('loadLevel', loadData);
                }
            }

            this.identifySelectedForm();
        }

    }

    death() {
        super.death();

        setTimeout(() => {
            let thisModel = this.model.getObjectByProperty("objectType", "hero");
            thisModel.position.copy(this.model.position);
            this.sceneController.scene.add(thisModel);

        }, 2000);
        
    }

    /** returns the new value */
    changeStat(stat, change, changeMax = false) {

        super.changeStat(stat, change, changeMax);

        if (change < 0) {
            this.fadeToAction("No", 0.2);
        } else {
            this.fadeToAction("Yes", 0.2);
        }
    }

    levelUpEligibility() {
        // Formula for each level up: 2^x+1
        let eligibility = [];
        Object.keys(this.attributes.xpLevels).forEach(category => {
            let nextLevel = Number(this.attributes.xpLevels[category]) + 1;
            let reqPoints = Math.pow(2, nextLevel+1);
            console.log(`${category}: ${reqPoints} required for level ${nextLevel}`);
            if (this.attributes.experience >= reqPoints) eligibility.push({
                category,
                nextLevel
            });
        })
        return eligibility;
    }

    grantSpell(spellName) {
        let spell = this.gameObjects[spellName];
        this.spells.push({
            itemName: spell.name
        });
    }

    /** 
     * launch is used for throwables, like greenpotion, arrows, spells, etc.
     * Every throwable item has specific properties including quantity,
     * raised pitch, and weight (which affects how the trajectory declines).
     * 
     * Throwing an item affects inventory similarly to using a hotkey potion,
     * pulling from inventory until the last item is used (or all mana is used).
     */
    launch(itemName, bodyPart = null, [parentBodyPart, parentItemName] = []) {

        // If this is a child item, check inventory first and bail if needed
        if (parentBodyPart && this.getInventoryQuantity(itemName) == 0) {
            this.unequip(parentBodyPart);
            this.addToInventory(parentItemName, 0, 1);
        } else {
            // load the object model to the scene, copy the position/rotation of hero,
            this.sceneController.loadFormbyName(itemName, (item) => {

                item.model.position.copy(this.model.position);
                item.model.rotation.copy(this.model.rotation);
                item.model.position.y += this.attributes.height;
                this.sceneController.addToProjectiles(item);

                if (bodyPart || parentBodyPart) { // remove from inventory, unequip when out
                    if (this.removeFromInventory(itemName) == -1) {
                        this.unequip(parentBodyPart? parentBodyPart : bodyPart);

                        // re-equip parent item to inventory if applicable
                        if (parentBodyPart) this.addToInventory(parentItemName, 0, 1);
                    }
                }
            });

        }
    }

    inflictDamage(entity, hitPointReduction) {

        if (entity.changeStat('health', -hitPointReduction, false) <= 0) {
    
            this.attributes.experience += entity.getStatMax('health');

            if (this.levelUpEligibility().length > 0) {
                setTimeout(() => {
                    this.sceneController.eventDepot.fire('modal', { type: 'levelUp', title: 'Level Up', context: this.levelUpEligibility() });
                    this.sceneController.eventDepot.fire('disableCloser', {});
                }, 2000);
            }

            this.sceneController.eventDepot.fire('updateXP', this.attributes.experience); 

            // this.fadeToAction("Dance", 0.2);
        };
    }

    equippedThrows() {

        var throws = [];
        if (this.equipped.Middle2R && this.equipped.Middle2R[2]) {
            throws.push(['Middle2R', this.equipped.Middle2R[2]]);
        }

        if (this.equipped.Middle2L && this.equipped.Middle2L[2]) {
            throws.push(['Middle2L', this.equipped.Middle2L[2]]);
        }

        return throws;
    }
}