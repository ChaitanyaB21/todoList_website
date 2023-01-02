const express = require("express");
const mongoose = require("mongoose");
const app = express();
const currDate = require(__dirname + "/Date.js")

const bodyParser = require("body-parser");
// var itemsList = ['Start your playstation' , 'Open the game' , 'Wait for the boys to be online'];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

// Conecting to mongoose local server , name of the database is todolistDB

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");


const itemSchema = new mongoose.Schema(
    { name: String }
)

// Creating a new Collection called "items"
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: 'Start your playstation'
})

const item2 = new Item({
    name: 'Open the game'
})

const item3 = new Item({
    name: 'Wait for the boys to be online'
})

const defaultItems = [item1, item2, item3];

// Inserting all the items in the server
// Item.insertMany(defaultItems , function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("All inserts are saved");
//     }
// })


// console.log(itemsList);

// mongoose.connection.close()



// ++++++++++++++++++++++++ Mongo code ends +++++++++++++++++++++++++++++++++

app.set("view engine", "ejs");


app.get("/", function (req, res) {
    day = currDate();

    Item.find({}, function (err, foundItem) {
        // console.log(foundItem);

        if (foundItem.length === 0) {
            // Inserting all the items in the server
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("All inserts are saved");
                }
            })

            res.redirect("/")
        }else{
            res.render("list", { kindofDay: day, newListItem: foundItem });
        }

        
    });


})

app.post("/", function (req, res) {
    // console.log(req.body.newEntry);
    var item = req.body.newEntry;
    itemsList.push(item);
    res.redirect("/");
})



app.listen(3000, function () {
    console.log('Server is flying on port 3000');
})