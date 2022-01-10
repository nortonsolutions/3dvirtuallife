import { Hero } from './hero.js';
import { ArtificialForm } from './artificial.js';
import { AnimatedForm } from './animated.js';
import { StandardForm } from './standard.js';
import { SpriteForm } from './sprite.js';
import { Fire } from './fire.js';

/**
 * The FormFactory will provide objects based on templates
 * for the SceneController, to be modeled and used in the
 * scene.
 */

export class FormFactory {

    constructor(sceneController) {
        this.sceneController = sceneController;
        
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

        let flameSpriteForm = new SpriteForm('flame', 40, true);
        let regex = new RegExp('sconce', 'i');

        this.addSpritesRecursive(flameSpriteForm, model, regex);

    }

    addSpritesRecursive = (spriteForm, model, regex) => {
        
        if (regex.test(model.name)) {

            let sprite = spriteForm.getSprite();
            sprite.scale.set(.3, .4, .3);
            sprite.translateY(.15);

            model.add(sprite);
            this.sceneController.sprites.push({ sprite, frames: spriteForm.getFrames() });

        } else {
            if (model.children) {
                model.children.forEach(m => {
                    this.addSpritesRecursive(spriteForm, m, regex);
                })
            }
        }
    }



}
