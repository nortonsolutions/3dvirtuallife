import { IntelligentForm } from './intelligent.js'

/** Artificial Intelligences: friendlies and beasts */
export class ArtificialForm extends IntelligentForm{

    constructor(template, sceneController) {
        super(template, sceneController);

        // proximity to nearest Hero to animate
        this.proximityToMove = 800;
        this.proximityToAnimate = this.sceneController.scene.cameraReach;
        
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

            // What is the current distance to closest Hero?
            let closestHeroPosition = this.closestHeroPosition();
            let heroDistance = closestHeroPosition.distance;
            
            if (!this.attributes.shouldMove) { // as of last cycle, should not move
                if (heroDistance <= this.proximityToMove) {
                    // console.log(`${this.objectName}: shouldMove = true`);
                    this.updateAttributes({shouldMove: true});
                    
                }
            } else { // as of last cycle, should move
                if (heroDistance > this.proximityToMove) {
                    // console.log(`${this.objectName}: shouldMove = false`)
                    this.updateAttributes({shouldMove: false});
                    // this.velocity.x = 0;
                    // this.velocity.y = 0;
                    // this.velocity.z = 0;
                    
                }
            }

            // Perform calculations for animation as well, since local instance has the heroDistance
            if (!this.attributes.shouldAnimate) { // as of last cycle, should not animate
                if (heroDistance <= this.proximityToAnimate) {
                    // console.log(`${this.objectName}: shouldAnimate = true`);
                    this.updateAttributes({shouldAnimate: true});
                    // this.updateAttributes({paused: false});
                    
                }
            } else { // as of last cycle, should animate
                if (heroDistance > this.proximityToAnimate) {
                    // console.log(`${this.objectName}: shouldAnimate = false`)
                    this.updateAttributes({shouldAnimate: false});
                    
                    // this.updateAttributes({paused: true});
                }
            }

            if (this.attributes.shouldMove) {

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

                        if (d < 100) {
                            this.facePosition(closestHeroPosition.position);
                            if (!this.attributes.docile) this.attackHero(closestHeroPosition.heroLayoutId);
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
                    
                } else if (this.attributes.follower) {

                    let closestBeast = this.closestBeast(1500);
                    if (closestBeast) {
                        let b = closestBeast.beast;
                        let d = closestBeast.distance;
                        if (d < 50) {
                            this.facePosition(b.model.position);
    
                            let side = ['L','R'][getRndInteger(0,1)];
                            let shift = [true,false][getRndInteger(0,1)];
                            this.attack(side, shift);
                            this.stopAndBackup(delta);
    
                        } else if (d < 400 && this.attributes.rangedSpell) {
                            this.facePosition(b.model.position);
                            if (Math.random()<.05) {
                                let action = this.throwActions[getRndInteger(0,this.throwActions.length-1)]
                                this.fadeToAction(action, 0.2);
                                setTimeout(() => {
                                    this.castSpell(this.sceneController.getTemplateByName(this.attributes.rangedSpell), true, false);
                                }, 1000);
                            } else {
                                this.moveToward(delta);
                            }
    
                        } else if (d < 1500) {
                            this.facePosition(b.model.position);
                            this.moveToward(delta);
                        }                      
                    } else {
                        let d = closestHeroPosition.distance;

                        if (d < 2000 && d > 50) {
                            this.facePosition(closestHeroPosition.position);
                            this.moveToward(delta);
                        } 
                    }
                    
                }

                if (this.setElevation() == -1) {
                    // console.log(`${this.objectName} is out of bounds`)
                    this.model.position.x = shiftTowardCenter(this.model.position.x, 1);
                    this.model.position.z = shiftTowardCenter(this.model.position.z, 1);

                    // this.stopAndBackup(delta);
                };

            } 
        }
    }
    
    moveToward(delta) {
        this.model.translateZ( this.velocity.z * delta );
    }

    facePosition(position) {
        this.model.lookAt(position);
    }

    closestBeast(range) { // used by followers to attack
        let beastIndex = 0;
        let distance = Infinity;

        var entitiesInRange = this.sceneController.allEnemiesInRange(range, this.model.position);
        if (entitiesInRange.length > 0) {
            entitiesInRange.forEach((entity,index) => {
                let p = entity.model.position
                let d = this.model.position.distanceTo(p);
                if (d < distance) {
                    distance = d;
                    beastIndex = index;
                }
            })
        }

        if (distance == Infinity) {
            return null;
        } else {
            return { beast: entitiesInRange[beastIndex], distance };
        }
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
            return { distance };
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

        switch (this.attributes.conversation.state) {
            case "intro": 
            case "disengaged":
                this.attributes.conversation.state = "engaged";
                this.attributes.conversation.engagementState = 0;
                break;
            case "engaged":
                this.attributes.conversation.engagementState++;
                break;
        }
    }

    jumpToConversation(state) {
        this.attributes.conversation.state = state;
        this.attributes.conversation.engagementState = 0;
    }

    disengageConversation() {
        this.attributes.conversation.state = "disengaged";
        this.attributes.conversation.engagementState = 0;
    }

    getCurrentConversation() {

        let loyalTo = this.attributes.loyalTo;
        let convo = this.attributes.conversation;
        let challenge = convo? (convo.challenge? convo.challenge : null) : null;
        let special = convo.state != "complete" && convo.special;
        let trade = convo.trade;
        
        if (loyalTo && loyalTo == this.sceneController.hero.objectName) {

            if (convo.state == "trade") {
                if (this.sceneController.hero.inventoryContains(trade.wants)) {
                    let context = Object.assign({}, trade);
                    context.wares = this.inventory;
                    return context;
                } else {
                    return convo.comeback;
                }
            } else {
                return this.attributes.follower? convo.loyalFollower : convo.loyalSubject;
            }
            
        } else if (challenge) { // handle challenges
            if (this.sceneController.hero.inventoryContains(challenge.condition)) {
                return this.attributes.conversation[this.attributes.conversation.state];
            } else {
                return challenge;
            }

        // If special condition is already met and jumpToState is set, set to complete
        } else if (special) { // handle special
            if (this.inventoryContainsAll(special.condition) && special.jumpToState) {
                // AI already has his special condition
                switch (special.jumpToState) {
                    case "loyal": // return wares and loyalty info
                        return {
                            wares: this.inventory,
                            loyalTo: this.attributes.loyalTo
                        };
                }
    
                // default convo state:
                return convo[convo.state];
    
            } else if (this.sceneController.hero.inventoryContains(special.condition)) {
                // Hero meets special condition
                return special;
            }
        }
        
        if (convo.state == "trade") {
            if (this.sceneController.hero.inventoryContains(trade.wants)) {
                let context = Object.assign({}, trade);
                context.wares = this.inventory;
                return context;
            } else {
                return convo.comeback;
            }
        } else {
            if (convo.state == "engaged") {
                return convo[convo.state][convo.engagementState];
            } else {
                return convo[convo.state];
            }
        }
    }

    joinParty(hero) {
        this.updateAttributes({loyalTo: hero.objectName});
    }

    follow(hero) {
        this.updateAttributes({follower: true});
        hero.addToParty(this.returnTemplate());
        hero.cacheHero();
    }

    unfollow(hero) {
        this.updateAttributes({follower: false});
        hero.removeFromParty(this.returnTemplate().name);
        hero.cacheHero();
    }
}