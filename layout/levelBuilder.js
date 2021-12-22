import {levels} from './blueprints/levels.js'


class LevelBuilder {

    constructor(level) {
        
        this.usedLocations = [];
        this.level = levels.find(el => el.level == level);

        this.levelItems = this.level.items.map(this.mapItemToLocation);
        this.levelEntities = this.level.entities.map(this.mapItemToLocation);
        this.levelStructures = this.level.structures.map(this.mapItemToLocation);

        this.levelObjects = [...this.levelItems, ...this.levelStructures, ...this.levelEntities];
    
    }

    getLayout() {
        return {
            terrain: this.level.terrain,
            items: this.levelItems,
            structures: this.levelStructures,
            entities: this.levelEntities,
            width: this.level.width,
            length: this.level.length,   
            background: this.level.background
        }
    }

    getLevelObjects() {
        return this.levelObjects;
    }

    mapItemToLocation = (item) => {
        return {
            ...item,
            location: item.location? item.location : this.randomUniqueLocation()
        }
    }

    randomLocation() {
        
        let location = {
            x: getRndInteger(-this.level.width/2,this.level.width/2),
            y: 0,
            z: getRndInteger(-this.level.length/2,this.level.length/2)

        }

        this.usedLocations.push(location);
        return location;
    }

    randomUniqueLocation() {
        
        let location = {
            x: getRndInteger(-this.level.width/2,this.level.width/2),
            y: 0,
            z: getRndInteger(-this.level.length/2,this.level.length/2)
        }

        if (!this.usedLocations.includes(location)) {
            this.usedLocations.push(location);
            return location;
        } else {
            return randomUniqueLocation(); 
        }
 

    }
}

export {LevelBuilder};