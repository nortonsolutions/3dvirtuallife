import { Hero } from './hero.js';
import { ArtificialForm } from './artificial.js';
import { AnimatedForm } from './animated.js';
import { StandardForm } from './standard.js';
import { Sprite } from './sprite.js';
import { Fire } from './fire.js';

/**
 * The FormFactory will provide objects based on templates
 * for the SceneController, to be modeled and used in the
 * scene.
 */

export class FormFactory {

    constructor(sceneController) {
        
        this.sceneController = sceneController;
        this.setToRenderDoubleSided = this.setToRenderDoubleSided.bind(this);
    }

    newForm(type, template) {

        let form = null;
        switch (type) {
            case "hero":
                form = new Hero(template, this.sceneController);
                break;
            case "floor":
                form = new StandardForm(template, this.sceneController);
                this.setToRenderDoubleSided(form);
                // this.addSconces(this.floor);
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

    setToRenderDoubleSided(object) {

        if (object.material) {
            if (object.material.name != "Roof") { 
                object.material.side = THREE.DoubleSide;
            } else {
                object.material.side = THREE.FrontSide;
            }
        }

        if (object.children) {
            object.children.forEach(e => this.setToRenderDoubleSided(e)); 
        }
    }


}
