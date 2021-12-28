
import { InventoryScreen } from './inventoryScreen.js'


class Modal {

    constructor(eventDepot, game) {

        this.inventoryScreen = new InventoryScreen(eventDepot, game, this);

        eventDepot.addListener('modal', (data) => {

            eventDepot.fire('unlockControls', {});
            var context;
        
            switch (data.type) {
                case 'inventory': 
                    context = this.inventoryScreen.getInventoryContext(0);
                    break;
                
                default:
        
            }
            
            this.loadTemplate('modal-body', data.type, context, () => {
                if (data.type == "inventory") this.inventoryScreen.addInventoryEvents();
            });
            
            var modal = document.getElementById('myModal');
            var closer = document.getElementsByClassName("close")[0];
            var modalTitle = document.getElementById('modal-title').innerHTML = data.title;
        
            modal.style.display = "block";
        
            function escape() {
                modal.style.display = "none";
                eventDepot.fire('lockControls', {});
            }
        
            closer.onclick = function() {
                escape();
            }
        
            window.onclick = function(event) {
                if (event.target == modal) {
                    escape();
                }
            }
        })
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

