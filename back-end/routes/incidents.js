import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('../passport');
const Incident = require("../schemas/Incident");
const User = require("../schemas/User");
const TokensJWT = require("../schemas/TokensJWT");

const router = express.Router()

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const { xmlOptions, bustHeaders, distance,compare, buildResponse, isAdmin, isCoordinator } = require('../helper/functions');

// endpoints
router.get("/incidents", bustHeaders,(req,res,next)=>{
    // Get all incidents
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
      Incident.find((err,foundItems)=>{
        if(!err){
          let result = foundItems;
          if(result.length === 0 || result === null)
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml)
          else{
            if(req.app.isXml){ result = JSON.parse(JSON.stringify(result)); }
            return buildResponse(res, 200, result,'Incidents',req.app.isXml);
          }
        }else{
          return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        }
      });
    })(req, res, next);
});

router.post("/incidents", bustHeaders,xmlparser(xmlOptions),(req,res,next)=>{
  // Add a new incident
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
      console.log(error)
      return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
    }

    // check who can use this endpoint
    if(isCoordinator(token.role) || isAdmin(token.username)){
      const { title, x , y , startDate , endDate, telephone, level } = (req.body['Incident'] || req.body);
      //insert the users based on lat lon in the array 

      let setAll = (obj, val) => Object.keys(obj).forEach(k => obj[k] = val);
      let setEmpty = obj => setAll(obj, ['temp']);
      let levelsGiven = await Object.values(level);
      let searchResult = {...level};
      setEmpty(searchResult);                  // get an object with keys the agencies and values empty arrays (later user arrays)
      let searchArr = Object.entries(searchResult)
      // console.log(searchArr)

      // for every agency given with level, find all available users
      for(let i=0; i<searchArr.length; i++){
        let distancesArray = [];
        const users = await User.find({isAvailable:true, agencyId:searchArr[i][0]}, (err)=>{
          if(err)
            return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        });
        if(users){
          await users.forEach(async element => {
            distancesArray.push({
              dist : distance(element.x , element.y , x , y),
              elem: element
            })
          })
          searchArr[i][1] = distancesArray
        }
      }

      for(let i=0; i<searchArr.length; i++){  // for every agency wanted
        let distancesArray = searchArr[i][1];
        let usersIncident = [];

        // sort array according to distance and keep users
        distancesArray.sort(compare);
        let searchNum = levelsGiven[i] * 2;
        if(distancesArray.length < searchNum ){
          searchNum = distancesArray.length;
        }
        for (let j = 0; j < searchNum; j++) {
          usersIncident.push(distancesArray[j].elem); // !!
        }

        // change availability of users
        await usersIncident.forEach(element =>{
          User.updateOne(
          {_id: element._id}, // !!
          {$set: {isAvailable : false}  },
          (err)=>{
          if(!err){
            //return buildResponse(res, 200, {"status":"Successfully updated the user"},'status',req.app.isXml);
             }else{
                return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
            }
          });     
       });

        // save results
        searchArr[i][1] = usersIncident;
      }
      searchResult = Object.fromEntries(searchArr)
      console.log(searchResult)

      // insert incident into database
      Incident.insertMany({title:title, x:x, y:y, startDate:startDate, endDate:endDate, telephone:telephone, level:level, isOpen:true, userId:token._id, users:searchResult}, (err, result1) => {
        if(err){
          // check if it is validation error
          console.log(err)
          if(err.name == "ValidationError" || err.name == "BulkWriteError")
            return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);
          else
            return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        }else{
          let result = result1[0];
            if(req.app.isXml){result = JSON.parse(JSON.stringify(result));}
            return buildResponse(res, 200, result,'Incident',req.app.isXml);
        }
      });
    }
    else{
      return buildResponse(res, 403, {"status":"Forbidden"},'Incident',req.app.isXml);
    }
  })(req, res, next);
});

