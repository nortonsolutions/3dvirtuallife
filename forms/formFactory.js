import { Hero } from './hero.js';
import { ArtificialForm } from './artificial.js';
import { AnimatedForm } from './animated.js';
import { StandardForm } from './standard.js';
import { SpriteForm } from './sprite.js';
import { Fire, params } from './fire.js';
import { WaterForm } from './water.js';

/**s
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
            case "water":
                form = new WaterForm(template, this.sceneController);
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
        let treeTypes = ['aspen1','pine1','pine2','maple1','tree1'];
        this.addSpritesRecursive(treeTypes, 1, 5, .1, false, model, regex);

    }

    addSpritesGeneric = (model, name, regexString, frames = 10, scale = 1, elevation = 5, flip = false, time) => {
        
        if (regexString) {
            let regex = new RegExp(regexString, 'i');
            this.addSpritesRecursive(name, frames, scale, elevation, flip, model, regex, time);
    
        } else { // No regex, so just add one in the center of the object
            this.addSpritesSingle(name, frames, scale, elevation, flip, model, time);
        }
    }

    /** 
     * Scan down the model for any part that matches regex;
     * the first param may optionally be an array for random selection.
     */
    addSpritesRecursive = (name, frames, scale, elevation, flip, model, regex) => {
        
        if (regex.test(model.name)) {

            var itemName;
            if (typeof name == 'object') {
                itemName = name[getRndInteger(0,name.length-1)];
            } else itemName = name;

            let spriteForm = new SpriteForm(itemName, frames, flip);
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

    /** Add a single sprite to the center of the model and display for the given time (seconds) */
    addSpritesSingle = (name, frames, scale, elevation, flip, model, time) => {
    
        let spriteForm = new SpriteForm(name, frames, flip);
        let sprite = spriteForm.getSprite();
        sprite.scale.set(scale, scale, scale);
        sprite.translateY(elevation);

        model.add(sprite);
        this.sceneController.sprites.push({ sprite, frames: spriteForm.getFrames() });

        setTimeout(() => {
            model.remove(sprite);
            this.sceneController.sprites.pop();
        }, time * 1000);
    }

    addTorchLight = (model) => {
        
        let spriteForm = new SpriteForm('flame', 40, true);
        let sprite = spriteForm.getSprite();
        sprite.scale.set(.05, .1, .05);
        sprite.translateZ(-.32);
        // sprite.translateY();

        model.add(sprite);
        this.sceneController.sprites.push({ sprite, frames: spriteForm.getFrames() });

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
