/**
 * Norton - 2021
 * 
 * The 'Game' is the main interface for the game.
 * 
 * It utilizes the LayoutManager to provide layout details
 * given the props (hero, level, and layouts).
 * 
 */

import { LayoutManager } from './layout/layoutManager.js';

class Game {

    constructor(heroTemplate, eventDepot, socket) {

        this.heroTemplate = heroTemplate;
        this.eventDepot = eventDepot;
        this.socket = socket;

        this.stop = this.stop.bind(this);
        this.start = this.start.bind(this);

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        this.eventDepot.addListener('loadLevel', (data) => {
            this.eventDepot.fire('unlockControls', {});
            this.stop(() => {
                this.heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
                if (data.location) this.heroTemplate.location = data.location;
    
                this.heroTemplate.location.x -= 1;
    
                this.eventDepot.fire('startLevel', {
                    heroTemplate: this.heroTemplate,
                    props: { level: data.level }
                })
            });
        });
    }

    stop(callback) {
        if (this.layoutManager) {
            this.layoutManager.shutdown(() => {
                this.layoutManager = null;
                callback();
            });
        } else callback();
    }

    start(level) {
        this.layoutManager = new LayoutManager(level, this.eventDepot, this.socket);
        this.layoutManager.launch(this.heroTemplate);
        
    }
}

export { Game };