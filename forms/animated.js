import { StandardForm } from './standard.js'



/** AnimatedForms are forms that have animation actions
 * and a mixer.
 */
export class AnimatedForm extends StandardForm{

    constructor(template, sceneController) {

        super(template, sceneController);

        this.actions = [];
        
        // this.fadingToDeath = false;
        this.states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];

        
        this.currentlyFadingToAction = false;
        this.animatedSubforms = [];

        this.punchAttacksR = [];
        this.swordAttacksR = [];
        this.swordAttacksL = [];
        this.blocksL = [];
        this.blocksR = [];
        this.bowAttacks = [];

        this.possiblePunchAttacksR = ["Punch", "Punching R"]
        this.possibleSwordAttacksR = ["Punch", "Striking R", "Swing R"]
        this.possibleSwordAttacksL = ["Punching L", "Swing L"]
        this.possibleBlocksR = ["Blocking R"];
        this.possibleBlocksL = ["Blocking L"];
        this.possibleBowAttacks = ["ThumbsUp", "Givining the bird"];


        this.emotes = [ 
            'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp',
            ...this.possibleBlocksL, 
            ...this.possibleBlocksR, 
            ...this.possibleBowAttacks, 
            ...this.possiblePunchAttacksR, 
            ...this.possibleSwordAttacksL, 
            ...this.possibleSwordAttacksR
        ];
    }
    
    load(callback) {

        super.load(() => {

            this.mixer = new THREE.AnimationMixer( this.model );

            let firstAnimationName = '';
            this.animations.forEach((animation,index) => {
                
                if (this.possiblePunchAttacksR.includes(animation.name)) {
                    this.punchAttacksR.push(animation.name);
                } else if (this.possibleSwordAttacksR.includes(animation.name)) {
                    this.swordAttacksR.push(animation.name);
                } else if (this.possibleSwordAttacksL.includes(animation.name)) {
                    this.swordAttacksL.push(animation.name);
                } else if (this.possibleBlocksL.includes(animation.name)) {
                    this.blocksL.push(animation.name);
                } else if (this.possibleBlocksR.includes(animation.name)) {
                    this.blocksR.push(animation.name);
                } else if (this.possibleBowAttacks.includes(animation.name)) {
                    this.bowAttacks.push(animation.name);
                }

                var action = this.mixer.clipAction( animation );
                if (index == 0) { firstAnimationName = animation.name };
    
                if ( this.emotes.indexOf( animation.name ) >= 0 || this.states.indexOf( animation.name ) >= 4) {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                } else if (this.model.objectType=='structure') {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopPingPong;
                    action.repetitions = 1;
                } else if (this.model.objectType=='item' && (!this.attributes.animatesRecurring)) {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopPingPong;
                    action.repetitions = 1;
                } else if (this.model.objectType=='item' && this.attributes.animatesRecurring) {
                    console.log("test")
                    this.model.children[1].material.opacity = 0.5;

                }
    
                this.actions[ animation.name ] = action;
    
            });
    
            this.activeActionName = 'Idle'; // Default for intelligent/walking beings
            this.activeAction = this.actions[ firstAnimationName ];
            this.previousActionName = '';
            this.previousAction = null;
    
            if (this.attributes.unlocked) {
                if (this.activeAction) this.activeAction.play();
            }

            callback();

        })
    }

    animate(delta) {

        if (this.attributes.moves) {
            if (this.alive) {
                this.absVelocity = Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.z));

                if (this.absVelocity < .1 && (this.activeActionName == 'Walking' || this.activeActionName == 'Running')) {
                    this.fadeToAction( 'Idle', 0.2);
                } else if (this.absVelocity >= .1 && this.activeActionName == 'Idle') {
                    this.fadeToAction( 'Walking', 0.2);
                } else if (this.absVelocity >= 199 && this.activeActionName == 'Walking') {
                    this.fadeToAction( 'Running', 0.2);
                }
            } else {
                // if (!this.fadingToDeath) {
                    this.fadeToAction("Death", 0.2);
                    // this.fadingToDeath = true;
                // }
            }
        }

        this.mixer.update( delta );
    }

    fadeToAction( actionName, duration ) {
        console.log(`${this.objectName}: fadeToAction ${actionName}`);
        if ( ! this.currentlyFadingToAction && this.activeActionName !== actionName ) { // 
            console.log(`${this.objectName}: fadingToAction ${actionName}`);
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
                    // .setEffectiveTimeScale( 1 )
                    // .setEffectiveWeight( 1 )
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

    runActiveAction(duration) {

        if (this.activeAction) {
            this.activeAction
                .reset()
                .setEffectiveTimeScale( 1 )
                .setEffectiveWeight( 1 )
                .fadeIn( duration )
                .play();
        }
    }

}