import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('../passport');
const FormalReport = require("../schemas/FormalReport");
const TokensJWT = require("../schemas/TokensJWT");
const router = express.Router()

const builder = new xml.Builder({
    renderOpts: { 'pretty': false }
  });
  
const { xmlOptions, bustHeaders, buildResponse, isAdmin } = require('../helper/functions');

// endpoints
router.get("/formal-reports", bustHeaders, (req,res,next)=>{
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
        // check who can use this endpoint
        if(token.isHeadOfAgency ){
          FormalReport.find({agencyId:token.agencyId},(err,foundItems)=>{
            if(!err){
              let result = foundItems;
              if(result.length === 0)
                return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml)
              if(req.app.isXml){result = JSON.parse(JSON.stringify(result)); }
              return buildResponse(res, 200, result,'FormalReport',req.app.isXml);
            }else{
              return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
            }
          });
        }
        else{
          return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
        }
      })(req, res, next);
});

// get formal report + filter user
router.get("/formal-reports/user/:userId", bustHeaders, (req,res,next)=>{
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

      const requestedId = req.params.userId;
      FormalReport.find({userId : requestedId, isOpen:true }, (err, foundItems)=>{
        if(!err){
          let result = foundItems;
          if(result.length === 0)
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml)
          if(req.app.isXml){result = JSON.parse(JSON.stringify(result)); }
            return buildResponse(res, 200, result,'FormalReport',req.app.isXml);
        }else{
          return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        }
      });
    })(req, res, next);
});


router.get("/formal-reports/:freportId", bustHeaders, (req,res,next)=>{
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

    const requestedId = req.params.freportId;
    const frep = await FormalReport.findOne({_id : requestedId } , (err) =>{
        if(err){ 
          return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
        }
    });
    if(!frep){
      return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
    }
    else{
      // check who can use this endpoint
      // here the author can access too
    
      if(token.isHeadOfAgency || frep.userId == token._id || isAdmin(token.username)){
        let result = frep;
        if(req.app.isXml){result  = JSON.parse(JSON.stringify(result)); }
        return buildResponse(res, 200, result ,'FormalReport',req.app.isXml);
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    }
  })(req, res, next);
});

router.delete("/formal-reports/:freportId", bustHeaders, (req,res,next)=>{
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

    // check who can use this endpoint
    if(token.isHeadOfAgency || isAdmin(token.username)){
      const requestedId = req.params.freportId;
      FormalReport.deleteOne(
       {_id:requestedId},
        (err)=>{
         if(!err){
          return buildResponse(res, 200, {"status":"OK"},'status',req.app.isXml);
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

router.put("/formal-reports/:freportId", bustHeaders, xmlparser(xmlOptions),(req,res,next)=>{
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

    const requestedId = req.params.freportId;
    const frep = await FormalReport.findOne({_id : requestedId } , (err) =>{
        if(err){ 
          return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
        }
    });
    if(!frep){
      return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
    }
    else{
      // check who can use this endpoint
      // here the author can access too
    
      if(token.isHeadOfAgency || frep.userId == token._id || isAdmin(token.username)){
        //update all fields in a specific incident
        const { title, userId, incidentId, agencyId, injuries, casualties, unitsDeployed, date, comments, isOpen } = (req.body['Report'] || req.body);
        FormalReport.updateOne(
          {_id:requestedId},
          {$set: {
              title:title, userId:userId, incidentId:incidentId, agencyId:agencyId, injuries:injuries, casualties:casualties, unitsDeployed:unitsDeployed,
              date:date, comments:comments, isOpen:false} 
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
    }
  })(req, res, next);
})

router.patch("/formal-reports/:freportId", bustHeaders, xmlparser(xmlOptions),(req,res,next)=>{
  // update the formal report
  passport.authenticate('jwt', { session: false, }, async (error, token) => {
    // check if jwt is blacklisted
    const jwt = req.headers.authorization.substring(7);
    let isBlackListed = false;
    await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
      if (!err && token ){
        isBlackListed = true;
      }
    });

    if (error || !token || isBlackListed) {
      console.log(error)
      return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
    }

    // find formal report
    const requestedId = req.params.freportId;
    const frep = await FormalReport.findOne({_id : requestedId } , (err, report) =>{
        if(err){ 
          return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
        }
        else{
          if(!report.isOpen){
            // trying to close already closed incident
            return buildResponse(res, 403, {"status":"Bad request", "message":"Formal report already closed"},'Error',req.app.isXml);
          }
        }
    });
    if(!frep){
      return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
    }
    else{
      // check who can use this endpoint
      // here the author can access too
    
      if(token.isHeadOfAgency || frep.userId == token._id || isAdmin(token.username)){
        //update all fields in a specific incident
        const { injuries, casualties, unitsDeployed, comments, isOpen } = (req.body['FormalReport'] || req.body);

        await FormalReport.updateOne(
          {_id:requestedId},
          {$set: {injuries:injuries, casualties:casualties, unitsDeployed:unitsDeployed, comments:comments, isOpen:false}},  
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
    }
  })(req, res, next);
});

module.exports = router