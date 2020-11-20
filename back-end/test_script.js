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

const formalReport = require("./schemas/FormalReport");
const User = require("./schemas/User");
const Incident = require("./schemas/Incident");
const Agency = require("./schemas/Agency");


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// -----------------------------------------------------------

// get a specific user
async function get_some_user(pos){
    const users = await User.find();
    if(users.length > 0)
        return users[pos]   
}

// get a specific incident
async function get_some_incident(pos){
    const incidents = await Incident.find();
    if(incidents.length > 0)
        return incidents[pos]   
}

// get a specific agency
async function get_some_agency(pos){
    const agencies = await Agency.find();
    if(agencies.length > 0)
        return agencies[pos]   
}

//random int number
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// random date
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleString();
  }
  
  function getUnits() {
    let arr = [2,4,6]
    return arr[ Math.floor(Math.random() * Math.floor(3)) ];
    }

async function populate_freports(){
    let user = await get_some_user(1);
    let incident = await get_some_incident(0);
    let agency = await get_some_agency(0);

    const loop_num = 10;
    for(let i=0; i<loop_num; i++){
        let title = "Title " + i;
        let userId = user._id;
        let incidentId = incident._id;
        let agencyId = agency._id;
        let date = randomDate(new Date(2019, 1, 24, 10, 33, 30, 0),new Date(2020, 12, 24, 10, 33, 30, 0));
        let injuries = getRandomInt(10);
        let casualties = getRandomInt(10);
        let unitsDeployed = getUnits();
        let comments = title;
        console.log(unitsDeployed);
        await formalReport.insertMany({title:title, userId:userId, incidentId:incidentId, agencyId:agencyId, date:date, isOpen:false, comments:comments, injuries:injuries, casualties:casualties, unitsDeployed:unitsDeployed});
    }
}
populate_freports()