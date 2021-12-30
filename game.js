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
import { Hero } from '/hero.js';

class Game {

    constructor(props, eventDepot) {

        this.props = props;
        this.setLocalStorage();

        this.eventDepot = eventDepot;
        this.hero = new Hero(props.hero, this.eventDepot);

        // this.addQueryGameListener = this.addQueryGameListener.bind(this);
        // this.addQueryGameListener();
    }

    stop() {
        // this.eventDepot.removeListeners('queryGame');
        this.layoutManager.shutdown();
        this.hero.stop();
        
        this.layoutManager = null;
        this.hero = null;
    }

    // addQueryGameListener() {
    //     this.eventDepot.addListener('queryGame', (data) => {
    //         let {key, queryName, args} = data;
    //         let response = null;
    //         switch (queryName) {
    //             case 'swapInventoryPositions':
    //                 this.hero.swapInventoryPositions(args.first, args.second);
    //                 break;
    //         }
    //         this.eventDepot.fire('gameResponse' + key, response);
    //     })
    // }

    setLevel(level) {
        this.props.level = level;
    }

    setLocalStorage() {
        localStorage.setItem('gameProps', JSON.stringify(this.props));
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('gameProps'));
    }

    start() {

        this.layoutManager = new LayoutManager(this.props, this.eventDepot);
        this.layoutManager.launch(this.hero);

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
                type: "hero",
                location: { x: 0, y: 0, z: 0 },
                attributes: {
                    moves: true,
                    height: height,
                    scale: 10,
                    elevation: 0,
                    life: 0,
                    manna: 0,
                    strength: 1,
                    agility: 3
                },
                gltf: 'robot.glb',
                model: null,
                inventory: [],
                equipped: {}
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