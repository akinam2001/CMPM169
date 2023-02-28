// // project.js - purpose and description here
// // Author: Your Name
// // Date:

// // NOTE: This is how we might start a basic JavaaScript OOP project

// // Constants - User-servicable parts
// // In a longer project I like to put these in a separate file

// // define a class
// function WordCloud(text, {
//   size = group => group.length, // Given a grouping of words, returns the size factor for that word
//   word = d => d, // Given an item of the data array, returns the word
//   marginTop = 0, // top margin, in pixels
//   marginRight = 0, // right margin, in pixels
//   marginBottom = 0, // bottom margin, in pixels
//   marginLeft = 0, // left margin, in pixels
//   width = 640, // outer width, in pixels
//   height = 400, // outer height, in pixels
//   maxWords = 250, // maximum number of words to extract from the text
//   fontFamily = "sans-serif", // font family
//   fontScale = 15, // base font size
//   padding = 0, // amount of padding between the words (in pixels)
//   rotate = 0, // a constant or function to rotate the words
//   invalidation // when this promise resolves, stop the simulation
// } = {}) {
//   const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  
//   const data = d3.rollups(words, size, w => w)
//     .sort(([, a], [, b]) => d3.descending(a, b))
//     .slice(0, maxWords)
//     .map(([key, size]) => ({text: word(key), size}));
  
//   const svg = d3.create("svg")
//       .attr("viewBox", [0, 0, width, height])
//       .attr("width", width)
//       .attr("font-family", fontFamily)
//       .attr("text-anchor", "middle")
//       .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

//   const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);

//   const cloud = d3Cloud()
//       .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
//       .words(data)
//       .padding(padding)
//       .rotate(rotate)
//       .font(fontFamily)
//       .fontSize(d => Math.sqrt(d.size) * fontScale)
//       .on("word", ({size, x, y, rotate, text}) => {
//         g.append("text")
//             .attr("font-size", size)
//             .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
//             .text(text);
//       });

//   cloud.start();
//   invalidation && invalidation.then(() => cloud.stop());
//   return svg.node();
// }

// function main() {

//   console.log("here");

//   WordCloud("Hello, World! This is a small cloud for your enjoyment", {
//     width: 250,
//     height: 100,
//     size: () => .3 + Math.random(),
//     rotate: () => (~~(Math.random() * 6) - 3) * 30
//   });
// }



// // let's get this party started - uncomment me
// main();

// List of words
let myWords = ["Hello", "Everyday", "How", "Are", "You", "Today", "It", "Is", "A", "Lovely", "Day", "I", "Love", "Coding", "In", "My", "Van", "Mate"]

// set the dimensions and margins of the graph
let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
let layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d}; }))
  .padding(10)
  .fontSize(60)
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' variable above
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

