//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
const coo = console.log;
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true,useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const User  = new mongoose.model("user",userSchema);
app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newuser = new User({
      email:req.body.username,
      password:hash
    });
    newuser.save((err) =>{
      if(!err){
        res.render("secrets");
      }else{
        coo(err);
          res.redirect("/");
      }
    });
});

});

app.post("/login",function(req,res) {
  var email = req.body.username;
  var password = req.body.password;
  User.findOne({email:email},function(err,found){
    if(!err){
      if(found){
        bcrypt.compare(password, found.password, function(err, result) {
          if(result===true){
            res.render("secrets");
          }else{res.redirect("/login");}
          });
        }else{res.redirect("/login");}
    }else{
      coo(err);
    }
  });
});

app.listen(3000,() =>{
  coo("server started on port 3000!!");
});
