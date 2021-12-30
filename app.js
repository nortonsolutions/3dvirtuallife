/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game, GameAPI } from '/game.js';
import { SceneController } from '/scene/sceneController.js'
import { Modal } from '/views/modal.js';

export const app = () => {

    var gameAPI = new GameAPI();

    // Some game details will be provided, either new or restored game
    var props = 
    localStorage.getItem('gameProps')? 
    JSON.parse(localStorage.getItem('gameProps')): gameAPI.newGame('Dave', 20);

    var game;
    var modal;
    var sceneController;
    var eventDepot = new EventDepot();
    var minimap = false;

    const addEventListeners = () => {
        
        eventDepot.addListener('loadLevel', (data) => {
            game.eventDepot.fire('unlockControls', {});
            game.unregisterListeners();

            sceneController.deanimateScene(() => {
                sceneController = null;
            });

            props.hero = data.hero;
            props.level = data.level;
            props.layouts = JSON.parse(localStorage.getItem('gameProps')).layouts;
            props.hero.location = data.location;
            props.hero.location.x -= 1;
            startGame();
        });

        eventDepot.addListener('saveLevel', (data) => {
            
            props.hero = data.hero;
            props.level = data.level;
            props.layouts[data.level] = data.layouts[data.level];

            localStorage.setItem('gameProps', JSON.stringify(props)); 

        });

        eventDepot.addListener('showDescription', (data) => {

            let description = JSON.parse(localStorage.getItem('gameObjects'))[data.objectName].description;
            document.getElementById('message').innerHTML = description;
        });

        eventDepot.addListener('hideDescription', (data) => {
            document.getElementById('message').innerHTML = '';
        });

        eventDepot.addListener('minimap', () => {
            minimap = !minimap;
            document.getElementById('minimap').style.display = minimap? 'block' : 'none';
        });

        document.querySelector('.inventoryLink').addEventListener('click', e => {
            eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
            e.preventDefault();
        })

        Array.from(document.querySelectorAll('.startGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                startGame();
                
            })
        })
    }

    addEventListeners();

    const startGame = () => {
        game = new Game(props, eventDepot);
        game.setGameLayout();

        game.stats(); // currently just dumps objects to console
        sceneController = new SceneController(game.hero, game.layoutManager, game.eventDepot);
        
        modal = new Modal(eventDepot);

        sceneController.animateScene();
    }
}