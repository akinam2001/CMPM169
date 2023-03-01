// Author: Anika Mahajan
// Date: 03/02/2023
// Purpose: Experiment 7 - Data Visualization
// for CMPM 169 taught by Wes Modes at UCSC Winter 2023

// Code Attributions
// basis for word cloud: https://d3-graph-gallery.com/graph/wordcloud_basic.html
// basis for filtering words: https://observablehq.com/@d3/word-cloud
// basis for filtering array and counting appearances of each item: https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript

// importing JSON
import messages from './../json/cardifferent.js';

let messageString = "";
let stopwords = new Set("i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall,it'll".split(","))

// regex's
let numRegex = /\d+/g;
let letterRegex = /^[a-zA-Z]$/g;

// loops through messages and filters and adds to one giant string
messages.messages.forEach(function (m) {
  if (m.content) {
    if (!m.content.includes(".com")) {
      m.content = m.content.replace("/", " ");
      if (m.content.includes("y'all")) {
        m.content = m.content.replace("y'all", "yall");
      }
      if (m.content.includes("ya'll")) {
        m.content = m.content.replace("ya'll", "yall");
      }
      if (m.content.includes("/")) {
        m.content = m.content.replace("/", "");
      }
      messageString += m.content + " ";
    }
  }

});

// giant string is split by space and then filtered again
let messageWords = messageString.split(/[\s.]+/g)
  .map(w => w.replace(/^[“‘"\-—()\[\]{}*#|]+/g, ""))
  .map(w => w.replace(/[;:.!?()\[\]{},"'’”\-—]+$/g, ""))
  .map(w => w.replace(/['’]s$/g, ""))
  .map(w => w.substring(0, 30))
  .map(w => w.toLowerCase())
  .filter(w => w && !stopwords.has(w))
  .filter(w => !w.includes("ð") && !w.includes("\u009f") && !w.includes("\u0098") && !w.includes("\u008a") && !w.includes("â"))
  .filter(w => !numRegex.test(w))
  .map(w => w.replace(/\d+/g, "REMOVE!!!")).filter(w => !w.includes("REMOVE!!!"))
  .filter(w => !w.includes("^"))
  .filter(w => !letterRegex.test(w));

// turn array into an object where keys are word and values are how many times that word appears
const counts = {};
messageWords.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

// set the dimensions and margins of the graph
let margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1200 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg;
let layout;

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' variable above
function draw(words) {
  svg
    .append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function (d) { return d.size + "px"; })
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function (d) { return d.text; });
}


function main() {
  // filters words that appear less than 7 times and are only 1 letter
  for (const key in counts) {
    if (counts[key] < 7 || key.length < 2) {
      delete counts[key];
    }
  }

  // creates space for word cloud on page
  svg = d3.select("#wordCloud").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .style("font-family", "Quicksand")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // font size is based on how many counts there are of the word
  layout = d3.layout.cloud()
    .size([width, height])
    .words(Object.keys(counts).map(function (d) { return { text: d, size: counts[d] }; }))
    .padding(4.5)
    .fontSize(function (d) { return Math.sqrt(d.size) * 2; })
    .rotate(function () { return ~~(Math.random() * 4) * 30 - 60; })
    .on("end", draw);
  layout.start();
}

// run code on load
window.onload = function () {
  main();
};

// run code when button is clicked
document.getElementById("redraw").onclick = function() {
  d3.select("svg").remove();
	main();
};