// Author: Anika Mahajan
// Date: 02/14/2023
// Purpose: Experiment 5 - 3D Graphics
// for CMPM 169 taught by Wes Modes at UCSC Winter 2023

// Attributions:
// code for noise terrain: "Terrain" by Tiago
// Sailboat by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/1d76pfN4Dne)

let sc = 20;
let cols, rows;
let w = 1400;
let h = 1000;

let flightPos = 0;
let flightSpeed = 0.035;
let noiseDelta = 0.35;
let terrain = [];
let terrainHeight = 112;

let fireflies = [];
let mouseClicks = 0;

let ship;

let colors = [
  "#FBF8CC",
  "#FDE4CF",
  "#FFCFD2",
  "#F1C0E8",
  "#CFBAF0",
  "#A3C4F3",
  "#90DBF4",
  "#8EECF5",
  "#98F5E1",
  "#B9FBC0",
  "#f8f9fa",
];

function setup() {
  createCanvas(1280, 720, WEBGL);

  cols = w / sc;
  console.log(w/sc);
  rows = h / sc;
  for (let x = 0; x < cols; ++x) {
    terrain[x] = [];
  }

  //creates spotlight fireflies
  //startingX, startingY, xSpeed, yspeed, horizontallyMoving, color
  for (let a = 0; a < 4; a++) {
    if (a < 3) {
      fireflies.push(
        new Firefly(
          255,
          random(-width / 2 + 50, width / 2 - 50),
          random(-height / 2 + 20, -height / 6),
          random(1, 5),
          random(1, 5),
          false,
          colors[int(random(11))],
          true
        )
      );
    } else {
      fireflies.push(
        new Firefly(
          255,
          random(-width / 2 + 50, width / 2 - 50),
          random(-height / 2, height / 4),
          random(1, 5),
          random(1, 5),
          true,
          colors[int(random(11))],
          true
        )
      );
    }
  }
  mouseClicks = 0;
  
  
  ship = loadModel("assets/model.obj", true);
}

function draw() {
  flightPos -= flightSpeed;
  shiftNoiseSpace();

  background("#0E1118");
  lights();
  noStroke();
  // fill("#557A64");
  fill("white");

  mouseSpotlight();
  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].render(true);
  }

  rotateX(PI / 3);
  translate(-w / 2 + 1, -h / 2 + 30);

  for (let y = 0; y < rows - 1; ++y) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; ++x) {
      vertex(x * sc, y * sc, terrain[x][y]);
      vertex(x * sc, (y + 1) * sc, terrain[x][y + 1]);
      if(x == 0 && y == cols/2) {
        push();
        rotateX(2*PI / 3);
        translate(mouseX, terrain[x][y + 1] - 70, -300);
        rotateY(PI/4);
        model(ship);
        pop();
      }
    }
    endShape();
  }
  orbitControl(1, 1, 0.1);
  
}

function shiftNoiseSpace() {
  let yOffset = flightPos;
  for (let y = 0; y < rows; ++y) {
    let xOffset = 0;
    for (let x = 0; x < cols; ++x) {
      terrain[x][y] = map(
        noise(xOffset, yOffset),
        0,
        1,
        -terrainHeight,
        terrainHeight
      );
      xOffset += noiseDelta;
    }
    yOffset += noiseDelta;
  }
}

function mouseSpotlight() {
  // based off of https://p5js.org/examples/lights-mixture.html
  // to set the light position,
  // think of the world's coordinate as:
  // -width/2,-height/2 -------- width/2,-height/2
  //                |            |
  //                |     0,0    |
  //                |            |
  // -width/2,height/2--------width/2,height/2

  // calculate distance from center to mouseX
  let lightX = mouseX - width / 2;
  let lightY = mouseY - height / 2;

  // white spotlight
  // axis located at lightX, lightY, 500
  // axis direction of light: 0, 0, -1
  spotLight(255, 255, 255, lightX, lightY, 600, 0, 0, -1);

  // renderObjects();
}

function mousePressed() {
  if (mouseClicks < 5) {
    if (random() < 0.5) {
      fireflies.push(
        new Firefly(
          255,
          random(-width / 2 + 50, width / 2 - 50),
          random(-height / 2 + 20, -height / 6),
          random(1, 5),
          random(1, 5),
          false,
          colors[int(random(11))],
          false
        )
      );
    } else {
      fireflies.push(
        new Firefly(
          255,
          random(-width / 2 + 50, width / 2 - 50),
          random(-height / 2, height / 4),
          random(1, 5),
          random(1, 5),
          true,
          colors[int(random(11))],
          false
        )
      );
    }
  }
  mouseClicks++;
}

class Firefly {
  constructor(
    r,
    startingX,
    startingY,
    xSpeed,
    ySpeed,
    horizontallyMoving,
    c,
    isSpotlight
  ) {
    this.r = r;
    this.x = startingX;
    this.y = startingY;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;

    this.horizontallyMoving = horizontallyMoving;

    this.color = c;
    this.isSpotlight = isSpotlight;
  }

  render(on) {
    //started with https://p5js.org/examples/hello-p5-animation.html
    if (this.horizontallyMoving) {
      // Jiggling randomly on the vertical axis
      this.x = this.x + this.xSpeed;
      // Moving up at a constant speed
      this.y = this.y + random(-1, 1) * this.ySpeed;
    } else {
      // Jiggling randomly on the horizontal axis
      this.x = this.x + random(-1, 1) * this.xSpeed;
      // Moving up at a constant speed
      this.y = this.y + this.ySpeed;
    }

    // wraps
    if (this.y < -height / 2) {
      this.y = height / 2;
    }
    if (this.y > height / 2) {
      this.y = -height / 2;
    }

    if (this.x < -width / 2) {
      this.x = width / 2;
    }
    if (this.x > width / 2) {
      this.x = -width / 2;
    }

    if (this.isSpotlight) {
      spotLight(
        color(this.color),
        createVector(this.x, this.y, 350),
        createVector(0, 0, -1)
      );
    } else {
      pointLight(color(this.color), createVector(this.x, this.y, 350));
    }

    push();
    fill(this.color);
    translate(this.x, this.y);
    sphere(this.r / 22);
    pop();
  }
}