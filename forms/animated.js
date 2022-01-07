import { StandardForm } from './standard.js'



/** AnimatedForms are forms that have animation actions
 * and a mixer.
 */
export class AnimatedForm extends StandardForm{

    constructor(template, sceneController) {

        super(template, sceneController);

        this.actions = [];

        this.states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
        this.emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

    }
    
    load(callback) {

        super.load(() => {

            this.mixer = new THREE.AnimationMixer( this.model );

            let firstAnimationName = '';
            this.animations.forEach((animation,index) => {
    
                var action = this.mixer.clipAction( animation );
                if (index == 0) { firstAnimationName = animation.name };
    
                if ( this.emotes.indexOf( animation.name ) >= 0 || this.states.indexOf( animation.name ) >= 4) {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                } else if (this.model.objectType=='structure') {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopPingPong;
                    action.repetitions = 1;
                }
    
                this.actions[ animation.name ] = action;
    
            });
    
            this.activeActionName = 'Idle';
            this.activeAction = this.actions[ firstAnimationName ];
            this.previousActionName = '';
            this.previousAction = null;
    
            this.activeAction.play();
            callback();

        })
    }

    animate(delta) {
        if (this.moves) {
            this.absVelocity = Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.z));

            if (this.absVelocity < .1 && (this.activeActionName == 'Walking' || this.activeActionName == 'Running')) {
                this.fadeToAction( 'Idle', 0.2);
            } else if (this.absVelocity >= .1 && this.activeActionName == 'Idle') {
                this.fadeToAction( 'Walking', 0.2);
            } else if (this.absVelocity >= 199 && this.activeActionName == 'Walking') {
                this.fadeToAction( 'Running', 0.2);
            }
        }

        this.mixer.update( delta );
    }

    fadeToAction( actionName, duration ) {
        
        console.log(`previous: ${this.previousActionName}, active: ${this.activeActionName}, new: ${actionName}`)
        if ( this.activeActionName !== actionName ) {

            
            let newAction = this.actions[ actionName ];

            this.previousActionName = this.activeActionName;
            this.previousAction = this.activeAction;
            this.activeActionName = actionName;
            this.activeAction = newAction;

            this.previousAction.fadeOut( duration );


            this.activeAction
                .reset()
                .setEffectiveTimeScale( 1 )
                .setEffectiveWeight( 1 )
                .fadeIn( duration )
                .play();

            const restoreState = () => {
                this.mixer.removeEventListener('finished', restoreState );
                this.fadeToAction( this.previousActionName, 0.1 );
            }

            console.log(actionName);
            if (this.emotes.includes(actionName)) {
                this.mixer.addEventListener( 'finished', restoreState );
            }
        }
    }

    runActiveAction(duration) {

        this.activeAction
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn( duration )
            .play();
    }

}