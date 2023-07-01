import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const c = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 4;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 10000;
      this.gameOver = false;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.maxParticles = 50;
    }

    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) {
        this.gameOver = true;
      }
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // handle enemies

      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion == true) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });

      // particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) {
          this.particles.splice(index, 1);
        }
      });

      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      //collision sprites

      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) {
          this.collisions.splice(index, 1);
        }
      });
    }

    draw(c) {
      this.background.draw(c);
      this.player.draw(c);
      this.enemies.forEach((enemy) => {
        enemy.draw(c);
      });
      this.particles.forEach((particle) => {
        particle.draw(c);
      });

      this.collisions.forEach((collision) => {
        collision.draw(c);
      });
      this.UI.draw(c);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }

      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    c.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(c);
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
  }
  animate(0);
});
