import { Scene } from '/scene/scene.js';

/**
 * SceneController has a Scene object for graphical display, and keeps track
 * of movements and placement within the scene for object interactions, etc.
 * 
 * SceneController receives the summarized version of the layout as defined
 * by the LayoutBuilder, containing only the information needed for the UI.
 */

export class SceneController {

    constructor(hero, layoutBuilder, eventDepot) {

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

}