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

}

export {Entity};