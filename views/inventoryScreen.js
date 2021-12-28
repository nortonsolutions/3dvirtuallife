

class InventoryScreen {
 
    constructor(eventDepot,game, modal) {

        this.game = game;
        this.eventDepot = eventDepot; // used for dropItem, etc.
        this.modal = modal;  // will be used for loadTemplate on page +/-

    }

    queryGame(queryName, key) {

        return new Promise((resolve, reject) => {
            this.eventDepot.addListener('gameResponse' + key, response => {
                resolve(response);
            })
            this.eventDepot.fire('queryGame', { key, queryName });
        })

    }

    getInventoryContext = (pageNumber) => {

        this.pageNumber = pageNumber;
        let inventoryPageSize = 12;

        // startingIndex will advance by inventoryPageSize for each page
        let startingIndex = this.pageNumber? this.pageNumber * inventoryPageSize: 0;
    
        var context = { equipped: {}, inventory: [], pageNumber: pageNumber };
        
        let key = getRndInteger(1,100000);
        this.queryGame('getHeroEquipped', key).then(response => {
            let heroEquipped = response;
            console.log(heroEquipped);
            this.eventDepot.removeListeners('gameResponse' + key);
        })

        Object.keys(this.game.hero.equipped).forEach(key => {
            context.equipped[key] = {
                name: this.game.hero.equipped[key],
                description: this.game.getObjectDetail(this.game.hero.equipped[key],'description'),
                image: this.game.getObjectDetail(this.game.hero.equipped[key],'image')
            };
        });
    
        for (let index = startingIndex; index < startingIndex + inventoryPageSize; index++) {
            let key = this.game.hero.inventory[index] && this.game.hero.inventory[index].itemName ? this.game.hero.inventory[index].itemName : undefined;
            if (!(key == undefined)) {
                context.inventory[index] = {
                    index: index,
                    name: key,
                    description: this.game.getObjectDetail(key,'description'),
                    image: this.game.getObjectDetail(key,'image'),
                    quantity: this.game.hero.inventory[index].quantity
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

    addInventoryEvents = () => {
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
                    this.game.hero.swapInventoryPositions(index, targetElement.id);
    
                } else { // Inventory to body part
    
                    if (targetElement.firstElementChild) { // If the bodypart is already equipped...

                        // Identify the item to swap back to inventory
                        let itemNameToSwap = targetElement.firstElementChild.id;
                        let descIdToSwap = targetElement.firstElementChild.attributes.describedBy.value;
                        let quantIdToSwap = targetElement.firstElementChild.attributes.quant.value;
                        let indexToSwap = targetElement.id; 

                        // Unequip this item
                        this.game.hero.unequip(indexToSwap);

                        // Put the item back in the original location (index)
                        let {itemIndex,quantity} = this.game.hero.addToInventory(itemNameToSwap,index);

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

                    let quantityRemaining = this.game.hero.removeFromInventory(itemName);
                    
                    this.eventDepot.fire('loadObject3DbyName', {itemName, bodyPart: targetElement.id});

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
                } 
    
            } else { // source is body part
    
                if (! Array.from(targetElement.classList).includes('body')) { // back to inventory
    
                    this.game.hero.unequip(index);
                    let {itemIndex,quantity} = this.game.hero.addToInventory(itemName,targetElement.id);
                    
                    let finalTargetElement = document.getElementById(itemIndex);
    
                    if (finalTargetElement) {
                        Array.from(finalTargetElement.childNodes).forEach(el => el.remove());
    
                        finalTargetElement.appendChild(document.getElementById(itemName));
                        finalTargetElement.appendChild(document.getElementById(descId));
                        finalTargetElement.appendChild(document.getElementById(quantId));
                        document.getElementById(quantId).innerText = quantity;
                    } else {
                        document.getElementById(itemName).remove();
                        document.getElementById(descId).remove();
                        document.getElementById(quantId).remove();
                    }
    
                } else { // body part to body part
    
                    this.game.hero.unequip(index);
    
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
    
                    this.eventDepot.fire('loadObject3DbyName', {itemName, bodyPart: ev.target.id});
                }
    
            } 
    
            console.dir(this.game.hero.inventory);        
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
    
            this.eventDepot.fire('dropItem', itemName);
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
    
        document.getElementById('backPage').addEventListener('click', e => {
            this.pageNumber--;
            let context = this.getInventoryContext(this.pageNumber);
            this.modal.loadTemplate('modal-body', 'inventory', context, () => {
                this.addInventoryEvents();
            });
        })
    
        document.getElementById('nextPage').addEventListener('click', e => {
            this.pageNumber++;
            let context = this.getInventoryContext(this.pageNumber);
            this.modal.loadTemplate('modal-body', 'inventory', context, () => {
                this.addInventoryEvents();
            });
        })
    
    }

}

export { InventoryScreen }