require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://admin:admin@localhost:27017/test");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/login", function (req, res) {
    User.findOne({
        email: req.body.username
    })
        .then((result) => {
            if (result) {
                if (req.body.password === result.password) {
                    console.log(result);
                    res.render("secrets");
                } else {
                    res.render("login");
                }
            } else {
                res.render("login");
            }
        })
        .catch((err) => {
            res.render("login");
        })
});

app.post("/register", function (req, res) {
    console.log(req.body.username);
    console.log(req.body.password);
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
        .then((result) => {
            res.render("secrets");
        })
        .catch((err) => {
            res.render(err);
        });
});

app.listen(3000, function () {
    console.log("App started on port 3000");
});