const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.7; // divide or times height and width by same number, multiplcation more performative
    this.height = this.spriteHeight * 0.7;
    // this.x = x - this.width / 2; // horizontally center around cursor
    // this.y = y - this.height / 2; // placed after this.width and height!
    this.x = x; // FOR ROTATION ,NEED TO CHANGE< CENTERING HAPPENS LATER
    this.y = y; // FOR ROTATION ,NEED TO CHANGE< CENTERING HAPPENS LATER
    this.image = new Image();
    this.image.src = "boom.png";
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2; // radians expected
    // this.sound = new Audio(); // AuDIO
    // this.sound.src = "";
  }

  update() {
    // if (this.frame == 0) {
    //   this.sound.play(); // AUDIO
    // }
    this.timer++;
    if (this.timer % 10 == 0) {
      this.frame++;
    }
  }

  draw() {
    c.save(); // allow translation
    c.translate(this.x, this.y); // rotate by center
    c.rotate(this.angle);
    c.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2, //this.x, // normally would be this.x , but save and restore after translate changes x and y to click point
      0 - this.height / 2, // this.y,
      this.width,
      this.height
    );
    c.restore(); //alow translation
  }
}

window.addEventListener("click", function (e) {
  createAnimation(e);
  //   c.fillStyle = "white";
  //   c.fillRect(
  //     // e.x - canvasPosition.left - 25, // -25 (half of height of rectangle) to centre mouse
  //     e.y - canvasPosition.top - 25,
  //     50,
  //     50
  //   );
});

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].frame > 5) {
      //sprite sheet has 5 animation{
      explosions.splice(i, 1); // remove 1 object at position i
      i--; // to ensure not object in array correctly update
    }
  }
  requestAnimationFrame(animate);
}
animate();
