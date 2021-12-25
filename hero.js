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

    addToInventory(itemName) {

        let itemIndex = this.inventory.map(el => el.itemName).indexOf(itemName);
        if (itemIndex != -1) {
            this.inventory[itemIndex].quantity++;
        } else {
            this.inventory[this.firstInventorySlot()] = {
                itemName: itemName,
                quantity: 1
            }
        }
    }

    removeFromInventory(itemName) {

        let index = this.inventory.findIndex(el => el.itemName);
        
        if (this.inventory[index].quantity > 1) {
            this.inventory[index].quantity--;
        } else {
            this.inventory[index] = {};
        }
    }

    getInventory() {
        return this.inventory;
    }

    equip(area, item) {

        this.addToBodyPart(this.model, area, item);
        
    }

    findBodyPartByName(current, name) {

        if (current.name == name ) {
            return current;
        } else {
            current.children.forEach(child => {
                return this.findBodyPartByName(child, name);
            })
        }
    }

    addToBodyPart(current, name, componentToAdd) {

        if (current.name == name ) {
            componentToAdd.position.set(0,0,0);
            componentToAdd.rotation.y = Math.PI;
            componentToAdd.scale.copy(new THREE.Vector3( .1,.1,.1 ));
            current.add(componentToAdd);
            return current;
        } else {
            current.children.forEach(child => {
                return this.addToBodyPart(child, name, componentToAdd);
            })
        }
    }

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