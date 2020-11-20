require('dotenv').config();
import express from 'express';
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

// script to add new admin user to system

const app = express();
app.use(session({
    secret: process.env.MY_ENCRYPT,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/telDB", {useUnifiedTopology: true,useNewUrlParser: true})
.then(() => console.log('DB Connected!'));
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
    username: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add admin "hardcoded"
User.register({ username:"admin"}, "pass123!", function(err){
                    if(err)
                        console.log("Error while adding admin...")
                    else
                        console.log("Admin added successfully")
                })