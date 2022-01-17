
import { InventoryScreen } from './inventoryScreen.js';
import { LoadGameScreen } from './loadGameScreen.js';
import { LevelUpScreen } from './levelUpScreen.js';

class Modal {

    constructor(eventDepot, gameAPI) {

        this.gameAPI = gameAPI;
        this.eventDepot = eventDepot;
        this.inventoryScreen = new InventoryScreen(eventDepot, this);
        this.loadGameScreen = new LoadGameScreen(eventDepot, this);
        this.levelUpScreen = new LevelUpScreen(eventDepot, this);

        this.closeModal = this.closeModal.bind(this);

        /** e.g. data: { type: 'loadGame', title: 'Load Game', context: response } */
        eventDepot.addListener('modal', (data) => {

            eventDepot.fire('unlockControls', {});

            var context;
            if (data.type == "inventory") {
                context = this.inventoryScreen.getContext(0);
            } else {
                context = data.context;
            }
            
            this.loadTemplate('modal-body', data.type, context, () => {
                if (data.type == "inventory") {
                    this.inventoryScreen.addInventoryEvents(data.type);
                } else if (data.type == 'loadGame') {
                    this.loadGameScreen.addLoadGameEvents();
                } else if (data.type == 'levelUp') {
                    this.levelUpScreen.addLevelUpEvents();
                }
            });
            
            var modal = document.getElementById('myModal');
            var closer = document.getElementsByClassName("close")[0];
            var modalTitle = document.getElementById('modal-title').innerHTML = data.title;
        
            modal.style.display = "block";
        
            closer.onclick = () => {
                this.closeModal();
            }
        
            // window.onclick = (event) => {
            //     if (event.target == modal) {
            //         this.closeModal();
            //     }
            // }
        });

        eventDepot.addListener('closeModal', () => {
            this.closeModal();
        });
    }

    closeModal = () => {
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
        this.eventDepot.fire('lockControls', {});
    }

    loadTemplate = (elementId, template, data, callback) => {
        handleGet(`/views/${template}.hbs`, response => {
            let template = Handlebars.compile(response);
            document.getElementById(elementId).innerHTML = template(data);
            if (callback) callback();
        });
    }
}

export { Modal };

