require('dotenv').config();
import express from 'express';
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

// script to populate database
// to be deleted!!

const mock_agencies = [
    {
        "name": "Police",
        "address": "Dromos1"
    },
    {
        "name": "Fire Department",
        "address": "Dromos2"
    },{
        "name": "Hospital",
        "address": "Dromos3"
    },{
        "name": "Navy",
        "address": "Dromos4"
    },
];
const mock_users = [
    {
        "username": "errikos",
	    "email": "mail@1.com",
	    "role": "policeman",
	    "firstName": "Errikos",
	    "lastName": "Gutierrez-Fernandez",
	    "age": 24,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 1,
	    "y": 2,
	    "isAvailable": true
    },
    {
        "username": "kostas",
	    "email": "mail@2.com",
	    "role": "policeman",
	    "firstName": "Kostas",
	    "lastName": "Maragos",
	    "age": 24,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 5,
	    "y": 2,
	    "isAvailable": true
    },
    {
        "username": "aris",
	    "email": "mail@3.com",
	    "role": "policeman",
	    "firstName": "Aris",
	    "lastName": "Katops",
	    "age": 24,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 3,
	    "y": 3,
	    "isAvailable": true
    },
    {
        "username": "stelios",
	    "email": "mail@4.com",
	    "role": "firefighter",
	    "firstName": "Stelios",
	    "lastName": "Surtagias",
	    "age": 24,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 4,
	    "y": 4,
	    "isAvailable": true
    },
    {
        "username": "mixalis",
	    "email": "mail@5.com",
	    "role": "firefighter",
	    "firstName": "Mixalis",
	    "lastName": "Mitsios",
	    "age": 22,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 6,
	    "y": 6,
	    "isAvailable": true
    },
    {
        "username": "antonis",
	    "email": "mail@6.com",
	    "role": "firefighter",
	    "firstName": "Antonis",
	    "lastName": "Kakavas",
	    "age": 23,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 6,
	    "y": 6,
	    "isAvailable": true
    },
    {
        "username": "dude1",
	    "email": "mail@7.com",
	    "role": "policeman",
	    "firstName": "DUDE",
	    "lastName": "DUDESON",
	    "age": 24,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 3,
	    "y": 1,
	    "isAvailable": true
    },
    {
        "username": "dude2",
	    "email": "mail@8.com",
	    "role": "firefighter",
	    "firstName": "DUDE",
	    "lastName": "DUDESON",
	    "age": 24,
	    "gender": "male",
	    "isHeadOfAgency": false,
	    "x": 1,
	    "y": 3,
	    "isAvailable": true
    },
    //heads
    {
        "username": "head1",
	    "email": "mail@9.com",
	    "firstName": "HEAD",
	    "lastName": "HEAD",
	    "age": 34,
	    "gender": "male",
	    "isHeadOfAgency": true
    },
    {
        "username": "head2",
	    "email": "mail@10.com",
	    "firstName": "HEAD",
	    "lastName": "HEAD",
	    "age": 34,
	    "gender": "male",
	    "isHeadOfAgency": true
    },
    //coordinator
    {
        "username": "coord",
	    "email": "mail@11.com",
	    "role": "coordinator",
	    "firstName": "COORD",
	    "lastName": "COORD",
	    "age": 40,
	    "gender": "male",
    }
];

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

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

const Agency = require("./schemas/Agency");
const User = require("./schemas/User");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const start = async () => {
    // add agencies
    await asyncForEach(mock_agencies, async (element) =>{
        const res = await Agency.insertMany({name:element.name, address:element.address});
        const agency = res[0];
        if(!agency){
            console.log("ERROR agency")
        }

        if(agency.name == "Police"){
            mock_users[0].agencyId = agency._id
            mock_users[1].agencyId = agency._id
            mock_users[2].agencyId = agency._id
            mock_users[6].agencyId = agency._id
            mock_users[8].agencyId = agency._id
        }
        else if(agency.name == "Fire Department"){
            mock_users[3].agencyId = agency._id
            mock_users[4].agencyId = agency._id
            mock_users[5].agencyId = agency._id
            mock_users[7].agencyId = agency._id
            mock_users[9].agencyId = agency._id
        }
    })
    // fix
    for(let i=0; i<mock_users.length; i++){
        if(mock_users[i].agencyId){
            mock_users[i].agencyId = JSON.stringify(mock_users[i].agencyId);
            mock_users[i].agencyId = mock_users[i].agencyId.slice(1,-1);
        }
    }
    
    // add users
    await asyncForEach(mock_users, async (element) =>{
        console.log(element)
        await User.register({username:element.username, email:element.email, role:element.role, agencyId:element.agencyId,firstName:element.firstName, lastName:element.lastName, age:element.age, gender:element.gender, x:element.x, y:element.y, isHeadOfAgency:element.isHeadOfAgency, isAvailable:element.isAvailable}, "pass123!", (err, user)=>{
            if(err){
                console.log("ERROR user")
            }
            else{
                console.log("OK")

                // updare agency with user id
                if(user.isHeadOfAgency){
                    Agency.updateOne(
                        {_id: element.agencyId},
                        {$set: {userId:user._id}}, (err)=> {
                            if(err)
                                console.log(err)
                        });
                }
            }
        })
    })
}
start();