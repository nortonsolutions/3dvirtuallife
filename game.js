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

    constructor(heroTemplate, eventDepot) {

        // this.props = props;
        this.heroTemplate = heroTemplate;
        this.eventDepot = eventDepot;

        this.stop = this.stop.bind(this);
        this.start = this.start.bind(this);

        this.eventDepot.addListener('loadLevel', (data) => {
            this.eventDepot.fire('unlockControls', {});
            if (this.layoutManager) this.stop(() => {

                this.heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
                if (data.location) this.heroTemplate.location = data.location;

                this.heroTemplate.location.x -= 1;
                this.start(data.level);
            });
    
        });
    }

    stop(callback) {
        this.layoutManager.shutdown(() => {
            this.layoutManager = null;
            if (callback) callback();
        });
    }

    start(level) {

        this.layoutManager = new LayoutManager(level, this.eventDepot);
        this.layoutManager.launch(this.heroTemplate);
    }
}



export { Game };