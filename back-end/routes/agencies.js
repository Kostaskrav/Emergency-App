import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('../passport');
const router = express.Router()

const { xmlOptions, bustHeaders, buildResponse, isAdmin } = require('../helper/functions');

const Agency = require("../schemas/Agency");
const TokensJWT = require("../schemas/TokensJWT");

// endpoints
router.get("/agencies", bustHeaders,(req,res,next)=>{
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
        Agency.find((err,foundItems)=>{
          if(!err){
            let result = foundItems;
            if(result.length === 0)
              return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml)   
            if(req.app.isXml){result = JSON.parse(JSON.stringify(result)); }
              return buildResponse(res, 200, result,'Agency',req.app.isXml);
          }else{
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }
        });
      })(req, res, next);
});

router.post("/agencies", bustHeaders,xmlparser(xmlOptions),(req,res,next) => {
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
        const { name,userId,address,users } = (req.body['Agency'] || req.body);
        Agency.insertMany({name:name, userId:userId, address:address, users:users}, (err, result) => {
            if(err){
                console.log(err.name)
                if(err.name == "ValidationError" || err.name == "BulkWriteError")
                    return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
                else
                    return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
            }
            else{
                return buildResponse(res, 200, {
                    "name" : name,
                    "userId" : userId,
                    "address" :address,
                    "users": users} , 'Agency',req.app.isXml);
            }
          });
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

router.get("/agencies/:agencyId", bustHeaders,xmlparser(xmlOptions),(req,res,next) => {
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
        const requestedId = req.params.agencyId;
          Agency.findOne({_id : requestedId} , (err,foundItem) =>{
            if(!err){ 
              if(foundItem === null){
                return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
              }
              else{
                let result = foundItem;
              if(req.app.isXml){ result = JSON.parse(JSON.stringify(result)); }
              return buildResponse(res, 200, result,'Agency',req.app.isXml);
              }
            }else{
              return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
            }
          });
      })(req, res, next);
});

router.delete("/agencies/:agencyId", bustHeaders,(req,res,next)=>{
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
      const requestedId = req.params.agencyId;
      Agency.deleteOne(
        {_id:requestedId},
         (err)=>{
          if(!err){
           return buildResponse(res, 200, {"status":"Successfully deleted the agency"},'status',req.app.isXml);
         }else{
             return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
           }
        }
       );
    }
    else{
      return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
    }
  })(req, res, next);
});

router.put("/agencies/:agencyId", bustHeaders, xmlparser(xmlOptions),(req,res,next)=>{
  passport.authenticate('jwt', { session: false }, async (error, token) => {
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
      const requestedId = req.params.agencyId;
      //update all fields in a specific agency
      const { name, userId, address, users } = (req.body['Agency'] || req.body);
      Agency.updateOne(
        {_id:requestedId},
        {$set: {
          name:name,
          userId:userId,
          address:address,
          users:users} 
        },
        (err)=>{
          if(!err){
            return buildResponse(res, 200, {"status":"OK"},'status',req.app.isXml);
          }else{
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }
      });
    }
    else{
      return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
    }
  })(req, res, next);
})


module.exports = router