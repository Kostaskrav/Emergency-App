import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('../passport');
const router = express.Router()
const jwt = require('jsonwebtoken');

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const { xmlOptions, bustHeaders, buildResponse, isAdmin } = require('../helper/functions');
const User = require("../schemas/User");

const start = Date.now();

router.post("/login", bustHeaders, xmlparser(xmlOptions), function(req, res, next) {
    const { username, password } = (req.body['User'] || req.body);
    const user = new User({
               username: username,
               password: password
             });
  
    passport.authenticate('local', {session:false}, function(err,user,info) {
        if (err || !user) {return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml); }
        req.logIn(user, {session: false}, function(err) {
            if (err) {return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);}
            else{
                User.findOne({username : username } , (err,foundItem) =>{
                    if(!err){
                        const token = jwt.sign({"id":foundItem._id,"username":foundItem.username}, process.env.JWT_KEY, {expiresIn:"1h"});
  
                        return buildResponse(res, 200, {
                        //if the login was successful the system responds with
                          "status" : "Authorized",
                          "id" : foundItem._id,
                          "username" : foundItem.username,
                          "email" : foundItem.email,
                          "role"  : foundItem.role,
                          "agency" : foundItem.agencyId,
                          "firstName" : foundItem.firstName,
                          "lastName" : foundItem.lastName,
                          "isHeadOfAgency" : foundItem.isHeadOfAgency,
                          "gender" : foundItem.gender,
                          "age": foundItem.age,
                          "x": foundItem.x,
	                      "y": foundItem.y,
                          "token" :  token
                          } , 'User',req.app.isXml);
                    }
                } );
            }
        });
    })(req, res, next);
});

module.exports = router