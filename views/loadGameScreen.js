export class LoadGameScreen {

    constructor(eventDepot, modal) {
        this.eventDepot = eventDepot;
        this.modal = modal;

        this.refresh = this.refresh.bind(this);
    }

    addLoadGameEvents() {
        document.querySelectorAll('.load').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                let gameName = e.target.id;
                // this.modal.gameAPI is available
            })
        })

        document.querySelectorAll('.delete').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                let gameName = e.target.id;
                this.modal.gameAPI.deleteGame(gameName);
                this.refresh;
            })
        })
    }

    refresh() {
        handleGet('/list', response => {
            this.modal.loadTemplate('modal-body', 'loadgame', response, () => {
                this.addLoadGameEvents();
            });
        });
    }

}