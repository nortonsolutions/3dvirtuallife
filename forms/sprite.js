export class SpriteForm {

    constructor(name, frames, flip) {
        
        // // How much a single repetition of the texture is offset from the beginning
        // this.spriteMap.offset = {x: 1 / frames * spriteNumber, y: 0};
        
        this.frames = frames;

        this.spriteMap = new THREE.TextureLoader().load( '/models/png/' + name + '.png' );
        this.spriteMap.repeat = {x: 1 / this.frames, y: 1};

        this.spriteMaterial = new THREE.SpriteMaterial({
            opacity: 1,
            transparent: true,
            map: this.spriteMap,
            rotation: flip? Math.PI : 0
        });

        

    }

    getSprite() {
        return new THREE.Sprite(this.spriteMaterial);
    }

    getFrames() {
        return this.frames;
    }
}