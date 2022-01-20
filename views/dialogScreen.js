export class DialogScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.entity = null;
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
        return this.entity.getCurrentConversation();
    }

    refresh = () => {
        let context = this.getContext();
        this.modal.loadTemplate('modal-body', "dialog", context, () => {
            this.addDialogEvents();
        });
    }


}