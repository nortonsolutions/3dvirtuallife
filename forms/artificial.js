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
                    this.actions['Punch'].setEffectiveTimeScale(8);
                    this.actions['Death'].setEffectiveTimeScale(8);
                    break;
                case "blueShirt":
                    this.actions['Idle'].setEffectiveTimeScale(2);
                    this.actions['Walking'].setEffectiveTimeScale(2);
                    this.actions['Punch'].setEffectiveTimeScale(2);
                    this.actions['Death'].setEffectiveTimeScale(1);
                    break;
                case "rockyman":
                case "lavaman":
                case "crystalman":
                    this.actions['Idle'].setEffectiveTimeScale(.5);
                    this.actions['Walking'].setEffectiveTimeScale(.5);
                    this.actions['Punch'].setEffectiveTimeScale(.5);
                    this.actions['Punch2'].setEffectiveTimeScale(.5);
                    this.actions['Kick'].setEffectiveTimeScale(.5);
                    this.actions['Death'].setEffectiveTimeScale(.5);
                    break;
            }
            if (callback) callback();
        });
    }

    move(delta) {
        // let time = performance.now();
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

            // let time3 = performance.now();
            this.movementRaycaster.ray.origin.copy( this.model.position );

            // Make a random rotation (yaw)
            this.model.rotateY(getRndInteger(-5,5)/100);
            this.rotation.copy(this.model.rotation);

            super.move(delta);
            // console.log(`super move: ${this.objectName} - ${performance.now() - time3}`);

            // let time4 = performance.now();
            if (this.objectType == "beast") {
                let closestHeroPosition = this.closestHeroPosition();
                
                if (closestHeroPosition) {
                    let d = closestHeroPosition.distance;
                    if (d < 60) {
                        this.facePosition(closestHeroPosition.position);
                        this.attackHero(closestHeroPosition.heroLayoutId);
                        this.stopAndBackup(delta);
                    } else if (d < 700) {
                        this.facePosition(closestHeroPosition.position);
                        this.moveToward(delta);
                    } 
                }
            } 
            // console.log(`beast specific: ${this.objectName} - ${performance.now() - time4}`);

            // let time2 = performance.now();
            // Set elevation last
            if (this.setElevation() == -1) {
                this.stopAndBackup(delta);
            };
            // console.log(`setElevation: ${this.objectName} - ${performance.now() - time2}`);
        }
        // console.log(`move: ${this.objectName} - ${performance.now() - time}`);
    }

    stopAndBackup(delta) {

        this.model.translateX( -this.velocity.x * delta );
        this.model.translateZ( -this.velocity.z * delta );

        this.velocity.x = 0;
        this.velocity.z = 0;
        
    }

    moveToward(delta) {
        this.model.translateZ( this.velocity.z * delta );
    }

    facePosition(position) {
        this.model.lookAt(position);
    }

    closestHeroPosition() {

        let position = new THREE.Vector3();
        let distance = Infinity;
        let heroLayoutId = null;

        if (this.sceneController.hero && this.sceneController.hero.alive) {
            position.copy(this.sceneController.hero.model.position);
            distance = this.model.position.distanceTo(position);
            heroLayoutId = this.sceneController.hero.attributes.layoutId;
        }

        this.sceneController.others.forEach(other => {
            let p = other.model.position
            let d = this.model.position.distanceTo(p);
            if (d < distance) {
                distance = d;
                heroLayoutId = other.attributes.layoutId;
                position.copy(p);
            }
        })

        if (distance == Infinity) {
            return null;
        } else {
            // console.table({ distance, heroLayoutId, position });
            return { distance, heroLayoutId, position };
        }
        
    }

    attackHero(layoutId) {

        
        switch (this.objectName) {
            case 'rat':
            case 'spiderQueen':
                this.fadeToAction("Attack", 0.2);
                break;
            case 'crystalman':
            case 'lavaman':
            case 'rockyman':

                let attackArray = ['Punch','Punch2','Kick'];
                let attack = getRndInteger(0,attackArray.length - 1);
                this.fadeToAction(attackArray[attack], 0.2);

                break;
            default:
                this.fadeToAction("Punch", 0.2);
                break;
        }

        let chanceToHit = this.getEffectiveStat('agility') / 100;
        let hitPointReduction = Math.max(0,getRandomArbitrary(0,this.getEffectiveStat('strength')) - getRandomArbitrary(0,this.sceneController.hero.getEffectiveStat('defense')));
        
        if (Math.random() < chanceToHit) {
            let thisHero = this.sceneController.getHeroByLayoutId(layoutId);
            
            if (thisHero.alive) {
                
                if (layoutId == this.sceneController.hero.attributes.layoutId) {
                    // console.table({ layoutId, hitPointReduction });
                    this.sceneController.hero.changeStat('health', -hitPointReduction, false);
                } else {
                    // console.log('Should not be here during local play')
                    // { level, layoutId, hitPointReduction }                    
                    this.sceneController.socket.emit('changeStat', { level: this.sceneController.level, stat: 'health', layoutId, hitPointReduction: -hitPointReduction });
                }
            }
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