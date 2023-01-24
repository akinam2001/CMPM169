// sketch.js - purpose and description here
// Author: Your Name
// Date:

function sketchSnailRace(p) {
    let inc = 0.008;
    let inc1 = 0.008;
    let start1 = 0;
    let start2 = 10;

    p.setup = function () {
      p.createCanvas(400,400);
    }
  
    p.draw = function () {
        // stuff to draw
        p.background(51);
  
        // drawing line 1 and snail 1 (yellow)
        // code from The Coding Train
        // https://www.youtube.com/watch?v=ikwNrFvnL3g (3:29)
        p.noFill();
        p.beginShape();
        xoffLoop = start1;
        for(let a = 0; a < p.width; a++){
            // color and weight of line
            p.stroke(239, 251, 151);
            p.strokeWeight(5); 
            
            // random y value
            let b = p.noise(xoffLoop) * p.height;
            
            // draw vertex
            p.vertex(a, b);
            
            // increment noise
            xoffLoop += inc;
            
            // end line 50 pixels from right
            if(a == p.width - 50) {
                p.endShape();     
                
                // draw snail
                p.push();
                p.translate(a + 15, b + 11);
                p.rotate(p.atan(a/b));
                p.scale(0.5);
                new snail(0, 0, '#FFCC5F').draw();
                p.scale(1);
                p.noFill();
                p.pop();
                
                break;
            }
        }
        
        // drawing line 2 and snail 2 (pink)
        p.beginShape();
        xoffLoop1 = start2;
        for(let x = 0; x < p.width; x++){
            // set color of the line
            p.stroke(250, 150, 209);
            p.strokeWeight(5);
            
            // randomly generate y
            let y = p.noise(xoffLoop1) * p.height;
            
            // draw point
            p.vertex(x, y);
            
            // increment noise
            xoffLoop1 += inc1;
            
            // end line 100 pixels from right
            if(x == p.width - 100) {
                p.endShape();     
                
                // draw snail
                p.push();
                p.translate(x + 15, y + 11);
                p.rotate(p.atan(x/y));
                p.scale(0.5);
                new snail(0, 0, '#FBB5E1').draw();
                p.scale(1);
                p.noFill();
                p.pop();
                
                break;
            }
        }
        
        // increment noise starting point
        start1 += inc;
        start2 += inc1;
    }

    p.keyPressed = function () {
        // if right arrow is pressed, increase increment of snail 1
        if(p.key === "ArrowRight") {
          inc += 0.005;
        }
        
        // if right arrow is pressed, decrease increment of snail 2
        if(p.key === "ArrowLeft") {
          inc -= 0.005;
        }
        
    }

    class snail {
        constructor(x, y, color) {
          this.x = x;
          this.y = y;
          this.color = color;
        }
        
        draw() {
            p.stroke('#5e503f')
            p.fill('#5e503f')
            p.strokeWeight(3);
            p.ellipse(this.x, this.y, 40, 40);
            p.stroke('#B3AF8F')
            p.ellipse(this.x, this.y, 30, 30);
            p.ellipse(this.x, this.y, 20, 20);
        
            p.stroke(this.color);
            p.fill(this.color);
            p.ellipse(this.x - 3, this.y + 15, 40 + 20, 40 - 25)
        
        
            p.push();
            p.translate(this.x + 20 + 7, this.y + 15 - 7);
            p.rotate(-p.PI/4);
            p.ellipse(0, 0, 20, 40 - 27);
            p.pop();
        }
    }
  }

  function sketchGradientingCircles(p) {
    // global variables
    let transitionFrames = Math.floor(Math.random() * 350) + 50;  // number of frames in between each transition
    let currentFrames = 0; // how many frames has passed since last transition
    let color = [0, 0, 0]; // current color
    let oldColor = [0, 0, 0]; // saving of old color if key is pressed
    let index = 1; // index of color array

    p.setup = function () {
        p.createCanvas(600, 600);
        p.background(255);
    }

    p.draw = function () {
        // draws a new random circle
        // code from Wes Modes (in class demonstration)
        // https://editor.p5js.org/wmodes/sketches/UfOHRlYqV
        let circSize = p.random(20,100);
        p.stroke(255);
        p.fill(color);
        p.ellipse(p.random(p.width), p.random(p.height), circSize, circSize);
    
        // checks if it is time to transiton colors
        if(currentFrames == transitionFrames) {
            // picks new transition time
            transitionFrames = p.int(p.random(50,400));
            // increments r, g, or b of the color
            color[index] += p.int(p.random(10,50));
            // resets current frames
            currentFrames = 0;
            // randomly chooses what index to change next
            index = p.int(p.random(0,3));
        } else {
            currentFrames++;
        }
    }

    p.keyPressed = function() {
        // changes color based on key pressed
        // based off of code from Wes Modes's in class demonstration
        // https://editor.p5js.org/wmodes/sketches/UfOHRlYqV

        // saves current color
        oldColor = color;

        // if r, g, or b, change color to the according one
        // otherwise change it to a random color
        if(p.key == "r") {
            color = [255, 0, 0];
        } else if (p.key == "g") {
            color = [0, 255, 0];
        } else if (p.key == "b") {
            color = [0, 0, 255];
        } else {
            color = [p.int(p.random(0,255)), p.int(p.random(0,255)), p.int(p.random(0,255))];
        }
    }

    p.keyReleased = function () {
        // on key release, put color back to oldColor
        color = oldColor;
    }

  }


