/**
 * The LayoutManager manages the layout and the SceneController.
 * Its events have to do with updating the layout in localStorage.
 * It receives props (level, layouts[]) from the Game, and a Hero
 * object with launch.  It then passes the hero, current layout,
 * eventDepot and allObjects objects to the Scene Controller.
 */

import { LevelBuilder } from './levelBuilder.js';
import { Spells } from './blueprints/spells.js';
import { Items } from './blueprints/items.js';
import { Entities } from './blueprints/entities.js';
import { Structures } from './blueprints/structures.js';
import { xpLevels } from './blueprints/xpLevels.js';
import { SceneController } from '/scene/sceneController.js'

class LayoutManager {

    constructor(level, eventDepot, socket) {

        this.props = localStorage.getItem('gameProps')? JSON.parse(localStorage.getItem('gameProps')): { level: 0, layouts: [] };
        this.props.level = level;
        this.eventDepot = eventDepot;
        this.socket = socket;
        
        this.allItems = Items;
        this.allStructures = Structures;
        this.allEntities = Entities;
        this.allSpells = Spells;
        this.allObjects = {...Items, ...Structures, ...Entities, ...Spells, ...{ floor: { description: "floor"}}, ...{ xpLevels } };

        localStorage.setItem('gameObjects', JSON.stringify(this.allObjects));
        
        this.layout = {};
        
        if (this.props.layouts[this.props.level]) {
            this.layout = this.props.layouts[this.props.level];
        } else {
            this.levelBuilder = new LevelBuilder(this.props.level);
            this.layout = this.levelBuilder.getLayout();
        }

        this.cacheLayout();
        this.addEventListeners();
    }

    launch(heroTemplate) {
        
        this.sceneController = new SceneController(heroTemplate, this.layout, this.eventDepot, this.allObjects, this.socket);
        this.sceneController.animateScene();
    }

    addEventListeners() {

        this.socket.on('gameProps', (data) => {
            this.props = data;
            this.layout = this.props.layouts[this.props.level];
        });

        this.eventDepot.addListener('removeItemFromLayout', (uuid) => {
            this.layout.items = this.layout.items.filter(el => el.uuid != uuid);
            this.cacheLayout();
        });

        this.eventDepot.addListener('addItemToLayout', (data) => {
            let item = {};
            item.name = this.allItems[data.itemName].name;
            item.location = data.location;
            item.uuid = data.uuid;
            this.layout.items.push(item);
            this.cacheLayout();
        });

        this.eventDepot.addListener('cacheLayout', () => {
            this.cacheLayout();
        });

        // data: {uuid: ..., attributes: ...}
        this.eventDepot.addListener('updateStructureAttributes', (data) => {
            
            var index = this.layout.structures.findIndex(el => el.uuid == data.uuid);
            if (index == -1) {
                console.log('NOT FOUND');
            } else {
                this.layout.structures[index].attributes = {...this.layout.structures[index].attributes, ...data.attributes};
                this.cacheLayout();
            }
        });

    }

    shutdown(callback) {
        this.eventDepot.removeListeners('updateStructureAttributes');
        this.eventDepot.removeListeners('removeItemFromLayout');
        this.eventDepot.removeListeners('addItemToLayout');
        this.eventDepot.removeListeners('cacheLayout');
        
        this.sceneController.deanimateScene(() => {
            this.sceneController = null;
            callback();
        });
    }

    cacheLayout() {
        let currentProps = JSON.parse(localStorage.getItem('gameProps'));
        
        if (currentProps) {
            currentProps.level = this.props.level;
            currentProps.layouts[this.props.level] = this.layout;
        } else {
            currentProps = { level: this.props.level };
            currentProps.layouts = [];
            currentProps.layouts[this.props.level] = this.layout;
        }
        localStorage.setItem('gameProps', JSON.stringify(currentProps));
        this.socket.emit('gameProps', currentProps );
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

    getAllSpells() {
        return this.allSpells;
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