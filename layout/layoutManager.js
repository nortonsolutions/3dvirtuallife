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

import { LevelBuilder } from './levelBuilder.js';
import { Items } from './blueprints/items.js';
import { Entities } from './blueprints/entities.js';
import { Structures } from './blueprints/structures.js';
import { SceneController } from '/scene/sceneController.js'


class LayoutManager {

    constructor(props, eventDepot) {

        this.props = props;
        this.level = props.level;
        this.eventDepot = eventDepot;

        this.allItems = Items;
        this.allStructures = Structures;
        this.allEntities = Entities;
        this.allObjects = {...Items, ...Structures, ...Entities, ...{ floor: { description: "floor"}}};

        localStorage.setItem('gameObjects', JSON.stringify(this.allObjects));
        
        this.layout = {};
        
        if (props.layouts[this.level]) {
            this.layout = props.layouts[this.level];
        } else {
            this.levelBuilder = new LevelBuilder(this.level);
            this.layout = this.levelBuilder.getLayout();
        }

        this.addEventListeners();
    }

    launch(hero) {
        
        this.sceneController = new SceneController(hero, this.layout, this.eventDepot, this.allObjects);
        this.sceneController.animateScene();
    }

    addEventListeners() {
        this.eventDepot.addListener('removeItemFromLayout', (uuid) => {
            this.layout.items = this.layout.items.filter(el => el.uuid != uuid);
            this.cacheLayout();
        });

        this.eventDepot.addListener('addItemToLayout', (data) => {
            let item = this.allItems[data.itemName];
            item.location = data.location;
            item.uuid = data.uuid;
            this.layout.items.push(item);
            this.cacheLayout();
        });

        this.eventDepot.addListener('saveLayout', (uuid) => {
            this.cacheLayout();
        });

        this.eventDepot.addListener('updateStructureAttributes', (data) => {
            // {uuid: thisObj.uuid, attributes: thisObj.attributes}
            var index = this.layout.structures.findIndex(el => el.uuid == data.uuid);
            this.layout.structures[index].attributes = {...this.layout.structures[index].attributes, ...data.attributes};
            this.cacheLayout();
        });

    }

    shutdown() {
        this.eventDepot.removeListeners('updateStructureAttributes');
        this.eventDepot.removeListeners('removeItemFromLayout');
        this.eventDepot.removeListeners('addItemToLayout');
        this.eventDepot.removeListeners('saveLayout');
        
        this.sceneController.deanimateScene(() => {
            this.sceneController = null;
        });
    }

    cacheLayout() {
        let currentProps = JSON.parse(localStorage.getItem('gameProps'));
        currentProps.layouts[this.level] = this.layout;
        localStorage.setItem('gameProps', JSON.stringify(currentProps));
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

    getLevelObjects() {
        return [...this.layout.items, ...this.layout.structures, ...this.layout.entities];
    }
}

export {LayoutManager};