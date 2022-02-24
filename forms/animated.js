import { StandardForm } from './standard.js'



/**
 * AnimatedForms are forms that have animation actions
 * and a mixer.
 */
export class AnimatedForm extends StandardForm{

    constructor(template, sceneController) {

        super(template, sceneController);

        this.actions = [];
        
        this.states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
        
        this.currentlyFadingToAction = false;
        this.animatedSubforms = [];

        this.handAttacksR = [];
        this.kickAttacksR = [];
        this.handAttacksL = [];
        this.kickAttacksL = [];
        this.blocks = [];
        this.bowAttacks = [];

        this.possibleHandAttacksR = ["Punch", "Attack", "Punch2", "Punching R", "Striking R", "Swing R"];
        this.possibleHandAttacksL = ["Punching L", "Striking L", "Swing L"];
        this.possibleKickAttacksR = ["Kick", "Kick R"];
        this.possibleKickAttacksL = ["Kick L"]
        this.possibleBlocks = ["Blocking R", "Blocking L"];
        this.possibleBowAttacks = ["ThumbsUp", "Givining the bird"];

        this.emotes = [ 
            'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp', 'Walking in', 'Walking out', 'Open', 'Close',
            ...this.possibleBlocks,
            ...this.possibleBowAttacks, 
            ...this.possibleHandAttacksR, 
            ...this.possibleKickAttacksR,
            ...this.possibleHandAttacksL, 
            ...this.possibleKickAttacksL
        ];
    }
    
    load(callback) {

        super.load(() => {

            this.mixer = new THREE.AnimationMixer( this.model );

            let firstAnimationName = '';
            this.animations.forEach((animation,index) => {
                
                if (this.possibleHandAttacksR.includes(animation.name)) {
                    this.handAttacksR.push(animation.name);
                } else if (this.possibleHandAttacksL.includes(animation.name)) {
                    this.handAttacksL.push(animation.name);
                } else if (this.possibleKickAttacksR.includes(animation.name)) {
                    this.kickAttacksR.push(animation.name);
                } else if (this.possibleKickAttacksL.includes(animation.name)) {
                    this.kickAttacksL.push(animation.name);
                } else if (this.possibleBlocks.includes(animation.name)) {
                    this.blocks.push(animation.name);
                } else if (this.possibleBowAttacks.includes(animation.name)) {
                    this.bowAttacks.push(animation.name);
                }

                var action = this.mixer.clipAction( animation );
                if (index == 0) { firstAnimationName = animation.name };
    
                if (this.objectName == "tavernShop") {
                    action.clampWhenFinished = false;
                    action.loop = THREE.LoopOnce;
                } else if ( this.emotes.indexOf( animation.name ) >= 0 || this.states.indexOf( animation.name ) >= 4) {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                } else if (this.model.objectType=='structure' || this.objectName == "floor") {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                } else if (this.model.objectType=='item' && (!this.attributes.animatesRecurring)) {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopPingPong;
                    action.repetitions = 1;
                } else if (this.model.objectType=='item' && this.attributes.animatesRecurring) {
                    this.model.children[1].material.opacity = 0.5;
                } else if (this.model.objectName=='ghostGhoul') {
                    this.model.children[0].children[1].material.opacity = 0.5;
                }
    
                this.actions[ animation.name ] = action;
    
            });
    
            this.handAttacks = [...this.handAttacksR, ...this.handAttacksL];
            this.kickAttacks = [...this.kickAttacksR, ...this.kickAttacksL];

            this.activeActionName = 'Idle'; // Default for intelligent/walking beings
            this.activeAction = this.actions[ 'Idle' ]? this.actions[ 'Idle' ] : this.actions[ firstAnimationName ];
            this.previousActionName = '';
            this.previousAction = null;
    
            if (typeof this.attributes.position && this.attributes.position == "up") {
                // if (this.activeAction) this.activeAction.play();
                    if (this.activeAction) this.animations.forEach(animation => {
                        this.runAction(animation.name, 0.2);
                    })
                
            } else if (this.actions[ 'Idle' ]) this.activeAction.play();

            callback();

        })
    }

