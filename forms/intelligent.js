import { AnimatedForm } from './animated.js'

/** IntelligentForms are AnimatedForms which also
 * move and make decisions every turn.  Subclasses
 * include the Hero and ArtificialForms (AIs).
 */



export class IntelligentForm extends AnimatedForm{

    constructor(template, sceneController) {
        super(template, sceneController);

        // Animation mixer has been added by superclass
        this.absVelocity = 0;
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

        this.justJumped = false;
        this.standingUpon = null;
        this.canJump = true;
        this.alive = true;

        this.movementRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.length/2 + 45 );
        // this.movementRaycasterR = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        // this.movementRaycasterL = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, this.attributes.width/2 + 20 )
        
    }

    /** load is for loading the model and animations specifically */
    load(callback) {
        
        super.load(() => {
            this.listGeometries(this.model);
            this.listPositions(this.model);
            this.getBoundingSphereHandR(this.model);
            if (callback) callback();
        })

    }

    getBoundingSphereHandR(el) {
        // if (el.geometry)

        let temp = this.model.getObjectByName('HandR'); // .children[1];
        // temp.computeBoundingSphere();
        console.log("Test")

    }

    listGeometries(el) {

        if (el.geometry) {
            console.log(`${this.objectName}: ${el.name}`);
            el.children.forEach(child => {
                this.listGeometries(child);
            })
        } else {
            el.children.forEach(child => {
                this.listGeometries(child);
            })
        }
    }

    listPositions(el) {
        if (el.position) {
            console.log(`${this.objectName}: ${el.name} ${el.position.x},${el.position.z} `);
            el.children.forEach(child => {
                this.listPositions(child);
            })
        } else {
            el.children.forEach(child => {
                this.listPositions(child);
            })
        }
    }



    /**
     * This function will move an entity from one location to another.
     * Direction is relative to the entity in question
     */
    move(delta) {
        
        if (this.alive) {
            let worldDirection = new THREE.Vector3().copy(this.direction).applyEuler( this.rotation );
            this.movementRaycaster.ray.direction.x = worldDirection.x; // -worldDirection.x;
            this.movementRaycaster.ray.direction.z = worldDirection.z; // -worldDirection.z;
            this.movementRaycaster.ray.origin.y += this.attributes.height;
    
            // Essentially set Lx = -wDz and Lz = wDx, then Rx = wDz and Rz = -wDx
            // let worldDirectionL = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, -Math.PI/2, 0, 'YXZ' ));
            // let worldDirectionR = new THREE.Vector3().copy(worldDirection).applyEuler( new THREE.Euler( 0, Math.PI/2, 0, 'YXZ' ));
    
            // if (worldDirection.x != 0 || worldDirection.z != 0) {
            //     console.log(`${this.objectName} wD: ${worldDirection.x},${worldDirection.z}`);
            //     console.log(`${this.objectName} rc: ${this.movementRaycaster.ray.direction.x},${this.movementRaycaster.ray.direction.z}`);
            //     console.log(`${this.objectName} V: ${this.velocity.x},${this.velocity.z}`);
            //     console.log(`${this.objectName} D: ${this.direction.x},${this.direction.z}`);
            //     console.log(`${this.objectName} rotationY: ${this.model.rotation.y}`);
            // }
            
            // Can I avoid the filter here using object attributes.length and width as the starting point for the ray?
            let fIntersects = this.movementRaycaster.intersectObjects(this.sceneController.structureModels, true);
            
            if (fIntersects.length == 0) { // Nothing is in the front, so move forward at given velocity
                
                this.model.translateX( this.velocity.x * delta );
                this.model.translateY( this.velocity.y * delta );
                this.model.translateZ( this.velocity.z * delta );
    
            } else { // Something is blocking, so stop without moving
                
                if (this.objectType != "hero") {
                    this.model.translateX( -this.velocity.x * delta );
                    this.model.translateZ( -this.velocity.z * delta );
                }
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.velocity.z = 0;
    
                this.sceneController.eventDepot.fire('updateHelper', { position: fIntersects[0].point, color: { r: 0, g: 1, b: 0 }});
                
            }
    
        }
    }

    setElevation() {
        
        let downRayOriginHeight = this.model.position.y + 30;

        this.downRaycaster.ray.origin.copy(this.model.position);
        this.downRaycaster.ray.origin.y = downRayOriginHeight;

        let downwardIntersections = this.downRaycaster.intersectObjects( this.sceneController.structureModels, true );
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

            if (newYposition == -1) { 
                this.model.position.x = shiftTowardCenter(this.model.position.x);
                this.model.position.z = shiftTowardCenter(this.model.position.z);
                return -1;
            } else {
                this.model.position.y = newYposition;
            }
        }
    }

    changeStat(stat, change) {

        let cur = Number(this.attributes.stats[stat].substring(0,2));
        let max = this.attributes.stats[stat].substring(3);
        let newvalue = 0;

        if (change > 0) {
            this.fadeToAction("Yes", 0.2);
            // this.fadeToAction("ThumbsUp", 0.2);
            newvalue = Math.min(max, cur + change);
        } else {
            newvalue = cur + change;

            if (stat == "health") {

                if (this.alive && newvalue <= 0) {
                    this.death();
                } else if (this.alive) {
                    this.fadeToAction("No", 0.2);
                } 
            } else {
                this.fadeToAction("No", 0.2);
            }
        }

        this.attributes.stats[stat] = Number(newvalue).toLocaleString('en-US',{minimumIntegerDigits:2}) + "/" + max;



        if (this.objectType == "hero") {
            this.updateHeroStats();
        }

    }

    getStat(stat) {
        return Number(this.attributes.stats[stat].substring(0,2));
    }

    death() {
        this.alive = false;
        this.fadeToAction("Death", 0.2);
        // this.sceneController.removeEntityFromScene(this);
    }

}