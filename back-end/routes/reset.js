import express from 'express';
import passport from "passport";
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('../passport');
const router = express.Router()
const TokensJWT = require("../schemas/TokensJWT");

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const { xmlOptions, bustHeaders, buildResponse, isAdmin } = require('../helper/functions');

// get all models
const Report = require("../schemas/Report");
const Incident = require("../schemas/Incident");
const User = require("../schemas/User");
const Agency = require("../schemas/Agency");
const FormalReport = require("../schemas/FormalReport");


// endpoints
router.post("/reset", (req,res,next)=>{
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
      //then check if the user is the admin - if not,he is not authorized for this endpoint
      if(isAdmin(token.username)){
        Incident.deleteMany({},(err)=>{
          if (err) {
            res.send(err);
          }
        });
        Report.deleteMany({},(err)=>{
          if (err) {
            res.send(err);
          }
        });
        Agency.deleteMany({},(err)=>{
          if (err) {
            res.send(err);
          }
        });
        FormalReport.deleteMany({},(err)=>{
          if (err) {
            res.send(err);
          }
        });
        TokensJWT.deleteMany({},(err)=>{
          if (err) {
            res.send(err);
          }
        });
        User.deleteMany({ username: { $nin: "admin"}},(err)=>{
          if (err) {
            res.send(err);
          } else {
            return buildResponse(res, 200, {"status":"Successfully reset system"},'status',req.app.isXml);
          }
        });
      }
      else{
        return buildResponse(res, 403, {"status":"Forbidden"},'Error',req.app.isXml);
      }
    })(req, res, next);
});

module.exports = router