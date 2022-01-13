import { Hero } from './hero.js';
import { ArtificialForm } from './artificial.js';
import { AnimatedForm } from './animated.js';
import { StandardForm } from './standard.js';
import { SpriteForm } from './sprite.js';
import { Fire, params } from './fire.js';

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
                form = new StandardForm(template, this.sceneController);
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
            default:
                form = new StandardForm(template, this.sceneController);
                break;
        }

        return form;
    }

    addSconces = (model) => {

        let regex = new RegExp('sconce', 'i');
        this.addSpritesRecursive('flame', 40, .25, .1, true, model, regex);

    }

    addBorderTrees = (model) => {
        
        let regex = new RegExp('null', 'i');
        this.addSpritesRecursive('aspen1', 1, 5, .1, false, model, regex);

    }

    /** Scan down the model for any part that matches regex */
    addSpritesRecursive = (name, frames, scale, elevation, flip, model, regex) => {
        
        if (regex.test(model.name)) {

            let spriteForm = new SpriteForm(name, frames, flip);
            let sprite = spriteForm.getSprite();
            sprite.scale.set(scale, scale, scale);
            sprite.translateY(elevation);

            model.add(sprite);
            this.sceneController.sprites.push({ sprite, frames: spriteForm.getFrames() });

        } else {
            if (model.children) {
                model.children.forEach(m => {
                    this.addSpritesRecursive(name, frames, scale, elevation, flip, m, regex);
                })
            }
        }
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
