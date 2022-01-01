// Norton's EventDepot, inspired by Carver's EventEmitter
class EventDepot {

    constructor() {
        // eventRegistry will be of the form:
        // { event1: [eventHandler, eventHandler...], event2: [eventHandler, eventHandler...] }
        this.eventRegistry = {};
    }

    addListener(eventName, listener) {
        
        let currentKeys = Object.keys(this.eventRegistry);
        if (!currentKeys.includes(eventName)) {
            this.eventRegistry[eventName] = [];
        }
        this.eventRegistry[eventName].push(listener);

    }

    fire(eventName, eventData) {

        if (this.eventRegistry[eventName]) {
            let handlers = this.eventRegistry[eventName];
            for (let handler of handlers) {
                handler(eventData);                
            }
        }
    }
    
    removeListeners(eventName) {
        delete this.eventRegistry[eventName];
    }

    /* Listener function must be named */
    removeListener(eventName, uniqueId) {
        this.eventRegistry[eventName] = this.eventRegistry[eventName].filter(el => el.name != uniqueId);
        console.dir(this.eventRegistry[eventName]);
    }
}

export { EventDepot };