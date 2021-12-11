export class Hero {

    // Sample empty hero:
    // {
    //     name: 'Dave',
    //     height: 20,
    //     inventory: []
    // }

    constructor(hero, eventDepot) {
        this.name = hero.name;
        this.height = hero.height;
        this.inventory = hero.inventory;
        this.eventDepot = eventDepot;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

    }

    addEventListeners() {
        this.eventDepot.addListener('takeItem', function(item) {
            this.addToInventory(item);
        });

        this.eventDepot.addListener('dropItem', function(item) {
            this.removeFromInventory(item);
        });
    }

    addToInventory(item) {
        this.inventory.push(item);
    }

    removeFromInventory(item) {
        this.inventory = this.inventory.filter()
    }

    getInventory() {
        return this.inventory;
    }




}