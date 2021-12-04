/**
 * The Entity represents an intelligent being, either good or evil,
 * fleshed out based upon the blueprint details in the layout.
 * Beyond the parameters defined in the blueprint, this Entity will
 * provide action functions and other characteristics for the UI.
 *  
 */

class Entity {

    constructor(props) {
        this.name = props.name;
        this.location = props.location;
        this.inventory = props.inventory;
        this.attributes = props.attributes;
    }

    toString() {
        return this.name;
    }

    getLocation() {
        return this.location;
    }

    getInventory() {
        return this.inventory;
    }

    getAttributes() {
        return this.attributes;
    }
}

export {Entity};