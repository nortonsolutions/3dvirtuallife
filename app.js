/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display,
* saving and loading props and hero template from localStorage, starting or joining games.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game, GameAPI } from '/game.js';
import { Modal } from '/views/modal.js';

export const app = () => {

    var gameAPI = new GameAPI();

    var game = null;
    var props = { level: 0, layouts: [] }
    var heroTemplate = gameAPI.newHeroTemplate('dave', 20);

    var eventDepot = new EventDepot();
    var modal = new Modal(eventDepot);
    
    var minimap = false;

    const addEventListeners = () => {
        
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

        Array.from(document.querySelectorAll('.clearGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                localStorage.clear();
            })
        })

        Array.from(document.querySelectorAll('.saveGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();

                // Send the following data to the server for saving
                console.log(localStorage.getItem('gameProps'));
                console.log(localStorage.getItem('gameHeroTemplate'));

            })
        })

        Array.from(document.querySelectorAll('.loadGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();

                // MOCK DATA loading existing game for now, for gameHeroTemplate and gameProps
                props = localStorage.getItem('gameProps');
                heroTemplate = localStorage.getItem('gameHeroTemplate');
                
            })
        })
    }

    addEventListeners();

    const startGame = () => {
        
        if (game && game.layoutManager) game.stop();
        game = new Game(props, heroTemplate, eventDepot);
        game.start();

    }
}