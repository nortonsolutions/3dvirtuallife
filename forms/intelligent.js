import { AnimatedForm } from './animated.js'

/** IntelligentForms are AnimatedForms which also
 * move and make decisions every turn.  Subclasses
 * include the Hero and ArtificialForms (AIs).
 */

var downRaycasterTestLength = 70;

export class IntelligentForm extends AnimatedForm{

    constructor(template, formFactory) {
        super(template, formFactory);

        // Animation mixer has been added by superclass

        this.moves = true;
        this.absVelocity = 0;
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();

        this.justJumped = false;
        this.standingUpon = null;
        this.canJump = true;

        this.downRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, downRaycasterTestLength );
        this.movementRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.length/2 + 20 );
        this.movementRaycasterR = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        this.movementRaycasterL = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        
    }


        /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    handleMovement = ( uniqueId, entity, delta ) => {

        var yAxisRotation;
        if (uniqueId = "hero") {
            yAxisRotation = new THREE.Euler( 0, entity.rotation.y, 0, 'YXZ' );
        } else {
            yAxisRotation = new THREE.Euler( 0, -entity.rotation.y, 0, 'YXZ' );
        }

        let worldDirection = new THREE.Vector3().copy(this.mixers[uniqueId].direction).applyEuler( yAxisRotation );
        
        let mRaycaster = this.mixers[uniqueId].movementRaycaster;
        mRaycaster.ray.origin.copy( entity.position );
        mRaycaster.ray.origin.y += entity.attributes.height;
        mRaycaster.ray.direction.x = -worldDirection.x;
        mRaycaster.ray.direction.z = -worldDirection.z;



        // Essentially set Lx = -wDz and Lz = wDx, then Rx = wDz and Rz = -wDx
        // let worldDirectionL = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, -Math.PI/2, 0, 'YXZ' ));
        // let worldDirectionR = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, Math.PI/2, 0, 'YXZ' ));

        // if (worldDirection.x != 0 || worldDirection.z != 0) {
        //     console.log(`${uniqueId} rc: ${mRaycaster.ray.direction.x},${mRaycaster.ray.direction.z}`);
        //     console.log(`${uniqueId} mixerV: ${this.mixers[uniqueId].velocity.x},${this.mixers[uniqueId].velocity.z}`);
        //     console.log(`${uniqueId} mixerD: ${this.mixers[uniqueId].direction.x},${this.mixers[uniqueId].direction.z}`);
        //     console.log(`${uniqueId} rotationY: ${entity.rotation.y}`);
        // }
        
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
        let fIntersects = mRaycaster.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);
        // let rIntersects = mRaycasterR.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);
        // let lIntersects = mRaycasterL.intersectObjects(this.objects3D, true).filter(el => this.getRootObject3D(el.object) != entity);

        if (fIntersects.length == 0) { // Nothing is in the front, so move forward at given velocity
            
            entity.translateX( this.mixers[uniqueId].velocity.x * delta );
            entity.translateY( this.mixers[uniqueId].velocity.y * delta );
            entity.translateZ( this.mixers[uniqueId].velocity.z * delta );

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
            
            this.mixers[uniqueId].velocity.x = 0;
            this.mixers[uniqueId].velocity.y = 0;
            this.mixers[uniqueId].velocity.z = 0;

            entity.translateX( -this.mixers[uniqueId].velocity.x * delta );
            entity.translateY( -this.mixers[uniqueId].velocity.y * delta );
            entity.translateZ( -this.mixers[uniqueId].velocity.z * delta );

            // Show the helper in front:
            this.scene.helper.position.copy(fIntersects[0].point);
            this.scene.helper.material.color = { r: 0, g: 1, b: 0 };

            if (uniqueId != "hero") { // AI - turn around
                entity.rotateY(Math.PI);
            }

            
        }

        // entity.translateY( this.mixers[uniqueId].velocity.y * delta );
        this.setElevation( uniqueId, entity );

    }
    
 

    
    handleHeroMovement(delta) {

        if (this.mixers.hero) {

            let heroObj = this.scene.controls.getObject();

            // INERTIA
            this.mixers.hero.velocity.x -= this.mixers.hero.velocity.x * 10.0 * delta;
            this.mixers.hero.velocity.z -= this.mixers.hero.velocity.z * 10.0 * delta;
            this.mixers.hero.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            this.mixers.hero.direction.z = Number( this.scene.moveForward ) - Number( this.scene.moveBackward );
            this.mixers.hero.direction.x = Number( this.scene.moveLeft ) - Number( this.scene.moveRight );
            this.mixers.hero.direction.normalize(); // this ensures consistent movements in all directions
            
            let agility = this.hero.attributes.stats.agility.substring(0,2);

            if ( this.scene.moveForward || this.scene.moveBackward ) this.mixers.hero.velocity.z -= this.mixers.hero.direction.z * 1000.0 * agility * delta;
            if ( this.scene.moveLeft || this.scene.moveRight ) this.mixers.hero.velocity.x -= this.mixers.hero.direction.x * 1000.0 * agility * delta;

            this.identifySelectedObject(heroObj);
            this.handleMovement( "hero", heroObj, delta );
            
            if (this.mixers.hero.standingUpon && this.mixers.hero.standingUpon.attributes.routeTo && typeof this.mixers.hero.standingUpon.attributes.routeTo.level == "number") {
                if (this.mixers.hero.standingUpon.attributes.unlocked) {
                    
                    this.eventDepot.fire('cacheLayout', {});

                    let loadData = {

                        level: this.mixers.hero.standingUpon.attributes.routeTo.level,
                        location: this.mixers.hero.standingUpon.attributes.routeTo.location,
                    }

                    this.eventDepot.fire('loadLevel', loadData);
                }
            }

            this.scene.handleAutoZoom();

            if (this.layout.terrain.overheadPointLight) {
                this.overheadPointLight.position.copy(heroObj.position);
                this.overheadPointLight.rotation.copy(heroObj.rotation);
                this.overheadPointLight.position.y = heroObj.position.y + 60;
                this.overheadPointLight.translateZ(-80);
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