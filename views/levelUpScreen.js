export class LevelUpScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
    }

    addLevelUpEvents() {

        Array.from(document.querySelectorAll('.levelUp')).forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let [category, nextLevel] = e.target.id.split('-');
                this.eventDepot.fire('levelUp', { category, nextLevel })
                this.eventDepot.fire('enableCloser', {});
                this.eventDepot.fire('closeModal', {});
                
            })
        })
        
    }

}