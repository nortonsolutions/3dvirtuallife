/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display,
* saving and loading props and hero template from localStorage, starting or joining games.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game } from '/game.js';
import { GameAPI } from './gameAPI.js'
import { Modal } from '/views/modal.js';
import { Sidebar } from '/views/sidebar.js';
import { Chatbar } from '/views/chatbar.js';

export const app = () => {

    var game = null;
    var minimap = false;
    var eventDepot = new EventDepot();
    var socket = null;
    var chatbar = null;

    var gameAPI = new GameAPI(eventDepot);
    var modal = new Modal(eventDepot, gameAPI);
    var sidebar = new Sidebar(eventDepot); // hotkeys

    const addEventDepotListeners = (eventDepot) => {

        eventDepot.addListener('showHeroStats', () => {
            document.getElementById('heroStats').classList.remove('d-none');
        });
        
        eventDepot.addListener('showDescription', (data) => {
            var description;
            if (data.objectType == "hero") {
                description = data.objectName;
            } else {
                description = JSON.parse(localStorage.getItem('gameObjects'))[data.objectName].description;
            }
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

        eventDepot.addListener('joinGame', (data) => {
            eventDepot.fire('unlockControls', {});
            joinGame(data.heroTemplate, data.activeGames);
        });

        eventDepot.addListener('startLevel', (data) => {
            eventDepot.fire('unlockControls', {});
            startLevel(data.heroTemplate, data.props, data.namespace);
        });

        eventDepot.addListener('saveGame', (gameName) => {
            gameAPI.saveGame(gameName);
        });

    }

    const addDocumentEventListeners = () => {
        
        document.querySelector('.inventoryLink').addEventListener('click', e => {
            eventDepot.fire('modal', { type: 'inventory', title: 'Inventory' });
            e.preventDefault();
        })

        Array.from(document.querySelectorAll('.startGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                // startLevel(heroTemplate, props);
                eventDepot.fire('modal', { type: 'character', title: "Character", context: { } });
                
            })
        });

        Array.from(document.querySelectorAll('.clearGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                localStorage.clear();
                handleGet('/clearActiveGames', () => {});
            })
        });

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
        });

        // List the games via the loadGame template, where the game can be selected and loaded
        Array.from(document.querySelectorAll('.loadGame')).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();

                if (characterSelected()) {
                    gameAPI.listGames();
                } else {
                    eventDepot.fire('modal', { type: 'character', title: "Character", context: { } });
                }
            })
        });

        Array.from(document.querySelectorAll('.quitGame')).forEach(el => {
            el.addEventListener('click', e => {
                localStorage.clear();
                if (game) game.stop();
                window.location = '/logout';
                e.preventDefault();
            })
        });



        Array.from(document.querySelectorAll('.joinGame')).forEach(el => {
            el.addEventListener('click', e => {

            e.preventDefault();

            if (localStorage.getItem('gameHeroTemplate')) {
                let heroTemplate = JSON.parse(localStorage.getItem('gameHeroTemplate'));
                handleGet('/listActiveGames', (response) => {

                    let activeGames = JSON.parse(response);
                    if (Object.keys(activeGames).length > 0) { // if there are games
                
                        eventDepot.fire('joinGame', { heroTemplate, activeGames });
    
                    } else { // no games to join, so notify and start new game
    
                        let namespace = '/';
                        alert('No games to join!  Starting new game.');
                        
                        var props = { level: 0, layouts: [] }
                        localStorage.setItem('gameProps', JSON.stringify(props));
    
                        eventDepot.fire('startLevel', { heroTemplate, props, namespace });
                    }
                });
            } else {
                alert('You must first select a game hero.')
            }
            })
        });
    }

    addDocumentEventListeners();
    addEventDepotListeners(eventDepot);

    const characterSelected = () => {
        return (localStorage.getItem('gameHeroTemplate'));
    }

    /** Launch modal to select from activeGames */
    const joinGame = (heroTemplate, activeGames) => {
        eventDepot.fire('modal', { type: 'joinGame', title: "Join Game", context: { heroTemplate, activeGames } });
    }

    const startLevel = (heroTemplate, props, namespace = '/') => {
        
        // let uniqueNamespace = heroTemplate.name + getRndInteger(1,1000000);
        
        if (socket) socket.disconnect('http://192.168.109.2:3001'); socket = null;
        socket = io.connect(`http://192.168.109.2:3001${namespace}`);
        
        eventDepot = null; gameAPI = null; modal = null; sidebar = null; chatbar = null; 
        
        eventDepot = new EventDepot();
        addEventDepotListeners(eventDepot);
        
        gameAPI = new GameAPI(eventDepot);
        modal = new Modal(eventDepot, gameAPI, socket);
        sidebar = new Sidebar(eventDepot);
        chatbar = new Chatbar(eventDepot, socket);

        if (game) game.stop();
        game = new Game(heroTemplate, eventDepot, socket);
        game.start(props.level);
    }

    eventDepot.fire('modal', { type: 'character', title: "Character", context: { } });
}