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
        this.inventory = this.template.inventory;
        this.attributes = this.template.attributes;
        this.spells = this.template.spells;
        this.equipped = this.template.equipped;
        this.selectedObject = null;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

        // Actually just a starting/saved location
        this.location = this.template.location? this.template.location : { x: 0, y: 0, z: 0 };

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        // // Proximity Light is used for object selection/identification
        this.proximityLight = new THREE.PointLight( 0x00ff00, 5, 250, 30 );
        // this.proximityLight.position.set( 0, 0, 0 );
        

        this.cacheHero();

    }

    load(callback) {

        super.load(() => {

            /** For the hero, the controls obj IS the model, which contains the gltf model */
            let modelCopy = this.model;
            modelCopy.rotation.y = Math.PI;
            modelCopy.position.set(0,0,0); // hero model is always centered in the controls

            this.model = this.controls;

            this.setToCastShadows();
            this.model.add( modelCopy );
            this.model.add( this.proximityLight );

            if (this.template.location) {
                this.model.position.x = this.template.location.x * multiplier;
                this.model.position.z = this.template.location.z * multiplier;
                this.model.position.y = this.determineElevationFromBase();
            }

            if (this.equipped) {
                Object.keys(this.equipped).forEach(bodyPart => {
                    this.equip(bodyPart, this.equipped[bodyPart]);
                })
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
            let itemName = this.equipped[keyString];

            if (itemName) {
                let item = JSON.parse(localStorage.getItem('gameObjects'))[itemName];

                let itemType = item.type;
    
                // Using this will diminish the item quantity in inventory for items, or mana for spells
                if (itemType == "item") {
    
                    // What is the item effect?
                    let [stat, change] = item.attributes.effect.split("/");
    
                    switch (stat) {
                        case "health":
                        case "mana": 
                            this.fadeToAction("ThumbsUp", 0.2); // TODO: Use sprites to spritz things up
                            this.changeStat(stat, change, false);
                            break;
    
                        case "damage":
                            this.fadeToAction("Yes", 0.2);
                            if (this.selectedObject.changeStat("health", change, false) <= 0) {
                                this.fadeToAction("Dance", 0.2);
                            }
                            break;
                    }
    
                    if (this.removeFromInventory(itemName) == -1) this.unequip(keyString);
                    this.cacheHero();
                
                } else { 
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
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('unequipItem', (data) => {
            this.unequip(data);
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('equipItem', (data) => {
            this.equip(data.bodyPart, data.itemName);
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('placeItem', (data) => {
            this.addToInventory(data.itemName, data.desiredIndex);
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('takeItemFromScene', (data) => {
            this.addToInventory(data.itemName);
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('removeItem', (itemName) => {
            this.removeFromInventory(itemName);
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('setHeroStat', (data) => {
            this.attributes.stats[data.type] = data.points + '/' + this.attributes.stats[data.type].split('/')[1];
            this.cacheHero();
        })

        this.sceneController.eventDepot.addListener('setHeroStatMax', (data) => {
            this.attributes.stats[data.type] = this.attributes.stats[data.type].split('/')[0] + '/' + data.points;
            this.cacheHero();
        })

        this.sceneController.eventDepot.addListener('dropItemToScene', (data) => {
            
            if (data.source.length < 3) {  // inventory
                this.removeFromInventory(data.itemName);
            } else { // equipped
                this.unequip(data.source);
            }
            this.cacheHero();
        });

        this.sceneController.eventDepot.addListener('mouse0click', () => {

            if (this.alive && this.selectedObject) {

                let objectType = this.selectedObject.objectType;
                
                if (objectType == "item") {
                    this.sceneController.eventDepot.fire('takeItemFromScene', {itemName: this.selectedObject.objectName, uuid: this.selectedObject.model.uuid});

                } else if (objectType == "friendly") {
                    
                    // TODO: conversation
                    this.sceneController.eventDepot.fire('unlockControls', {});
                    this.sceneController.eventDepot.fire('modal', { name: this.selectedObject.objectName });
                
                } else if (objectType == "beast") {

                    // TODO: combat
                    this.fadeToAction("Punch", 0.2)

                    let chanceToHit = this.getStat('agility') / 10;
                    let hitPointReduction = getRandomArbitrary(0,this.getStat('strength'));

                    // console.dir(this.selectedObject);
                    if (Math.random() < chanceToHit) {  // this.selectedObject.getStat('health') > 0 &&

                        // this.sceneController.eventDepot.fire('statusUpdate', { 
                        //     message: `${this.selectedObject.objectName} has ${this.selectedObject.getStat('health')} hit points` 
                        // }); 
                        
                        if (this.selectedObject.changeStat('health', -hitPointReduction, false) <= 0) {

                            this.attributes.experience += this.selectedObject.getStatMax('health');
                            this.sceneController.eventDepot.fire('statusUpdate', { 
                                message: `${this.selectedObject.objectName} killed for ${this.selectedObject.getStatMax('health')} XP` 
                            }); 
                            this.fadeToAction("Dance", 0.2);
                        };
                    }

                } else if (objectType == "structure") {
                    
                    var accessible = this.selectedObject.attributes.key ? 
                        this.inventory.map(el => {
                            return el? el.itemName: null;
                        }).includes(this.selectedObject.attributes.key) :
                        true;
                    
                    if (accessible) {
                        this.selectedObject.updateAttributes({unlocked: true});
                        if (this.selectedObject.activeAction) {
                            this.selectedObject.runActiveAction(0.2);
                        }
                    }
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
        this.sceneController.eventDepot.removeListeners('setHeroStat');
        this.sceneController.eventDepot.removeListeners('setHeroStatMax');
        this.sceneController.eventDepot.removeListeners('dropItemToScene');
        this.sceneController.eventDepot.removeListeners('mouse0click');
        this.sceneController.eventDepot.removeListeners('unlockControls');
        this.sceneController.eventDepot.removeListeners('jump');
        this.dispose(this.model);
        callback();
    }

    firstInventorySlot() {
        let max = this.inventory.length;
        for (let i = 0; i < this.inventory.length; i++ ) {
            if (!this.inventory[i] || !this.inventory[i].itemName) return i;
        }
        return max;
    }
    
    addToInventory(itemName, desiredIndex) {

        var quantity;
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1) {
            quantity = this.inventory[itemIndex].quantity + 1;
        } else {

            // If desiredIndex is already defined, use the first inventory slot
            if (desiredIndex == undefined || this.inventory[desiredIndex]) {
                itemIndex = this.firstInventorySlot();
            } else itemIndex = desiredIndex;

            quantity = 1;
        }

        this.inventory[itemIndex] = {
            itemName: itemName,
            quantity: quantity
        }

        return {itemIndex, quantity};
    }

    /**
     * returns the remaining quantity
     */
    removeFromInventory(itemName) {

        let index = this.inventory.findIndex(el => {
            return el != undefined && el.itemName == itemName
        });

        if (index != -1) {
            if (this.inventory[index].quantity > 1) {
                this.inventory[index].quantity--;
                return this.inventory[index].quantity;
            } else {
                this.inventory[index] = null;
                return 0;
            }
        } else return -1;
    }

    swapInventoryPositions(first,second) {
        let temp = {...this.inventory[first]};
        let temp2 = {...this.inventory[second]};
        this.inventory[first] = temp2;
        this.inventory[second] = temp;
    }

    getInventory() {
        return this.inventory;
    }

    equip(area, itemName) {
        this.equipped[area] = itemName;
        this.sceneController.loadFormbyName(itemName, (item) => {

            item.model.position.set(0,0,0);
            item.model.rotation.y = Math.PI;
            item.model.scale.copy(new THREE.Vector3( .1,.1,.1 ));
    
            if (itemName == "torch") {
                this.sceneController.formFactory.addTorchLight(item.model);
            } 

            // Apply effects of items if applied to body parts (non 'key' positions)
            if (!(/key/.test(area)) && item.attributes.effect) {
                
                // What is the item effect?
                let stat = item.attributes.effect.split("/")[0];
                let change = Number(item.attributes.effect.split("/")[1]);

                switch (stat) {
                    case "health":
                    case "mana":
                    case "strength": 
                        this.changeStat(stat, change, true);
                        break;
                    case "light":
                        this.sceneController.overheadPointLight.intensity += 10;
                        break;
                }
            }
            
            if (area.match('key')) {
                this.sceneController.eventDepot.fire('refreshSidebar', { equipped: this.equipped });
            } else {
                // this.model.getObjectByName("Middle2R").add(item.model);
                this.model.getObjectByName(area).add(item.model);
                console.log("test")
            }
            
        });
    }
    
    unequip(area) {

        // Which item is being unequipped?
        let itemName = this.equipped[area];


        delete this.equipped[area];
        
        if (area.match('key')) {
            this.sceneController.eventDepot.fire('refreshSidebar', { equipped: this.equipped });
        } else {
            let thisArea = this.model.getObjectByName(area);
            thisArea.children.forEach(child => {
                thisArea.remove(child);
            })
    
        }
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

    updateHeroStats = () => {

        Object.keys(this.attributes.stats).forEach(stat => {
            
            let points = this.attributes.stats[stat].split('/')
            let cur = Number(points[0]);
            let max = Number(points[1]);

            this.sceneController.eventDepot.fire('setHeroStatMax', { type: stat, points: max});
            this.sceneController.eventDepot.fire('setHeroStat', { type: stat, points: cur});

        })

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
            
            let agility = this.attributes.stats.agility.split('/')[0];

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

}