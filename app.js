/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game, GameAPI } from '/game.js';
import { Modal } from '/views/modal.js';

export const app = () => {

    var gameAPI = new GameAPI();

    var game;
    var props;

    var eventDepot = new EventDepot();
    var modal = new Modal(eventDepot);
    
    var minimap = false;

    const addEventListeners = () => {
        
        eventDepot.addListener('loadLevel', (data) => {
            game.eventDepot.fire('unlockControls', {});
            game.stop();

            props.hero = data.hero;
            props.level = data.level;
            props.layouts = JSON.parse(localStorage.getItem('gameProps')).layouts;
            props.hero.location = data.location;
            props.hero.location.x -= 1;
            startGame(data.level);
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
                localStorage.clear();
                startGame(-1);
                
            })
        })
    }

    addEventListeners();

    const startGame = (level) => {

        if (level == -1) {
            props = 
            localStorage.getItem('gameProps')? 
            JSON.parse(localStorage.getItem('gameProps')): 
            gameAPI.newGame('Dave', 20);
        }
        
        game = new Game(props, eventDepot);
        game.start();

    }
}