/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display,
* saving and loading props and hero template from localStorage, starting or joining games.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game } from '/game.js';
import { GameAPI } from './gameAPI.js'
import { Modal } from '/views/modal.js';

export const app = () => {

    var eventDepot = new EventDepot();
    var gameAPI = new GameAPI(eventDepot);

    var game = null;
    var props = { level: 0, layouts: [] }
    var heroTemplate = gameAPI.newHeroTemplate('dave', 20);

    var modal = new Modal(eventDepot, gameAPI);
    var minimap = false;

    const addEventDepotListeners = () => {

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

        eventDepot.addListener('minimap', () => {
            minimap = !minimap;
            document.getElementById('minimap').style.display = minimap? 'block' : 'none';
        });

        eventDepot.addListener('startGame', (data) => {
            eventDepot.fire('unlockControls', {});
            startGame(data.heroTemplate, data.props);
        })

    }
    
    const removeEventDepotListeners = () => {

        eventDepot.removeListeners('showHeroStats');
        eventDepot.removeListeners('showDescription');
        eventDepot.removeListeners('hideDescription');
        eventDepot.removeListeners('minimap');
        eventDepot.removeListeners('startGame');
        
    }

    const addDocumentEventListeners = () => {
        
        document.querySelector('.inventoryLink').addEventListener('click', e => {
            eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
            e.preventDefault();
        })

        Array.from(document.querySelectorAll('.newGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                startGame(heroTemplate, props, eventDepot);
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

        // List the games via the loadgame template, where the game can be selected and loaded
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
    addEventDepotListeners();

    const startGame = (heroTemplate, props) => {
        
        if (game && game.layoutManager) {
            game.stop(() => {
                game = new Game(heroTemplate, eventDepot);
                game.start(props.level);
            });
        } else {
            game = new Game(heroTemplate, eventDepot);
            game.start(props.level);
        }

    }
}