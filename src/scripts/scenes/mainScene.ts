import PauseOverlay from '../objects/pause-overlay';
import XInput from '../input-methods/x-input';
import Paddle from '../objects/paddle';
import { GameObjects, Input, Types } from 'phaser';

let paddleSpeed = 2;
let ballSpeed = 700;
let ballScale = 0.4;

export default class MainScene extends Phaser.Scene {
  private pauseOverlay: PauseOverlay;
  private xInput = new XInput();
  private playerPaddle: Paddle;
  private player1Score: GameObjects.Text;
  private player2Score: GameObjects.Text;
  private secondPlayerPaddle: Paddle;
  private ball: Types.Physics.Arcade.SpriteWithDynamicBody;
  private downKey: Input.Keyboard.Key;
  private upKey: Input.Keyboard.Key;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
      window.addEventListener("gamepadconnected", () => {
        this.scene.resume();
      });

      this.downKey = this.input.keyboard.addKey("down");
      this.upKey = this.input.keyboard.addKey("up");

      this.physics.world.setBounds(0, 0, 1400, 800, true, true, true);

      window.addEventListener("gamepaddisconnected", () => {
        this.scene.pause();
        this.pauseOverlay.setVisible(true);
      });

      this.playerPaddle = new Paddle(this, 100, 400);
      this.secondPlayerPaddle = new Paddle(this, 1200, 400);
      this.physics.add.existing(this.playerPaddle);
      this.physics.add.existing(this.secondPlayerPaddle);
      this.add.existing(this.secondPlayerPaddle.create());
      this.add.existing(this.playerPaddle.create());

      this.pauseOverlay = new PauseOverlay(this).setVisible(false);
      this.add.existing(this.pauseOverlay);
      this.physics.world.setBoundsCollision();
      this.ball = this.physics.add.sprite(500, 500, "ball", 0xFFFFFF).setBounce(1);
      this.ball.setCollideWorldBounds(true);

      this.player1Score = this.add.text(this.playerPaddle.getCenter().x, 40, "0", {
        fontSize: "100px",
      });

      this.player2Score = this.add.text(this.secondPlayerPaddle.getCenter().x, 40, "0", {
        fontSize: "100px",
      });
  
      this.launchBall();

      this.physics.add.collider(this.playerPaddle, this.ball);
      this.physics.add.collider(this.secondPlayerPaddle, this.ball);
  }

  private launchBall() {
    this.ball.x = +this.game.config.width / 2;
    this.ball.y = +this.game.config.height / 2;
    const launchAngle = getLaunchAngle();
    this.ball.setScale(ballScale);
    const xVelocity = ballSpeed * Math.cos(launchAngle);
    const yVelocity = ballSpeed * Math.sin(launchAngle);
    this.ball.setVelocity(xVelocity, yVelocity);
  }

  announceWinner(player: string) {
    this.ball.setVelocity(0);
    this.add.text(500, 500, `${player} wins`);
  }

  update() {
    if (this.player1Score.text === "10") {
      this.announceWinner("Player 1");
    } else if (this.player2Score.text === "10") {
      this.announceWinner("Player 2");
    } else {
      if (this.downKey.isDown) {
        this.secondPlayerPaddle.move(2);
      }

      if (this.upKey.isDown) {
        this.secondPlayerPaddle.move(-2);
      }
      const pad = navigator.getGamepads()[0];
      if (pad) {
        const pressed = this.xInput.getPressedButtons(pad.buttons);
        const sticks = this.xInput.getStickAxes(pad.axes);
        if (pressed.includes("DPad-Up") || sticks.leftStick.y < 0) {
          this.playerPaddle.move(-paddleSpeed);
        }

        if (pressed.includes("DPad-Down") || sticks.leftStick.y > 0) {
          this.playerPaddle.move(paddleSpeed);
        }

        if (this.ball.getLeftCenter().x === 0) {
          this.player2Score.setText((+this.player2Score.text + 1).toString());
          this.playerPaddle.scaleY = Math.min(this.playerPaddle.scaleY * 1.1, 3);
          ballSpeed -= 50;
          paddleSpeed = Math.max(paddleSpeed - 2, 1);
          this.launchBall();
        }

        if (this.ball.getRightCenter().x === +this.game.config.width) {
          const newScore = +this.player1Score.text + 1;
          this.player1Score.setText(newScore.toString());
          this.playerPaddle.scaleY = Math.max(this.playerPaddle.scaleY / 1.1, 0.2);
          ballSpeed += 100;
          paddleSpeed += 2;
          this.launchBall();   
        }
      }
    }
  }
}

function getLaunchAngle() {
  return new Phaser.Math.RandomDataGenerator().between(40, 320);
}
