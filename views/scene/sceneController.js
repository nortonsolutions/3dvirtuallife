import { Scene } from '/scene/scene.js';

/**
 * SceneController has a Scene object for graphical display, and keeps track
 * of movements and placement within the scene for object interactions, etc.
 * 
 * SceneController receives the summarized version of the layout as defined
 * by the LayoutBuilder, containing only the information needed for the UI.
 */

export class SceneController {

    constructor(layout) {
        this.layout = layout;
        this.player = this.layout.player;
        this.background = this.layout.background;
        this.objects = [...this.layout.entities, ...this.layout.structures, ...this.layout.items];
    }

    animateScene() {
        var scene = new Scene(this.layout.height, this.layout.width, this.player, this.objects, this.background);
        scene.init();
        scene.animate();
    }

}