const circle1 = { x: 10, y: 10, radius: 300 };
const circle2 = { x: 500, y: 500, radius: 150 };
let dx = circle2.x - circle1.x;
let dy = (circle2.y = circle1.y);
let distance = Math.sqrt(dx * dx + dy * dy); // distance = hypotenuse / distance between two circles centre point
let sumOfRadii = circle1.radius + circle2.radius;
if (distance < sumOfRadii) {
  //circles collide
} else if (distance == sumOfRadii) {
  //circles touching
} else if (distance > sumOfRadii) {
  // no collision
}
