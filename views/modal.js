
import { InventoryScreen } from './inventoryScreen.js'

class Modal {

    constructor(eventDepot) {

        this.inventoryScreen = new InventoryScreen(eventDepot, this);

        eventDepot.addListener('modal', (data) => {

            eventDepot.fire('unlockControls', {});
            var context = this.inventoryScreen.getContext(data.type, 0);
            
            this.loadTemplate('modal-body', data.type, context, () => {
                if (data.type == "inventory" || data.type == "spells") 
                this.inventoryScreen.addInventoryEvents(data.type);
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

