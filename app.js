require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// To parse data from form to server
app.use(bodyParser.urlencoded({ extended: true }));

// To user the custom css present in public folder
app.use(express.static("public"));

// To enable templating using ejs
app.set("view engine", "ejs");

mongoose.connect(process.env.ADMIN_ID);
// mongodb+srv://pavanprabhakar628:<password>@cluster0.xohbmrg.mongodb.net/?retryWrites=true&w=majority

const itemsSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to Do This!",
});

const item2 = new Item({
  name: "Press + button to add new things to do",
});

const item3 = new Item({
  name: "Check the box to delete a thing you have done",
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

// Handling get request to the home route
app.get("/", (req, res) => {
  Item.find({})
    .then((items) => {
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { listType: "Today", items: items });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/list/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName })
    .then((foundList) => {
      if (foundList) {
        // Show the list which is present
        res.render("list", {
          listType: foundList.name,
          items: foundList.items,
        });
      } else {
        // Insert the list to db
        const list = new List({
          name: listName,
          items: [],
        });
        list.save();
        res.redirect("/list/" + listName);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const newItem = req.body.toDo;
  const listName = req.body.list.trim();
  const item = new Item({
    name: newItem,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/list/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// Handling request when check box is ticked for deletion
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkedItem.trim(); // Trim used to remove the unwanted spaces in object id which causes bug
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then((result) => {
        res.redirect("/list/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/new", (req, res) => {
  const newList = req.body.listName;
  res.redirect("/list/" + newList);
});

app.get("/newDoThis", (req, res) => {
  List.distinct("name")
    .then((results) => {
      res.render("new", { createdList: results });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
