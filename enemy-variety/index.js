window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const c = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(c, width, height) {
      this.c = c;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      this.enemyTypes = ["worm", "ghost", "spider"];
    }
    update(deltaTime) {
      this.enemies = this.enemies.filter((object) => !object.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
        console.log(this.enemies);
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((object) => {
        object.update(deltaTime);
      });
    }
    draw() {
      this.enemies.forEach((object) => {
        object.draw(this.c);
      });
    }
    #addNewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randomEnemy == "worm") this.enemies.push(new Worm(this));
      else if (randomEnemy == "ghost") this.enemies.push(new Ghost(this));
      else if (randomEnemy == "spider") this.enemies.push(new Spider(this));

      // this.enemies.sort((a, b) => {
      //   return a.y - b.y;
      // });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
      this.frameX;
      this.maxFrame = 5; // count from 0
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      this.x -= this.velocityX * deltaTime;
      //remove enemies
      if (this.x < 0 - this.width) this.markedForDeletion = true; // spiders not being removed in this
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
    draw(c) {
      c.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.image = worm;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.markedForDeletion = false;
      this.velocityX = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.image = ghost;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.markedForDeletion = false;
      this.velocityX = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
    }

    draw(c) {
      c.save();
      c.globalAlpha = 0.7;
      super.draw(c);
      c.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.image = spider;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.markedForDeletion = false;
      this.velocityX = 0;
      this.velocityY = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * this.game.height;
    }

    update(deltaTime) {
      super.update(deltaTime);
      if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
      this.y += this.velocityY * deltaTime;
      if (this.y > 200) this.velocityY *= -1;
    }

    draw(c) {
      c.beginPath();
      c.moveTo(this.x + this.width / 2, 0);
      c.lineTo(this.x + this.width / 2, this.y + 10);
      c.stroke();
      super.draw(c);
    }
  }

  const game = new Game(c, canvas.width, canvas.height);
  let lastTime = 1;
  function animate(timeStamp) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }
  animate(0);
});
