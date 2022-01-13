

class InventoryScreen {
 
    constructor(eventDepot, modal) {

        this.location = {};
        this.eventDepot = eventDepot;
        this.modal = modal;

        this.type = null;
    }

    getSpellsContext = (pageNumber) => {

        this.pageNumber = pageNumber;
        let inventoryPageSize = 12;

        // startingIndex will advance by inventoryPageSize for each page
        let startingIndex = this.pageNumber? this.pageNumber * inventoryPageSize: 0;
    
        var context = { equipped: {}, spells: [], pageNumber: pageNumber };
        
        var hero = JSON.parse(localStorage.getItem('gameHeroTemplate'));
        var gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        
        Object.keys(hero.equipped).forEach(bodyPart => {

            if (bodyPart[0] == "f") { // e.g. 'f1', 'f2', 'f3'....
                let objectName = hero.equipped[bodyPart];
                context.equipped[bodyPart] = {
                    name: objectName,
                    description: gameObjects[objectName].description,
                    image: gameObjects[objectName].image
                };
            }
        });

        for (let index = startingIndex; index < startingIndex + inventoryPageSize; index++) {
            let objectName = hero.spells[index] && hero.spells[index].name ? hero.spells[index].name : undefined;
            if (!(objectName == undefined)) {
                context.spells[index] = {
                    index: index,
                    name: objectName,
                    description: gameObjects[objectName].description,
                    image: gameObjects[objectName].image,
                };
            } else {
                context.spells[index] = {
                    index: index,
                    name: '',
                    description: '',
                    image: 'blank.PNG',
                }
            }
        }

        this.location = hero.location;
        return context;
    }

    getInventoryContext = (pageNumber) => {

        this.pageNumber = pageNumber;
        let inventoryPageSize = 12;

        // startingIndex will advance by inventoryPageSize for each page
        let startingIndex = this.pageNumber? this.pageNumber * inventoryPageSize: 0;
    
        var context = { equipped: {}, inventory: [], pageNumber: pageNumber };
        
        var hero = JSON.parse(localStorage.getItem('gameHeroTemplate'));
        var gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        
        Object.keys(hero.equipped).forEach(bodyPart => {
            
            if (bodyPart[0] != "f") {
                let objectName = hero.equipped[bodyPart];
                context.equipped[bodyPart] = {
                    name: objectName,
                    description: gameObjects[objectName].description,
                    image: gameObjects[objectName].image
                };
            }
        });

        for (let index = startingIndex; index < startingIndex + inventoryPageSize; index++) {
            let objectName = hero.inventory[index] && hero.inventory[index].itemName ? hero.inventory[index].itemName : undefined;
            if (!(objectName == undefined)) {
                context.inventory[index] = {
                    index: index,
                    name: objectName,
                    description: gameObjects[objectName].description,
                    image: gameObjects[objectName].image,
                    quantity: hero.inventory[index].quantity
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

        this.location = hero.location;
        return context;
    }

    addInventoryEvents = (type) => {

        this.type = type;

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
            // var descId = data[1]; // id of description element
            // var quantId = data[2]; // id of quantity element
            var index = data[3];  // inventory # ... or bodyPart by name
            
            if (index.length < 3) { // source is inventory
                
                if (! Array.from(targetElement.classList).includes('body')) { // To another slot

                    this.eventDepot.fire('swapInventoryPositions', {first: index, second: targetElement.id});
    
                } else { 

                    if (targetElement.firstElementChild) {
                        let itemNameToSwap = targetElement.firstElementChild.id;
                        this.eventDepot.fire('unequipItem', targetElement.id);
                        this.eventDepot.fire('placeItem', {itemName: itemNameToSwap, desiredIndex: index});
                    }
                    this.eventDepot.fire('removeItem', itemName)
                    this.eventDepot.fire('equipItem', {bodyPart: targetElement.id, itemName});

                } 
    
            } else { // source is body part
    
                if (! Array.from(targetElement.classList).includes('body')) { // back to inventory
    
                    this.eventDepot.fire('unequipItem', index);
                    this.eventDepot.fire('placeItem', {itemName, desiredIndex: targetElement.id});
    
                } else { // body part to body part
    
                    this.eventDepot.fire('unequipItem', index);

                    if (targetElement.firstElementChild) {

                        let itemNameToSwap = targetElement.firstElementChild.id;
                        this.eventDepot.fire('unequipItem', ev.target.parentNode.id);
                        this.eventDepot.fire('equipItem', {bodyPart: index, itemName: itemNameToSwap});
                        
                    }

                    this.eventDepot.fire('equipItem', {bodyPart: ev.target.parentNode.id, itemName});
                }
    
            }
            
            this.refresh();
        }
    
        const dropOnly = (ev) => {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("text").split(':');

            let dropData = {
                itemName: data[0],
                location: this.location,
                source: data[3]
            }

            this.eventDepot.fire('dropItemToScene', dropData);

            this.refresh();
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
    
        if (document.getElementById('backPage')) {
            document.getElementById('backPage').addEventListener('click', e => {
                this.pageNumber--;
                let context = this.getContext(this.type, this.pageNumber);
                this.modal.loadTemplate('modal-body', this.type, context, () => {
                    this.addInventoryEvents(this.type);
                });
            })
        }

        if (document.getElementById('backPage')) {
            document.getElementById('nextPage').addEventListener('click', e => {
                this.pageNumber++;
                let context = this.getContext(this.type, this.pageNumber);
                this.modal.loadTemplate('modal-body', this.type, context, () => {
                    this.addInventoryEvents(this.type);
                });
            })
        }
    
    }

    getContext = (type, page) => {
        let context;
        switch (type) {
            case 'inventory': 
                context = this.getInventoryContext(page);
                break;

            case 'spells': 
                context = this.getSpellsContext(page);
                break;
                                
            default:
        }
        return context;
    }

    refresh = () => {
        let context = this.getContext(this.type, this.pageNumber);
        this.modal.loadTemplate('modal-body', this.type, context, () => {
            this.addInventoryEvents(this.type);
        });
    }

}

export { InventoryScreen }