/**
 * Norton - 2021
 * 
 * The 'Game' is the main interface for the game,
 * utilizing the LayoutBuilder to provide layout details
 * for each level in turn.
 * 
 */

import {LayoutBuilder} from './layout/layoutBuilder.js';


class NortonGame {

    constructor(props) {
        super.constructor(props);
        this.layoutBuilder = new LayoutBuilder(props);
        this.gameLayout = this.layoutBuilder.getLayout();
    }

    start() {
        console.dir(this.gameLayout)
    }
}

var initialProps = {
    level: 0,
    numberOfOthers: 2,
    heroName: 'Ian'
}

var game = new NortonGame(initialProps);

export {game};