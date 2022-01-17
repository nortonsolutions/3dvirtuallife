/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display,
* saving and loading props and hero template from localStorage, starting or joining games.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game, newHeroTemplate } from '/game.js';
import { GameAPI } from './gameAPI.js'
import { Modal } from '/views/modal.js';
import { Sidebar } from '/views/sidebar.js';

export const app = () => {

    var game = null;
    var props = { level: 0, layouts: [] }
    var heroTemplate = newHeroTemplate('dave', 20);
    var minimap = false;
    var eventDepot = new EventDepot();
    

    var gameAPI = new GameAPI(eventDepot);
    var modal = new Modal(eventDepot, gameAPI);
    var sidebar = new Sidebar(eventDepot); // hotkeys

    const addEventDepotListeners = (eventDepot) => {

        eventDepot.addListener('showHeroStats', () => {
            document.getElementById('heroStats').classList.remove('d-none');
        });
        
        eventDepot.addListener('showDescription', (data) => {
            let description = JSON.parse(localStorage.getItem('gameObjects'))[data.objectName].description;
            document.getElementById('message').innerHTML = description;
        });

        eventDepot.addListener('hideDescription', (data) => {
            document.getElementById('message').innerHTML = '';
        });

        eventDepot.addListener('statusUpdate', (data) => {
            document.getElementById('statusUpdates').innerHTML = data.message;
            setTimeout(() => {
                // document.getElementById('statusUpdates').innerHTML = '';
            }, 5000);
        });

        eventDepot.addListener('minimap', () => {
            minimap = !minimap;
            document.getElementById('minimap').style.display = minimap? 'block' : 'none';
        });

        eventDepot.addListener('startGame', (data) => {
            eventDepot.fire('unlockControls', {});
            startGame(data.heroTemplate, data.props);
        })

    }

    const addDocumentEventListeners = () => {
        
        document.querySelector('.inventoryLink').addEventListener('click', e => {
            eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
            e.preventDefault();
        })

        Array.from(document.querySelectorAll('.newGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                startGame(heroTemplate, props);
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
                if (game) {

                    var gameName;
                    if (localStorage.getItem('gameName')) {
                        gameName = localStorage.getItem('gameName');
                    } else {
                        gameName = prompt("Please enter saved game name:", "default")
                    }

                    gameAPI.saveGame(gameName);
                }
            })
        })

        // List the games via the loadGame template, where the game can be selected and loaded
        Array.from(document.querySelectorAll('.loadGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                gameAPI.listGames();
            })
        })

        Array.from(document.querySelectorAll('.quitGame')).forEach(el => {
            el.addEventListener('click', e => {
                localStorage.clear();
                if (game) game.stop();
                window.location = '/';
                e.preventDefault();
            })
        })
    }

    addDocumentEventListeners();
    addEventDepotListeners(eventDepot);

    const startGame = (heroTemplate, props) => {
        
        eventDepot = null; gameAPI = null; modal = null; sidebar = null;
        
        eventDepot = new EventDepot();
        addEventDepotListeners(eventDepot);

        gameAPI = new GameAPI(eventDepot);
        modal = new Modal(eventDepot, gameAPI);
        sidebar = new Sidebar(eventDepot);

        if (game) game.stop();
        game = new Game(heroTemplate, eventDepot);
        game.start(props.level);
    }
}