router.get("/incidents/:incidentId", bustHeaders,(req,res,next)=>{
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
      const requestedId = req.params.incidentId;
      Incident.findOne({_id : requestedId} , (err,foundItem) =>{
        if(!err){ 
          if(foundItem === null){
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }else{
            let result = foundItem;
            if(req.app.isXml){result  = JSON.parse(JSON.stringify(result)); }
            return buildResponse(res, 200, result ,'Incident',req.app.isXml);
          }
        }else{
          return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
        }
      });
    })(req, res, next);
});

router.delete("/incidents/:incidentId",bustHeaders,(req,res,next)=>{
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

    if(isAdmin(token.username)){
      const requestedId = req.params.incidentId;
      Incident.deleteOne(
       {_id:requestedId},
        (err)=>{
         if(!err){
          return buildResponse(res, 200, {"status":"Successfully deleted the incident"},'status',req.app.isXml);
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

router.patch("/incidents/:incidentId", bustHeaders,xmlparser(xmlOptions),(req,res,next)=>{
  // insert users to an already open incident
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
    if(isCoordinator(token.role) || isAdmin(token.username)){
      const requestedId = req.params.incidentId;
      //update all fields in a specific incident
      const { title, x , y , startDate , endDate, telephone, level , isOpen , userId , addUsers } = (req.body['Incident'] || req.body);

      // find requested incident
      let lat =0;
      let lon =0;
      let oldUsers = null;
      let levelOfIncident = null;

      await Incident.findOne({_id : requestedId} , (err,foundItem) =>{
        if(!err){ 
          if(foundItem === null){
            return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
          }else{
            oldUsers = {...foundItem.users};
            lat = foundItem.x;
            lon = foundItem.y;
            levelOfIncident = foundItem.level;
          }
        }else{
          return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
        }
      });
      let searchArr = Object.entries(oldUsers);
      let addition = Object.entries(addUsers);

      // find all available users pes requested agency
      for (let i=0; i<addition.length; i++){
        let distancesArray = [];
        const users = await User.find({isAvailable:true, agencyId:addition[i][0]}, (err)=>{
          if(err)
            return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);
        });
        if(users){
          // if available users were found, add them all to arrays
          await users.forEach(async element => {
            distancesArray.push({
              dist : distance(element.x , element.y , x , y),
              elem: element
            })
          })
          searchArr[i][1] = distancesArray  // keep new values
        }
      }

      let oldUsersArray = Object.entries(oldUsers);
      for(let i=0; i<searchArr.length; i++){  // for every agency wanted
        let distancesArray = searchArr[i][1];
        let usersIncident = [];

        // sort array according to distance and keep users
        distancesArray.sort(compare);
        let searchNum = addition[i][1];
        if(distancesArray.length < searchNum ){
          searchNum = distancesArray.length;
        }
        for (let j = 0; j < searchNum; j++) {
          usersIncident.push(distancesArray[j].elem); // !!
        }

        // change availability of users
        await usersIncident.forEach(element =>{
          User.updateOne(
          {_id: element._id}, // !!
          {$set: {isAvailable : false}  },
          (err)=>{
              if(err){
                return buildResponse(res, 404, {"status":"Not Found"},'Error',req.app.isXml);
              }
          });     
        });

        // save results 
        oldUsersArray[i][1].push(...usersIncident)
      }
      console.log(oldUsersArray)
      let newUsers = Object.fromEntries(oldUsersArray)

      // update incident
      await Incident.updateOne(
        {_id:requestedId},
        {$set: {users : newUsers}},
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
});

router.put("/incidents/:incidentId", bustHeaders,xmlparser(xmlOptions),(req,res,next)=>{
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
    if(isCoordinator(token.role) || isAdmin(token.username)){
      const requestedId = req.params.incidentId;
      //update all fields in a specific incident
      const { title, x , y , startDate , endDate, telephone, level , isOpen , userId , users } = (req.body['Incident'] || req.body);
      Incident.updateOne(
        {_id:requestedId},
        {$set: {
          title:title,
          x:x,
          y:y,
          startDate:startDate,
          endDate:endDate,
          telephone:telephone,
          level:level,
          isOpen:false,
          userId : userId,
          users : users
        } 
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
});

// export the router
module.exports = router