    animate(delta) {

        if (this.attributes.moves) {
            if (this.alive) {
                
                if (this.objectType == "hero" && this.balloonRide) {
                    this.fadeToAction( 'Idle', 0.2);
                } else {
                    this.absVelocity = Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.z));

                    if (this.absVelocity < .1 && (this.activeActionName == 'Walking' || this.activeActionName == 'Running')) {
                        this.fadeToAction( 'Idle', 0.2);
                    } else if (this.absVelocity >= .1 && this.activeActionName == 'Idle') {
                        if (this.objectName == 'horse') {
                            this.fadeToAction( 'horse_A_', 0.2);
                        } else {
                            this.fadeToAction( 'Walking', 0.2);
                        }
                    } else if (this.absVelocity >= 250 && this.activeActionName == 'Walking') {
                        this.fadeToAction( 'Running', 0.2);
                    }
                }
            }
        }

        this.mixer.update( delta );
    }

    fadeToAction( actionName, duration ) {

        if ( this.activeActionName != "Death" && (actionName == "Death" || ! this.currentlyFadingToAction) && this.activeActionName !== actionName ) { // 
            // console.log(`${this.objectName}: fadingToAction ${actionName}`);

            this.currentlyFadingToAction = true;
            
            let newAction = this.actions[ actionName ];

            this.previousActionName = this.activeActionName;
            this.previousAction = this.activeAction;
            this.activeActionName = actionName;
            this.activeAction = newAction;

            if (this.previousActionName && this.actions[this.previousActionName]) {
                this.previousAction.fadeOut( duration );
            }

            if (this.activeAction) {

                if (this.handAttacksR.includes(this.activeActionName)) {
                    this.handAttackR = true;
                } else if (this.handAttacksL.includes(this.activeActionName)) {
                    this.handAttackL = true;
                } else if (this.kickAttacksR.includes(this.activeActionName)) {
                    this.kickAttackR = true;
                } else if (this.kickAttacksR.includes(this.activeActionName)) {
                    this.kickAttackL = true;
                } 

                this.activeAction
                    .reset()
                    // .setEffectiveTimeScale( 1 )
                    // .setEffectiveWeight( 1 )
                    .fadeIn( duration )
                    .play();

                const restoreState = () => {
                    this.handAttackR = false;
                    this.handAttackL = false;
                    this.kickAttackR = false;
                    this.kickAttackL = false;

                    this.currentlyFadingToAction = false;
                    this.mixer.removeEventListener('finished', restoreState );
                    if (this.actions[this.previousActionName]) {
                        this.fadeToAction( this.previousActionName, 0.1 );
                    } else {
                        this.activeActionName = "Idle";
                    }
                }

                if (this.emotes.includes(actionName)) {
                    this.mixer.addEventListener( 'finished', restoreState );
                } else {
                    this.currentlyFadingToAction = false;
                }
            }
        }
    }

    runActiveAction(duration) {

        if (this.activeAction) {

            let action = this.activeAction;
            action.loop = THREE.LoopOnce;
            action.repetitions = 1;
            action.setEffectiveTimeScale( 1 );
                
            if (this.attributes.position == "down") {
                action.fadeOut( duration );
            } else {
                action.reset();
                action.setEffectiveTimeScale( 1 );
                action.fadeIn( duration );
            }

            action.play();
        }
    }

    runAction(actionName, duration) {

        let action = this.actions[actionName];
        action.loop = THREE.LoopOnce;
        action.repetitions = 1;
        action.setEffectiveTimeScale( 1 );
            
        if (this.attributes.position == "down") {
            action.fadeOut( duration );
        } else {
            action.reset();
            action.setEffectiveTimeScale( 1 );
            action.fadeIn( duration );
        }

        action.play();
    }
}