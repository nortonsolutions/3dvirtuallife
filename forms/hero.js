import { IntelligentForm } from './intelligent.js'

let hitSpriteConfig = { 
    name: "hitEffect",
    regex: "",
    frames: 9,
    scale: 100, 
    elevation: 20,
    flip: false,
    time: 1
}

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
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.positionHandR = new THREE.Vector3();

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

            if (this.actions['Punch']) this.actions['Punch'].setEffectiveTimeScale(1);

            callback();

        }, undefined, function ( error ) {
            console.error( error );
        });
    }



    cacheHero(justDied = false) {
        
        if (this.model) this.updateHeroLocationFromPosition(justDied);
        if (justDied) {
            this.changeStat("health", this.getStatMax("health") * 2/3);
            let gameName = localStorage.getItem('gameName');
            if (gameName) this.sceneController.eventDepot.fire('saveGame', gameName);
        }
        localStorage.setItem('gameHeroTemplate', JSON.stringify(this.returnTemplate()));

    }

    // Calculate hero location using grid coordinates
    updateHeroLocationFromPosition(justDied) {

        var position = new THREE.Vector3();
        if (justDied) {
            position = this.sceneController.positionOfClosestStructure(this.model.position);
            // position.x = shiftTowardCenter(position.x, 4); // Causes performance leak somehow
            // position.z = shiftTowardCenter(position.z, 4);
        } else {
            position.copy(this.model.position);
        }

        this.location.x = position.x / multiplier,
        this.location.y = position.y / multiplier,
        this.location.z = position.z / multiplier
        
    }

    takeEffect(item) {

        // What is the item effect?
        let [stat, change] = item.attributes.effect.split("/");

        switch (stat) {

            case "scale":

                let torso = this.model.getObjectByName('Torso');
                torso.scale.x *= change;
                torso.scale.y *= change;
                torso.scale.z *= change;

                this.attributes.height *= change;
                this.changeStatBoost("strength", 2);
                this.changeStat("health", 2);
                break;

            case "mana": 
                this.fadeToAction("ThumbsUp", 0.2);
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
                    if (this.selectedObject.alive) this.inflictDamage(this.selectedObject, change);
                }

                break;

            case "health":
                this.fadeToAction("Yes", 0.2);
                if (this.changeStat(stat, change, false) <= 0) {
                    this.fadeToAction("Dance", 0.2);
                }

                break;
        }
    }



    useItem(item, keyString) {
        
        if (item.attributes.throwable) {
            this.launch(item.name, bodyPart);
        } else {
            this.takeEffect(item);
            if (this.removeFromInventory(item.name) == -1) this.unequip(keyString);
            
            // Sprite effects:
            if (item.attributes.sprites) {
                item.attributes.sprites.forEach(spriteConfig => {
                    this.sceneController.formFactory.addSprites(this.model, spriteConfig, null, true);
                })
            }
        }
    }

    addEventListeners() {

        // data: { otherLayoutId: data.layoutId, otherInventory: data.heroInventory, initiator: ...}
        this.sceneController.socket.on('heroDialogNew', data => { // request for heroDialog; open modal
            
            this.sceneController.eventDepot.fire('unlockControls', {});

            let heroDialogData = { 
                type: 'heroDialog', 
                title: data.initiator,
                layoutId: this.attributes.layoutId, 
                heroInventory: this.inventory,
                otherLayoutId: data.otherLayoutId, 
                otherInventory: data.otherInventory, 
                socket: this.sceneController.socket, 
                initiator: false, 
                level: this.sceneController.level
                
            };

            this.sceneController.eventDepot.fire('modal', heroDialogData);

        });

        this.sceneController.socket.on('castSpell', data => {
            this.castSpell(data.spell, false, data.hostile);
        })

        this.sceneController.eventDepot.addListener('hotkey', (data) => { // key = number, i.e. 1 => equipped.f1key

            // Item or spell use
            let keyString = 'f' + data.key + 'key';
            let itemName = this.equipped[keyString]? this.equipped[keyString][0] : null;

            if (itemName) {
                let itemTemplate = this.sceneController.getTemplateByName(itemName);
                let itemType = itemTemplate.type;

                switch (itemType) {
                    case "spell": 
                        this.castSpell(itemTemplate);
                        break;

                    case "item": 
                        this.useItem(itemTemplate, keyString);
                        break;
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

        this.sceneController.eventDepot.addListener('removeFromInventory', (itemName) => {
            this.removeFromInventory(itemName);
        });

        this.sceneController.eventDepot.addListener('addToInventory', (data) => {
            this.addToInventory(data.itemName, undefined, data.quantity);
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
                    let objectSubtype = this.selectedObject.objectSubtype;
                    
                    if (objectType == "item") {
                        this.sceneController.eventDepot.fire('takeItemFromScene', {
                            itemName: this.selectedObject.attributes.baseItemName? this.selectedObject.attributes.baseItemName : this.selectedObject.objectName, 
                            quantity: this.selectedObject.attributes.quantity? this.selectedObject.attributes.quantity : 1,
                            layoutId: this.selectedObject.model.attributes.layoutId
                        });
    
                    } else if (objectType == "friendly") {
                        
                        this.sceneController.eventDepot.fire('unlockControls', {});
                        this.sceneController.eventDepot.fire('modal', { type: 'dialog', title: this.selectedObject.objectName, entity: this.selectedObject, hero: this });
                    
                    } else if (objectType == "beast") {
    
                        if (this.selectedObject.alive) this.attack();
    
                    } else if (objectType == "structure") {
                        
                        var accessible = this.selectedObject.attributes.key ? 
                            this.inventory.map(el => el? el.itemName: null).includes(this.selectedObject.attributes.key) :
                            true;
                        
                        if (accessible) {
                            this.selectedObject.updateAttributes({unlocked: true});
                        }

                    } else if ( objectType == "hero") {
                        
                        this.sceneController.eventDepot.fire('unlockControls', {});

                        let dialogData = { 
                            type: 'heroDialog', 
                            title: this.selectedObject.objectName, 
                            heroInventory: this.inventory, 
                            otherLayoutId: this.selectedObject.attributes.layoutId, 
                            socket: this.sceneController.socket, 
                            initiator: this.objectName, 
                            level: this.sceneController.level,
                            layoutId: this.attributes.layoutId
                        };

                        this.sceneController.eventDepot.fire('modal', dialogData);
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
                        
                        this.fadeToAction(this.bowAttacks[0], 0.2);
                        
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
            let effect = this.sceneController.getTemplateByName('xpLevels')[data.category][data.nextLevel]? this.sceneController.getTemplateByName('xpLevels')[data.category][data.nextLevel].effect : `${data.category}/1`;
            let spell = this.sceneController.getTemplateByName('xpLevels')[data.category][data.nextLevel]? this.sceneController.getTemplateByName('xpLevels')[data.category][data.nextLevel].spell : null;

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

    /**
     * Choose from the available attack moves
     */
    attack() {

        // Choose an attack
        let possibleAttacks = [...this.punchAttacksR, ...this.swordAttacksR, ...this.swordAttacksL];
        let attack = possibleAttacks[getRndInteger(0,possibleAttacks.length-1)];
    
        /** During action runtime, this.handAttack==true */
        this.fadeToAction(attack, 0.2);

        // let chanceToHit = this.getEffectiveStat('agility') / 10;
        // let hitPointReduction = getRandomArbitrary(0,this.getEffectiveStat('strength'));

        // if (Math.random() < chanceToHit) {
        //     // this.selectedObject.model.translateZ(-10);
        //     this.inflictDamage(this.selectedObject, hitPointReduction);
        // }
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
        this.sceneController.eventDepot.removeListeners('removeFromInventory');
        this.sceneController.eventDepot.removeListeners('addToInventory');
        this.sceneController.eventDepot.removeListeners('dropItemToScene');
        this.sceneController.eventDepot.removeListeners('mouse0click');
        this.sceneController.eventDepot.removeListeners('mouse1click');
        this.sceneController.eventDepot.removeListeners('unlockControls');
        this.sceneController.eventDepot.removeListeners('jump');
        this.sceneController.eventDepot.removeListeners('levelUp');
        this.dispose(this.model);
        callback();
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

            if (o.attributes.contentItems) distance -= 20;

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

                    this.sceneController.scene.removeFromScenebyLayoutId(this.attributes.layoutId);
                    this.sceneController.eventDepot.fire('loadLevel', loadData);
                }
            }

            this.identifySelectedForm();

            if (this.handAttack) this.handleHandAttack();

            /** data: { layoutId: ..., rotation: ..., velocity: ..., position: ..., level: ...} */

            let heroData = {
                layoutId: this.attributes.layoutId,
                position: this.model.position,
                rotation: this.model.rotation,
                velocity: this.velocity,
                level: this.sceneController.level
            };
            

            this.sceneController.socket.emit('updateHeroPosition', heroData);

        }

    }

    handleHandAttack() {

        let diff = new THREE.Vector3();
        // What is the world position of my hands or their associated weapons?  Start with right hand.
        let handR = this.equipped.Middle2R? this.equipped.Middle2R[0] : "Middle2R";
        this.positionHandR = handR=="Middle2R"? this.model.getObjectByName(handR).getWorldPosition(this.positionHandR) : this.model.getObjectByProperty("objectName", handR).getWorldPosition(this.positionHandR);
        
        for (const entity of this.sceneController.allEnemiesInRange(100, this.model.position)) {

            diff.subVectors(this.positionHandR, entity.model.position);

            // console.log(`diff length: ${diff.length()}; radius: ${entity.radius}`);
            if ( diff.length() < entity.radius ) {
                // console.log('hit!');
				// collided
				// diff.normalize(); // .multiplyScalar( ballSize );
				// pos.copy( ballPosition ).add( diff );
                let hitPointReduction = (getRandomArbitrary(0,this.getEffectiveStat('strength'))/10);
                this.inflictDamage(entity, hitPointReduction);

                // Add hit sprites at the location of the hand:
                this.sceneController.formFactory.addSprites(null, hitSpriteConfig, this.sceneController.scene, true, this.positionHandR);

                // this.selectedObject.model.translateZ(-10);
            }
        }

    }

    death(local = true) {
        super.death(local);

        // drop all wares, then cache
        this.inventory.forEach(item => {
            
            if (item) {
                for (let x = 0; x < item.quantity; x++) {
                    /** data: {location ..., itemName..., } */
                    this.sceneController.dropItemToScene({itemName: item.itemName, location: this.location});
                }
            }
        });

        this.inventory = [];

        Object.values(this.equipped).forEach(item => {
            /** data: {location ..., itemName..., } */
            if (item) {
                this.unequip(item[1]);
                this.sceneController.dropItemToScene({itemName: item[0], location: this.location});
            }
        });

        this.equipped = {};
        this.cacheHero(true);

        // setTimeout(() => { // pause before separation
        //     let thisModel = this.model.getObjectByProperty("objectType", "hero");
        //     thisModel.position.copy(this.model.position);
        //     this.sceneController.scene.add(thisModel);

            

            
        // }, 2000);
        
    }

    /** returns the new value */
    changeStat(stat, change, changeMax = false) {

        super.changeStat(stat, change, changeMax);

        if (change < 0) {
            // this.fadeToAction("No", 0.2);
        } else if (change > 1) {
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
        let spell = this.sceneController.getTemplateByName(spellName);
        if (!this.spells.map(el => el.itemName).includes(spellName)) {
            this.spells.push({
                itemName: spell.name
            });
        }
    }

    inflictDamage(entity, hitPointReduction) {

        if (entity.changeStat('health', -hitPointReduction, false) <= 0) {
    
            this.attributes.experience += entity.getStatMax('health');

            if (this.levelUpEligibility().length > 0) {
                setTimeout(() => {
                    this.sceneController.eventDepot.fire('modal', { type: 'levelUp', title: 'Level Up', context: this.levelUpEligibility() });
                }, 1500);
            }

            this.sceneController.eventDepot.fire('updateXP', this.attributes.experience); 
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

    getCurrentConversation() {
        let context = this.attributes.conversation.special;
        context.wares = this.inventory;
    }

}