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
        this.currentlyRunningAction = false;
        this.animatedSubforms = [];

        this.handAttacksR = [];
        this.kickAttacksR = [];
        this.handAttacksL = [];
        this.kickAttacksL = [];
        this.blocks = [];
        this.bowAttacks = [];
        this.throwAttacks = [];

        this.possibleHandAttacksR = ["Punch", "Attack", "Punch2", "Punching R", "Striking R", "Swing R"];
        this.possibleHandAttacksL = ["Punching L", "Striking L", "Swing L"];
        this.possibleKickAttacksR = ["Kick", "Kick R"];
        this.possibleKickAttacksL = ["Kick L"]
        this.possibleBlocks = ["Blocking R", "Blocking L"];
        this.possibleBowAttacks = ["ThumbsUp", "Givining the bird"];
        this.possibleThrowAttacks = ["Striking L", "Punch2", "Punch"];

        this.emotes = [ 
            'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp', 'Open', 'Close',
            ...this.possibleBlocks,
            ...this.possibleBowAttacks, 
            ...this.possibleHandAttacksR, 
            ...this.possibleKickAttacksR,
            ...this.possibleHandAttacksL, 
            ...this.possibleKickAttacksL,
            ...this.possibleThrowAttacks
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
                } else if (this.possibleThrowAttacks.includes(animation.name)) {
                    this.throwAttacks.push(animation.name);
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
                }
    
                this.actions[ animation.name ] = action;
    
            });
    
            this.handAttacks = [...this.handAttacksR, ...this.handAttacksL];
            this.kickAttacks = [...this.kickAttacksR, ...this.kickAttacksL];
            
            if (this.objectName == "blacksmith") {
                this.activeActionName = 'Smiting';
            } else {
                this.activeActionName = 'Idle';
            }
             // Default for intelligent/walking beings
            this.activeAction = this.actions[ this.activeActionName ]? this.actions[ this.activeActionName ] : this.actions[ firstAnimationName ];
            this.previousActionName = '';
            this.previousAction = null;
    
            if (typeof this.attributes.position && this.attributes.position == "up") {
                // if (this.activeAction) this.activeAction.play();
                    if (this.activeAction) this.animations.forEach(animation => {
                        this.runAction(animation.name, 0.2);
                    })
                
            } else if (this.actions[ this.activeActionName ]) this.activeAction.play();

            callback();

        })
    }

    animate(delta) {

        if (this.attributes.moves && this.heroNearby) {
            if (this.alive) {
                
                let controlled = this.mountedUpon? this.mountedUpon : this;

                if (this.objectType == "hero" && this.mounted) {
                    this.fadeToAction( 'Idle', 0.2);
                }

                // } else {
                    this.absVelocity = Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.z));

                    if (this.absVelocity < .1 && ((controlled.activeActionName == 'Walking' || controlled.activeActionName == 'Running' || controlled.activeActionName == 'Swimming' || controlled.activeActionName == 'horse_A_') || this.paused)) {
                        controlled.fadeToAction( 'Idle', 0.2);
                    } else if (this.absVelocity >= .1 && (controlled.activeActionName == 'Idle' || controlled.objectName == 'horse' || this.paused)) {
                        if (controlled.objectName == 'horse') {
                            controlled.fadeToAction( 'horse_A_', 0.2);
                        } else {
                            if (this.swimming) {
                                controlled.fadeToAction( 'Swimming', 0.2);
                            } else {
                                controlled.fadeToAction( 'Walking', 0.2);
                            }
                        }
                    } else if (this.absVelocity >= 250 && controlled.activeActionName == 'Walking') {
                        
                        if (this.swimming) {
                            controlled.fadeToAction( 'Swimming', 0.2);
                        } else {
                            controlled.fadeToAction( 'Running', 0.2);
                        }
                    }
                // }
            }
        }

        this.mixer.update( delta );
    }

    fadeToAction( actionName, duration ) {

        if (!this.actions[actionName]) { // if animation doesn't exist, fadeOut and set activeActionName
            this.previousActionName = this.activeActionName;
            this.previousAction = this.activeAction;
            this.activeActionName = actionName;
            if (this.previousAction) this.previousAction.fadeOut(0.2);

        } else {
            if (this.activeActionName != "Death" && (actionName == "Death" || !this.currentlyFadingToAction) && this.activeActionName !== actionName) {
              this.currentlyFadingToAction = true;
              let newAction = this.actions[actionName];

              this.previousActionName = this.activeActionName;
              this.previousAction = this.activeAction;
              this.activeActionName = actionName;
              this.activeAction = newAction;

              if (this.previousActionName && this.actions[this.previousActionName]) {
                this.previousAction.fadeOut(duration);
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
                  .fadeIn(duration)
                  .play();

                const restoreState = () => {
                  this.handAttackR = false;
                  this.handAttackL = false;
                  this.kickAttackR = false;
                  this.kickAttackL = false;

                  this.currentlyFadingToAction = false;
                  this.mixer.removeEventListener("finished", restoreState);
                  if (this.actions[this.previousActionName]) {
                    this.fadeToAction(this.previousActionName, 0.1);
                  } else {
                    this.activeActionName = "Idle";
                  }
                };

                if (this.emotes.includes(actionName)) {
                  this.mixer.addEventListener("finished", restoreState);
                } else {
                  this.currentlyFadingToAction = false;
                }
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

    runAction(actionName, duration, fadeOutDuration = 0.2, fadeOutDelay = 0, autorestore = false, concurrent = false) {

        if (concurrent || !this.currentlyRunningAction) {
            this.currentlyRunningAction = true;

            let action = this.actions[actionName];
            action.loop = THREE.LoopOnce;
            action.repetitions = 1;
            action.setEffectiveTimeScale( 1 );
                
            if (this.attributes.position == "down") {
                setTimeout(() => {
                    action.fadeOut( fadeOutDuration );
                }, fadeOutDelay*1000)
            } else {
                action.reset();
                action.setEffectiveTimeScale( 1 );
                action.fadeIn( duration );
            }
    
            action.play();
    
            const restoreState = () => {
                setTimeout(() => {
                    action.fadeOut( fadeOutDuration );
                    setTimeout(() => {
                        this.currentlyRunningAction = false;
                        this.mixer.removeEventListener('finished', restoreState );
                    }, fadeOutDuration * 1000);
                }, duration * 1000);
            }
            
            if (autorestore) {
                this.mixer.addEventListener( 'finished', restoreState );
            } else {
                setTimeout(() => {
                    this.currentlyRunningAction = false;
                }, duration * 1000);
            }
        }
    }
}