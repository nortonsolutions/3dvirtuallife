import { AnimatedForm } from './animated.js'

/** IntelligentForms are AnimatedForms which also
 * move and make decisions every turn.  Subclasses
 * include the Hero and ArtificialForms (AIs).
 */



export class IntelligentForm extends AnimatedForm{

    constructor(template, eventDepot, loader, floorModel) {
        super(template, eventDepot, loader, floorModel);

        // Animation mixer has been added by superclass

        this.moves = true;
        this.absVelocity = 0;
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.rotation = new THREE.Vector3();

        this.justJumped = false;
        this.standingUpon = null;
        this.canJump = true;

        
        this.movementRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.length/2 + 20 );
        this.movementRaycasterR = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        this.movementRaycasterL = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        
    }


    /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    move() {

    }

    setElevation(otherModels) {


        let downRayOriginHeight = this.model.position.y + 30;

        this.downRaycaster.ray.origin.copy(this.model.position);
        this.downRaycaster.ray.origin.y = downRayOriginHeight;

        let downwardIntersections = this.downRaycaster.intersectObjects( otherModels, true );
        if (downwardIntersections[0]) { 
            var topOfObject = downRayOriginHeight - downwardIntersections[0].distance + 2;
            if (this.model.position.y <= topOfObject) {
                
                this.model.position.y = topOfObject;
                let standingUpon = getRootObject3D(downwardIntersections[0].object);
                this.standingUpon = {
                    objectName: standingUpon.objectName,
                    objectType: standingUpon.objectType,
                    attributes: standingUpon.attributes
                }
                this.velocity.y = Math.max( 0, this.velocity.y );
                this.canJump = true;
                this.justJumped = false;
            }
            
        } else {

            this.standingUpon = null;
            
            let newYposition = this.determineElevationFromBase();

            while (newYposition == -1) { // move toward center until ground found
                this.model.position.x = shiftTowardCenter(this.model.position.x);
                this.model.position.z = shiftTowardCenter(this.model.position.rotateZ);
                newYposition = this.determineElevationFromBase();
            }
            entity.position.y = newYposition;
            
        }
    }

    handleEntityMovement(delta) {
        this.objects3D.filter(el => el.objectType == 'friendly' || el.objectType == 'beast').forEach(entity => {
            
            if (this.mixers[entity.uuid]) {
            
                // Make a random rotation (yaw)
                entity.rotateY(getRndInteger(-5,5)/100);

                // // INERTIA
                // this.mixers[entity.uuid].velocity.x -= this.mixers[entity.uuid].velocity.x * 10.0 * delta;
                // this.mixers[entity.uuid].velocity.z -= this.mixers[entity.uuid].velocity.z * 10.0 * delta;
                // this.mixers[entity.uuid].velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                // if (Math.random() < .4) { // percentage of changing direction
                //     this.mixers[entity.uuid].direction.z = getRandomArbitrary(1,10);
                //     this.mixers[entity.uuid].direction.x = getRandomArbitrary(0,1);
                //     this.mixers[entity.uuid].direction.normalize();
                // }

                // let agility = entity.attributes.stats.agility.substring(0,2);

                // if (Math.random() < .4) { // percentage of moving
                //     this.mixers[entity.uuid].velocity.z -= this.mixers[entity.uuid].direction.z * 1000.0 * agility * delta;
                //     this.mixers[entity.uuid].velocity.x -= this.mixers[entity.uuid].direction.x * 1000.0 * agility * delta;
                // } 

                this.handleMovement(entity.uuid, entity, delta);
            }
        });
    }




}