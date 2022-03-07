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
                    Object.values(this.actions).forEach(action => { action.setEffectiveTimeScale(8); });
                    this.actions['Idle'].setEffectiveTimeScale(1);
                    break;
                case "blueShirt":
                    Object.values(this.actions).forEach(action => { action.setEffectiveTimeScale(2); });
                    break;
                case "rockyMan":
                case "lavaMan":
                case "crystalMan":  
                    Object.values(this.actions).forEach(action => { action.setEffectiveTimeScale(0.5); });
                    this.actions['Idle'].setEffectiveTimeScale(.005);
                    break;
                case "blacksmith":
                    Object.values(this.actions).forEach(action => { 
                        action.setEffectiveTimeScale(0.3); 
                    });
                    break;
            }
            if (callback) callback();
        });
    }

    move(delta) {
        if (this.alive && !this.controlled) {
            let closestHeroPosition = this.closestHeroPosition();

            if (closestHeroPosition && closestHeroPosition.distance < 1000) {
                this.heroNearby = true;

                // TODO: If the velocity is already close to zero, maintain idle
                this.absVelocity = Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.z));

                if (this.absVelocity < .1 && Math.random() < .95) {
                    // DO NOTHING, maintain idle state

                } else {

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

                    if (this.getEffectiveStat('agility') > 0) {
                        this.model.rotateY(getRndInteger(-5,5)/100);
                        this.rotation.copy(this.model.rotation);
                    }

                }

                super.move(delta);

                if (this.objectType == "beast") {
                    
                        let d = closestHeroPosition.distance;

                        if (d < 60) {
                            this.facePosition(closestHeroPosition.position);
                            this.attackHero(closestHeroPosition.heroLayoutId);
                            this.stopAndBackup(delta);
                        } else if (d < 400 && this.attributes.rangedSpell) {
                            this.facePosition(closestHeroPosition.position);
                            
                            if (Math.random()<.05) {
                                let action = this.throwActions[getRndInteger(0,this.throwActions.length-1)]
                                this.fadeToAction(action, 0.2);
                                setTimeout(() => {
                                    this.castSpell(this.sceneController.getTemplateByName(this.attributes.rangedSpell), true, true);
                                }, 1000);
                            } else {
                                this.moveToward(delta);
                            }

                        } else if (d < 700) {
                            this.facePosition(closestHeroPosition.position);
                            this.moveToward(delta);
                        } 
                    
                } 

                if (this.setElevation() == -1) {
                    // console.log(`${this.objectName} is out of bounds`)
                    this.model.position.x = shiftTowardCenter(this.model.position.x, 1);
                    this.model.position.z = shiftTowardCenter(this.model.position.z, 1);

                    // this.stopAndBackup(delta);
                };
            } else { // idle
                this.fadeToAction('Idle', 0.2); // force Idle animation
                this.heroNearby = false; // stops movement
            }
        }
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
            return { distance, heroLayoutId, position };
        }
        
    }

    attackHero(layoutId) {

        // Choose an attack
        let possibleAttacks = [...this.handAttacks, ...this.kickAttacks];
        let attack = possibleAttacks[getRndInteger(0,possibleAttacks.length-1)];
        
        this.fadeToAction(attack, 0.2);

        let chanceToHit = this.getEffectiveStat('agility') / 100;
        let hitPointReduction = Math.max(0,getRandomArbitrary(0,this.getEffectiveStat('strength')) - getRandomArbitrary(0,this.sceneController.hero.getEffectiveStat('defense')));
        
        if (Math.random() < chanceToHit) {
            let thisHero = this.sceneController.getHeroByLayoutId(layoutId);
            
            if (thisHero.alive) {
                
                if (layoutId == this.sceneController.hero.attributes.layoutId) {
                    this.sceneController.hero.changeStat('health', -hitPointReduction, false);
                } else {
                    // { level, stat, layoutId, hitPointReduction }                    
                    this.sceneController.socket.emit('changeStat', { level: this.sceneController.level, stat: 'health', layoutId, hitPointReduction: -hitPointReduction });
                }
            }
        }
    }

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

        let challenge = this.attributes.conversation.challenge;
        let special = this.attributes.conversation.conversationState != "complete" && this.attributes.conversation.special;

        // If special condition is already met and jumpToState is set, set to complete

        if (challenge) {
            if (this.sceneController.hero.inventoryContains(challenge.condition)) {
                return this.attributes.conversation[this.attributes.conversation.conversationState];
            } else {
                return challenge;
            }
        } else if (special && this.inventoryContainsAll(special.condition) && this.attributes.conversation.special.jumpToState) {
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