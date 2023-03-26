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
    phone: String,
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
    user: JSON,
    dish: JSON,
    date: Date,
});
const ORDER = mongoose.model("Order",orderSchema);

// ---------- GET ----------
app.get("/",(req,res)=> {
    res.render("homepage");
});

app.get("/admin/:password", async(req,res)=> {
    try {
        if(md5(req.params.password) === "7028aec409b4f7edb040a6e07607783d") {
            res.render("admin-dashboard");
        }
        else {
            res.send("Incorrect password.");
        }
    }
    catch(error) {
        res.send(error);
    }
});

app.get("/add-dish", async (req,res)=> {
    res.render("add-dish");
});

app.get("/view-orders", async(req,res)=> {
    const orders = await ORDER.find({});
    res.render("orders",{
        ordersList: orders
    });
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
            customerAddress: curr_customer.address,
            customerContact: curr_customer.phone,
            userID: curr_customer.ID,
            dishID: curr_dish.ID
        });
    }
    catch(error) {
        res.send(error);
    }
});

app.get("/update-user/:user_ID", async(req,res)=> {
    try {
        const tempUser = await USER.findOne({ID: Number(req.params.user_ID)});
        res.render("update-user",{
            NAME: tempUser.name,
            userID: tempUser.ID
        });
    }
    catch(error) {
        res.send(error);
    }
});

app.get("/placeOrder/:userID/:dishID", async(req,res)=> {
    try {
        const curr_user = await USER.findOne({ID: Number(req.params.userID)});
        const curr_item = await FOOD.findOne({ID: Number(req.params.dishID)});
        const curr_count = await ORDER.countDocuments({});
        const curr_order = new ORDER({
            ID: curr_count + 1,
            user: curr_user,
            dish: curr_item,
            date: new Date()
        });
        await curr_order.save();
        console.log(curr_order);
        res.send("Order placed successfully.");
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
                userID: tempUser.ID,
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

app.post("/update-user", async(req,res)=> {
    try {
        console.log("UPDATE request received.");
        await USER.updateOne(
            {ID: Number(req.body.newID)},
            {
                name: req.body.newName,
                phone: req.body.newPhone,
                address: req.body.newAddress,
                password: md5(req.body.newPassword)
            }
        );
        res.send("Details updated successfully.");
    }
    catch(error) {
        console.log(error);
        res.send(error);
    }
});

app.listen(3000,()=> {
    console.log("Server is running on port 3000.");
});