// sketch.js - purpose and description here
// Author: Your Name
// Date:

function nightSkySketch(p) {
  
    // for star generation
    // code by Gabriela Voll from "UniverseGen"
    on = true; //universe gen on at starts
    MAX = 20000; //max num stars
    MAXD = 4;  
    MAXDB = 9;
    
    stars = [MAX];
    i = 0;
    
    lines = [];
    cScale = 6;
    angle = 0;
    
    p.setup = function() {
      w = p.min(p.windowWidth - 100, p.windowHeight - 100);
      p.createCanvas(w*2, w);
      p.background(t = 0, 0, 0);
      cScale = 6;
  }
  
    p.draw = function() {
      p.background(0, 0, 0);
      // draws moon
      // code by Andrea Diotallevi from "Moonlight"
      n = p.noise;
      r = w / 4;
      // makes more lines towards the left --> merge radius becomes smaller
      // higher the number more variability
      a = n(t + 50) * r;
      // also controls merge radius 
      b = n(w) * r;
      // controls angle and how much of moon lights up
      c = n(t) * cScale;
      d = n(t++ + 60) * 6;
      p.stroke(w, 30);
      // p.line(p.cos(c) * a + r, p.sin(c) * a + r, p.cos(d) * b + r, p.sin(d) * b + r);
      lines.push([[p.cos(c) * a + r, p.sin(c) * a + r],[p.cos(d) * b + r, p.sin(d) * b + r]])
      
      // draws stars
      // code by Gabriela Voll from "UniverseGen"
    
      // randomly pick x and y
      co = p.createVector(p.random(-w*3,w*3),p.random(-w*3,w*3));
      
      // every 100 stars have a bigger diameter
      if(i % 100 == 0){
        m = MAXDB; 
      } else {
        m = MAXD; 
      }
      // choose random diametr
      dia = p.random(0,m);
      
      // keep picking random diameter until star can be placed
      while(TestStars(co, dia, i) == false){
         co = p.createVector(p.random(-w*3,w*3),p.random(-w*3,w*3)); 
         if(i % 100 == 0){
           m = MAXDB;
         } else {
           m = MAXD;
         }
         dia = p.random(0,m);
      }
      
      // create new star and save it
      f = new Star(co, dia);
      stars[i] = f; 
      for (x = 0; x < i; x++) {
        p.stroke(w, 30);
        p.line(
          lines[x][0][0],
          lines[x][0][1],
          lines[x][1][0],
          lines[x][1][1]
        );
        
        p.push();
        p.translate(p.width/2, p.height);
        p.rotate(angle);
        stars[x].draw();
        p.pop();
      }
      
      i++;
      
      // controls how much of moon gets filled
      if(i % 100 == 0) {
        cScale += 0.1;
      }
      
      angle += 0.0005;
    }
    
    // class for star
    // code by Gabriela Voll from "UniverseGen"
    class Star {
       constructor(coor, d) {
         this.coor = coor; 
         this.diameter = d; 
       } 
  
      draw() {
        p.noStroke(); 
        p.fill(255); 
        p.ellipse(this.coor.x, this.coor.y, this.diameter, this.diameter);  
       }
    }
    
    // test if star can be placed
    // code by Gabriela Voll from "UniverseGen"
    function TestStars(coor, d, current){
      // check if it is in the moon
      if((coor.x > 70 && coor.x < w/2.5) && (coor.y > 70 && coor.y < w/2.5)) {
        // console.log("reach")
        // console.log("coorx: " + coor.x + " coory: " + coor.y)
        return false;
      }
      if(current > 0){
        for(a = 0; a < current; a++){
          // check if it touches any other star
          if(p.dist(coor.x,coor.y, stars[a].coor.x, stars[a].coor.y) < ((d + stars[a].diameter)/2) ){
            return false; // if not
          }
        }
      }
     return true; //if possible  
    }
  }

new p5(nightSkySketch, 'nightSkyContainer');