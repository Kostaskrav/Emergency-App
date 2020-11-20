import express from 'express';
import passport from "passport";
import xml from 'xml2js';
require('../passport');
import mongoose from "mongoose";

const router = express.Router()
const TokensJWT = require("../schemas/TokensJWT");

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const { bustHeaders, buildResponse, isAdmin } = require('../helper/functions');

router.get("/health-check", bustHeaders,(req,res,next)=>{
    if (req.app.isXml) {
      res.setHeader('Content-Type', 'text/xml');
    }
    //checking if the connection is live
    let connectionCode = mongoose.connection.readyState;
    if(connectionCode === 0){
      //disconnected
      return buildResponse(res, 500, {"status":"Error Database Disconnected"},'Error',req.app.isXml);
    }else if(connectionCode === 1){
      //connected
      return buildResponse(res, 200, {"status":"System health is OK"},'status',req.app.isXml);
    }else if(connectionCode === 2){
      //connecting
      return buildResponse(res, 500, {"status":"Error Database Connecting"},'Error',req.app.isXml);
    }else if(connectionCode === 3){
      //disconnecting
      return buildResponse(res, 500, {"status":"Error Database Disconnecting"},'Error',req.app.isXml);
    }else{
      //Undefinded behavior
      res.json({"status":"Undefinded behavior"});
    }  
});

module.exports = router