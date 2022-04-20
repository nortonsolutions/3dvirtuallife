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
        this.negotiation = false;

        this.currentModel = null;
        this.actions = [];
        this.emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
        this.currentlyFadingToAction = false;
        this.activeActionName

        this.prevTime = performance.now();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, 2/3, 0.25, 100 );
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );

        this.loader = new THREE.GLTFLoader();
        this.running = false;
        this.animationId = null;
        this.cylinder = null;

        // lights

        var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 20, 0 );
        this.scene.add( light );

        let light2 = new THREE.DirectionalLight( 0xffffff );
        light2.position.set( 0, 20, 10 );
        this.scene.add( light2 );

        // var ambientLight = new THREE.AmbientLight( 0xcccccc, 2 );
        // this.scene.add( ambientLight );

        let light3 = new THREE.DirectionalLight( 0xffffff );
        light3.position.set( 60, 40, 10 );
        this.scene.add( light3 );

        var closer = document.getElementsByClassName("close")[0];
        closer.onclick = () => {
            this.closeModal();
        }
    }

    closeModal = () => {
        this.running = false;
    }

    initCanvas = () => {
        this.tempSpeech = null;
        // stop the existing animation cycle
        if (this.animationId) cancelAnimationFrame( this.animationId );
        
        // Re-add the playerPreview panel
        let playerPreview = document.getElementById('playerPreview');
        playerPreview.appendChild( this.renderer.domElement );
        
        this.scene.remove( this.currentModel );
        this.scene.dispose();
        this.running = true;
        this.render();

        // Which model to add to the scene?
        this.loader.load( '/models/3d/gltf/' + this.entity.template.gltf, (gltf) => {
            this.currentModel = gltf.scene;
            this.animations = gltf.animations;
            this.mixer = new THREE.AnimationMixer( this.currentModel );

            this.currentModel.scale.x = this.entity.template.attributes.scale;
            this.currentModel.scale.y = this.entity.template.attributes.scale;
            this.currentModel.scale.z = this.entity.template.attributes.scale;

            if (this.entity.template.attributes.rotateY) {
                this.currentModel.rotateY(degreesToRadians(this.entity.template.attributes.rotateY));
            }

            this.scene.add( this.currentModel );
            this.camera.position.z = 40;
            if (this.entity.template.attributes.dialogCameraDistance) this.camera.position.z += this.entity.template.attributes.dialogCameraDistance;
            this.camera.position.y = this.entity.template.attributes.dialogHeight;

            this.animations.forEach((animation,index) => {
                var action = this.mixer.clipAction( animation );
                
                if ( this.emotes.indexOf( animation.name ) >= 0) {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                }

                this.actions[ animation.name ] = action;
            });
        
            // if (this.entity.objectName == "blacksmith") {
            //     this.activeActionName = 'Smiting';
            //     this.activeAction = this.actions[ 'Smiting' ];
            //     this.actions['Smiting'].setEffectiveTimeScale(1);

            // } else {
                this.activeActionName = 'Idle';
                this.activeAction = this.actions[ 'Idle' ];
                this.actions['Idle'].setEffectiveTimeScale(.1);
    
            // }
            this.previousActionName = '';
            this.previousAction = null;
    
            this.activeAction.play();

        })
    }

    /**
     * Recursive method which renders the scene in the canvas.
     */
    render = () => {
        
        if (this.running) {
            this.time = performance.now();
            
            this.delta = ( this.time - this.prevTime ) / 1000;
            if (this.mixer) this.mixer.update( this.delta );
            
            this.animationId = requestAnimationFrame( this.render );
            
            this.renderer.render( this.scene, this.camera );
            this.prevTime = this.time;

        } else {
            cancelAnimationFrame( this.animationId );      
            this.dispose(this.scene);      
        }
    }

    dispose(item) {
        if (item.children.length == 0) {
            if (item.dispose) item.dispose();
            return;
        } else {
            item.children.forEach(child => {
                this.dispose(child);
            })
        }
        if (item.dispose) item.dispose();
    }

    fadeToAction( actionName, duration ) {
        
        if ( ! this.currentlyFadingToAction && this.activeActionName !== actionName ) { // 
            
            this.currentlyFadingToAction = true;
            
            let newAction = this.actions[ actionName ];

            this.previousActionName = this.activeActionName;
            this.previousAction = this.activeAction;
            this.activeActionName = actionName;
            this.activeAction = newAction;

            if (this.previousAction) this.previousAction.fadeOut( duration );

            if (this.activeAction) {
                this.activeAction
                    .reset()
                    .fadeIn( duration )
                    .play();

                const restoreState = () => {
                    this.currentlyFadingToAction = false;
                    this.mixer.removeEventListener('finished', restoreState );
                    this.fadeToAction( this.previousActionName, 0.1 );
                }

                if (this.emotes.includes(actionName)) {
                    this.mixer.addEventListener( 'finished', restoreState );
                } else {
                    this.currentlyFadingToAction = false;
                }
            }
        }
    }

    addDialogEvents() {

        /**
         *  challenge: {
                condition: ["keyToKingdom"],
                speech: 'Please provide the passphrase.',
                challenge: 'shibboleth',
                grants: 'keyToKingdom',
                fail: 'That is not the pass.  Return when you have the password.',
                success: 'The pass is right.  Here is your key to operate the lever.'
            },
         */
        Array.from(document.querySelectorAll('#challengePasswordSubmit')).forEach(el => {
            el.addEventListener('click', e => { 
                
                let challengeResponse = '';
                let passEntered = document.getElementById('challengePassword').value;

                if (passEntered == this.getContext().challenge) {
                    challengeResponse = this.getContext().success;
                    this.hero.addToInventory(this.getContext().grants, 0, 1);
                } else {
                    challengeResponse = this.getContext().fail;
                }

                this.refresh(challengeResponse);
            });
        });

        Array.from(document.querySelectorAll('.response')).forEach(el => {
            el.addEventListener('click', e => {
                // e.target.id;

                var tempSpeech = null;
                let responseType = this.getContext().responses[e.target.id].type;
                switch (responseType) {

                    case "engage":
                        this.entity.engageConversation();
                        break;

                    case "disengage":
                        this.entity.disengageConversation();
                        break;

                    case "trade":
                        this.entity.attributes.conversation.state = "trade";
                        break;

                    case "reset":
                        let d = this.entity.attributes.conversation.defaultState;
                        this.entity.attributes.conversation.state = d ? d: "intro";
                        this.entity.attributes.conversation.engagementState = 0;
                        this.reset();
                        break;

                    case "enlist":
                        this.entity.attributes.conversation.state = "loyalFollower";
                        this.entity.follow(this.hero);
                        this.reset();
                        this.fadeToAction('Yes', 0.2);
                        tempSpeech = "As you wish!"
                        break;

                    case "release":
                        this.entity.attributes.conversation.state = "loyalSubject";
                        this.entity.unfollow(this.hero);
                        this.reset();
                        this.fadeToAction('Yes', 0.2);
                        tempSpeech = "As you wish!"
                        break;

                    case "grant": // grant special condition items
                    
                        for (let item of this.getContext().condition) {
                            if (this.hero.inventoryContains([item])) {
                                this.entity.addToInventory(item, 0, 1);
                                this.hero.removeFromInventory(item); 
                                break;
                            } 
                        }
                        this.entity.giveLoyalty(this.hero);
                        this.reset();
                        this.entity.attributes.conversation.state = 'intro';
                        this.fadeToAction('Yes', 0.2);
                        tempSpeech = "God bless you!"
                        break;

                    case "mount":
                        this.hero.mount(this.entity);
                        tempSpeech = "Let's go!"
                        break;

                    case "end":
                        this.closeModal();
                        this.eventDepot.fire('closeModal', {});
                        break;

                    case "neutral":
                        break;
                }
                this.refresh(tempSpeech);
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

                var response;
                if (Array.from(el.classList).includes("disabled")) {
                    this.fadeToAction('No', 0.2);
                    response = "You'll have to do better than that, my friend."
                } else {
                    
                    response = this.acceptDeal();

                    if (this.entity.attributes.cutScenes && this.entity.attributes.cutScenes.acceptDeal) {
                        setTimeout(() => {
                            this.eventDepot.fire('modal', { type: 'cutScene', title: 'Good deal!', context: { videoName: this.entity.attributes.cutScenes.acceptDeal } });
                        },2000);
                    }
                }

                this.refresh(response);
            })
        })


    }

    setCurrentEntities(entity, hero) {
        this.entity = entity;
        this.hero = hero;
    }

    reset() {
        this.tempSpeech = null;
        this.acceptDisabled = true;
        this.tab = { items: {}, totalPrice: {} } ;
        this.payment = { };
        this.negotiation = false;
    }

    refresh = (tempSpeech) => {
        this.currentlyFadingToAction = false;
        
        if (tempSpeech) {
            this.updateSpeech(tempSpeech);
        } else this.tempSpeech = null;


        if (this.negotiation) {
            if (this.goodDeal()) {
                this.acceptDisabled = false;
                this.fadeToAction('Yes', 1);
                this.updateSpeech("This looks like a fair deal!");
    
            } else {
                this.updateSpeech(tempSpeech? tempSpeech: "Make me an offer.");
                this.acceptDisabled = true;
            }
        }

        let context = this.getContext();

        this.modal.loadTemplate('dialogActive', "dialogActive", context, () => {
            this.addDialogEvents();
        });

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

        let currentNumberCommitted = this.tab.items[itemName]? this.tab.items[itemName] : 0;
        if (currentNumberCommitted < this.entity.getInventoryQuantity(itemName)) {

            if (this.tab.items[itemName]) { // increment
                this.tab.items[itemName] = Number(this.tab.items[itemName]) + 1;
            }  else { // create
                this.tab.items[itemName] = 1
            }

            price.split(',').forEach(subprice => {
                let [paymentItem,paymentQuantity] = subprice.split('/');
            
                var paymentItemTotal;
    
                if (this.tab.totalPrice[paymentItem]) { // increment
                    paymentItemTotal  = Number(this.tab.totalPrice[paymentItem]) + Number(paymentQuantity);
                }  else { // create
                    paymentItemTotal = Number(paymentQuantity);
                }
                this.tab.totalPrice[paymentItem] = paymentItemTotal;
            });
        }
        return this.tab;
    }

    removeTabItem(itemName, price) {

        if (this.tab.items[itemName] >= 1) {

            if (this.tab.items[itemName] == 1) {
                delete this.tab.items[itemName];
            } else if (this.tab.items[itemName] > 1) {
                this.tab.items[itemName] = Number(this.tab.items[itemName]) - 1;
            }
    
            price.split(',').forEach(subprice => {
                let [paymentItem,paymentQuantity] = subprice.split('/');
    
                if (paymentItem == 'gold') {
                    this.tab.totalPrice.gold -= Number(paymentQuantity);
                } else {
                    this.tab.totalPrice[paymentItem] = Number(this.tab.totalPrice[paymentItem]) - Number(paymentQuantity);
                    if (this.tab.totalPrice[paymentItem] == 0) delete this.tab.totalPrice[paymentItem];
                }
            })
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

    goodDeal() {

        if (Object.keys(this.tab.items).length == 0) return false;

        let goodDeal = true;


        // this.tab.totalPrice and this.payment resemble this: 
        // {
        //    "gold": 20,   (payable with items of exchange as well)
        //    "crystalBall": 1,
        //    "bagOfGems": 2    (redeemable as gold)
        // }

        Object.keys(this.tab.totalPrice).forEach(itemName => {

            switch (itemName) {
                case "gold":

                    // check to see if the total gold value of the offer meets the price
                    var tally = 0;
                    Object.keys(this.payment).forEach(item => {
                        let quantity = Number(this.payment[item]);
                        if (item == "gold") {
                            tally += quantity;
                        } else tally += (quantity * this.entity.getGoldValue(item));
                    })
                    if (this.tab.totalPrice[itemName] > tally) goodDeal = false;
                    break;

                default: 
                    if (this.payment[itemName] == undefined || this.tab.totalPrice[itemName] > this.payment[itemName]) {
                        goodDeal = false;
                    }
            }

        })
        return goodDeal;
    }

    acceptDeal() { // item exchange

        Object.keys(this.tab.items).forEach(item => {

            let keyCode = null;

            if (/house/.test(item)) {
                keyCode = getRndInteger(1,100000);
                this.hero.addToInventory("keyToHouse", 0, this.tab.items[item], keyCode);
            }

            this.hero.addToInventory(item, 0, this.tab.items[item], keyCode);
        });

        Object.keys(this.payment).forEach(item => {
            this.entity.addToInventory(item, 0, this.payment[item]);
        });

        // Removals
        Object.keys(this.tab.items).forEach(item => {
            for (let i = 0; i < this.tab.items[item]; i++) {
                this.entity.removeFromInventory(item);
            }
        })

        Object.keys(this.payment).forEach(item => {
            for (let i = 0; i < this.payment[item]; i++) {
                this.hero.removeFromInventory(item); 
            }
        })
        
        this.hero.cacheHero();
        // TODO: Adjust the wants of the entity
        this.reset();
        this.fadeToAction('Yes', 0.2);

        return "We have a deal!";
    }

    getContext() {
        
        if (this.gameObjects.length == 0) this.gameObjects = JSON.parse(localStorage.getItem('gameObjects'));
        let context = this.entity.getCurrentConversation();

        if (context.wares) {

            this.negotiation = true;
            var inv = context.wares;
            context.inventory = [];
            context.wants = [];

            for (let index = 0; index < inv.length; index++) {
                let objectName = inv[index] && inv[index].itemName ? inv[index].itemName : undefined;


                if (inv[index] && inv[index].price) { // if the item is valid and has a price
                    let priceString = '';


                    inv[index].price.split(',').forEach((price,index) => {
                        let [paymentItem,paymentQuantity] = price.split('/');
    
                        if (index > 0) priceString += ',';
                        if (paymentItem == "gold") {
                            priceString += "$" + paymentQuantity;
                        } else priceString += 'item';
                    })

                    if (priceString.indexOf(',') >= 0) {
                        priceString = priceString.substr(0,priceString.indexOf(',')) + "+";
                    }

    
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
            }

            // look at special conditions to determine wants
            let wants = this.entity.attributes.conversation.trade.wants;

            if (wants == 'all') wants = this.hero.inventory
            .filter(e => e != null).map(e => e.itemName);

            for (let index = 0; index < wants.length; index++) {
                let objectName = wants[index] ? wants[index] : undefined;

                context.wants[index] = {
                    index: index,
                    name: objectName,
                    description: this.gameObjects[objectName].description,
                    image: this.gameObjects[objectName].image,
                    quantity: this.hero.getInventoryQuantity(objectName)
                };

            }
        } else if (context.challenge) {

        }

        context.payment = this.payment;
        context.tab = this.tab;
        context.acceptDisabled = this.acceptDisabled;
        context.goldExchange = Math.floor(this.entity.getGoldValue('bagOfGems'));

        if (this.tempSpeech) {
            context.tempSpeech = this.tempSpeech;
        } else context.tempSpeech = null;

        return context;
    }

}