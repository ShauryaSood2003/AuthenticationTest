const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require('dotenv').config();
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
});

const schemaUser = new mongoose.Schema({
  email: String,
  password: String
});


schemaUser.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });

const User = new mongoose.model("user", schemaUser);



app.get("/", (req, res) => {
  res.render("home");
});


app.route("/login")
  .get((req, res) => {
    res.render("login")
  })

  .post((req, res) => {
    User.findOne({
      email: req.body.username
    }).then((found) => {
      if (found) {
        if(found.password === req.body.password){
          res.render("secrets");
        }else{
          res.send("<h1>Wrong password</h1>")
        }
      }else{
        res.send("<h1>No such email found</h1>");
      }
    }).catch((err) => {
      console.log(err);
    });

  });

app.route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {

    const newItem = new User({
      email: req.body.username,
      password: req.body.password
    });

    newItem.save().then((found) => {
      if (found) {
        res.render("secrets");
      }
    }).catch((err) => {
      console.log(err);
    });


  });

app.listen(3000, () => {
  console.log("Server running at port 3000");
})
