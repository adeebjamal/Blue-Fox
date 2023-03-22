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
    imageUrl: String        // https://drive.google.com/uc?id= + imageID
});
const FOOD = mongoose.model("food",foodSchema);

const orderSchema = new mongoose.Schema({
    ID: Number,
    date: Date,
    address: String
});
const ORDER = mongoose.model("Order",orderSchema);
// ---------- GET ----------
app.get("/",(req,res)=> {
    res.render("homepage");
});

app.get("/add-dish", async (req,res)=> {
    res.render("add-dish");
});

app.get("/purchase/:foodID/:customerID", async (req,res)=> {
    try {
        const curr_customer = await USER.findOne({ID : Number(req.params.customerID)});
        const curr_dish = await FOOD.findOne({ID : Number(req.params.foodID)});
        res.render("checkout",{
            imgLink: curr_dish.imageUrl,
            dishName: curr_dish.name,
            dishDescription: curr_dish.description,
            dishPrice: curr_dish.price,
            customerName: curr_customer.name,
            customerAddress: curr_customer.address
        });
    }
    catch(error) {
        res.send(error);
    }
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
            const dishes = await FOOD.find();
            res.render("user-dashboard",{
                NAME: tempUser.name,
                dishList: dishes,
                customerID: tempUser.ID
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

app.post("/add-dish", async (req,res)=> {
    if(md5(req.body.key) === "7028aec409b4f7edb040a6e07607783d") {
        try {
            const food_count = await FOOD.countDocuments({});
            const tempFood = new FOOD({
                ID: food_count + 1,
                name: req.body.newName,
                description: req.body.newDescription,
                price: Number(req.body.newPrice),
                imageUrl: "https://drive.google.com/uc?id=" + req.body.newID
            });
            await tempFood.save();
            res.send("Dish added successfully.");
        }
        catch(error) {
            res.render("add-dish");
        }
    }
    else {
        res.render("Incorrect key. Try again.");
    }
});

app.listen(3000,()=> {
    console.log("Server is running on port 3000.");
});