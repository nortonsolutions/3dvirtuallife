import { IntelligentForm } from './intelligent.js'

/** Artificial Intelligences: friendlies and beasts */
export class ArtificialForm extends IntelligentForm{

    constructor(template, sceneController) {

        super(template, sceneController);

    }

    move(delta) {
        // INERTIA
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (Math.random() < .4) { // percentage of changing direction
            this.direction.z = getRandomArbitrary(0,10);
            this.direction.x = getRandomArbitrary(-1,1);
            this.direction.normalize();
        }

        let agility = this.attributes.stats.agility.substring(0,2);

        if (Math.random() < .2) { // percentage of moving
            this.velocity.z += this.direction.z * 1000.0 * agility * delta;
            this.velocity.x += this.direction.x * 1000.0 * agility * delta;
        } 

        this.movementRaycaster.ray.origin.copy( this.model.position );

        // Make a random rotation (yaw)
        this.model.rotateY(getRndInteger(-5,5)/100);
        this.rotation.copy(this.model.rotation);

        super.move(delta);

        if (this.setElevation() == -1) {

            this.model.translateX( -this.velocity.x * delta );
            this.model.translateY( -this.velocity.y * delta );
            this.model.translateZ( -this.velocity.z * delta );

            this.velocity.x = 0;
            this.velocity.y = 0;
            this.velocity.z = 0;

        };

    }


}