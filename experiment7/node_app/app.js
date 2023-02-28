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
m.messages.forEach(function(p){
    p.sender_name= "REDACTED";
    if(p.content){
        if(p.content.includes("â")) {
            p.content.replace("â", '\'');
        }
        if(p.content.includes("â")) {
            p.content.replace("â", '\'');
        }
    }
    if(p.reactions){
        p.reactions.forEach(function(q){
            q.actor = "REDACTED";
        });
    }
});
fs.writeFileSync(name, JSON.stringify(m));