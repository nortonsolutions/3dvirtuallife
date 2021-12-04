/**
 * Norton - 2021
 * 
 * The 'Game' is the main interface for the game,
 * utilizing the LayoutBuilder to provide layout details
 * for each level in turn.
 * 
 */

import {LayoutBuilder} from './layout/layoutBuilder.js';


class Game {

    constructor(props) {
        super.constructor(props);
        this.level = props.level;
        this.layoutBuilder = new LayoutBuilder(props);
        this.gameLayout = this.layoutBuilder.getLayout();
    }

    start() {

        console.log(`Starting scene ${this.level}`);
        console.dir(this.gameLayout);
    }
}

export {Game};