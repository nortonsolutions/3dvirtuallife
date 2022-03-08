export class JoinGameScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.heroTemplate = null;
        this.activeGames = null;
    }

    addJoinGameEvents(context) {

        this.heroTemplate = context.heroTemplate;
        this.activeGames = context.activeGames;

        document.querySelectorAll('.join').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                let game = e.target.id;
                
                // TODO: set the local gameProps to match the server
                this.modal.closeModal();
                let heroTemplate = this.heroTemplate;
                heroTemplate.location = {};
                heroTemplate.location.x = 0;
                heroTemplate.location.y = 0;
                heroTemplate.location.z = 0;

                let props = this.activeGames[game];
                props.level = 0;

                this.eventDepot.fire('startLevel', { heroTemplate: this.heroTemplate, props });
                
            })
        })
    }
}