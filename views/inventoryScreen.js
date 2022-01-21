

class InventoryScreen {
 
    constructor(eventDepot, modal) {

        this.location = {};
        this.eventDepot = eventDepot;
        this.modal = modal;

        this.showInventory = true; // toggle to false for spells display
        this.gameObjects = [];
    }

    getContext = (pageNumber) => {

        if (this.gameObjects.length == 0) this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));

        this.pageNumber = pageNumber;
        let inventoryPageSize = 12;

        // startingIndex will advance by inventoryPageSize for each page
        let startingIndex = this.pageNumber? this.pageNumber * inventoryPageSize: 0;

        var bodyParts = [['head','one'],['torso','two'],['Middle2R','three'],['Middle2L','four'],['special','five'],['feet','six']];
        var hotKeys = ['f1key','f2key','f3key','f4key','f5key','f6key','f7key','f8key']
    
        var context = { showInventory: this.showInventory, equippedBodyParts: {}, equippedHotKeys: {}, inventory: [], pageNumber };
        
        var hero = JSON.parse(localStorage.getItem('gameHeroTemplate'));
        
        /** 
         * Sample of hero.equipped:
         * {"f1key":["redpotion",false],"Middle2L":["smallSword",false],"Middle2R":["greenpotion",true]}
         * 
         * The first value for each key is the itemName, and the second is the throwable boolean.
         */

        bodyParts.forEach(bodyPart => { // bodyPart: [bodyPart, gridNumber]
            
            let objectName = hero.equipped[bodyPart[0]] ? hero.equipped[bodyPart[0]][0] : null;
            context.equippedBodyParts[bodyPart[0]] = objectName ? {
                name: objectName,
                description: this.gameObjects[objectName].description,
                image: this.gameObjects[objectName].image,
                gridNumber: bodyPart[1]
            } : {
                name: null,
                gridNumber: bodyPart[1]
            };
        });

        hotKeys.forEach(hotkey => {
            
            let objectName = hero.equipped[hotkey] ? hero.equipped[hotkey][0] : null;
            context.equippedHotKeys[hotkey] = objectName ? {
                name: objectName,
                description: this.gameObjects[objectName].description,
                image: this.gameObjects[objectName].image,
                overlay: hotkey.substring(1,2)
            } : {
                name: null,
                overlay: hotkey.substring(1,2)
            };
        });

        var inv;

        if (this.showInventory) {
            inv = hero.inventory;
        } else {
            inv = hero.spells;
        }

        for (let index = startingIndex; index < startingIndex + inventoryPageSize; index++) {
            let objectName = inv[index] && inv[index].itemName ? inv[index].itemName : undefined;
            if (!(objectName == undefined)) {
                context.inventory[index] = {
                    index: index,
                    name: objectName,
                    description: this.gameObjects[objectName].description,
                    image: this.gameObjects[objectName].image,
                    quantity: inv[index].quantity? inv[index].quantity: 1
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

    addInventoryEvents = () => {

        document.getElementById('toggleInventory').addEventListener('click', () => {
            this.showInventory = !this.showInventory;

            document.getElementById('modal-title').innerHTML = this.showInventory? "Inventory" : "Spells";
            this.pageNumber = 0;
            this.refresh();
        })

        const allowDrop = (ev) => {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
        }
    
        const drag = (ev) => {
    
            var textToSend = ev.target.id + ':' 
                + ev.target.attributes.describedBy.value + ':' 
                + ev.target.attributes.quant.value + ':' 
                + ev.target.parentNode.id;
    
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
            
            if (itemName.match(/key|gold/i) && Array.from(targetElement.classList).includes('body')){
                alert('This cannot be equipped.');
            } else if (itemName.match(/redpotion|bluepotion|spell/i) && Array.from(targetElement.classList).includes('bodyPart')) {
                alert('This can only be equipped on the hotkeys, 1-8.');
            } else if (!itemName.match(/potion|spell/i) && Array.from(targetElement.classList).includes('fKey')){
                alert('This can only be equipped on the body.');
            } else {

                if (index.length < 3) { // source is inventory
                
                    if (! Array.from(targetElement.classList).includes('body')) { // To another slot
    
                        this.eventDepot.fire('swapInventoryPositions', {first: index, second: targetElement.id});
        
                    } else { // to body part or hotkey
    
                        if (targetElement.firstElementChild && !Array.from(targetElement.firstElementChild.classList).includes('overlay')) {
                            let itemNameToSwap = targetElement.firstElementChild.id;
                            this.eventDepot.fire('unequipItem', targetElement.id);
                            this.eventDepot.fire('placeItem', {itemName: itemNameToSwap, desiredIndex: index});
                        }
                        this.eventDepot.fire('removeItem', itemName)
                        this.eventDepot.fire('equipItem', {bodyPart: targetElement.id, itemName, throwable: this.isItemThrowable(itemName) });

                    } 
        
                } else { // source is body part or hotkey
        
                    if (! Array.from(targetElement.classList).includes('body')) { // back to inventory
        
                        this.eventDepot.fire('unequipItem', index);

                        if (!itemName.match(/spell/i)) {
                            this.eventDepot.fire('placeItem', {itemName, desiredIndex: targetElement.id});
                        } 
        
                    } else { // to another body part or hotkey
        
                        this.eventDepot.fire('unequipItem', index);
    
                        if (targetElement.firstElementChild && !Array.from(targetElement.firstElementChild.classList).includes('overlay')) {
    
                            let itemNameToSwap = targetElement.firstElementChild.id;
                            this.eventDepot.fire('unequipItem', ev.target.parentNode.id);
                            this.eventDepot.fire('equipItem', {bodyPart: index, itemName: itemNameToSwap, throwable: this.isItemThrowable(itemNameToSwap)});
                            
                        }
    
                        this.eventDepot.fire('equipItem', {bodyPart: ev.target.id, itemName, throwable: this.isItemThrowable(itemName) });
                    }
        
                }
                
                this.refresh();
            }

        }
    
        const dropOnly = (ev) => {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("text").split(':');

            if (data[0] != "gold") {

                let dropData = {
                    itemName: data[0],
                    location: this.location,
                    source: data[3]
                }
    
                this.eventDepot.fire('dropItemToScene', dropData);
    
                this.refresh();
    
            }
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
                let context = this.getContext(this.pageNumber);
                this.modal.loadTemplate('modal-body', "inventory", context, () => {
                    this.addInventoryEvents();
                });
            })
        }

        if (document.getElementById('nextPage')) {
            document.getElementById('nextPage').addEventListener('click', e => {
                this.pageNumber++;
                let context = this.getContext(this.pageNumber);
                this.modal.loadTemplate('modal-body', "inventory", context, () => {
                    this.addInventoryEvents();
                });
            })
        }
    
    }

    refresh = () => {
        let context = this.getContext(this.pageNumber);
        this.modal.loadTemplate('modal-body', "inventory", context, () => {
            this.addInventoryEvents();
        });
    }

    isItemThrowable(itemName) {
        if (this.gameObjects.length == 0) this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        return (this.gameObjects[itemName].attributes.throwable);
    }

}

export { InventoryScreen }