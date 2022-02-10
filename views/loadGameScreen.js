export class LoadGameScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.refresh = this.refresh.bind(this);
    }

    addLoadGameEvents() {
        document.querySelectorAll('.load').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                let gameName = e.target.id;
                this.modal.gameAPI.loadGame(gameName);
                this.modal.closeModal();
            })
        });

        document.querySelectorAll('.delete').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                let gameName = e.target.id;
                this.modal.gameAPI.deleteGame(gameName, () => {
                    this.refresh;
                });
            })
        });
    }

    refresh() {
        handleGet('/list', response => {
            this.modal.loadTemplate('modal-body', 'loadGame', response, () => {
                this.addLoadGameEvents();
            });
        });
    }

}