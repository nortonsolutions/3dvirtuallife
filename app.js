/**
* This index module has the primary EventDepot, GameAPI, Game, and SceneController.
* It handles events which deal with HTML user interaction like the modal display.
*/
import { EventDepot } from '/public/eventDepot.js';
import { Game, GameAPI } from '/game.js';
import { SceneController } from '/scene/sceneController.js'

export const app = () => {

    var gameAPI = new GameAPI();

    // Some game details will be provided, either new or restored game
    var props = 
    localStorage.getItem('gameProps')? 
    JSON.parse(localStorage.getItem('gameProps')): gameAPI.newGame('Dave', 20);

    var game;
    var sceneController;
    var eventDepot = new EventDepot();
    var minimap = false;

    const addEventListeners = () => {
        
        eventDepot.addListener('loadLevel', (data) => {
            game.eventDepot.fire('unlockControls', {});
            sceneController.deanimateScene(() => {
                sceneController = null;
            });

            props.hero = data.hero;
            props.level = data.level;
            props.hero.location = data.location;
            props.hero.location.x -= 1;
            startGame();
        });

        eventDepot.addListener('saveLevel', (data) => {
            
            props = {...props, ...data};
            localStorage.setItem('gameProps', JSON.stringify(props)); 

        });


        eventDepot.addListener('showDescription', (data) => {
            let description = game.getObjectDetail(data.objectName,'description');
            document.getElementById('message').innerHTML = description;
        });

        eventDepot.addListener('hideDescription', (data) => {
            document.getElementById('message').innerHTML = '';
        });

        eventDepot.addListener('minimap', () => {
            minimap = !minimap;
            document.getElementById('minimap').style.display = minimap? 'block' : 'none';
        });

        eventDepot.addListener('modal', (data) => {

            eventDepot.fire('unlockControls', {});
            var context;

            switch (data.type) {
                case 'inventory': 

                    let inventoryPageSize = 12;
                    // startingIndex will advance by inventoryPageSize for each page
                    let startingIndex = data.page? data.page * inventoryPageSize: 0;

                    context = { equipped: {}, inventory: [] };
                    
                    Object.keys(game.hero.equipped).forEach(key => {
                        context.equipped[key] = {
                            name: game.hero.equipped[key],
                            description: game.getObjectDetail(game.hero.equipped[key],'description'),
                            image: game.getObjectDetail(game.hero.equipped[key],'image'),
                        };
                    });

                    for (let index = startingIndex; index < startingIndex + inventoryPageSize; index++) {
                        let key = game.hero.inventory[index] && game.hero.inventory[index].itemName ? game.hero.inventory[index].itemName : undefined;
                        if (!(key == undefined)) {
                            context.inventory[index] = {
                                index: index,
                                name: key,
                                description: game.getObjectDetail(key,'description'),
                                image: game.getObjectDetail(key,'image'),
                                quantity: game.hero.inventory[index].quantity
                            };
                        } else {
                            context.inventory[index] = {
                                index: index,
                                name: '',
                                description: '',
                                image: 'blank.PNG',
                                quantity: 0
                            }
                        }
                    }
                    break;
                default:
            
            }
            
            loadTemplate('modal-body', data.type, context, () => {
                if (data.type == "inventory") addInventoryEvents();
            });
            
            var modal = document.getElementById('myModal');
            var closer = document.getElementsByClassName("close")[0];
            var modalTitle = document.getElementById('modal-title').innerHTML = data.title;

            modal.style.display = "block";



            function escape() {
                modal.style.display = "none";
                eventDepot.fire('lockControls', {});
            }

            closer.onclick = function() {
                escape();
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    escape();
                }
            }
        })

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
        sceneController.animateScene();
    }

    const loadTemplate = (elementId, template, data, callback) => {
        handleGet(`/views/${template}.hbs`, response => {
            let template = Handlebars.compile(response);
            document.getElementById(elementId).innerHTML = template(data);
            if (callback) callback();
        });
    }

    const addInventoryEvents = () => {
        const allowDrop = (ev) => {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
        }

        const drag = (ev) => {
            ev.dataTransfer.setData("text", ev.target.id + ':' + ev.target.attributes.describedBy.value + ':' + ev.target.attributes.quant.value);
            ev.dataTransfer.setDragImage(new Image(ev.target.src),10,10);
        }

        const drop = (ev) => {
            ev.preventDefault();

            let data = ev.dataTransfer.getData("text").split(':');

            var id = data[0];
            var descId = data[1];
            var quantId = data[2];
            
            ev.target.appendChild(document.getElementById(id));
            ev.target.appendChild(document.getElementById(descId));
            ev.target.appendChild(document.getElementById(quantId));

            if (Array.from(ev.target.classList).includes('body')) {
                game.hero.equipped[ev.target.id] = id;
                sceneController.loadObject3DbyName(id, (gltf) => {
                    game.hero.equip(ev.target.id, gltf.scene);
                });
            };
        }

        const dropOnly = (ev) => {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("text").split(':');

            var itemName = data[0];
            eventDepot.fire('dropItem', itemName);
        }

        document.querySelectorAll('.draggable').forEach(draggableElement => {
            draggableElement.addEventListener('dragstart', drag);
        });

        document.querySelectorAll('.dragSpot').forEach(dragSpot => {
            dragSpot.addEventListener('drop', drop);
            dragSpot.addEventListener('dragover', allowDrop);
        });

        document.querySelectorAll('.dropOnly').forEach(d => {
            d.addEventListener('drop', dropOnly);
            d.addEventListener('dragover', allowDrop);
        });
    }
}