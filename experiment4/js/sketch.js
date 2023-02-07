// Author: Anika Mahajan
// Date: 02/07/2023
// Purpose: Experiment 4 - Image, Video, & Sound 
// for CMPM 169 taught by Wes Modes at UCSC Winter 2023

// Attributions:
// code for bars and collisions: "Generative Music String" by Che-Yu Wu
// code for ball physics: "Ball drop" by IKEA

// GLOBAL VARIABLES
// for sound
let osc, envelope;
let pan1 = 0;

// for noise
let yOff = 0;
let inc = 0.1;

// for camera/canvas set up
const SPEED = 2.5;
const SPAN = (600 * 0.9) / 5;
let strings = [];
let balls = [];
let cam;

// notes for the different bars
let notes = [
  { midi: 55 },
  { midi: 58 },
  { midi: 62 },
  { midi: 63 },
  { midi: 67 },
  { midi: 70 },
  { midi: 72 },
  { midi: 50 },
  { midi: 76 },
  { midi: 48 },
  { midi: 55 },
  { midi: 74 },
  { midi: 62 },
];

// class for music paddles
class PlayString {
  constructor(p1, p2, midi) {
    this.p1 = p1;
    this.p2 = p2;
    this.midi = midi;
    this.trTime = 0;
    this.useFreq = 0;

    this.envelope = new p5.Envelope();
    this.envelope.setADSR(
      random(15, 40) / 1000,
      random(10, 50) / 100,
      0.02,
      this.midi == -1 ? 0.5 : 0.2 + 100 / this.midi
    );
    this.envelope.setRange(0.2, 0);

    if (this.midi != -1) {
      if (random() < 0.5) {
        this.osc = new p5.SinOsc();
      } else {
        this.osc = new p5.TriOsc();
      }
      this.osc.freq(midiToFreq(this.midi + pan1));
      this.useFreq = midiToFreq(this.midi + pan1);
    } else {
      this.osc = new p5.Noise();

      this.envelope.setADSR(1, 0.1, 0.05, 0.02);
    }
    this.osc.start();

    this.envelope.play(this.osc, 0, 0.2);
  }

  update() {
    this.trTime++;
    if (random() < 0.05 && this.trTime > 5) {
      this.osc.freq(midiToFreq(this.midi + pan1));
      this.useFreq = midiToFreq(this.midi + pan1);
    }
    
    // wraparound effect
    // if goes out of view of camera, moves back with new random y value
    if(this.p2.x < cam.eyeX - width/2) {
      this.p1.x = cam.eyeX + 1326 - 5 - width/2;
      this.p2.x = cam.eyeX + 1326 + SPAN - 20 - width/2;
      this.p1.y = map(noise(yOff), 0, 1, -height/4, height/2);
      this.p2.y = map(noise(yOff), 0, 1, -height/4, height/2);
      yOff += inc;
    }
  }

  draw() {
    push();
    colorMode(HSB);

    if (this.trTime < 20) {
      strokeWeight(50 * this.trTime);
      stroke(
        this.useFreq / 5,
        255 / sqrt(this.trTime),
        20 * (15 - this.trTime)
      );

      strokeWeight(5 + 15 / sqrt(this.trTime));
      line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }

    let panY = 0;
    if (this.trTime < 20) {
      this.panY = sin(this.trTime) * 10;
    }

    stroke(this.useFreq / 5, 255 / sqrt(this.trTime), 100);
    strokeWeight(5 + 15 / sqrt(this.trTime));
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    pop();
  }

  play() {
    let midiValue = this.midi;
    let freqValue = midiToFreq(midiValue);
    this.trTime = 0;
    
    this.envelope.play(this.osc, 0, 0.2);
  }

  collide(p, obj) {
    // sets range based off of mass
    // range based off of Che-Yu Wu's code
    if (obj) {
      this.envelope.setRange(map(obj.r, 5, 25, 1/140, 80/140), 0);
    }

    // checks distance of lines with buffer to see 
    // if the ball has collided
    return p.dist(this.p1) + p.dist(this.p2) <= this.p1.dist(this.p2) + 10.5;
  }
}

function setup() {
  getAudioContext().suspend();
  createCanvas(600, 600, WEBGL);
  background(100);

  // sets up bars
  let yOff = 0;
  for (var i = 0; i < notes.length; i++) {
    let x = i * SPAN + width * 0.05 - width/2;
    let y = map(noise(yOff), 0, 1, -height/4, height/2);
    strings.push(
      new PlayString(
        createVector(x + 10, y),
        createVector(x - 10 + SPAN, y),
        notes[i].midi
      )
    );
    yOff += inc;
  }
  
  cam = createCamera();
  
  // creates random number of starter balls
  let randomInt = int(random(1, 5));
  for (let i = 0; i < randomInt; i++){
    // places first ball in the same spot
    if(i === 0) {
      balls.push(new Ball(random(5,25), random(1,6), random(0.02, 0.08), random(0.4, 0.8), -width/4, -height/2));
    // randomizes the rest of the balls
    } else {
      balls.push(new Ball(random(5,25), random(1,6), random(0.02, 0.08), random(0.4, 0.8), random(-width/2 + 20, width/2 - 20) + cam.eyeX, -height/2));
      
    }
    
  }
}

function draw() {
  // move camera
  cam.move(SPEED, 0, 0);
  // set frame rate
  frameRate(30);
  if (frameCount % 200 == 0) {
    pan1 = random([0, -2, -4, 5, 6, 8]);
  }
  background(0, 0, 0);

  // draws and updates each paddle
  noFill();
  stroke(255);
  strings.forEach((s) => s.update());
  strings.forEach((s) => s.draw());

  // checks collisions for every string and every ball
  strings.forEach((s) => {
    balls.forEach((b) => {
      if (s.collide(b.vec, b)) {
        s.play();
        b.vy = -b.vy * b.jumpSpeed;
        b.vec.y -= 10;
      }
    });
  });
  
  // draws and updates each ball
  stroke(255);
  fill(255);
  balls.forEach((b) => b.draw());
}

// class for bouncing ball
class Ball {
  constructor(r, vy, vyDelta, jumpSpeed, x, y) {
    this.r = r;
    this.vec = createVector(x, y);
    this.vy = vy;
    this.vx = SPEED;
    this.vyDelta = vyDelta;
    this.jumpSpeed = jumpSpeed;
  }
  
  draw() {
    // draws ball
    ellipse(this.vec.x, this.vec.y, this.r);
    // updates position
    this.vec.x += this.vx;
    this.vec.y += this.vy;
    // updates y speed
    this.vy += this.vyDelta;
    
    // if off screen, wraps back up
    if(this.vec.y > height/2) {
      this.vec.y = -height/2;
    }
  }
}

function mousePressed() {
  userStartAudio();
  // adds new ball if mouse is clicked
  balls.push(new Ball(random(5,25), random(1,6), random(0.02, 0.08), random(0.4, 0.8), random(-width/2 + 20, width/2 - 20) + cam.eyeX, -height/2));
}