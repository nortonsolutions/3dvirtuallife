/**
 * The LayoutManager manages the layout and the SceneController.
 * Its events have to do with updating the layout in localStorage.
 * It receives props (level, layouts[]) from the Game, and a Hero
 * object with launch.  It then passes the hero, current layout,
 * eventDepot and allObjects objects to the Scene Controller.
 */

import { LevelBuilder } from './levelBuilder.js';
import { Items } from './blueprints/items.js';
import { Entities } from './blueprints/entities.js';
import { Structures } from './blueprints/structures.js';
import { SceneController } from '/scene/sceneController.js'


class LayoutManager {

    constructor(props, eventDepot) {

        this.props = localStorage.getItem('gameProps')? JSON.parse(localStorage.getItem('gameProps')): props;
        this.props.level = props.level;
        this.eventDepot = eventDepot;

        this.allItems = Items;
        this.allStructures = Structures;
        this.allEntities = Entities;
        this.allObjects = {...Items, ...Structures, ...Entities, ...{ floor: { description: "floor"}}};

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

        this.eventDepot.addListener('saveLayout', () => {
            this.cacheLayout();
        });

        this.eventDepot.addListener('updateStructureAttributes', (data) => {
            // {uuid: thisObj.uuid, attributes: thisObj.attributes}
            var index = this.layout.structures.findIndex(el => el.uuid == data.uuid);
            if (index == -1) {
                console.log('NOT FOUND');
            } else {
                this.layout.structures[index].attributes = {...this.layout.structures[index].attributes, ...data.attributes};
                this.cacheLayout();
            }
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
        
        if (currentProps) {
            currentProps.level = this.props.level;
            currentProps.layouts[this.props.level] = this.layout;
        } else {
            currentProps = { level: this.props.level };
            currentProps.layouts = [];
            currentProps.layouts[this.props.level] = this.layout;
        }
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