import express from 'express';
import passport from "passport";
require('../passport');
const router = express.Router()
const TokensJWT = require("../schemas/TokensJWT");

const { xmlOptions, bustHeaders, buildResponse, isAdmin } = require('../helper/functions');

router.get("/profile", bustHeaders,(req,res,next)=>{
    // get user profile
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
      return buildResponse(res, 200, token,'Profile',req.app.isXml);
    })(req, res, next);
});

module.exports = router