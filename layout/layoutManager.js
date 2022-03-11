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

    /** Socket interaction must take place during construction to push/pull layout accordingly */
    constructor(level, eventDepot, socket, callback) {
        
        this.eventDepot = eventDepot;
        this.socket = socket;
        this.addEventListeners();

        // if (!localStorage.getItem('gameObjects')) { //
            this.allItems = Items;
            this.allStructures = Structures;
            this.allEntities = Entities;
            this.allSpells = Spells;
            this.allObjects = {...Items, ...Structures, ...Entities, ...Spells, ...{ floor: { description: "floor"}}, ...{ xpLevels } };

            localStorage.setItem('gameObjects', JSON.stringify(this.allObjects));
        // }

        this.props = localStorage.getItem('gameProps')? JSON.parse(localStorage.getItem('gameProps')): { level: 0, layouts: [] };
        this.props.level = level;
        if (callback) callback();

    }

    launch(heroTemplate) {

        this.socket.emit('joinroom', {level: this.props.level}, (firstInRoom) => {

            this.firstInRoom = firstInRoom;

            if (this.firstInRoom) {

                this.layout = {};

                if (this.props.layouts[this.props.level]) {
                    this.layout = this.props.layouts[this.props.level];
                } else {
                    this.levelBuilder = new LevelBuilder(this.props.level);
                    this.layout = this.levelBuilder.getLayout();
                }
                this.cacheLayout();

                this.socket.emit('gameProps', JSON.parse(localStorage.getItem('gameProps')));
                this.socket.emit('pushLayout', { level: this.props.level, layout: this.layout });

                this.sceneController = new SceneController(heroTemplate, this.layout, this.eventDepot, this.allObjects, this.socket, this.firstInRoom, this.props.level);
                this.sceneController.animateScene();

                if (this.layout.terrain.attributes.cutScenes && this.layout.terrain.attributes.cutScenes.intro) { 
                    this.eventDepot.fire('modal', { type: 'cutScene', title: this.layout.terrain.description, context: { videoName: this.layout.terrain.attributes.cutScenes.intro } });
                }
            } else {

                this.socket.emit('pullLayout', this.props.level, (data) => {
                    this.layout = data;
                    this.cacheLayout();
                    this.sceneController = new SceneController(heroTemplate, this.layout, this.eventDepot, this.allObjects, this.socket, this.firstInRoom, this.props.level);
                    this.sceneController.animateScene();

                    if (this.layout.terrain.attributes.cutScenes && this.layout.terrain.attributes.cutScenes.intro) { 
                        this.eventDepot.fire('modal', { type: 'cutScene', title: this.layout.terrain.description, context: { videoName: this.layout.terrain.attributes.cutScenes.intro } });
                    }
                })
            }


        });
    }

    addItemToLayout(data, local = true) {
        let item = {}; item.attributes = {};

        if (!this.allObjects[data.itemName]) {
            console.error(`${data.itemName} not found in this.allItems`);
        } else {
            item.name = this.allObjects[data.itemName].name;
            item.type = this.allObjects[data.itemName].type;
            item.location = data.location;
            item.attributes.layoutId = data.layoutId;
            if (data.keyCode) item.attributes.keyCode = data.keyCode;
            if (typeof data.stage == "number") item.attributes.stage = data.stage;

            if (item.type == "item") this.layout.items.push(item);
            if (item.type == "structure") this.layout.structures.push(item);
            if (item.type == "entity" || item.type == "friendly" || item.type == "beast") this.layout.entities.push(item);
            if (local) this.socket.emit('addItemToLayout', {level: this.props.level, data, item});
            this.cacheLayout();
        }
    }
    
    removeFromLayoutByLayoutId(layoutId, local = true) {  // remove From scene 
        if (this.layout.items.map(el => el.attributes.layoutId).includes(layoutId)) {
            this.layout.items = this.layout.items.filter(el => el.attributes.layoutId != layoutId);
        } else if (this.layout.entities.map(el => el.attributes.layoutId).includes(layoutId)) {
            this.layout.entities = this.layout.entities.filter(el => el.attributes.layoutId != layoutId);
        } else if (this.layout.structures.map(el => el.attributes.layoutId).includes(layoutId)) {
            this.layout.structures = this.layout.structures.filter(el => el.attributes.layoutId != layoutId);
        }
        if (local) this.socket.emit('removeFromLayoutByLayoutId', {level: this.props.level, layoutId});
        this.cacheLayout();
    }

    addEventListeners() {

        // this.socket.on('gameProps', (data) => {
        //     this.props = data;
        //     this.layout = this.props.layouts[this.props.level];
        // });

        this.socket.on('addItemToLayout', data => {
            this.addItemToLayout(data.data, false);
        });

        this.socket.on('removeFromLayoutByLayoutId', data => {
            this.removeFromLayoutByLayoutId(data.layoutId, false);
        });

        this.eventDepot.addListener('removeFromLayoutByLayoutId', (layoutId) => {
            this.removeFromLayoutByLayoutId(layoutId);
        });

        this.eventDepot.addListener('addItemToLayout', (data) => {
            this.addItemToLayout(data);
        });

        this.eventDepot.addListener('cacheLayout', () => {
            this.cacheLayout();
        });

        // data: {layoutId: ..., attributes: ..., type: ...}
        this.eventDepot.addListener('updateAttributes', (data) => {
            
            switch (data.type) {
                case 'structure':
                    var index = this.layout.structures.findIndex(el => el.attributes.layoutId == data.layoutId);
                    if (index != -1) this.layout.structures[index].attributes = {...this.layout.structures[index].attributes, ...data.attributes};
                    break;
                case 'item':
                    var index = this.layout.items.findIndex(el => el.attributes.layoutId == data.layoutId);
                    if (index != -1) this.layout.items[index].attributes = {...this.layout.items[index].attributes, ...data.attributes};
                    break;
                case 'entity':
                case 'friendly':
                case 'beast':
                    var index = this.layout.entities.findIndex(el => el.attributes.layoutId == data.layoutId);
                    if (index != -1) this.layout.entities[index].attributes = {...this.layout.entities[index].attributes, ...data.attributes};
                    break;
            }
            this.cacheLayout();
        });

    }



    shutdown(callback) {
        this.eventDepot.removeListeners('updateAttributes');
        this.eventDepot.removeListeners('removeFromLayoutByLayoutId');
        this.eventDepot.removeListeners('addItemToLayout');
        this.eventDepot.removeListeners('cacheLayout');
        
        if (this.sceneController) {
            this.sceneController.deanimateScene(() => {
                this.sceneController = null;
                callback();
            });
        } else callback();
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