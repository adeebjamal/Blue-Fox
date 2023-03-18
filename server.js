const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");
const nodemailer = require("nodemailer");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static("public"));

app.get("/",(req,res)=> {
    res.render("homepage");
});

app.post("/signup",(req,res)=> {
    
});

app.listen(3000,()=> {
    console.log("Server is running on port 3000.");
});