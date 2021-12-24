/**
 * A 'Location' is like a room, in which multiple people can coexist.
 * Later the concept of boundaries for fermionic matter will exist
 * within the sphere of a single location, so two objects cannot
 * occupy the exact spacetime coordinate.
 * 
 * 'Self' refers to the player, who controls himself and his things.
 * 
 * 'Others' are like the human player, and may represent other human
 * players who have joined the game, or artificial intelligence.
 * They will compete with the player to carry out various objectives,
 * compete for territory and prizes, etc.  They can be cooperative
 * and engage in trades or other negotiations as well.
 * 
 * 'Items' are items of interest in the game, things to be possessed
 * by the player or others.  The may be animate or inanimate, or may
 * provide special abilities, etc.  The prototypical item is a key,
 * which can be used to unlock a doorway which leads to a prize.
 * 
 * 'Structures' occupy space in the world but cannot be possessed, 
 * such as buildings, permanent fixtures, etc.
 * 
 * This class is the controller of the layout, accepting a number of
 * Others to place on the layout, along with an array of Items to disperse.
 * 
 * This class will NOT be responsible for keeping track of further movement,
 * as each entity or item will keep track of its own location and communicate
 * location changes to the world.
 */

import {LevelBuilder} from './levelBuilder.js';
import {Items} from './blueprints/items.js';
import {Entities} from './blueprints/entities.js';
import {Structures} from './blueprints/structures.js';


class LayoutManager {

    constructor(props) {

        this.props = props;

        this.allItems = Items;
        this.allStructures = Structures;
        this.allEntities = Entities;
        this.allObjects = {...Items, ...Structures, ...Entities, ...{ floor: { description: "floor"}}};

        this.layout = {};
        
        if (props.layouts[props.level]) {
            this.layout = props.layouts[props.level];
        } else {
            this.levelBuilder = new LevelBuilder(this.props.level);
            this.layout = this.levelBuilder.getLayout();
        }

        this.props.hero.location = this.props.hero.location? this.props.hero.location : this.levelBuilder.randomUniqueLocation();
        
    }

    getObject(name) {
        return this.allObjects[name];
    }

    getObjectDetail(objectName,detailName) {
        return this.allObjects[objectName][detailName];
    }

    getAllItems() {
        return this.allItems;
    }

    getAllStructures() {
        return this.allStructures;
    }

    getAllEntities() {
        return this.allEntities;
    }

    getLayout() {
        return this.layout;
    }

    getLevel() {
        return this.props.level;
    }

    updateLayout(payload) {
        this.layout = {...this.layout, ...payload};
    }

    getLevelObjects() {
        return [...this.layout.items, ...this.layout.structures, ...this.layout.entities];
    }
}

export {LayoutManager};