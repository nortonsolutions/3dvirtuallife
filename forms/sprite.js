export class SpriteForm {

    constructor(name, frames, flip) {
        
        this.flip = flip;
        this.frames = frames;
        this.spriteMap = new THREE.TextureLoader().load( '/models/png/' + name + '.png' );
        this.spriteMap.repeat = {x: 1 / this.frames, y: 1};

    }


    getSprite() {

        let spriteMaterial = new THREE.SpriteMaterial({
            opacity: 1,
            transparent: true,
            map: this.spriteMap,
            rotation: this.flip? Math.PI : 0
        });

        let startingSprite = getRndInteger(0,this.frames - 1)
        spriteMaterial.map.offset = {x: 1 / this.frames * startingSprite, y: 0};
        return new THREE.Sprite(spriteMaterial);
    }

    getFrames() {
        return this.frames;
    }
}