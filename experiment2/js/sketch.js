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

  new p5(sketchSnailRace, 'snailRaceContainer');
  new p5(sketchGradientingCircles, 'gradientingCirclesContainer');