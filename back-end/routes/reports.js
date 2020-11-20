import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('../passport');
const Report = require("../schemas/Report");
const Incident = require("../schemas/Incident");
const User = require("../schemas/User");
const FormalReport = require("../schemas/FormalReport");
const TokensJWT = require("../schemas/TokensJWT");
const router = express.Router()

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const { xmlOptions, bustHeaders, buildResponse, isAdmin, isCoordinator, titleGenerator } = require('../helper/functions');

// endpoints
router.get("/reports", bustHeaders, (req,res,next)=>{
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
      Report.find((err,foundItems)=>{
        if(!err){
          let result = foundItems;
          if(result.length === 0)
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml)
          if(req.app.isXml){result = JSON.parse(JSON.stringify(result)); }
          return buildResponse(res, 200, result,'Reports',req.app.isXml);
        }else{
          return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        }
      });
    })(req, res, next);
})

router.post("/reports", bustHeaders,xmlparser(xmlOptions),(req,res,next)=>{
  // post a new report
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

    //check who can use this endpoint
    if(isCoordinator(token.role) || isAdmin(token.username)){
      // id here is the incident id closing
      const { id } = (req.body['Report'] || req.body);
      const requestedId = id;

      let users = {};
      let incidentTitle = 'temp';
      let incidentDate = 'temp';

      await Incident.findOne({_id : requestedId} , (err,foundItem) =>{
        if(!err){ 
          if(foundItem === null){
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }else{
            let result = foundItem;
            users = foundItem.users;
            incidentTitle = foundItem.title;
            incidentDate = foundItem.startDate;

            if(!foundItem.isOpen){
              // trying to close already closed incident
              return buildResponse(res, 403, {"status":"Bad request", "message":"Incident already closed"},'Error',req.app.isXml);
            }
          }
        }else{
          return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
        }
      });
      //also set the isOpen from incident to false !!!!! 
      await Incident.updateOne(
        {_id:requestedId},
        {$set: {isOpen : false}},
       (err)=>{
           if(err){
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
           }
      });
      let userArray = Object.values(users);
      let allUsers = []
      for(let i=0; i<userArray.length; i++){
        allUsers = allUsers.concat(userArray[i]);
      }
      // console.log(allUsers)
      
      //now make all the users that were in the incident available !!!!
      //and create the report spaces
      await allUsers.forEach(async element =>{
        await User.updateOne(
          {_id: element._id},
          {$set: {isAvailable : true}  },
          (err)=>{
           if(err){
             return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
            }
        });

        // find current user
        const curr_user = await User.findOne({_id:element._id});
        const report_title = await titleGenerator(element._id, incidentTitle);
        // await console.log(report_title)
        await Report.insertMany({title:report_title, userId:element._id, incidentId:requestedId, agencyId:curr_user.agencyId, date:incidentDate, comments:"" , isOpen : true}, (err, result1) => {
          if(err){
              console.log(err)
              if(err.name == "ValidationError"  || err.name == "BulkWriteError")
                return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
              else
                return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
          }
        });
      });
      return buildResponse(res, 200, {"status":"OK"},'status',req.app.isXml);
    }
    else{
      return buildResponse(res, 403, {"status":"Forbidden"},'status',req.app.isXml);
    }
  })(req, res, next);
});

router.get("/reports/:reportid", bustHeaders, (req,res,next)=>{
    if (req.app.isXml) {
        res.setHeader('Content-Type', 'text/xml');
      }
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
        const requestedId = req.params.reportid;
        Report.findOne({_id : requestedId  } , (err,foundItem) =>{
        if(!err){ 
          if(foundItem === null){
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }else{
            let result = foundItem;
            if(req.app.isXml){result  = JSON.parse(JSON.stringify(result)); }
            return buildResponse(res, 200, result ,'Report',req.app.isXml);
          }
        }else{
          return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
        }
        });
    })(req, res, next);
})

router.delete("/reports/:reportid", bustHeaders, (req,res,next)=>{
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

      if(isAdmin(token.username)){
        const requestedId = req.params.reportid;
        Report.deleteOne(
         {_id:requestedId},
          (err)=>{
           if(!err){
            return buildResponse(res, 200, {"status":"Successfully deleted the report"},'status',req.app.isXml);
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
})

router.put("/reports/:reportid", bustHeaders, xmlparser(xmlOptions),(req,res,next)=>{
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

    // check if this user is accessing his own report
    const requestedId = req.params.reportid;
    const rep = await Report.findOne({_id:requestedId}, (err)=>{
      if(err)
        return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
    });
    if(rep.userId === token._id || isAdmin(token.username)){
      const requestedId = req.params.reportid;
      //update all fields in a specific incident
      const { title, userId, incidentId, agencyId, date, comments ,isOpen } = (req.body['Report'] || req.body);
      Report.updateOne(
        {_id:requestedId},
        {$set: {
          title:title,
          userId:userId,
          incidentId:incidentId,
          agencyId:agencyId,
          date:date,
          comments:comments,
          isOpen:false} 
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

router.patch("/reports/:reportid", bustHeaders, xmlparser(xmlOptions),(req,res,next)=>{
  // update the report with the user comments
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

    // check if this user is accessing his own report
    const requestedId = req.params.reportid;
    const rep = await Report.findOne({_id:requestedId}, (err, report)=>{
      if(err)
        return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
      else{
        if(!report.isOpen){
          // trying to close already closed incident
          return buildResponse(res, 400, {"status":"Bad request", "message":"Report already closed"},'Error',req.app.isXml);
        }
      }
    });
    
    if(rep.userId == token._id || isAdmin(token.username)){
      // update  fields in a specific report
      const { comments, isOpen} = (req.body['Report'] || req.body);
      await Report.updateOne(
        {_id:requestedId},
        {$set: {comments:comments, isOpen:false}},  
        (err)=>{
          if(err){
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }
      });

      // get reports incident id (we know it exists)
      const report = await Report.findOne({ _id:requestedId });
      const curr_incident = report.incidentId;
      const incident = await Incident.findOne({_id:curr_incident});

      // check database if all the other reports of the same incident are closed
      // if yes, open a formalReport
      let reportArray = [];
      await Report.find(async (err,foundItems)=>{
        if(!err){
          let result = foundItems;
          if(result.length === 0 || result === null)
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml)
          else{
            // get all report of same incident (isOpen flag)
            await foundItems.forEach(element => {
                if(element.incidentId === curr_incident){
                  reportArray.push(element.isOpen);
                }
            });

            // check if all closed
            const isClosed = (value) => value===false;
            if(reportArray.every(isClosed)){
              // open formal report
              const freport_title = await titleGenerator(report.userId, incident.title);
              FormalReport.insertMany({title:freport_title, userId:report.userId, incidentId:report.incidentId, agencyId:report.agencyId, date:report.date, isOpen:true}, (err, result1) => {
                if(err || !result1){
                  // check if it is validation error
                  if(err.name == "ValidationError" || err.name == "BulkWriteError")
                    return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
                  else
                    return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
                }else{
                    return buildResponse(res, 200, {"status": "OK", "message":"Formal report opened"},'FormalReport',req.app.isXml);
                }
              });          
            }
            else{
              return buildResponse(res, 200, {"status": "OK"},'FormalReport',req.app.isXml);
            }
          }
        }else{
          return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        }
      });
    }
    else{
      return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
    }
  }) (req, res, next);
})
// export the router
module.exports = router