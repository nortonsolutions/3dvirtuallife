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

        const getInventoryContext = (pageNumber) => {

            let inventoryPageSize = 12;
            // startingIndex will advance by inventoryPageSize for each page
            let startingIndex = pageNumber? pageNumber * inventoryPageSize: 0;

            var context = { equipped: {}, inventory: [], pageNumber: pageNumber };
            
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
            return context;
        }

        eventDepot.addListener('modal', (data) => {

            eventDepot.fire('unlockControls', {});
            var context;

            switch (data.type) {
                case 'inventory': 
                    context = getInventoryContext(0);
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

            // let quantity = Array.from(ev.target.parentNode.classList).includes('body')? 1 : ;
            var textToSend = ev.target.id + ':' 
                + ev.target.attributes.describedBy.value + ':' 
                + ev.target.attributes.quant.value + ':' 
                + ev.target.parentNode.id;

            console.log(textToSend)
            ev.dataTransfer.setData("text", textToSend);
            ev.dataTransfer.setDragImage(new Image(ev.target.src),10,10);
        }

        // Verify that the element is of class 'dragSpot'
        const getDragSpot = (el) => {
            if (Array.from(el.classList).includes('dragSpot')) {
                return el;
            } else {
                return getDragSpot(el.parentNode);
            }
        }

        const drop = (ev) => {


            ev.preventDefault();
            
            let targetElement = getDragSpot(ev.target);

            let data = ev.dataTransfer.getData("text").split(':');

            var itemName = data[0]; // name of item and id of source draggable element
            var descId = data[1]; // id of description element
            var quantId = data[2]; // id of quantity element
            var index = data[3];  // inventory # ... or bodyPart by name
            
            if (index.length < 2) { // source is inventory
                
                if (! Array.from(targetElement.classList).includes('body')) { // To another slot
                    
                    if (targetElement.firstElementChild) {

                        let itemNameToSwap = targetElement.firstElementChild.id;
                        let descIdToSwap = targetElement.firstElementChild.attributes.describedBy.value;
                        let quantIdToSwap = targetElement.firstElementChild.attributes.quant.value;

                        let swapTargetElement = document.getElementById(itemName).parentNode;
                        swapTargetElement.appendChild(document.getElementById(itemNameToSwap));
                        swapTargetElement.appendChild(document.getElementById(descIdToSwap));
                        swapTargetElement.appendChild(document.getElementById(quantIdToSwap));

                    }

                    targetElement.appendChild(document.getElementById(itemName));
                    targetElement.appendChild(document.getElementById(descId));
                    targetElement.appendChild(document.getElementById(quantId));
                    game.hero.swapInventoryPositions(index, targetElement.id);

                } else { // Inventory to body part

                    sceneController.loadObject3DbyName(itemName, (gltf) => {
                        
                        if (targetElement.firstElementChild) { // If the bodypart is already equipped...

                            // Identify the item to swap back to inventory
                            let itemNameToSwap = targetElement.firstElementChild.id;
                            let descIdToSwap = targetElement.firstElementChild.attributes.describedBy.value;
                            let quantIdToSwap = targetElement.firstElementChild.attributes.quant.value;
                            let indexToSwap = targetElement.id; 

                            // Unequip this item
                            game.hero.unequip(indexToSwap);

                            // Put the item back in the original location (index)
                            let {itemIndex,quantity} = game.hero.addToInventory(itemNameToSwap,index);

                            // Determine where to put the item in the inventory based on itemIndex
                            let finalTargetElement = document.getElementById(itemIndex);

                            // Clean up if necessary
                            if (finalTargetElement.childNodes) {
                                Array.from(finalTargetElement.childNodes).forEach(el => el.remove());
                            }
        
                            // Append the item details into place
                            finalTargetElement.appendChild(document.querySelector('.body #' + itemNameToSwap));
                            finalTargetElement.appendChild(document.querySelector('.body #' + descIdToSwap));
                            finalTargetElement.appendChild(document.querySelector('.body #' + quantIdToSwap));
                            document.getElementById(quantIdToSwap).innerText = quantity;
    
                        }

                        let quantityRemaining = game.hero.removeFromInventory(itemName);
                        game.hero.equip(targetElement.id, gltf.scene);

                        if (quantityRemaining == 0) {

                            targetElement.appendChild(document.getElementById(itemName));
                            targetElement.appendChild(document.getElementById(descId));
                            targetElement.appendChild(document.getElementById(quantId));
                            
                        } else {

                            var dupe = document.getElementById(itemName).cloneNode(true);
                            var dupeDesc = document.getElementById(descId).cloneNode(true);
                            var dupeQuant = document.getElementById(quantId).cloneNode(true);

                            dupeQuant.innerText = '1';

                            dupe.addEventListener('dragstart', drag);
                            targetElement.appendChild(dupe);
                            targetElement.appendChild(dupeDesc);
                            targetElement.appendChild(dupeQuant);

                            document.getElementById(quantId).innerHTML = quantityRemaining;
                        }
                    });
                } 

            } else { // source is body part
    
                if (! Array.from(targetElement.classList).includes('body')) { // back to inventory

                    game.hero.unequip(index);
                    let {itemIndex,quantity} = game.hero.addToInventory(itemName,targetElement.id);
                    
                    let finalTargetElement = document.getElementById(itemIndex);

                    Array.from(finalTargetElement.childNodes).forEach(el => el.remove());

                    finalTargetElement.appendChild(document.getElementById(itemName));
                    finalTargetElement.appendChild(document.getElementById(descId));
                    finalTargetElement.appendChild(document.getElementById(quantId));
                    document.getElementById(quantId).innerText = quantity;

                } else { // body part to body part

                    game.hero.unequip(index);

                    if (targetElement.firstElementChild) {
                        let itemNameToSwap = targetElement.firstElementChild.id;
                        let descIdToSwap = targetElement.firstElementChild.attributes.describedBy.value;
                        let quantIdToSwap = targetElement.firstElementChild.attributes.quant.value;

                        let swapTargetElement = document.getElementById(itemName).parentNode;
                        swapTargetElement.appendChild(document.getElementById(itemNameToSwap));
                        swapTargetElement.appendChild(document.getElementById(descIdToSwap));
                        swapTargetElement.appendChild(document.getElementById(quantIdToSwap));
                    }
                    
                    targetElement.appendChild(document.querySelector('.body #' + itemName));
                    targetElement.appendChild(document.querySelector('.body #' + descId));
                    targetElement.appendChild(document.querySelector('.body #' + quantId));

                    sceneController.loadObject3DbyName(itemName, (gltf) => {
                        game.hero.equip(ev.target.id, gltf.scene);
                    });

                }

            } 

            console.dir(game.hero.inventory);        
        }

        const dropOnly = (ev) => {
            ev.preventDefault();


            let data = ev.dataTransfer.getData("text").split(':');

            var itemName = data[0]; // name of item and id of source draggable element
            var descId = data[1]; // id of description element
            var quantId = data[2]; // id of quantity element
            var index = data[3];  // inventory # ... or bodyPart by name

            let rootElement = document;
            if (index.length > 2) rootElement = document.querySelector('.body');

            let previousQuantity = document.getElementById(quantId).innerText;
            if (previousQuantity == "1") {
                rootElement.getElementById(itemName).remove();
                rootElement.getElementById(descId).remove();
                rootElement.getElementById(quantId).remove();
            } else {
                rootElement.getElementById(quantId).innerText = Number(previousQuantity) - 1;
            }

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