const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
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


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);



// ++++++++++++++++++++++++ Mongo code ends +++++++++++++++++++++++++++++++++

app.set("view engine", "ejs");


app.get("/", function (req, res) {
    day = currDate();

    Item.find({}, function (err, foundItem) {   /* To get the list of elements of the dataset */
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
        } else {
            res.render("list", { kindofDay: "Today",  newListItem: foundItem });
        }


    });


})

app.post("/", function (req, res) {
    // console.log(req.body.newEntry);
    var itemName = req.body.newEntry;
    const listName = req.body.item ;

    const itemNew = new Item({
        name: itemName
    })

    if (listName === "Today"){
        itemNew.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName} , function(err , result){
            result.items.push(itemNew);
            result.save();
            res.redirect("/" + listName);    
        })
    }



    // Entering new value in the local database
    Item.insertMany([itemNew], function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("New item has been added in the database");
        }
    })

    
})

// Using Express Route parameter to create dynamic webpages 

app.get('/:typeOfList', function (req, res) {
    const customListName = _.capitalize(req.params.typeOfList);

    List.find({ name: customListName }, function (err, results) {
        // console.log(results[0].items);
        if (results.length === 0) {
            // Create a new list
            const list = new List({
                name: customListName ,
                items : defaultItems
            });

            list.save();
            res.redirect("/" + customListName) ;
            // res.render("list" , {kindofDay: results[0].name, newListItem: results[0].items }) ;
        } else {
            // Show the existing list

            res.render("list" , {kindofDay: results[0].name, newListItem: results[0].items }) ;
        }

        
    })
   

    
})

//  Post method for checkbox click

app.post("/delete", function (req, res) {
    let checkedItem = req.body.checkBox;

    Item.findByIdAndRemove(checkedItem, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Checked Item has been removed");
            res.redirect("/");
        }
    })


})



app.listen(3000, function () {
    console.log('Server is flying on port 3000');
})