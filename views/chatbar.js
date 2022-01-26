class Chatbar {

    constructor(eventDepot, socket) {
        
        this.chatbarElement = document.getElementById('chatbar');
        
        this.eventDepot = eventDepot;
        this.socket = socket;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();

        this.messageThread = [];
    }



    addEventListeners() {

        // data: { playerName: ..., message: ... }
        this.socket.on('chat', (data) => {

            this.messageThread.push(data);
            if (this.messageThread.length > 5) this.messageThread.unshift();
            this.refreshChatbar();
        })

        this.eventDepot.addListener('toggleChatbar', data => {

            if (data.show) {
                this.eventDepot.fire('disableKeyDownListener', {});
                this.refreshChatbar();
                
            } else { 
                this.eventDepot.fire('enableKeyDownListener', {});
                document.getElementById('chatInput').style.display = 'none';
            }
        })
    }

    refreshChatbar = () => {
        // set context data and call loadTemplate
        this.loadTemplate(this.messageThread, () => {
            document.getElementById('chatInput').style.display = 'flex';
            document.getElementById('chatMessage').focus();
            this.addChatMessageListeners();

        });
    }

    /** These listeners are active when the chatbar is visible */
    addChatMessageListeners = () => {

        document.getElementById('chatMessage').addEventListener('keydown', this.submitOnEnter);

        document.getElementById('chatSend').addEventListener('click', () => {
            this.submitMessage(document.getElementById('chatMessage').value);
        });

        document.getElementById('chatSendCoordinates').addEventListener('click', () => {
            querySC('getHeroCoordinates', this.eventDepot, {}).then(coordinates => {
                this.socket.emit('chat', { message: `x: ${coordinates.x}, z: ${coordinates.z}` });
                document.getElementById('chatMessage').focus();
            });
        })

        document.getElementById('chatClose').addEventListener('click', () => {
            this.eventDepot.fire('toggleChatbar',{});
        });

        document.addEventListener('keydown', (event) => {

            /** Handle alt-... */
            if (event.altKey) {
                switch ( event.keyCode ) {
                    case 84: // T
                        document.getElementById('chatMessage').focus();
                        break;
                }
            }
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

    submitOnEnter = (event) => {
        if (event.keyCode == 13) this.submitMessage(document.getElementById('chatMessage').value);
    }

    submitMessage(message) {
        this.socket.emit('chat', { message })
        document.getElementById('chatMessage').value = "";
        document.getElementById('chatMessage').focus();
    }

}

export { Chatbar }