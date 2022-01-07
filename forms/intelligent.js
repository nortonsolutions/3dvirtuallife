import { AnimatedForm } from './animated.js'

/** IntelligentForms are AnimatedForms which also
 * move and make decisions every turn.  Subclasses
 * include the Hero and ArtificialForms (AIs).
 */



export class IntelligentForm extends AnimatedForm{

    constructor(template, sceneController) {
        super(template, sceneController);

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
    move(otherModels, worldDirection, delta) {
        let mRaycaster = this.movementRaycaster;
        mRaycaster.ray.origin.copy( this.model.position );
        mRaycaster.ray.origin.y += this.attributes.height;
        mRaycaster.ray.direction.x = -worldDirection.x; // -worldDirection.x;
        mRaycaster.ray.direction.z = -worldDirection.z; // -worldDirection.z;

        // Essentially set Lx = -wDz and Lz = wDx, then Rx = wDz and Rz = -wDx
        // let worldDirectionL = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, -Math.PI/2, 0, 'YXZ' ));
        // let worldDirectionR = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, Math.PI/2, 0, 'YXZ' ));

        if (worldDirection.x != 0 || worldDirection.z != 0) {
            console.log(`${this.name} rc: ${mRaycaster.ray.direction.x},${mRaycaster.ray.direction.z}`);
            console.log(`${this.name} V: ${this.velocity.x},${this.velocity.z}`);
            console.log(`${this.name} D: ${this.direction.x},${this.direction.z}`);
            console.log(`${this.name} rotationY: ${this.controls.rotation.y}`);
        }
        
        // let mRaycasterL = this.mixers[uniqueId].movementRaycasterL;
        // mRaycasterL.ray.origin.copy( entity.position );
        // mRaycasterL.ray.origin.y += entity.attributes.height;
        // mRaycasterL.ray.direction.x = worldDirectionL.x;
        // mRaycasterL.ray.direction.z = worldDirectionL.z;

        // let mRaycasterR = this.mixers[uniqueId].movementRaycasterR;
        // mRaycasterR.ray.origin.copy( entity.position );
        // mRaycasterR.ray.origin.y += entity.attributes.height;
        // mRaycasterR.ray.direction.x = worldDirectionR.x;
        // mRaycasterR.ray.direction.z = worldDirectionR.z;

        // Can I avoid the filter here using object attributes.length and width as the starting point for the ray?
        let fIntersects = mRaycaster.intersectObjects(otherModels, true);
        // let rIntersects = mRaycasterR.intersectObjects(this.objects3D, true).filter(el => getRootObject3D(el.object) != entity);
        // let lIntersects = mRaycasterL.intersectObjects(this.objects3D, true).filter(el => getRootObject3D(el.object) != entity);

        if (fIntersects.length == 0) { // Nothing is in the front, so move forward at given velocity
            
            this.controls.translateX( this.velocity.x * delta );
            this.controls.translateY( this.velocity.y * delta );
            this.controls.translateZ( this.velocity.z * delta );

            // if (rIntersects.length != 0) { // intersections on the right?
            //     entity.position.x += mRaycasterL.ray.direction.x;
            //     entity.position.z += mRaycasterL.ray.direction.z;
            //     this.scene.helper.position.copy(rIntersects[0].point);
            //     this.scene.helper.material.color = { r: 1, g: 0, b: 0 };
            // }

            // if (lIntersects.length != 0) { // intersections on the left?
            //     entity.position.x += mRaycasterR.ray.direction.x;
            //     entity.position.z += mRaycasterR.ray.direction.z;       
            //     // console.log(`${entity.objectName} lIntersects:`);
            //     // console.dir(lIntersects[0]);
            //     this.scene.helper.position.copy(lIntersects[0].point);
            //     this.scene.helper.material.color = { r: 0, g: 0, b: 1 };
            // }  


        } else { // Something is blocking, so stop without moving
            
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;

            this.eventDepot.fire('updateHelper', { position: fIntersects[0].point, color: { r: 0, g: 1, b: 0 }});


            
        }
    }

    setElevation(otherModels) {
        
        var model;
        if (this.type == "hero") {
            model = this.controls;
        } else {
            model = this.model;
        }

        let downRayOriginHeight = model.position.y + 30;

        this.downRaycaster.ray.origin.copy(model.position);
        this.downRaycaster.ray.origin.y = downRayOriginHeight;

        let downwardIntersections = this.downRaycaster.intersectObjects( otherModels, true );
        if (downwardIntersections[0]) { 
            var topOfObject = downRayOriginHeight - downwardIntersections[0].distance + 2;
            if (model.position.y <= topOfObject) {
                
                model.position.y = topOfObject;
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

            if (newYposition == -1) { 
                model.position.x = shiftTowardCenter(model.position.x);
                model.position.z = shiftTowardCenter(model.position.z);
                return -1;
            } else {
                model.position.y = newYposition;
            }
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