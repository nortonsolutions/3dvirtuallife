import { IntelligentForm } from './intelligent.js'

/** Artificial Intelligences: friendlies and beasts */
export class ArtificialForm extends IntelligentForm{

    constructor(template, sceneController) {

        super(template, sceneController);

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
        
        this.fadeToAction("Punch", 0.2);

        let chanceToHit = this.getStat('agility') / 100;
        if (this.sceneController.hero.getStat('health') > 0 && Math.random() < chanceToHit) {
            this.sceneController.hero.changeStat('health', -1);
        }
    }

}