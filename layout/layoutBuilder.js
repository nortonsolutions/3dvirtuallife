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

import {LevelManager} from './levelManager.js'

class LayoutBuilder {

    constructor(props) {

        // TODO: props may include saved game details of level layouts
        this.numberOfOthers = props.numberOfOthers;
        this.itemsArray = props.itemsArray;
        this.levelManager = new LevelManager(props.level);

        this.hero = {
            ...props.hero, 
            location: props.heroLocation? props.heroLocation : this.randomLocation(),
        }

        const itemDetails = (item) => {
            return {
                name: item.name, 
                type: item.type, 
                location: item.location? item.location : this.randomLocation(),
                gltf: item.gltf? item.gltf : 'redball.gltf',
                scale: item.attributes.scale,
                elevation: item.attributes.elevation
            }
        }

        this.items = this.levelManager.getItems()
            .map(item => itemDetails(item));
                    
        this.structures = this.levelManager.getStructures()
            .map(item => itemDetails(item));

        this.entities = this.levelManager.getEntities()
            .map(item => itemDetails(item));

        this.width = this.levelManager.getWidth();
        this.height = this.levelManager.getHeight();
        this.background = this.levelManager.getBackground();
        this.terrain = this.levelManager.getTerrain();
    }

    /**
     * The layout model presented here should only contain information
     * about the layout for the objects in the scene, like location, 
     * gltf, scale, elevation.
     */
    getLayout() {
        var layout = {
            hero: this.hero,
            terrain: this.terrain,
            items: this.items,
            structures: this.structures,
            entities: this.entities,
            width: this.width,
            height: this.height,   
            background: this.background
        }

        return layout;
    }

    randomLocation() {
        return {
            x: this.levelManager.getWidth()/2 - Math.floor(Math.random() * this.levelManager.getWidth()),
            y: 0,
            z: this.levelManager.getHeight()/2 - Math.floor(Math.random() * this.levelManager.getHeight())
        }
    }
}

export {LayoutBuilder};