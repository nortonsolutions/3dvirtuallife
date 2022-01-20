export class DialogScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.entity = null;
        this.gameObjects = [];
    }

    setCurrentEntity(entity) {
        this.entity = entity;
    }

    addDialogEvents() {

        Array.from(document.querySelectorAll('.response')).forEach(el => {
            el.addEventListener('click', e => {
                // e.target.id;
                let responseType = this.getContext().responses[e.target.id].type;
                switch (responseType) {
                    case "engage":
                        this.entity.engageConversation();
                        break;
                    case "disengage":
                        this.entity.disengageConversation();
                        break;
                    case "neutral":
                        break;
                }
                this.refresh();
            })
        })
        
    }

    getContext() {
        
        if (this.gameObjects.length == 0) this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        let context = this.entity.getCurrentConversation();

        if (context.wares) {

            var inv = context.wares;
            let startingIndex = 0;
            let inventoryPageSize = 12;
            context.inventory = [];

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
        }

        return context;
    }

    refresh = () => {
        let context = this.getContext();
        this.modal.loadTemplate('modal-body', "dialog", context, () => {
            this.addDialogEvents();
        });
    }
}