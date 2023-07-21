import { Physics, Scene } from "phaser";


class Paddle extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "paddle");
        this.setScale(0.5);
    }

    create() {
        this.setImmovable(true);
        return this;
    }

    move(yChange: number) {
        this.y += yChange;
    }
};

export default Paddle;
