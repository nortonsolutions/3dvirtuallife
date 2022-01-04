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

        eventDepot.addListener('loadLevel', (data) => {
            this.eventDepot.fire('unlockControls', {});
            if (this.layoutManager) this.stop(() => {

                let heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
                
                // JIC: update the location to match that specified in the event
                heroTemplate.location = data.location;
                heroTemplate.location.x -= 1;
                this.start(data.level);
            });
    
        });

        eventDepot.addListener('saveLocalStorage', () => {
            saveLocalStorage();
        });
    }

    stop(callback) {
        this.layoutManager.shutdown(() => {
            this.layoutManager = null;
            this.hero.stop(() => {
                this.hero = null;
                callback();
            });
        });
    }

    start(level) {

        this.layoutManager = new LayoutManager(level, this.eventDepot);
        this.layoutManager.launch(this.heroTemplate);
    }
}

/**
* 
* Here we keep track of the hero, inventory, saving/loading games, etc.
* 
* When a game is saved, the props are saved in the profile,
* so loading will resume at the same level with the same inventory, etc.
*/
class GameAPI {
    
    constructor() {}
    
    /**
     * Fresh game props from scratch with only personal details provided.
     */
    newHeroTemplate(name,height) {
        return {
            name: name,
            type: "hero",
            location: { x: 0, y: 0, z: 0 },
            attributes: {
                moves: true,
                height: height,
                length: 20,
                width: 20,
                scale: 10,
                elevation: 0,
                stats: {
                    health: "03/05",
                    mana: "00/00",
                    strength: "01/01",
                    agility: "03/03"
                }
            },
            gltf: 'robot.glb',
            model: null,
            inventory: [],
            spells: [],
            equipped: {}

        }
    }

    saveGame() {
        // Post to an API on the server with the game props
        // to save information in the server filesystem.
    }

    loadGame() {
        // Call the server API to load a specific game props. 
    }

    getSavedGames() {
        // Call the server API to return a list of the saved games.
    }

    deleteGame() {
        // Delete a saved game on the server.
    }

}

export {Game, GameAPI};