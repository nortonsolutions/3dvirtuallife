export class Hero {

    // Sample empty hero:
    // {
    //     name: 'Dave',
    //     attributes: {
    //          height: 20
    //     },
    //     inventory: []
    // }

    constructor(hero, eventDepot) {
        this.name = hero.name;
        this.gltf = hero.gltf;
        this.model = hero.model;
        this.attributes = hero.attributes;
        this.inventory = hero.inventory;
        this.equipped = hero.equipped;
        this.eventDepot = eventDepot;
        
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

        // Actually just a starting/saved location
        if (hero.location) this.location = hero.location;
    }

    addEventListeners() {
        this.eventDepot.addListener('takeItem', (data) => {
            this.addToInventory(data.name);
        });

        this.eventDepot.addListener('dropItem', (itemName) => {
            this.removeFromInventory(itemName);
        });
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
        var itemIndex = this.inventory.map(el => el.itemName).indexOf(itemName);
        if (itemIndex != -1) {
            quantity = this.inventory[itemIndex].quantity + 1;
        } else {

            // If desiredIndex is already defined, use the first inventory slot
            if (this.inventory[desiredIndex]) {
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
            this.inventory[index] = {};
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

    /* Assumes item is the full Object3D after loading */
    equip(area, item) {
        this.equipped[area] = item.objectName;

        item.position.set(0,0,0);
        item.rotation.y = Math.PI;
        item.scale.copy(new THREE.Vector3( .1,.1,.1 ));
        // this.addToBodyPart(this.model, area, item);
        this.model.getObjectByName(area).add(item);
    }

    /* Unequips by bodypart and itemName */
    unequip(area) {
        delete this.equipped[area];
        // this.removeFromBodyPart(this.model, area, item);
        // findBodyPartByName(this.model, area).remove(item);
        let thisArea = this.model.getObjectByName(area);
        thisArea.children.forEach(child => {
            thisArea.remove(child);
        })
    }

    // findBodyPartByName(current, name) {

    //     if (current.name == name ) {
    //         return current;
    //     } else {
    //         current.children.forEach(child => {
    //             return this.findBodyPartByName(child, name);
    //         })
    //     }
    // }

    // addToBodyPart(current, area, componentToAdd) {

    //     if (current.name == area ) {
    //         componentToAdd.position.set(0,0,0);
    //         componentToAdd.rotation.y = Math.PI;
    //         componentToAdd.scale.copy(new THREE.Vector3( .1,.1,.1 ));
    //         current.add(componentToAdd);
    //         return current;
    //     } else {
    //         current.children.forEach(child => {
    //             return this.addToBodyPart(child, area, componentToAdd);
    //         })
    //     }
    // }

    basic() {

        return {
            name: this.name,
            type: "hero",
            location: this.location,
            attributes: this.attributes,
            gltf: this.gltf,
            model: null,
            inventory: this.inventory,
            equipped: this.equipped
        }
    }

}