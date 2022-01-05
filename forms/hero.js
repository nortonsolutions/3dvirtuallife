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

    constructor(heroTemplate, formFactory) {
        
        super(heroTemplate, formFactory);

        this.name = heroTemplate.name;
        this.gltf = heroTemplate.gltf;
        this.model = heroTemplate.model;
        this.inventory = heroTemplate.inventory;
        this.spells = heroTemplate.spells;
        this.equipped = heroTemplate.equipped;
        this.eventDepot = formFactory.eventDepot;
        
        this.selectedObject = null;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

        // Actually just a starting/saved location
        this.location = heroTemplate.location? heroTemplate.location : { x: 0, y: 0, z: 0 };
        this.cacheHero();
        

    }

    cacheHero() {
        localStorage.setItem('gameHeroTemplate', JSON.stringify(this.returnTemplate()));
    }

    addEventListeners() {

        this.eventDepot.addListener('updateHeroLocation', data => {
            this.location.x = data.x;
            this.location.y = data.y;
            this.location.z = data.z;

            this.velocity.x = 0;
            this.velocity.z = 0;
            this.cacheHero();
        })

        this.eventDepot.addListener('swapInventoryPositions', (data) => {
            this.swapInventoryPositions(data.first, data.second);
            this.cacheHero();
        });

        this.eventDepot.addListener('unequipItem', (data) => {
            this.unequip(data);
            this.cacheHero();
        });

        this.eventDepot.addListener('equipItem', (data) => {
            this.equip(data.bodyPart, data.itemName);
            this.cacheHero();
        });

        this.eventDepot.addListener('placeItem', (data) => {
            this.addToInventory(data.itemName, data.desiredIndex);
            this.cacheHero();
        });

        this.eventDepot.addListener('takeItemFromScene', (data) => {
            this.addToInventory(data.itemName);
            this.cacheHero();
        });

        this.eventDepot.addListener('removeItem', (itemName) => {
            this.removeFromInventory(itemName);
            this.cacheHero();
        });

        this.eventDepot.addListener('setHeroStat', (data) => {
            this.attributes.stats[data.type] = data.points + this.attributes.stats[data.type].substring(2);
            this.cacheHero();
        })

        this.eventDepot.addListener('setHeroStatMax', (data) => {
            this.attributes.stats[data.type] = this.attributes.stats[data.type].substring(0,3) + data.points;
            this.cacheHero();
        })

        this.eventDepot.addListener('dropItemToScene', (data) => {
            
            if (data.source.length < 3) {  // inventory
                this.removeFromInventory(data.itemName);
            } else { // equipped
                this.unequip(data.source);
            }
            this.cacheHero();
        });

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
        
        this.eventDepot.removeListeners('updateHeroLocation');
        this.eventDepot.removeListeners('swapInventoryPositions');
        this.eventDepot.removeListeners('unequipItem');
        this.eventDepot.removeListeners('equipItem');
        this.eventDepot.removeListeners('placeItem');
        this.eventDepot.removeListeners('takeItemFromScene');
        this.eventDepot.removeListeners('removeItem');
        this.eventDepot.removeListeners('dropItemToScene');
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
        
        if (this.inventory[index].quantity > 1) {
            this.inventory[index].quantity--;
            return this.inventory[index].quantity;
        } else {
            this.inventory[index] = null;
            return 0;
        }
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
    }

    unequip(area) {
        delete this.equipped[area];
        let thisArea = this.model.getObjectByName(area);
        thisArea.children.forEach(child => {
            thisArea.remove(child);
        })
    }

    returnTemplate() {

        return {
            name: this.name,
            type: "hero",
            location: this.location,
            attributes: this.attributes,
            gltf: this.gltf,
            model: null,
            inventory: this.inventory,
            spells: this.spells,
            equipped: this.equipped
        }
    }

}