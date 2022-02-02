import { IntelligentForm } from './intelligent.js'

/** Artificial Intelligences: friendlies and beasts */
export class ArtificialForm extends IntelligentForm{

    constructor(template, sceneController) {

        super(template, sceneController);

    }

    load(callback) {
        super.load(() => {
            switch (this.objectName) {
                case "evilOne":
                    this.actions['Idle'].setEffectiveTimeScale(20);
                    this.actions['Walking'].setEffectiveTimeScale(20);
                    this.actions['Punch'].setEffectiveTimeScale(20);
                    this.actions['Death'].setEffectiveTimeScale(20);
                    break;
            }
            if (callback) callback();
        });
    }

    move(delta) {

        if (this.alive) {
            // INERTIA
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            if (Math.random() < .4) { // percentage of changing direction
                this.direction.z = getRandomArbitrary(0,10);
                this.direction.x = getRandomArbitrary(-1,1);
                this.direction.normalize();
            }

            let agility = this.getEffectiveStat('agility');

            if (Math.random() < .2) { // percentage of moving
                this.velocity.z += this.direction.z * 1000.0 * agility * delta;
                this.velocity.x += this.direction.x * 1000.0 * agility * delta;
            } 

            this.movementRaycaster.ray.origin.copy( this.model.position );

            // Make a random rotation (yaw)
            this.model.rotateY(getRndInteger(-5,5)/100);
            this.rotation.copy(this.model.rotation);

            super.move(delta);

            if (this.sceneController.hero && this.sceneController.hero.model) {
                let d = this.distanceToHero();

                if (this.objectType == "beast" && this.sceneController.hero.alive) {
                    if (d < 60) {
                        this.faceHero();
                        this.attackHero();
                        this.stopAndBackup(delta);
    
                    } else if (d < 500) {
                        this.faceHero();
                        this.moveTowardHero(delta);
                    } 
                } 
            }


            // Set elevation last
            if (this.setElevation() == -1) {
                this.stopAndBackup(delta);
            };

        }
    }

    stopAndBackup(delta) {

        this.model.translateX( -this.velocity.x * delta );
        this.model.translateZ( -this.velocity.z * delta );

        this.velocity.x = 0;
        this.velocity.z = 0;
        
    }

    moveTowardHero(delta) {
        this.model.translateZ( this.velocity.z * delta );
    }

    faceHero() {
        this.model.lookAt(this.sceneController.hero.model.position);
    }

    distanceToHero() {
        return this.model.position.distanceTo(this.sceneController.hero.model.position);
    }

    attackHero() {
        
        if (this.objectName.match(new RegExp('rat', 'i'))) {
            this.fadeToAction("Attack", 0.2);
        } else {
            this.fadeToAction("Punch", 0.2);
        }

        let chanceToHit = this.getEffectiveStat('agility') / 100;
        let hitPointReduction = Math.max(0,getRandomArbitrary(0,this.getEffectiveStat('strength')) - getRandomArbitrary(0,this.sceneController.hero.getEffectiveStat('defense')));
        if (this.sceneController.hero.getEffectiveStat('health') > 0 && Math.random() < chanceToHit) {
            if (this.sceneController.hero.changeStat('health', -hitPointReduction, false) <= 0) {
                // this.fadeToAction("Dance", 0.2);
            };
        }
    }

    // getConversationState() {
    //     return [this.attributes.conversation.conversationState, this.attributes.conversation.engagementState];
    // }
    
    // setConversationState(conversationState, engagementState) {
    //     this.attributes.conversation.conversationState = conversationState;
    //     if (engagementState) this.attributes.conversation.engagementState = engagementState;
    // }

    engageConversation() {

        switch (this.attributes.conversation.conversationState) {
            case "intro": 
            case "disengaged":
                this.attributes.conversation.conversationState = "engaged";
                this.attributes.conversation.engagementState = 0;
                break;
            case "engaged":
                this.attributes.conversation.engagementState++;
                break;
        }
    }

    completeConversation() {
        this.attributes.conversation.conversationState = "complete";
        this.attributes.conversation.engagementState = 0;
    }

    disengageConversation() {
        this.attributes.conversation.conversationState = "disengaged";
        this.attributes.conversation.engagementState = 0;
    }

    getCurrentConversation() {

        let special = this.attributes.conversation.conversationState != "complete" && this.attributes.conversation.special;

        // If special condition is already met and jumpToState is set, set to complete
        if (special && this.inventoryContainsAll(special.condition) && this.attributes.conversation.special.jumpToState) {
            switch (this.attributes.conversation.special.jumpToState) {
                case "complete": 
                    this.completeConversation();
                    break;
            }
            return this.attributes.conversation[this.attributes.conversation.conversationState];

        } else {
            // If hero meets the 'special condition' then jump straight to it:
            if (special && this.sceneController.hero.inventoryContains(special.condition)) {
                special.wares = this.inventory;
                return special;
            } else {
                if (this.attributes.conversation.conversationState == "engaged") {
                    return this.attributes.conversation[this.attributes.conversation.conversationState][this.attributes.conversation.engagementState];
                } else {
                    return this.attributes.conversation[this.attributes.conversation.conversationState];
                }
            }
        }
    }
}