import { AnimatedForm } from './animated.js'

/** IntelligentForms are AnimatedForms which also
 * move and make decisions every turn.  Subclasses
 * include the Hero and ArtificialForms (AIs).
 * 
 * They also have an inventory and can equip items.
 */

export class IntelligentForm extends AnimatedForm{

    constructor(template, sceneController) {
        super(template, sceneController);

        // Animation mixer has been added by superclass
        this.absVelocity = 0;
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

        this.justJumped = false;
        this.standingUpon = null;
        this.canJump = true;
        this.alive = true;

        this.inventory = this.template.inventory;
        this.attributes = this.template.attributes;
        this.spells = this.template.spells;
        this.equipped = this.template.equipped;

        this.movementRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.length/2 + 35 );
        // this.movementRaycasterR = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        // this.movementRaycasterL = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        
    }

    /** load is for loading the model and animations specifically */
    load(callback) {
        
        super.load(() => {
            // this.listGeometries(this.model);
            // this.listPositions(this.model);
            // this.getBoundingSphereHandR(this.model);
            // this.setToDoubleSided(this.model);
            this.computeVertexNormals(this.model);
            this.setToCastShadows();
            if (callback) callback();
        })

    }

    getBoundingSphereHandR(el) {
        // if (el.geometry)

        // let temp = this.model.getObjectByName('HandR'); // .children[1];
        // temp.computeBoundingSphere();
        // console.log("Test")

    }

    listGeometries(el) {

        if (el.geometry) {
            console.log(`${this.objectName}: ${el.name}`);
            el.children.forEach(child => {
                this.listGeometries(child);
            })
        } else {
            el.children.forEach(child => {
                this.listGeometries(child);
            })
        }
    }

    listPositions(el) {
        if (el.position) {
            console.log(`${this.objectName}: ${el.name} ${el.position.x},${el.position.z} `);
            el.children.forEach(child => {
                this.listPositions(child);
            })
        } else {
            el.children.forEach(child => {
                this.listPositions(child);
            })
        }
    }



    /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    move(delta) {
        
        if (this.alive) {
            let worldDirection = new THREE.Vector3().copy(this.direction).applyEuler( this.rotation );
            this.movementRaycaster.ray.direction.x = worldDirection.x; // -worldDirection.x;
            this.movementRaycaster.ray.direction.z = worldDirection.z; // -worldDirection.z;
            this.movementRaycaster.ray.origin.y += this.attributes.height;
            
            if (typeof this.sceneController.waterElevation == "number") {
                
                if (this.model.position.y < this.sceneController.waterElevation) {
                    let distanceBelowWater = Math.abs(this.sceneController.waterElevation - this.model.position.y);
                    this.velocity.x *= Math.max((100-(distanceBelowWater*3))/100,.005);
                    this.velocity.y *= Math.max((100-(distanceBelowWater*3))/100,.005);
                    this.velocity.z *= Math.max((100-(distanceBelowWater*3))/100,.005);
                }
    
            }


            // Essentially set Lx = -wDz and Lz = wDx, then Rx = wDz and Rz = -wDx
            // let worldDirectionL = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, -Math.PI/2, 0, 'YXZ' ));
            // let worldDirectionR = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, Math.PI/2, 0, 'YXZ' ));
    
            // if (worldDirection.x != 0 || worldDirection.z != 0) {
            //     console.log(`${this.objectName} wD: ${worldDirection.x},${worldDirection.z}`);
            //     console.log(`${this.objectName} rc: ${this.movementRaycaster.ray.direction.x},${this.movementRaycaster.ray.direction.z}`);
            //     console.log(`${this.objectName} V: ${this.velocity.x},${this.velocity.z}`);
            //     console.log(`${this.objectName} D: ${this.direction.x},${this.direction.z}`);
            //     console.log(`${this.objectName} rotationY: ${this.model.rotation.y}`);
            // }
            
            // Can I avoid the filter here using object attributes.length and width as the starting point for the ray?
            let fIntersects = this.movementRaycaster.intersectObjects(this.sceneController.structureModels, true);
            
            if (fIntersects.length == 0 || (fIntersects[0] && fIntersects[0].object.type == "Sprite")) { // Nothing is in the front, so move forward at given velocity
                
                this.model.translateX( this.velocity.x * delta );
                this.model.translateY( this.velocity.y * delta );
                this.model.translateZ( this.velocity.z * delta );
    
            } else { // Something is blocking, so stop without moving
                
                if (this.objectType != "hero") {
                    this.model.translateX( -this.velocity.x * delta );
                    this.model.translateZ( -this.velocity.z * delta );
                } else {
                    console.dir(fIntersects[0]);
                }
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.velocity.z = 0;
    
                this.sceneController.eventDepot.fire('updateHelper', { position: fIntersects[0].point, color: { r: 0, g: 1, b: 0 }});
                
            }
    
        }
    }

    setElevation() {
        
        let downRayOriginHeight = this.model.position.y + 30;

        this.downRaycaster.ray.origin.copy(this.model.position);
        this.downRaycaster.ray.origin.y = downRayOriginHeight;

        let downwardIntersections = this.downRaycaster.intersectObjects( this.sceneController.structureModels, true );
        if (downwardIntersections[0]) { 
            var topOfObject = downRayOriginHeight - downwardIntersections[0].distance + 2;
            if (this.model.position.y <= topOfObject) {
                
                this.model.position.y = topOfObject;
                let standingUpon = getRootObject3D(downwardIntersections[0].object);
                this.standingUpon = {
                    objectName: standingUpon.objectName,
                    objectType: standingUpon.objectType,
                    attributes: standingUpon.attributes
                }
                this.velocity.y = Math.max( 0, this.velocity.y );
                this.canJump = true;
                this.justJumped = false;
            }
            
        } else {

            this.standingUpon = null;

            let newYposition = this.determineElevationFromBase();

            if (newYposition == -1) { 
                this.model.position.x = shiftTowardCenter(this.model.position.x);
                this.model.position.z = shiftTowardCenter(this.model.position.z);
                return -1;
            } else if ((this.model.position.y - newYposition) < this.attributes.height) {
                this.model.position.y = newYposition;
            }
        }
    }

    /** returns the new value */
    changeStat(stat, change, changeMax = false) {

        change = Number(change);
        let currentStat = this.attributes.stats[stat].split('/');
        let cur = Number(currentStat[0]);
        let max = Number(currentStat[1]);
        let newvalue = 0;

        if (changeMax) max = max + change;

        if (change > 0) {
            // this.fadeToAction("Yes", 0.2); 
            // this.fadeToAction("ThumbsUp", 0.2);
            newvalue = Math.min(max, cur + change);
        } else {
            newvalue = cur + change;

            if (stat == "health") { 

                if (this.alive && newvalue <= 0) {
                    this.death();
                } else if (this.alive) {
                    // this.fadeToAction("No", 0.2);
                } 
            } else {
                // 
            }
        }

        this.attributes.stats[stat] = Number(newvalue).toFixed(2) + "/" + Number(max).toFixed(2) + "/" + this.getStatBoost(stat); //.toLocaleString('en-US',{minimumIntegerDigits:2})

        if (this.objectType == "hero") this.updateHeroStats(stat);

        this.sceneController.eventDepot.fire('statusUpdate', { 
            message: `${this.objectName} ${stat} stat updated: ${this.attributes.stats[stat]}` 
        }); 
        return newvalue;
    }


    changeStatBoost(stat, change) {
        change = Number(change);
        let currentBoost = this.getStatBoost(stat);

        this.attributes.stats[stat] = this.getStat(stat) + "/" + this.getStatMax(stat) + "/" + (Number(currentBoost) + Number(change));

        if (this.objectType == "hero") this.updateHeroStats(stat);
        
        this.sceneController.eventDepot.fire('statusUpdate', { 
            message: `${this.objectName} ${stat} stat boosted: ${this.attributes.stats[stat]}` 
        }); 
    }

    getStatAll(stat) {
        return Number(this.attributes.stats[stat]);
    }

    getStat(stat) {
        return Number(this.attributes.stats[stat].split('/')[0]);
    }

    getStatMax(stat) {
        return Number(this.attributes.stats[stat].split('/')[1]);
    }

    getStatBoost(stat) { // statBoost effectively raises the stat for runtime
        return Number(this.attributes.stats[stat].split('/')[2]);
    }

    getEffectiveStat(stat) {
        return this.getStat(stat) + this.getStatBoost(stat);
    }

    death() {

        this.alive = false;
        this.sceneController.entities = this.sceneController.entities.filter(el => el != this);
        // this.fadeToAction("Death", 0.2);

        if (this.attributes.grants) {
            this.attributes.grants.forEach(itemName => {
                // load the object model to the scene, copy the position/rotation of hero,
                this.sceneController.loadFormbyName(itemName, (item) => {
                    item.model.position.copy(this.model.position);
                    item.model.position.y = this.determineElevationFromBase();
                });
            })
        }
    }

    firstInventorySlot() {
        let max = this.inventory.length;
        for (let i = 0; i < this.inventory.length; i++ ) {
            if (!this.inventory[i] || !this.inventory[i].itemName) return i;
        }
        return max;
    }

    getInventoryQuantity(itemName) {
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1)
         {
            return this.inventory[itemIndex].quantity;
        } else return 0;
    }

    getGoldValue(itemName) {

        let gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        let obj = gameObjects[itemName];
        if (obj.attributes.value) {

            let goldValue = this.attributes.goldValue? this.attributes.goldValue: 1;
            return Number(obj.attributes.value / goldValue);
        } else return 0;
    }

    getTotalNetWorth() {
        let worth = 0;
        this.inventory.forEach(item => {
            if (item.itemName == "gold") {
                worth += item.quantity;
            } else {
                worth += getGoldValue(item.itemName);
            }
        })
        return worth;
    }

    addToInventory(itemName, desiredIndex, quantity) {

        var newQuantity;
        var itemIndex = this.inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1) {
            newQuantity = this.inventory[itemIndex].quantity + quantity;
        } else {

            // If desiredIndex is already defined, use the first inventory slot
            if (desiredIndex == undefined || this.inventory[desiredIndex]) {
                itemIndex = this.firstInventorySlot();
            } else itemIndex = desiredIndex;

            newQuantity = quantity;
        }

        this.inventory[itemIndex] = {
            itemName: itemName,
            quantity: newQuantity
        }

        if (this.objectType == "hero") this.cacheHero();
        return {itemIndex, quantity: newQuantity};
    }

    /**
     * returns the remaining quantity
     */
    removeFromInventory(itemName) {

        let index = this.inventory.findIndex(el => {
            return el != undefined && el.itemName == itemName
        });

        var quantityRemaining;
        if (index != -1) {
            if (this.inventory[index].quantity > 1) {
                this.inventory[index].quantity--;
                quantityRemaining = this.inventory[index].quantity;
            } else {
                this.inventory[index] = null;
                quantityRemaining = 0;
            }
        } else quantityRemaining = -1;

        if (this.objectType == "hero") this.cacheHero();
        return quantityRemaining;
    }

    swapInventoryPositions(first,second) {
        let temp = {...this.inventory[first]};
        let temp2 = {...this.inventory[second]};
        this.inventory[first] = temp2;
        this.inventory[second] = temp;
        if (this.objectType == "hero") this.cacheHero();
    }

    getInventory() {
        return this.inventory;
    }

    inventoryContains(items) {
        var found = false;
        items.forEach(item => {
            if (this.inventory.map(el => el? el.itemName: null).includes(item)) found = true;
        })
        return found;
    }

    inventoryContainsAll(items) {
        // var found = true;

        for (const item of items) {
            if (!(this.inventory.map(el => el? el.itemName: null).includes(item))) return false;
        }
        // items.forEach(item => {
            
        // })
        return true;
    }

    equip(area, itemName, throwable = false, throws = null) {
        this.equipped[area] = [itemName,throwable,throws];
        
        if (area.match('key')) {
            this.sceneController.eventDepot.fire('refreshSidebar', { equipped: this.equipped });
        } else {
            this.sceneController.loadFormbyName(itemName, (item) => {

                item.model.position.set(0,0,0);
                item.model.rotation.y = Math.PI;

                let scale = item.attributes.equippedScale? item.attributes.equippedScale: 0.1;
                item.model.scale.copy(new THREE.Vector3( scale, scale, scale ));

                if (itemName == "torch") {
                    this.sceneController.formFactory.addTorchLight(item.model);
                } 

                if (item.attributes.effect && !item.attributes.throwable) { // body parts (non 'key' positions)
                    
                    // What is the item effect?
                    let stat = item.attributes.effect.split("/")[0];
                    let change = Number(item.attributes.effect.split("/")[1]);
    
                    switch (stat) {
                        case "health":
                        case "mana":
                        case "strength":
                        case "agility":
                        case "defense": 
                            this.changeStatBoost(stat, change);
                            break;
                        case "light":
                            if (this.sceneController.overheadPointLight) this.sceneController.overheadPointLight.intensity += 10;
                            break;
                    }
                }
                

                if (area != "special") this.model.getObjectByName(area).add(item.model);
                
                if (item.attributes.animates) {

                    this.animatedSubforms.push([area,item]);
                }

            });
        }
        if (this.objectType == "hero") this.cacheHero();

    }
    
    unequip(area) {
        
        if (this.equipped[area]) {
            let itemName = this.equipped[area][0];

            delete this.equipped[area];
            
            if (area.match('key')) {
                this.sceneController.eventDepot.fire('refreshSidebar', { equipped: this.equipped });
            } else {
                
                let gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
                let item = gameObjects[itemName];
    
                if (area != "special") { // special = no model to remove
                    let thisItem = this.model.getObjectByProperty("objectName", itemName);
                    thisItem.parent.remove(thisItem);
                    this.sceneController.scene.scene.remove(thisItem);
                }
    
                if (item.attributes.effect) {
                    let stat = item.attributes.effect.split("/")[0];
                    let change = Number(item.attributes.effect.split("/")[1]);
        
                    switch (stat) {
                        case "health":
                        case "mana":
                        case "strength":
                        case "agility": 
                            this.changeStatBoost(stat, -change);
                            break;
                        case "light":
                            if (this.sceneController.overheadPointLight) this.sceneController.overheadPointLight.intensity -= change;
                            break;
                    }
                }
    
                if (item.attributes.animates) {
                    this.animatedSubforms = this.animatedSubforms.filter(el => { el[0] != area });
                }
            }
    
            if (this.objectType == "hero") this.cacheHero();
    
    
        }

    }

}