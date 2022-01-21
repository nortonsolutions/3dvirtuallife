export class DialogScreen {

    constructor(eventDepot, modal) {
        this.modal = modal;
        this.eventDepot = eventDepot;
        this.entity = null;
        this.hero = null;
        this.gameObjects = [];
        this.tab = { items: {}, totalPrice: {} } ;
        this.payment = { };
        this.acceptDisabled = true;
        this.tempSpeech = null;
    }

    reset() {
        this.acceptDisabled = true;
        this.tab = { items: {}, totalPrice: {} } ;
        this.payment = { };
        this.tempSpeech = null;
    }

    updateSpeech(speech) {
        this.tempSpeech = speech;
    }

    /** 
     * this.tab will look like this:
     * 
     * {
     *    items: {
     *        "itemA": 2,
     *        "item2": 1
     *    },
     *    totalPrice: {
     *         "gold": 20,
     *         "crystalBall": 1
     *    }
     * }
     * 
     * this.payment resembles the totalPrice object above.
     * 
     * @param price will look like "gold/30" or "crystalBall/1"
     */
    addTabItem(itemName, price) { // always incremented by one

        let [paymentItem,paymentQuantity] = price.split('/');
        
        var paymentItemTotal;

        if (this.tab.totalPrice[paymentItem]) { // increment
            paymentItemTotal  = Number(this.tab.totalPrice[paymentItem]) + Number(paymentQuantity);
        }  else { // create
            paymentItemTotal = Number(paymentQuantity);
        }

        // Don't bother adding if the hero doesn't have it...
        if (paymentItemTotal > this.hero.getInventoryQuantity(paymentItem)) {
            this.updateSpeech("Sorry friend.  You don't have enough to pay for this.");
            return this.tab;
        } else {
            this.updateSpeech("Ah yes, what a fine item it is!");
        }

        if (this.tab.items[itemName]) { // increment
            this.tab.items[itemName] = Number(this.tab.items[itemName]) + 1;
        }  else { // create
            this.tab.items[itemName] = 1
        }

        this.tab.totalPrice[paymentItem] = paymentItemTotal;

        return this.tab;
    }

    removeTabItem(itemName, price) {

        if (this.tab.items[itemName] >= 1) {

            if (this.tab.items[itemName] == 1) {
                delete this.tab.items[itemName];
            } else if (this.tab.items[itemName] > 1) {
                this.tab.items[itemName] = Number(this.tab.items[itemName]) - 1;
            }
    
            let [paymentItem,paymentQuantity] = price.split('/');
    
            if (paymentItem == 'gold') {
                this.tab.totalPrice.gold -= Number(paymentQuantity);
            } else {
                this.tab.totalPrice[paymentItem] = Number(this.tab.totalPrice[paymentItem]) - Number(paymentQuantity);
                if (this.tab.totalPrice[paymentItem] == 0) delete this.tab.totalPrice[paymentItem];
            }
        }

        return this.tab;        
    }

    addPaymentItem(itemName) { 

        let currentNumberCommitted = this.payment[itemName]? this.payment[itemName] : 0;
        if (currentNumberCommitted < this.hero.getInventoryQuantity(itemName)) {
            if (this.payment[itemName]) {
                this.payment[itemName] += 1;
            } else {
                this.payment[itemName] = 1; 
            }
        }
        this.refresh();
        return this.payment;
    }

    removePaymentItem(itemName) {
        if (this.payment[itemName] > 1) {
            this.payment[itemName] -= 1;
        } else {
            if (itemName == "gold") {
                this.payment[itemName] = 0;
            } else {
                if (this.payment[itemName]) delete this.payment[itemName];
            }
        }
        this.refresh();
        return this.payment;        
    }

    matchTab() {

        let paymentCopy = JSON.parse(JSON.stringify(this.payment));
        Object.keys(this.tab.totalPrice).forEach(itemName => {
            if (this.tab.totalPrice[itemName] <= this.hero.getInventoryQuantity(itemName)) {
                this.payment[itemName] = this.tab.totalPrice[itemName];
            } else {
                this.payment = paymentCopy;
                return false;
            }
        })
        return true;

    }

    setCurrentEntities(entity, hero) {
        this.entity = entity;
        this.hero = hero;
    }

    addDialogEvents() {

        Array.from(document.querySelectorAll('.response')).forEach(el => {
            el.addEventListener('click', e => {
                // e.target.id;
                let responseType = this.getContext().responses[e.target.id].type;
                switch (responseType) {
                    case "engage":
                        this.entity.engageConversation();
                        break;
                    case "disengage":
                        this.entity.disengageConversation();
                        break;
                    case "neutral":
                        break;
                }
                this.refresh();
            })
        })

        Array.from(document.querySelectorAll('.changeTabItem')).forEach(el => {

            el.addEventListener('click', () => {
                let [itemName,price] = el.attributes['data-item'].value.split(':');
                let quantity = Number(el.attributes['data-quantity'].value);
    
                if (quantity == "1") { // "1" or "-1"
                    this.addTabItem(itemName, price);
                } else {
                    this.removeTabItem(itemName, price);
                }

                this.refresh();
            })
        })

        Array.from(document.querySelectorAll('.changePaymentItem')).forEach(el => {
            el.addEventListener('click', () => {
                let [itemName,price] = el.attributes['data-item'].value.split(':');
                let quantity = Number(el.attributes['data-quantity'].value);
    
                if (quantity == "1") { // "1" or "-1"
                    this.addPaymentItem(itemName);
                } else {
                    this.removePaymentItem(itemName);
                }

                this.refresh();
            })
        })

        Array.from(document.querySelectorAll('.matchTab')).forEach(el => {
            el.addEventListener('click', e => {
                this.matchTab();
                this.refresh();
            })
        })

        Array.from(document.querySelectorAll('.acceptDeal')).forEach(el => {
            el.addEventListener('click', e => {
                this.acceptDeal();
                this.refresh();
            })
        })


    }

    goodDeal() {

        if (Object.keys(this.tab.items).length == 0) return false;

        let goodDeal = true;
        Object.keys(this.tab.totalPrice).forEach(itemName => {
            if (this.payment[itemName] == undefined || this.tab.totalPrice[itemName] > this.payment[itemName]) {
                goodDeal = false;
            }
        })
        return goodDeal;
    }

    acceptDeal() { // item exchange

    }

    getContext() {
        
        if (this.gameObjects.length == 0) this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        let context = this.entity.getCurrentConversation();

        if (context.wares) {

            var inv = context.wares;
            context.inventory = [];

            let wantsPageSize = 2;
            context.wants = [];

            for (let index = 0; index < inv.length; index++) {
                let objectName = inv[index] && inv[index].itemName ? inv[index].itemName : undefined;

                let priceString = null;
                let [paymentItem,paymentQuantity] = inv[index].price.split('/');

                if (paymentItem == "gold") {
                    priceString = "$" + paymentQuantity;
                } else priceString = 'item';

                context.inventory[index] = {
                    index: index,
                    name: objectName,
                    description: this.gameObjects[objectName].description,
                    image: this.gameObjects[objectName].image,
                    quantity: inv[index].quantity? inv[index].quantity: 1,
                    price: inv[index].price,
                    priceString
                };

            }

            // look at special conditions to determine wants
            let specialConditions = this.entity.attributes.conversation.special.condition;

            for (let index = 0; index < specialConditions.length; index++) {
                let objectName = specialConditions[index] ? specialConditions[index] : undefined;

                context.wants[index] = {
                    index: index,
                    name: objectName,
                    description: this.gameObjects[objectName].description,
                    image: this.gameObjects[objectName].image,
                    quantity: this.hero.getInventoryQuantity(objectName)
                };

            }
        }

        context.payment = this.payment;
        context.tab = this.tab;
        context.acceptDisabled = this.acceptDisabled;

        if (this.tempSpeech) context.speech = this.tempSpeech;
        return context;
    }

    refresh = () => {

        if (this.goodDeal()) {
            this.acceptDisabled = false;
        } else this.acceptDisabled = true;

        let context = this.getContext();
        this.modal.loadTemplate('modal-body', "dialog", context, () => {
            this.addDialogEvents();
        });


    }
}