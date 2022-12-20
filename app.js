const express = require("express");
const app = express();
const currDate = require(__dirname + "/Date.js")

const bodyParser = require("body-parser");
var itemsList = ['Start your playstation' , 'Open the game' , 'Wait for the boys to be online'];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("Public"));

app.set("view engine" , "ejs");


app.get("/" , function(req , res){
    day = currDate();

    res.render("list",{kindofDay: day ,newListItem : itemsList });
})

app.post("/" , function(req,res){
    // console.log(req.body.newEntry);
    var item = req.body.newEntry ;
    itemsList.push(item);
    res.redirect("/");
})



app.listen(3000 , function(){
    console.log('Server is flying on port 3000');
})