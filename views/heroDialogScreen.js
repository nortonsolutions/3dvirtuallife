export class HeroDialogScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.socket = null;
        this.heroInventory = null;
        this.otherInventory = null;
        this.tempSpeech = null;
        this.gameObjects = [];
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

    // data.socket, data.level, data.initiator, data.layoutId, data.otherLayoutId, data.heroInventory, data.otherInventory);
    setup(socket, level, initiator, layoutId, otherLayoutId, heroInventory, otherInventory) {
        this.socket = socket;
        this.heroInventory = heroInventory;
        this.otherInventory = otherInventory;
        this.otherLayoutId = otherLayoutId;
        this.level = level;

        if (initiator) {
            this.socket.emit('heroDialogNew', { layoutId, heroInventory, otherLayoutId, level, initiator })
        } else {
            this.socket.emit('heroDialogInventory', { layoutId, heroInventory, otherLayoutId, level })
        }
    }

    addHeroDialogEvents() {
        this.socket.on('heroDialogInventory', otherInventory => {
            this.otherInventory = otherInventory;
            this.refresh();
        })

        this.socket.on('closeModal', () => {
            this.modal.closeModal();
        })

        var closer = document.getElementsByClassName("close")[0];
        
        closer.onclick = () => {
            this.modal.closeModal();
            this.socket.emit('closeModal', { level: this.level, otherLayoutId: this.otherLayoutId });
        }
    }

    reset() {
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

            context.heroInventory[index] = {
                index: index,
                name: objectName,
                description: this.gameObjects[objectName].description,
                image: this.gameObjects[objectName].image,
                quantity: inv[index].quantity? inv[index].quantity: 1,
            };
        }

        if (this.otherInventory) { // should be set by incoming socket event
            var invOther = this.otherInventory;

            for (let index = 0; index < invOther.length; index++) {
                let objectName = invOther[index] && invOther[index].itemName ? invOther[index].itemName : undefined;
    
                context.otherInventory[index] = {
                    index: index,
                    name: objectName,
                    description: this.gameObjects[objectName].description,
                    image: this.gameObjects[objectName].image,
                    quantity: invOther[index].quantity? invOther[index].quantity: 1,
                };
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

    addTabItem(itemName) {
    }

    removeTabItem(itemName) {
    }

    addPaymentItem(itemName) { 
    }

    removePaymentItem(itemName) {
    }

    proposeDeal() {
    }

    acceptDeal() { // item exchange
    }

}