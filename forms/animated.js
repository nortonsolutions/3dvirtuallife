import { StandardForm } from './standard.js'

var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

/** AnimatedForms are forms that have animation actions
 * and a mixer.
 */
export class AnimatedForm extends StandardForm{

    constructor(template, eventDepot, loader, floorModel) {

        super(template, eventDepot, loader, floorModel);

        this.actions = [];

    }
    
    load(callback) {

        super.load(() => {

            this.mixer = new THREE.AnimationMixer( this.model );

            let firstAnimationName = '';
            this.animations.forEach((animation,index) => {
    
                var action = this.mixer.clipAction( animation );
                if (index == 0) { firstAnimationName = animation.name };
    
                if ( emotes.indexOf( animation.name ) >= 0 || states.indexOf( animation.name ) >= 4) {
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

}