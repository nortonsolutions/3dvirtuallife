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

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        this.eventDepot.addListener('loadLevel', (data) => {
            this.eventDepot.fire('unlockControls', {});
            this.stop();

            this.heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
            if (data.location) this.heroTemplate.location = data.location;

            this.heroTemplate.location.x -= 1;

            this.eventDepot.fire('startGame', {
                heroTemplate: this.heroTemplate,
                props: { level: data.level }
            })
        });
    }

    stop() {
        if (this.layoutManager) {
            this.layoutManager.shutdown(() => {
                this.layoutManager = null;
            });
        }
    }

    start(level) {

        this.layoutManager = new LayoutManager(level, this.eventDepot);
        this.layoutManager.launch(this.heroTemplate);
    }
}

function newHeroTemplate(name,height) {
    return {
        name: name,
        type: "hero",
        location: { x: 0, y: 0, z: 0 },
        attributes: {
            moves: true,
            animates: true,
            height: height,
            length: 20,
            width: 20,
            scale: 20,
            elevation: 0,
            experience: 0,
            stats: {
                health: "3/5/0",  // min/max/boost
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "3/3/0",
            },
            xpLevels: {
                health: 0,
                mana: 0,
                strength: 0,
                agility: 0,
            }
        },
        gltf: 'boy.glb',
        model: null,
        inventory: [],
        spells: [],
        equipped: {}

    }
}

export { Game, newHeroTemplate };