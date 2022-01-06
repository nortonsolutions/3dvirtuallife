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

    constructor(eventDepot) {
        
        this.eventDepot = eventDepot;
        this.setToRenderDoubleSided = this.setToRenderDoubleSided.bind(this);
    }

    newForm(type, template, floorModel) {

        let form = null;
        switch (type) {
            case "hero":
                form = new Hero(template, this.eventDepot, "gltf", floorModel);
                break;
            case "floor":
                form = new StandardForm(template, this, "gltf", floorModel);
                this.setToRenderDoubleSided(form);
                // this.addSconces(this.floor);
                break;
            default:
                form = new StandardForm(template, this, "gltf", floorModel);
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
