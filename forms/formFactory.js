import { Hero } from './hero.js';
import { ArtificialForm } from './artificial.js';
import { AnimatedForm } from './animated.js';
import { StandardForm } from './standard.js';
import { SpriteForm } from './sprite.js';
import { Fire, params } from './fire.js';
import { WaterForm } from './water.js';

/**
 * The FormFactory will provide objects based on templates
 * for the SceneController, to be modeled and used in the
 * scene.
 */

export class FormFactory {

    constructor(sceneController) {
        this.sceneController = sceneController;
        this.fireParams = params;
    }

    newForm(type, template, controls) {

        let form = null;
        switch (type) {
            case "hero":
                form = new Hero(template, this.sceneController, controls);
                break;
            case "floor":
                if (template.attributes.animates) {
                    form = new AnimatedForm(template, this.sceneController);
                } else {
                    form = new StandardForm(template, this.sceneController);
                }
                break;
            case "compass":
                form = new StandardForm(template, this.sceneController);
                break;
            case "artificial":
                form = new ArtificialForm(template, this.sceneController);
                break;
            case "animated":
                form = new AnimatedForm(template, this.sceneController);
                break;
            case "water":
                form = new WaterForm(template, this.sceneController,"Water" ); // ,"Water" ); // , "Refractor");
                break;
            default:
                form = new StandardForm(template, this.sceneController);
                break;
        }

        return form;
    }

    addSconces = (model, scaleAdjust) => {

        let spriteConfig = {
            name: 'flame',
            regex: new RegExp('sconce', 'i'),
            frames: 40,
            scale: .25 * scaleAdjust,
            elevation: .1,
            flip: true,
            animates: true,
            time: null
        }

        this.addSprites(model, spriteConfig);

    }

    addBorderTrees = (scene, model) => {
        
        let spriteConfig = {
            name: ['aspen1','pine1','pine2','maple1','tree1'],
            regex: new RegExp('null|edge', 'i'),
            frames: 1,
            scale: 500,
            elevation: 200,
            flip: false,
            animates: false,
            time: null
        }

        this.addSprites(model, spriteConfig, scene);

    }

    /** 
     * If regex is provided, scan down the model for any part that matches regex;
     * the first param may optionally be an array for random selection.
     * 
     * If the scene is provided, the sprites will be added to the scene, not the model.
     * If broadcast is true, the socket will emit an addSprite event with positioning.
     * 
     * If spriteConfig.regex is null/false, add a single sprite to the center of the model and display for the given time (seconds) 
     */

    addSprites = (model, spriteConfig, scene = null, broadcast = false, position = null) => {

        // Either position was passed OR there is no regex defined; position requires scene
        if (position || !spriteConfig.regex) {

            let spriteForm = new SpriteForm(spriteConfig.name, spriteConfig.frames, spriteConfig.flip);
            let sprite = spriteForm.getSprite();
            sprite.scale.set(spriteConfig.scale, spriteConfig.scale, spriteConfig.scale);
            
            if (position) {
                sprite.position.copy(position);
                sprite.position.y += spriteConfig.elevation;
                scene.add(sprite);
            } else {
                sprite.position.y += spriteConfig.elevation;

                // ONE-OFFs for torch and health/mana bars (make this more generic later)
                if (spriteConfig.translateZ) sprite.translateZ(spriteConfig.translateZ);
                if (spriteConfig.scaleY) sprite.scale.y = sprite.scale.y * spriteConfig.scaleY;

                model.add(sprite);
            }

            this.sceneController.sprites.push({ sprite, frames: spriteForm.getFrames() });

            if (broadcast) {
                let wp = new THREE.Vector3();
                wp = sprite.getWorldPosition(wp);
                this.broadcastSprite(spriteConfig, wp);
            }

            if (spriteConfig.time) {
                setTimeout(() => {
                    position? scene.scene.remove(sprite) : model.remove(sprite);
                    this.sceneController.sprites.pop();
                }, spriteConfig.time * 1000);
            }

            return sprite; // return sprite for non-recursive single instance

        } else { // If there is a regex, recurse

            if (typeof spriteConfig.regex == "string") spriteConfig.regex = new RegExp(spriteConfig.regex, 'i');
            if (spriteConfig.regex.test(model.name)) {

                var itemName;
                if (typeof spriteConfig.name == 'object') {
                    itemName = spriteConfig.name[getRndInteger(0,spriteConfig.name.length-1)];
                } else itemName = spriteConfig.name;
    
                let spriteForm = new SpriteForm(itemName, spriteConfig.frames, spriteConfig.flip);
                let sprite = spriteForm.getSprite();
                sprite.scale.set(spriteConfig.scale, spriteConfig.scale, spriteConfig.scale);
    
                if (!scene) {
                    sprite.position.y += spriteConfig.elevation;
                    model.add(sprite);
                } else {
                    sprite.position.x = model.position.x * multiplier;
                    sprite.position.z = model.position.z * multiplier;
                    sprite.position.y = model.position.y * multiplier;
                    sprite.translateY(spriteConfig.elevation);
                    scene.scene.add(sprite);
                }

                if (broadcast) this.broadcastSprite(spriteConfig, sprite.position);
                if (spriteConfig.animates) this.sceneController.sprites.push({ sprite, frames: spriteForm.getFrames() });
    
            } else {
                if (model.children) {
                    model.children.forEach(m => {
                        this.addSprites(m, spriteConfig, scene, position, broadcast);
                    })
                }
            }
    
        }
        

    }

    broadcastSprite = (spriteConfig, spritePosition) => {
        this.sceneController.socket.emit('addSprites', { level: this.sceneController.level, spriteConfig, spritePosition });
    }

    getFire(params) {

        if (!params) params = this.fireParams;

        let fireObj = new THREE.Group;

        let fire = new Fire();
        fire.single();
        fire.updateAll(params);
        
        let fire2 = new Fire();
        fire2.single();
        fire2.updateAll(params);

        fire2.fire.rotation.y = Math.PI/2;

        fireObj.add( fire.fire );
        fireObj.add( fire2.fire );

        return fireObj;
    }


}
