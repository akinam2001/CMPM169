// sketch.js - series of experiments for Experiment 3 for CMPM 169
// Author: Anika Mahajan
// Date: 01/30/2023


// code based on Gabriela Voll's "Universe Gen" for star generation
// and Andrea Diotallevi's "Moonlight" for the moon
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

    p.setup = function () {
        w = p.min(p.windowWidth - 100, p.windowHeight - 100);
        p.createCanvas(w * 2, w);
        p.background(t = 0, 0, 0);
        cScale = 6;
    }

    p.draw = function () {
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
        lines.push([[p.cos(c) * a + r, p.sin(c) * a + r], [p.cos(d) * b + r, p.sin(d) * b + r]])

        // draws stars
        // code by Gabriela Voll from "UniverseGen"

        // randomly pick x and y
        co = p.createVector(p.random(-w * 5, w * 5), p.random(-w * 5, w * 5));

        // every 100 stars have a bigger diameter
        if (i % 100 == 0) {
            m = MAXDB;
        } else {
            m = MAXD;
        }
        // choose random diametr
        dia = p.random(0, m);

        // keep picking random diameter until star can be placed
        while (TestStars(co, dia, i) == false) {
            co = p.createVector(p.random(-w * 5, w * 5), p.random(-w * 5, w * 5));
            if (i % 100 == 0) {
                m = MAXDB;
            } else {
                m = MAXD;
            }
            dia = p.random(0, m);
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
            p.translate(p.width / 2, p.height);
            p.rotate(angle);
            stars[x].draw();
            p.pop();
        }

        i++;

        // controls how much of moon gets filled
        if (i % 100 == 0) {
            cScale += 0.02;
        }

        angle += 0.001;
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
    function TestStars(coor, d, current) {
        // rotating makes irrelevant
        //   // check if it is in the moon
        //   if((coor.x > 70 && coor.x < w/2.5) && (coor.y > 70 && coor.y < w/2.5)) {
        //     return false;
        //   }
        if (current > 0) {
            for (a = 0; a < current; a++) {
                // check if it touches any other star
                if (p.dist(coor.x, coor.y, stars[a].coor.x, stars[a].coor.y) < ((d + stars[a].diameter) / 2)) {
                    return false; // if not
                }
            }
        }
        return true; //if possible  
    }
}

// L-System Code based on Paul Wheeler's "L-System Example"
// and fractal tree code based on Wes Modes' CMPM 169 lecture
function fractalTreeSketch(p) {
    //   L-System Code from Paul Wheeler's "L-System Example"
    /*
      https://en.wikipedia.org/wiki/L-system#Example_7:_Fractal_plant
      
      variables : X F
      constants : + − [ ]
      start  : X
      rules  : (X → F+[[X]-X]-F[-FX]+X), (F → FF)
      angle  : 25°
      
      F means "draw forward", − means "turn right 25°",
      and + means "turn left 25°". X does not
      correspond to any drawing action and is used to
      control the evolution of the curve. The square
      bracket "[" corresponds to saving the current
      values for position and angle, which are restored
      when the corresponding "]" is executed.
    */

    const X = 0, Y = 1;

    const rules = {
        // X: "F+[[X]-X]-F[-FX]+X",
        // Here's a much simpler alternative:
        X: "F+[X-FX]-[X+FX]-[X+FX]",
        F: "FF",

        // This varient gets really complex at iteration 6
        //"X": "F",
        //"F": "FF-[-F+F]+[+F-F]"
    };

    const initialAngle = 65;
    const turnAngle = 25;

    let scale = 128;
    let instructions = rules["X"];
    let iterations = 1;

    let iterator;

    let angle;
    let branchLength;

    p.setup = function () {
        p.createCanvas(p.windowWidth - 100, p.windowHeight - 100);
        p.background("#66999b");
        p.angleMode(p.DEGREES);
        p.textSize(18);
        p.textAlign(p.LEFT, p.TOP);
        p.fill("#19381F");

        p.text(
            `iteration ${iterations}${iterations == 8 ? " (Max)" : ""}: ${compact(
                instructions
            )}`,
            10,
            10
        );
        iterator = progressiveExecute();

        angle = 25;
        p.stroke("#5A352A");
        p.translate(p.width / 2, p.height);
        branchLength = p.height / 4;
        branch(p.height / 4);
    };

    p.draw = function () {
        p.push();
        // Position 0, 0 at the bottom center
        p.translate(p.width / 2, p.height);
        // Make positive in the y axis up from the bottom
        p.scale(1, -1);

        let val = iterator.next();
        if (val.value) {
            p.noLoop();
        }

        p.pop();
    };

    function* progressiveExecute() {
        let states = [];
        let state = { position: [0, 0], angle: initialAngle };

        for (let i = 0; i < instructions.length; i++) {
            state = executeInstruction(instructions[i], state, states);
            if (instructions[i] === "F" && instructions[i + 1] !== "F") {
                // Only yield when we've just finished drawing a line
                yield false;
            }
        }

        yield true;
    }

    function executeInstruction(instruction, state, states) {
        switch (instruction) {
            case "F":
                let newPos = [
                    state.position[X] + p.cos(state.angle) * scale,
                    state.position[Y] + p.sin(state.angle) * scale,
                ];

                p.line(state.position[X], state.position[Y], newPos[X], newPos[Y]);
                return { ...state, position: newPos };
            case "[":
                p.push();
                // p.stroke("#ff000077");
                // p.strokeWeight(3);
                // p.point(state.position[X], state.position[Y]);
                p.pop();
                states.push(state);
                break;
            case "]":
                p.push();
                // p.stroke("#00800077");
                // p.strokeWeight(3);
                // p.point(state.position[X], state.position[Y]);
                p.pop();
                return states.pop();
            case "+":
                return { ...state, angle: state.angle + turnAngle };
            case "-":
                return { ...state, angle: state.angle - turnAngle };
        }

        return state;
    }

    p.keyPressed = function () {
        if (iterations < 5) {
            iterations++;
            let newInstructions = "";
            for (let i = 0; i < instructions.length; i++) {
                let sub = rules[instructions[i]];
                if (sub) {
                    newInstructions += sub;
                } else {
                    newInstructions += instructions[i];
                }
            }

            instructions = newInstructions;
            scale /= 2;
            p.background("#66999b");
            p.text(
                `iteration ${iterations}${iterations == 8 ? " (Max)" : ""}: ${compact(
                    instructions
                )}`,
                10,
                10
            );
            iterator = progressiveExecute();
            p.loop();

            branchLength = branchLength / 3;
            p.translate(p.width / 2, p.height);
            branch(p.height / 4);
        }
    };

    function compact(instructions) {
        let str = "";
        let fs = 0;
        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i] == "F") {
                fs++;
            } else {
                if (fs > 1) {
                    str += `F(${fs})`;
                } else if (fs > 0) {
                    str += "F";
                }

                fs = 0;
                str += instructions[i];
            }
        }

        return str;
    }

    // from lecture
    function branch(len) {
        p.stroke("#5A352A");
        p.push();
        p.rotate(-25);
        p.line(0, 0, 0, -len);

        p.translate(0, -len);
        if (len > branchLength) {
            p.rotate(angle);
            branch(len * 0.67);
            p.rotate(-angle);
            // recursively call branch
            branch(len * 0.67);
        }
        p.pop()

    }

}

new p5(nightSkySketch, 'nightSkyContainer');
new p5(fractalTreeSketch, 'fractalTreeContainer');