import {levels} from './blueprints/levels.js'

class LevelManager {

    constructor(level) {
        this.level = levels[level];
    }

    getBackground() {
        return this.level.background;
    }

    getHeight() {
        return this.level.height;
    }

    getWidth() {
        return this.level.width;
    }

    getItems() {
        return this.level.items;
    }
    
    getStructures() {
        return this.level.structures;
    }

    getEntities() {
        return this.level.entities;
    }

}

export {LevelManager};