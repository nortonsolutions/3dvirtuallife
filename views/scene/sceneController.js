import { Scene } from '/scene/scene.js';

/**
 * SceneController has a Scene object for graphical display, and keeps track
 * of movements and placement within the scene for object interactions, etc.
 */

export class SceneController {

    constructor(layout) {
        this.layout = layout;
        this.player = this.layout.player;

    }

    animateScene() {
        var scene = new Scene(this.layout.height, this.layout.width, this.layout);
        scene.init();
        scene.animate();
    }

}