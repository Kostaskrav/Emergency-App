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

router.post("/logout", bustHeaders, (req, res,next)=>{
     const jwttoken = req.headers.authorization.substring(7);
    passport.authenticate('jwt', { session: false, }, async (error, user) => {
        // check if jwt is blacklisted
        const jwt = req.headers.authorization.substring(7)
        let isBlackListed = false;
        await TokensJWT.findOne({mytoken: jwt}, (err, token) => {
          if (!err && token ){
            isBlackListed = true;
          }
        });

        if (error || !user || isBlackListed) {
            return buildResponse(res, 401, {"status":"Not Authorized"},'Error',req.app.isXml);
        }
        //add the token to blacklist
        TokensJWT.insertMany({mytoken : jwttoken }, (err, result1) => {
            if(err){
                if(err.name == "ValidationError"){
                    return buildResponse(res, 400, {"status":"Bad Request"},'Error',req.app.isXml);}
                else
                   { return buildResponse(res, 500, {"status":"Internal Server Error"},'Error',req.app.isXml);}
            }
            else{
                return buildResponse(res, 200, {},'status',req.app.isXml);
            }
          });
        
    })(req, res, next);        
});

module.exports = router