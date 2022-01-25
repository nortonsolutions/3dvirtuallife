class Chatbar {

    constructor(eventDepot, socket) {
        
        this.chatbarElement = document.getElementById('chatbar');
        this.eventDepot = eventDepot;
        this.socket = socket;

        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();


    }

    addEventListeners() {

        this.socket.on('chat', (data) => {
            // append chat message to chatOutput div
            let newMessage = document.createElement('span');
            newMessage.innerText = data.playerName + ': ' + data.message + '\n';
            document.getElementById('chatOutput').append(newMessage);
        })

        this.eventDepot.addListener('toggleChatbar', data => {
            this.chatbarElement.style.display = data.show? 'flex' : 'none';

            if (data.show) {
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

        document.getElementById('chatSend').addEventListener('click', () => {
            let message = document.getElementById('chatMessage').value;
            this.socket.emit('chat', { message })
        });

        document.getElementById('chatSendCoordinates').addEventListener('click', () => {
            querySC('getHeroCoordinates', this.eventDepot, {}).then(coordinates => {
                this.socket.emit('chat', { message: `x: ${coordinates.x}, z: ${coordinates.z}` });
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

}

export { Chatbar }