class Chatbar {

    constructor(eventDepot) {
        this.chatbarElement = document.getElementById('chatbar');
        this.eventDepot = eventDepot;
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        this.eventDepot.addListener('toggleChatbar', data => {
            this.chatbarElement.style.display = data.show? 'flex' : 'none';

            if (data.show) {
                
                // Add keylistener specifically for Alt-T to restore focus


                this.eventDepot.fire('disableKeyDownListener', {});
                this.refreshChatbar(data);
            } else { 
                this.eventDepot.fire('enableKeyDownListener', {});
            }
        })

        // // data: { ... }
        // this.eventDepot.addListener('refreshChatbar', data => {
        //     this.refreshChatbar(data);
        // })
    }

    refreshChatbar = (data) => {
        // set context data and call loadTemplate
        this.loadTemplate(data, () => {
            document.getElementById('chatMessage').focus();
            this.addChatMessageListeners();
        });
    }

    /** These listeners are active when the chatbar is visible */
    addChatMessageListeners = () => {

        document.addEventListener('keydown', (event) => {

            /** Handle alt-... */
            if (event.altKey) {
                switch ( event.keyCode ) {
                    case 84: // T
                        document.getElementById('chatMessage').focus();
                        break;
                }
    
            }
            console.log('testing');
        });

        document.getElementById('chatMessage').addEventListener('focus', () => {
            this.eventDepot.fire('disableKeyDownListener', {});  
        });

        document.getElementById('chatMessage').addEventListener('blur', () => {
            this.eventDepot.fire('enableKeyDownListener', {});  
        });
    }

    loadTemplate = (data, callback) => {

        handleGet(`/views/chatbar.hbs`, response => {
            let template = Handlebars.compile(response);
            this.chatbarElement.innerHTML = template(data);
            if (callback) callback();
        });
    }

}

export { Chatbar }