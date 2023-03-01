// Author: Anika Mahajan
// Date: 03/02/2023
// Purpose: Experiment 7 - Data Visualization & Networks
// for CMPM 169 taught by Wes Modes at UCSC Winter 2023

// Code Attributions
// set up for node app: https://www.geeksforgeeks.org/how-to-create-and-run-node-js-project-in-vs-code-editor/

// Requiring module
const express = require('express');
 
// Creating express object
const app = express();
 
// Handling GET request
app.get('/', (req, res) => {
    res.send('A simple Node App is '
        + 'running on this server')
    res.end()
})
 
// Port Number
const PORT = process.env.PORT ||1200;
 
// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));

  fs = require('fs');
let name = '../json/cardifferent.json';
let m = JSON.parse(fs.readFileSync(name).toString());

// edits the json file permanently
m.messages.forEach(function(p){
    // takes out all names
    p.sender_name = "REDACTED";
    if(p.users) {
        p.users.forEach(function(q){
            q.name = "REDACTED";
        });
    }
    if(p.reactions){
        p.reactions.forEach(function(q){
            q.actor = "REDACTED";
        });
    }

    // removes any @ signs
    if(p.content) {
        if(p.content.includes("@")) {
            console.log("reach");
            p.content = p.content.replace("@", "");
        }
    }
    
});
fs.writeFileSync(name, JSON.stringify(m));