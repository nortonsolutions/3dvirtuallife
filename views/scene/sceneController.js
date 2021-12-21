import { Scene } from '/scene/scene.js';

/**
 * SceneController has a Scene object for graphical display, and keeps track
 * of movements and placement within the scene for object interactions, etc.
 * 
 * SceneController receives the summarized version of the layout as defined
 * by the LayoutBuilder, containing only the information needed for the UI.
 * 
 * Also has utilities for handling 3D objects, interfacing with the Scene.
 * 
 * Provides utilities to manage the scene state, for saving and loading.
 *  
 */



export class SceneController {

    constructor(hero, layoutBuilder, eventDepot) {

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.hero = hero;
        this.eventDepot = eventDepot;
        this.layoutBuilder = layoutBuilder;
        this.layout = layoutBuilder.getLayout();
        this.background = this.layout.background;
        this.terrain = this.layout.terrain;
        this.objects = [...this.layout.entities, ...this.layout.structures, ...this.layout.items];
        this.hero.location = this.layout.hero.location;

    }

    animateScene() {
        this.scene = new Scene(this.hero, this.layout.length, this.layout.width, this.terrain, this.objects, this.background, this);

        this.scene.init(() => {
            this.scene.animate();
        });
    }



    deanimateScene() {
        this.scene.deanimate();
        this.scene.unregisterEventListeners();
        this.scene = null;
    }

    /** This method will not set the position of the object3D, nor create a GUI.
     * The return object 'gltf' will have a model (scene) and animations if applicable.
      */
    loadObject3DbyName(objectName, callback) {

        let object = this.layoutBuilder.getObject(objectName);
        var loader = new THREE.GLTFLoader();
        loader.load( '/models/3d/gltf/' + object.gltf, (gltf) => {
            let model = gltf.scene;
            model.scale.x = object.attributes.scale;
            model.scale.y = object.attributes.scale;
            model.scale.z = object.attributes.scale;
            model.objectName = object.name;
            model.objectType = object.type;
            model.attributes = object.attributes;
            callback(gltf);
        });
    }
    
    /** Position of the model should be set before animating */
    createGUI(gltf) {
        this.scene.createGUI( model, gltf.animations, model.uuid );
    }

    getRootObject3D = (obj) => {
        if (obj.objectName) {
            return obj;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getRootObject3D(obj.parent);
        }
    }

    getObjectName = (obj) => {
        if (obj.objectName) {
            return obj.objectName;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getObjectName(obj.parent);
        }
    }

    getObjectType = (obj) => {
        if (obj.objectType) {
            return obj.objectType;
        } else if (obj.parent == null) {
            return null;
        } else {
            return this.getObjectType(obj.parent);
        }
    }


}