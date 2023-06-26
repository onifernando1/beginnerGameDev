const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.font = "bold 50px Impact";

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCanvasContext = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500; // ms
let lastTime = 0;
let score = 0;
let gameOver = false;
let ravens = [];

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    // this.flapInterval = 100;
    this.flapInterval = Math.random() * 100 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255), // want whole numbers
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      `rgb(` +
      this.randomColors[0] +
      `,` +
      this.randomColors[1] +
      `,` +
      this.randomColors[2] +
      `)`;

    this.hasTrail = Math.random() > 0.5; // true or false but nicer and stop if else statements to make some true and some false
  }

  update(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      // if reaches top, change direction
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
      if (this.hasTrail) {
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color));
        }
      }
    }
    if (this.x < 0 - this.width) gameOver = true;
  }

  draw() {
    collisionCanvasContext.fillStyle = this.color;
    collisionCanvasContext.fillRect(this.x, this.y, this.width, this.height);
    c.drawImage(
      this.image,
      this.frame * this.spriteWidth,
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

// const raven = new Raven();

let explosions = [];

class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.markedForDeletion = false;
    // this.sound = new Audio();
    // this.sound.src = "boom.wav";
  }

  update(deltatime) {
    // if (this.frame === 0) {
    //   this.sound.play();
    // }
    this.timeSinceLastFrame += deltatime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true; // after all frames cycled, delete
    }
  }

  draw() {
    c.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

let particles = [];
class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2;
    this.y = y + this.size / 3;
    this.radius = (Math.random() * this.size) / 10;
    this.maxRadius = Math.random() * 20 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }

  update() {
    this.x += this.speedX;
    this.radius += 0.5;
    if (this.radius > this.maxRadius - 5) {
      this.markedForDeletion = true;
    }
  }

  draw() {
    c.save();
    c.globalAlpha = 1 - this.radius / this.maxRadius; // changes transparency as trail radii grow
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

function drawScore() {
  c.fillStyle = "white";
  c.fillText("Score: " + score, 50, 75);
  c.fillStyle = "black";
  c.fillText("Score: " + score, 51, 77);
}

function drawGameOver() {
  c.textAlign = "center";
  c.fillStyle = "white";
  c.fillText(
    `GAME OVER, Your score is: ${score}`,
    canvas.width / 2,
    canvas.height / 2
  );
  c.fillStyle = "black";
  c.fillText(
    `GAME OVER, Your score is: ${score}`,
    canvas.width / 2 + 2,
    canvas.height / 2 + 2
  );
}

window.addEventListener("click", (e) => {
  const detectPixelColor = collisionCanvasContext.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pixelColour = detectPixelColor.data;
  ravens.forEach((object) => {
    if (
      object.randomColors[0] == pixelColour[0] &&
      object.randomColors[1] == pixelColour[1] &&
      object.randomColors[2] == pixelColour[2]
    ) {
      //collision detected
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(object.x, object.y, object.width));
    }
  });
});

function animate(timestamp) {
  c.clearRect(0, 0, canvas.width, canvas.height);
  collisionCanvasContext.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  drawScore();
  [...particles, ...ravens, ...explosions].forEach((r) => {
    r.update(deltatime);
  });
  [...particles, ...ravens, ...explosions].forEach((r) => {
    r.draw();
  });
  ravens = ravens.filter((object) => !object.markedForDeletion); // new array without those marked for deletion
  explosions = explosions.filter((object) => !object.markedForDeletion);
  particles = particles.filter((object) => !object.markedForDeletion);

  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}

animate(0); //set first timetstamp, as timestamp only passed on second loop
