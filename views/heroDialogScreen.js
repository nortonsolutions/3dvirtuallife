export class HeroDialogScreen {

    constructor(eventDepot, modal, socket) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.socket = socket;
        this.heroInventory = null;
        this.otherInventory = null;
        this.tempSpeech = null;
        this.gameObjects = [];
        this.tab = { } ;
        this.payment = { };

        this.readyForAccept = false;
        if (this.socket) this.addSocketEvents();
    }

    /**
     * 
     * If called by the initiator:
     * Initial setup of the dialog screen and negotiation table via server socket.
     * The initiator's inventory is provided as the initial context for the screen
     * 
     * If called by the receiver (non-initiator):
     * Receive the initial context, then reply to the socket with inventory to 
     * update the context for the initiator.
     * 
     */

    // data.socket, data.level, data.initiator, data.layoutId, data.otherLayoutId, data.hero, data.otherInventory);
    setup(level, initiator, layoutId, otherLayoutId, heroInventory, otherInventory) {
        
        this.layoutId = layoutId;
        this.heroInventory = heroInventory;
        this.otherInventory = otherInventory;
        this.otherLayoutId = otherLayoutId;
        this.level = level;

        if (initiator) {
            this.socket.emit('heroDialogNew', { layoutId, heroInventory, otherLayoutId, level, initiator });
        } else {
            this.socket.emit('heroDialogInventory', { layoutId, heroInventory, otherLayoutId, level });
        }
    }

    addSocketEvents() {
        this.socket.on('heroDialogAcceptDeal', () => {
            this.acceptDeal();
        });
        
        this.socket.on('heroDialogProposeDeal', () => {
            this.proposeDeal("Confirm?");
        });

        this.socket.on('heroDialogUpdateExchange', data => {
            this.tab = data.tab;
            this.payment = data.payment;
            this.resetProposal();
            this.refresh();
        });

        this.socket.on('heroDialogInventory', otherInventory => {
            this.otherInventory = otherInventory;
            this.refresh();
        });

        this.socket.on('closeModal', () => {
            this.modal.closeModal();
        });
    }

    addHeroDialogEvents() {

        var closer = document.getElementsByClassName("close")[0];
        
        closer.onclick = () => {
            this.modal.closeModal();
            this.socket.emit('closeModal', { level: this.level, otherLayoutId: this.otherLayoutId });
        }

        Array.from(document.querySelectorAll('.changeTabItem')).forEach(el => {

            el.addEventListener('click', () => {
                let itemName = el.attributes['data-item'].value;
                let quantity = Number(el.attributes['data-quantity'].value);
    
                if (quantity == "1") { // "1" or "-1"
                    this.addTabItem(itemName);
                } else {
                    this.removeTabItem(itemName);
                }

                this.updateExchange();
                this.refresh();
            })
        })

        Array.from(document.querySelectorAll('.changePaymentItem')).forEach(el => {
            el.addEventListener('click', () => {
                let itemName = el.attributes['data-item'].value;
                let quantity = Number(el.attributes['data-quantity'].value);
    
                if (quantity == "1") { // "1" or "-1"
                    this.addPaymentItem(itemName);
                } else {
                    this.removePaymentItem(itemName);
                }

                this.updateExchange();
                this.refresh();
            })
        })

        document.querySelector('#deal').addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();

            if (this.readyForAccept) { // confirm deal
                this.acceptDeal();
                this.socket.emit('heroDialogAcceptDeal', { level: this.level, otherLayoutId: this.otherLayoutId });

            } else { // propose deal
                this.proposeDeal("Waiting");
                this.socket.emit('heroDialogProposeDeal', { level: this.level, otherLayoutId: this.otherLayoutId });
            }
        })
    }

    reset() {
        this.tab = { } ;
        this.payment = { };
        this.resetProposal();
    }

    resetProposal() {
        this.readyForAccept = false;

        let button = document.querySelector('#deal');
        if (button) {
            button.innerHTML = "Propose";
            button.disabled = false;
        }
    }

    refresh = (tempSpeech) => {

        if (tempSpeech) {
            this.updateSpeech(tempSpeech);
        } else this.tempSpeech = null;

        let context = this.getContext();

        this.modal.loadTemplate('modal-body', "heroDialog", context, () => {
            this.addHeroDialogEvents();
        });
    }

    getContext() {

        let context = {};
        /** 
         * Context consists of heroInventory and otherInventory, molded to meet
         * the needs of the heroDialog.hbs template, along with current offers and tempSpeech.
         */

        if (this.gameObjects.length == 0) this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        context.heroInventory = [];
        context.otherInventory = [];

        var inv = this.heroInventory; // should always exist

        for (let index = 0; index < inv.length; index++) {
            let objectName = inv[index] && inv[index].itemName ? inv[index].itemName : undefined;

            if (objectName) {
                context.heroInventory[index] = {
                    index: index,
                    name: objectName,
                    description: this.gameObjects[objectName].description,
                    image: this.gameObjects[objectName].image,
                    quantity: inv[index].quantity? inv[index].quantity: 1,
                };
            }
        }

        if (this.otherInventory) { // should be set by incoming socket event
            var invOther = this.otherInventory;

            for (let index = 0; index < invOther.length; index++) {
                let objectName = invOther[index] && invOther[index].itemName ? invOther[index].itemName : undefined;
    
                if (objectName) {
                    context.otherInventory[index] = {
                        index: index,
                        name: objectName,
                        description: this.gameObjects[objectName].description,
                        image: this.gameObjects[objectName].image,
                        quantity: invOther[index].quantity? invOther[index].quantity: 1,
                    };
                }
            }
        }

        context.payment = this.payment; // what I am offering
        context.tab = this.tab; // what is being offered

        if (this.tempSpeech) {
            context.tempSpeech = this.tempSpeech;
        } else context.tempSpeech = null;

        return context;        
    }
    
    updateSpeech(speech) {
        this.tempSpeech = speech;
    }

    updateExchange() {
        this.socket.emit('heroDialogUpdateExchange', { level: this.level, otherLayoutId: this.otherLayoutId, tab: this.tab, payment: this.payment});
        this.resetProposal();
    }

    addTabItem(itemName) {
        let currentNumberCommitted = this.tab[itemName]? this.tab[itemName] : 0;
        if (currentNumberCommitted < this.getInventoryQuantity(this.otherInventory, itemName)) {
            if (this.tab[itemName]) { // increment
                this.tab[itemName] = Number(this.tab[itemName]) + 1;
            }  else { // create
                this.tab[itemName] = 1
            }
        }
        return this.tab;
    }

    removeTabItem(itemName) {
        if (this.tab[itemName] >= 1) {
            if (this.tab[itemName] == 1) {
                delete this.tab[itemName];
            } else if (this.tab[itemName] > 1) {
                this.tab[itemName] = Number(this.tab[itemName]) - 1;
            }
        }
        return this.tab;  
    }

    addPaymentItem(itemName) { 
        let currentNumberCommitted = this.payment[itemName]? this.payment[itemName] : 0;
        if (currentNumberCommitted < this.getInventoryQuantity(this.heroInventory, itemName)) {
            if (this.payment[itemName]) {
                this.payment[itemName] += 1;
            } else {
                this.payment[itemName] = 1; 
            }
        }
        return this.payment;
    }

    removePaymentItem(itemName) {
        if (this.payment[itemName] > 1) {
            this.payment[itemName] -= 1;
        } else {
            if (itemName == "gold") {
                this.payment[itemName] = 0;
            } else {
                if (this.payment[itemName]) delete this.payment[itemName];
            }
        }
        return this.payment;   
    }

    proposeDeal(waitingText) {
        this.readyForAccept = true;
        let button = document.querySelector('#deal');
        button.innerHTML = waitingText;
        if (waitingText == "Waiting") button.disabled = true;

    }

    acceptDeal() { // item exchange
        Object.keys(this.tab).forEach(item => {
            this.eventDepot.fire('addToInventory', {itemName: item, quantity: this.tab[item]}); 
        });

        Object.keys(this.payment).forEach(item => {
            for (let i = 0; i < this.payment[item]; i++) {
                this.eventDepot.fire('removeFromInventory', item); 
            }
        })
        
        this.socket.emit('heroDialogInventory', { layoutId: this.layoutId, heroInventory: this.heroInventory, otherLayoutId: this.otherLayoutId, level: this.level });
        this.reset();
        this.refresh();
    }

    getInventoryQuantity(inventory, itemName) {
        var itemIndex = inventory.map(el => el != undefined? el.itemName: null ).indexOf(itemName);
        if (itemIndex != -1)
         {
            return inventory[itemIndex].quantity;
        } else return 0;
    }
}