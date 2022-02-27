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
            background: this.level.background,
            backgroundNight: this.level.backgroundNight,
            description: this.level.description
        }
    }

    getLevelObjects() {
        return this.levelObjects;
    }

    mapItemToLocation = (item) => {
        let newItem = {
            name: item.name,
            location: item.location? item.location : this.randomUniqueLocation(item.type && item.type=="beast")
        }

        if (item.attributes) newItem.attributes = item.attributes;
        return newItem;
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

    randomUniqueLocation(beast = false) {
        
        let location = {
            x: getRndInteger(-this.level.width/2,this.level.width/2),
            y: 0,
            z: getRndInteger(-this.level.length/2,this.level.length/2)
        }

        if (!this.usedLocations.includes(location) && (!beast || this.outsideSafeZones(location))) {
            this.usedLocations.push(location);
            return location;
        } else {
            return this.randomUniqueLocation(beast); 
        }


    }

    /**
     *  noSpawnZones: [
     *      // [location,radius] (both in location units, i.e. /multiplier)
     *      [{ x: 0, y: 0, z: 0},5]
     *  ]
     */ 
    outsideSafeZones(location) {

        let zones = this.level.terrain.attributes.noEnemySpawnZones;

        for (let zone of zones) {
            let origin = new THREE.Vector3().copy(zone[0]);
            let testPoint = new THREE.Vector3().copy(location);
            if (origin.distanceTo(testPoint) < zone[1]) {
                return false;
            }
        }

        return true;
    }
}

export {LevelBuilder};