// following sketch is based off of code from...
// M_6_1_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
function sketchSpaceDebris(p) {

    // An array with nodes
    let nodes = [];
    let nodeCount = 100;
    
    // array for stars
    let stars = [];
    
    // holds current sun and moon position
    let sunX = 7*p.width/8;
    let sunY = 8*p.height/9;
    
    let moonX = 1*p.width/8;
    let moonY = 6*p.height/9;
  
    p.setup = function() {
      p.createCanvas(600, 600);
      p.noStroke();
  
      // Create nodes
      createNodes(p.width / 2, p.height / 2);
      
      // init stars
      initStars();
      
      // intialize sun and moon positions
      sunX = 7*p.width/8;
      sunY = 8*p.height/9;
    
      moonX = 1*p.width/8;
      moonY = 6*p.height/9;
    };
  
    p.draw = function() {
      // reset background everytime
      p.background(0);
  
      // draws nodes
      p.noStroke();
      p.fill('#b29889');
      for (var i = 0; i < nodes.length; i++) {
        // Let all nodes repel each other
        nodes[i].attractNodes(nodes);
        // Apply velocity vector and update position
        nodes[i].update();
        
        // attract nodes to mouse and sun and moon
        nodes[i].attractMouse(p.mouseX, p.mouseY);
        nodes[i].attractObject(sunX, sunY, 125);
        nodes[i].attractObject(moonX, moonY, 50);
        
        // Draw node
        p.ellipse(nodes[i].x, nodes[i].y, 10, 10);
      }
      
      // draw stars
      drawStars();
    };
    
    // if mouse clicked, recreate nodes where mouse is
    // randomly move sun and moon
    p.mouseClicked = function() {
      p.background(0);
      moonX = p.random(0, p.width);
      moonY = p.random(0, p.height);
      sunX = p.random(0, p.width);
      sunY = p.random(0, p.height);
      createNodes(p.mouseX, p.mouseY);
    };
  
    // create 100 nodes
    function createNodes(x, y) {
      nodes = [];
      for (var i = 0; i < nodeCount; i++) {
        nodes.push(new Node(
          x + p.random(-1, 1),
          y + p.random(-1, 1),
          5,
          x - 5,
          5,
          y - 5
        ));
      }
    };
    
    // initialize 20 stars
    function initStars() {
      for (let i = 0; i < 20; i++) {
          stars[i] = new Star();
      }
    }
    
    // draw stars, sun, and moon
    function drawStars() {
      for (let i = 0; i < stars.length; i++) {
          stars[i].draw();
      }
      
      p.fill('#FFEC85');
      p.ellipse(sunX, sunY, 250, 250);
      p.fill('#FAE052');
      p.ellipse(sunX, sunY, 220, 220);
      p.fill('#F9D71C');
      p.ellipse(sunX, sunY, 180, 180);
      p.fill('#909090');
      p.ellipse(moonX, moonY, 50, 50);
      p.fill('#C5C4C4');
      p.ellipse(moonX, moonY, 40, 40);
    }
  
    // twinkling star code from Vivek Singh Negi
    // https://github.com/negiyosai/fractalforest
    // star class
    class Star {
      constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.size = p.random(0.25, 4);
          this.t = p.random(p.TAU);
          this.scale = 0;
      }
  
      // redraw star with different scale each time
      draw() {
          this.t += 0.1;
          this.scale = this.size + p.sin(this.t) * 2;
          p.noStroke();
          p.fill(255, 255, 255);
  
          p.ellipse(this.x, this.y, this.scale, this.scale);
      }
    }

    // node class
    // based off of code from 
    // Generative Gestaltung – Creative Coding im Web
    // ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
    // Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
    // with contributions by Joey Lee and Niels Poldervaart
    class Node {
        constructor(x, y, minX, maxX, minY, maxY) {
          p5.Vector.call(this, x, y, 0);
          this.minX = Number.MIN_VALUE || minX;
          this.maxX = Number.MAX_VALUE || maxX;
          this.minY = Number.MIN_VALUE || minY;
          this.maxY = Number.MAX_VALUE || maxY;
          this.radius = 100; // Radius of impact
          this.ramp = 2; // Influences the shape of the function
          this.strength = -1; // Strength: positive value attracts, negative value repels
          this.damping = 3;
          this.velocity = p.createVector();
          this.pVelocity = p.createVector();
          this.maxVelocity = 10;
        }
        
        attractNodes(nodeArray) {
          for (var i = 0; i < nodeArray.length; i++) {
            var otherNode = nodeArray[i];
            // Stop when empty
            if (otherNode === undefined) break;
            // Continue from the top when node is itself
            if (otherNode === this) continue;
      
            this.attract(otherNode);
          }
        }
        
        attract(otherNode) {
          var thisNodeVector = p.createVector(this.x, this.y);
          var otherNodeVector = p.createVector(otherNode.x, otherNode.y);
          var d = thisNodeVector.dist(otherNodeVector);
      
          if (d > 0 && d < this.radius) {
            var s = p.pow(d / this.radius, 1 / this.ramp);
            var f = s * 9 * this.strength * (1 / (s + 1) + ((s - 3) / 4)) / d;
            var df = thisNodeVector.sub(otherNodeVector);
            df.mult(f);
      
            otherNode.velocity.x += df.x;
            otherNode.velocity.y += df.y;
          }
        }
        
        attractMouse(mouseX, mouseY) {
          var thisNodeVector = p.createVector(this.x, this.y);
          var otherNodeVector = p.createVector(mouseX, mouseY);
          var d = thisNodeVector.dist(otherNodeVector);
      
          if (d > 0 && d < this.radius) {
            var s = p.pow(d / this.radius, 1 / this.ramp);
            var f = -0.5 * s * 9 * (1 / d);
            var df = thisNodeVector.sub(otherNodeVector);
            df.mult(f);
      
            this.velocity.x += df.x;
            this.velocity.y += df.y;
          }
        }
        
        attractObject(x, y, radius) {
          var thisNodeVector = p.createVector(this.x, this.y);
          var otherNodeVector = p.createVector(x, y);
          var d = thisNodeVector.dist(otherNodeVector);
      
          if (d > 0 && d < this.radius) {
            var s = p.pow(d / radius, 1 / this.ramp);
            var f = -0.5 * s * 9 * (1 / d);
            var df = thisNodeVector.sub(otherNodeVector);
            df.mult(f);
      
            this.velocity.x += df.x;
            this.velocity.y += df.y;
          }
        }
        
        update() {
          this.velocity.limit(this.maxVelocity);
      
          this.x += this.velocity.x;
          this.y += this.velocity.y;
      
          if (this.x < this.minX) {
            this.x = this.minX - (this.x - this.minX);
            this.velocity.x = -this.velocity.x;
          }
          if (this.x > this.maxX) {
            this.x = this.maxX - (this.x - this.maxX);
            this.velocity.x = -this.velocity.x;
          }
      
          if (this.y < this.minY) {
            this.y = this.minY - (this.y - this.minY);
            this.velocity.y = -this.velocity.y;
          }
          if (this.y > this.maxY) {
            this.y = this.maxY - (this.y - this.maxY);
            this.velocity.y = -this.velocity.y;
          }
      
          this.velocity.mult(1 - this.damping);
        }
      }
  };

  new p5(sketchSnailRace, 'snailRaceContainer');
  new p5(sketchGradientingCircles, 'gradientingCirclesContainer');
  new p5(sketchSpaceDebris, 'spaceDebrisContainer');