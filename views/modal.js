
import { InventoryScreen } from './inventoryScreen.js';
import { LoadGameScreen } from './loadGameScreen.js';
import { LevelUpScreen } from './levelUpScreen.js';
import { DialogScreen } from './dialogScreen.js';
import { CharacterScreen } from './characterScreen.js';
import { JoinGameScreen } from './joinGameScreen.js';
import { HeroDialogScreen } from './heroDialogScreen.js';

class Modal {

    constructor(eventDepot, gameAPI, socket) {

        this.gameAPI = gameAPI;
        this.eventDepot = eventDepot;
        this.inventoryScreen = new InventoryScreen(eventDepot, this);
        this.loadGameScreen = new LoadGameScreen(eventDepot, this);
        this.levelUpScreen = new LevelUpScreen(eventDepot, this);
        this.dialogScreen = new DialogScreen(eventDepot, this);
        this.characterScreen = new CharacterScreen(eventDepot, this);
        this.joinGameScreen = new JoinGameScreen(eventDepot, this);
        this.heroDialogScreen = new HeroDialogScreen(eventDepot, this, socket);

        this.closeModal = this.closeModal.bind(this);
        this.heroDialog = false;
        
        /** e.g. data: { type: 'loadGame', title: 'Load Game', context: response } */
        eventDepot.addListener('modal', (data) => {

            eventDepot.fire('unlockControls', {});

            var context;
            if (data.type == "inventory") {

                context = this.inventoryScreen.getContext(0);

            } else if (data.type == "dialog") {
                this.dialogScreen.reset();
                this.dialogScreen.setCurrentEntities(data.entity, data.hero);
                context = this.dialogScreen.getContext();

            } else if (data.type == "character") {

                context = null;
            
            } else if (data.type == "heroDialog") {
                this.heroDialogScreen.reset();
                this.heroDialogScreen.setup(data.level, data.initiator, data.layoutId, data.otherLayoutId, data.heroInventory, data.otherInventory);
                context = this.heroDialogScreen.getContext();
                
            } else {
                context = data.context;
            }
            
            this.loadTemplate('modal-body', data.type, context, () => {

                this.heroDialog = false;

                switch (data.type) {
                    case "inventory":
                        this.inventoryScreen.addInventoryEvents();
                        break;
                    case "loadGame": 
                        this.loadGameScreen.addLoadGameEvents();
                        break;
                    case "levelUp":
                        this.levelUpScreen.addLevelUpEvents();
                        break;
                    case "dialog":
                        this.dialogScreen.addDialogEvents();
                        this.dialogScreen.initCanvas();
                        break;
                    case "character":
                        this.characterScreen.initialize();
                        break;
                    case "heroDialog":
                        this.heroDialog = true;
                        this.heroDialogScreen.addHeroDialogEvents();
                        break;
                    case "joinGame":
                        this.joinGameScreen.addJoinGameEvents(context);
                        break;
                }

                if (data.type == 'levelUp') {
                    this.eventDepot.fire('disableCloser', {});
                } else {
                    this.eventDepot.fire('enableCloser', {});
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

        eventDepot.addListener('disableCloser', () => {
            document.getElementsByClassName("close")[0].classList.add('d-none');
        })

        eventDepot.addListener('enableCloser', () => {
            document.getElementsByClassName("close")[0].classList.remove('d-none');
        })

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

