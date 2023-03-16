const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "1940509@sliet.ac.in",
        pass: "hostel@07"
    }
});

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
    const mailOptions = {
        from: "1940509@sliet.ac.in",
        to: req.body.newEmail,
        subject: "OTP verification",
        text: `Hello There. Thank you for signing up to the Blue Fox. Here is your OTP ${Math.floor(100000 + Math.random() * 900000)}`
    }
    transporter.sendMail(mailOptions,(error,info)=> {
        if(error) {
            res.send(error);
        }
        else {
            res.send("Check your mail box for OTP.");
        }
    });
});

app.listen(3000,()=> {
    console.log("Server is running on port 3000.");
});


// Math.floor(100000 + Math.random() * 900000);