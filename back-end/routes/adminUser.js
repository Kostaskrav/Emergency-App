import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
require('../passport');
const router = express.Router()

const { xmlOptions, bustHeaders, buildResponse, isAdmin } = require('../helper/functions');

const User = require("../schemas/User");
const Agency = require("../schemas/Agency");
const TokensJWT = require("../schemas/TokensJWT");

// endpoints
router.get("/admin/users", bustHeaders,(req,res,next)=>{
    if (req.app.isXml) {
      res.setHeader('Content-Type', 'text/xml');
    }
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
      // check if jwt is blacklisted
      const jwt = req.headers.authorization.substring(7)
      let isBlackListed = false;
      await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
        if (!err && token ){
          isBlackListed = true;
        }
      });

      if (error || !token || isBlackListed) {
        return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
      }
      //then check if the user is the admin - if not,he is not authorized for this endpoint
      if(isAdmin(token.username)){
        User.find((err,foundItems)=>{
          if(!err){
            let result = foundItems;
            if(req.app.isXml){result = JSON.parse(JSON.stringify(result)); }
            return buildResponse(res, 200, result,'Users',req.app.isXml);
          }else{
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }
        });
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

router.post("/admin/users", bustHeaders,xmlparser(xmlOptions),(req,res,next) => {
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
      // check if jwt is blacklisted
      const jwt = req.headers.authorization.substring(7)
      let isBlackListed = false;
      await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
        if (!err && token ){
          isBlackListed = true;
        }
      });

      if (error || !token || isBlackListed) {
        return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
      } 
      //then check if the user is the admin - if not,he is not authorized for this endpoint
     if(isAdmin(token.username)){
        const { username,email,password,role,agencyId,firstName,lastName,age,gender,x,y,isHeadOfAgency,isAvailable } = (req.body['User'] || req.body);
          // find the user agency
          const agency = await Agency.findOne({_id : agencyId}, (err) => {
            if(err){
              return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
            }
          });

          // register user to database
          User.register({username:username,email:email,role:role,agencyId:agencyId,firstName:firstName,lastName:lastName,age:age,gender:gender, x:x,y:y,isHeadOfAgency:isHeadOfAgency,isAvailable:isAvailable}, password, async function(err, user){
          if (err) {
            console.log(err)
            if(err.name == "ValidationError" || err.name == "MissingUsernameError" || err.name=="UserExistsError")
              return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
            else
              return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
          }
          else {
            if(agency){
              // agencyId given, assign user to the agency
              let newUsers = [];
              newUsers = [...agency.users, user._id];

              // equals user id if he is the Head of this agency
              let hoa = null;
              if(isHeadOfAgency)
                hoa = user._id

              await Agency.updateOne(
                {_id: agencyId},
                {$set: {users : newUsers, userId:hoa}}, (err)=>{
                  if(err){
                   return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
                  }
              });
            }
            // return
            return buildResponse(res, 200, {
              "username" : username,
              "email" : email,
              "role" :role,
              "agencyId": agencyId,
              "firstName": firstName,
              "lastName": lastName,
              "age": age,
              "gender": gender,
              "lat" : x,
              "lon" : y
              } , 'User',req.app.isXml);
          }
          });
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

router.get("/admin/users/:userId", bustHeaders,(req,res,next)=>{
    if (req.app.isXml) {
      res.setHeader('Content-Type', 'text/xml');
    }
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
      // check if jwt is blacklisted
      const jwt = req.headers.authorization.substring(7)
      let isBlackListed = false;
      await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
        if (!err && token ){
          isBlackListed = true;
        }
      });

      if (error || !token || isBlackListed) {
        return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
      }
      //then check if the user is the admin - if not,he is not authorized for this endpoint
      if(isAdmin(token.username)){
        const requestedId = req.params.userId;
        User.findOne({_id : requestedId} , (err,foundItem) =>{
          if(!err){ 
            if(foundItem === null){
              return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
            }
            else{
              let result = foundItem;
            if(req.app.isXml){ result = JSON.parse(JSON.stringify(result)); }
            return buildResponse(res, 200, result,'User',req.app.isXml);
            }
          }else{
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }
        });
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

router.patch("/admin/users/:userId", bustHeaders,xmlparser(xmlOptions),(req,res,next)=>{
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
      // check if jwt is blacklisted
      const jwt = req.headers.authorization.substring(7)
      let isBlackListed = false;
      await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
        if (!err && token ){
          isBlackListed = true;
        }
      });

      if (error || !token || isBlackListed) {
        return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
      }
      //then check if the user is the admin - if not,he is not authorized for this endpoint
      if(isAdmin(token.username)){
        const requestedId = req.params.userId;
        //update a specific field in a specific document
        User.updateOne(
          {_id: requestedId},
          {$set: (req.body || req.body['User']) },
          (err)=>{
             if(!err){
              return buildResponse(res, 200, {"status":"Successfully updated the user"},'status',req.app.isXml);
            }else{
                return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
              }
        });
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

router.delete("/admin/users/:userId", bustHeaders,(req,res,next)=>{
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
      // check if jwt is blacklisted
      const jwt = req.headers.authorization.substring(7)
      let isBlackListed = false;
      await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
        if (!err && token ){
          isBlackListed = true;
        }
      });

      if (error || !token || isBlackListed) {
        return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
      }
      //then check if the user is the admin - if not,he is not authorized for this endpoint
      if(isAdmin(token.username)){
        const requestedId = req.params.userId;
        User.findOne({username: "admin"}, function(err,found){
          // !! error means admin cant be found?
  
         if(found._id == requestedId){
           // admin was requested to be deleted, which is not possible by this api
            return buildResponse(res, 403, {"status":"Forbidden"},'status',req.app.isXml);
          }
          else{
            // a normal user is to be deleted, proceed
            User.deleteOne(
              {_id:requestedId},
              (err)=>{
                if(!err){
                  return buildResponse(res, 200, {"status":"Successfully deleted the user"},'status',req.app.isXml);
                 }else{
                  return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
                }
              }
            );
          }
        })
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

// export the router
module.exports = router