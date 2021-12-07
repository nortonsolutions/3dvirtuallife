import { Scene } from '/scene/scene.js';

/**
 * SceneController has a Scene object for graphical display, and keeps track
 * of movements and placement within the scene for object interactions, etc.
 */

export class SceneController {

    constructor(layout) {
        this.layout = layout;
        this.objects = [...this.layout.entities, ...this.layout.items, ...this.layout.structures];
        this.player = this.layout.player;

    }

    animateScene() {
        var scene = new Scene(this.layout.height, this.layout.width, this.player, this.objects);
        scene.init();
        scene.animate();
    }

}