/**
 * Norton - 2021
 * 
 * The 'Game' is the main interface for the game.
 * 
 * It utilizes the LayoutBuilder to provide layout details
 * given the props (hero, level, and layouts).
 * 
 */

import {LayoutBuilder} from './layout/layoutBuilder.js';
import {EventDepot} from '/public/eventDepot.js';
import {Hero} from '/hero.js';

class Game {

    constructor(props) {
        this.props = props;
        this.eventDepot = new EventDepot();

        this.hero = new Hero(props.hero, this.eventDepot);
        this.layoutBuilder = new LayoutBuilder(props);
        this.gameLayout = this.layoutBuilder.getLayout();
    }

    setLocalStorage(props) {
        localStorage.setItem('gameProps') = props;
    }

    getLocalStorage() {
        return localStorage.getItem('gameProps');
    }

    stats() {
        console.dir(this.gameLayout);
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
    
    constructor() {

    }
    
    /**
     * Fresh game props from scratch with only personal details provided.
     */
    newGame(name,height) {
        return {
            hero: {
                name: name,
                height: height,
                inventory: {}
            },
            level: 0,
            layouts: []
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