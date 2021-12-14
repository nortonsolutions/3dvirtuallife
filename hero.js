export class Hero {

    // Sample empty hero:
    // {
    //     name: 'Dave',
    //     height: 20,
    //     inventory: []
    // }

    constructor(hero, eventDepot) {
        this.name = hero.name;
        this.gltf = hero.gltf;
        this.scale = hero.scale;
        this.height = hero.height;
        this.inventory = hero.inventory;
        this.eventDepot = eventDepot;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

    }

    addEventListeners() {
        this.eventDepot.addListener('takeItem', (item) => {
            this.addToInventory(item);
        });

        this.eventDepot.addListener('dropItem', (item) => {
            this.removeFromInventory(item);
        });
    }

    /**
     * 
     * @param {} itemName refers to the name of the prototype in /layout/blueprints/items.js
     *
     * Each item may have multiple instances, so inventory keeps track of itemName:quantity
     */
    addToInventory(itemName) {

        if (Object.keys(this.inventory).includes(itemName)) {
            this.inventory[itemName]++;
        } else {
            this.inventory[itemName] = 1;
        }
        console.log("Inventory:")
        console.dir(this.inventory);
    }

    removeFromInventory(itemName) {
        if (this.inventor[itemName] > 1) {
            this.inventory[itemName]--;
        } else {
            delete this.inventory[itemName];
        }
        console.log("Inventory:")
        console.dir(this.inventory);
    }

    getInventory() {
        return this.inventory;
    }

}