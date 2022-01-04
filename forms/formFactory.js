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

    constructor(props) {

    }

    newForm(type, template, eventDepot) {

        let form = null;
        switch (type) {
            case "hero":
                form = new Hero(template, eventDepot);
                break;
        }

        return form;
    }



}
