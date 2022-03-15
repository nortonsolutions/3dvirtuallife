import { Hero } from './hero.js';
import { ArtificialForm } from './artificial.js';
import { AnimatedForm } from './animated.js';
import { StandardForm } from './standard.js';
import { SpriteForm } from './sprite.js';
import { Fire, params } from './fire.js';
import { WaterForm } from './water.js';
import { GrassForm } from './grass.js';

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
                form = new WaterForm(template, this.sceneController, template.attributes.useTHREE? "Water" : null ); // ,"Water" );
                break;
            case "grass":
                form = new GrassForm(template, this.sceneController ); // ,"Grass" );
                break;
            default:
                form = new StandardForm(template, this.sceneController);
                break;
        }

        return form;
    }

    addSconces = (model, scaleAdjust) => {

        let spriteConfig = {
            name: 'flame2',
            regex: new RegExp('sconce', 'i'),
            frames: 16,
            scale: .75 * scaleAdjust,
            elevation: .3,
            flip: false,
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

    addGrassSprites = (scene, model) => {
        
        let spriteConfig = {
            name: ['grass01','grass02','grass03','grass04','grass05'],
            regex: new RegExp('grass', 'i'),
            frames: 1,
            scale: 70,
            elevation: 10,
            flip: false,
            animates: false,
            time: null
        }
        this.addSprites(model, spriteConfig, scene);
    }

    addLeaves = (scene, model) => {
        
        let spriteConfig = {
            name: ['leaves'],
            regex: new RegExp('null|edge', 'i'),
            frames: 1,
            scale: 700,
            elevation: 20,
            flip: false,
            animates: false,
            time: null
        }

        this.addSprites(model, spriteConfig, scene);

    }

    addPonds = (model) => {
        if (/water/.test(model.name) && model.geometry) {
            
            var params = {
                color: '#ccccff',
                scale: 4,
                flowX: .5,
                flowY: .1
            };

            // var textureLoader = new THREE.TextureLoader();
            var waterGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
            let water = new THREE.Water( waterGeometry, {
                color: params.color,
                scale: params.scale,
                textureWidth: 1024,
                textureHeight: 1024,
                flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
                // flowMap: textureLoader.load( 'textures/Water_1_M_Flow.jpg' )
            } );

            // let refractor = new THREE.Refractor( waterGeometry, {
            //     color: 0x999999,
            //     textureWidth: 128,
            //     textureHeight: 128,
            //     shader: THREE.WaterRefractionShader
            // } );
            
            // this.sceneController.refractors.push(water);

            let scale = this.sceneController.layout.terrain.attributes.scale;
            water.position.copy(model.position);
            water.position.x *= scale;
            water.position.y *= scale;
            water.position.z *= scale;

            water.scale.x = scale;
            water.scale.y = scale;
            water.scale.z = scale;
            // refractor.position.set( 0, 10, 0 );

            this.setToDoubleSided(water);
            this.sceneController.scene.add(water);
            this.sceneController.ponds.push(water);
            
            // refractor.material.uniforms[ "tDudv" ].value = this.sceneController.dudvMap;
            water.rotation.x = - Math.PI / 2;
            model.parent.remove(model);
            

        } else {
            if (model.children) {
                model.children.forEach(m => {
                    this.addPonds(m);
                })
            }
        }
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
                        this.addSprites(m, spriteConfig, scene, broadcast, position);
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

    setToDoubleSided(root) {
        
        if (!root) root = this.model;
        if (root.material) { 
                root.material.side = THREE.DoubleSide;
        }

        if (root.children) {
            root.children.forEach(e => this.setToDoubleSided(e)); 
        }
    }

}
