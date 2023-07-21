import { GameObjects, Scene } from "phaser";

class PauseOverlay extends Phaser.GameObjects.Container {
    constructor(scene: Scene) {
        super(scene, 0, 0);
        const overlay = new GameObjects.Rectangle(scene, 0, 0, +scene.game.config.width, +scene.game.config.height, 0x000000, 0.5);
        this.add(overlay);
        this.add(new GameObjects.Text(scene, overlay.getCenter().x, overlay.getCenter().y, "PAUSE", {
            fontSize: "30px"
        }));
    }
};

export default PauseOverlay;
