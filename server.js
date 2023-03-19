const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static("public"));

mongoose.set("strictQuery",false);
mongoose.connect("mongodb://127.0.0.1:27017/Blue-Fox");

// ---------- SCHEMAS ----------
const userSchema = new mongoose.Schema({
    ID: Number,
    name: String,
    email: String,
    password: String,
    address: String,
    orders: []
});
const USER = mongoose.model("User",userSchema);

const foodSchema = new mongoose.Schema({
    ID: Number,
    name: String,
    description: String,
    price: Number,
    imageUrl: String
});
const FOOD = mongoose.model("food",foodSchema);

// ---------- GET ----------
app.get("/",(req,res)=> {
    res.render("homepage");
});


// ---------- POST ----------
app.post("/signup",async (req,res)=> {
    try {
        const curr_count = await USER.countDocuments({});
        const tempUser = new USER({
            ID: curr_count + 1,
            name: req.body.newName,
            email: req.body.newEmail,
            password: md5(req.body.newPassword),
            address: req.body.password,
            orders: []
        });
        await tempUser.save();
        res.send("Signup Successful.");
    }
    catch(error) {
        res.send(error);
    }
});

app.post("/login", async (req,res)=> {
    try {
        const tempUser = await USER.findOne({email: req.body.userEmail});
        if(tempUser.password === md5(req.body.userPassword)) {
            res.render("user-dashboard",{
                NAME: tempUser.name
            });
        }
        else {
            res.render("homepage");
        }
    }
    catch(error) {
        res.render("homepage");
    }
});

app.listen(3000,()=> {
    console.log("Server is running on port 3000.");
});