require('dotenv').config();
import cors from "cors";
import express from 'express';
import bodyParser from 'body-parser';
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
require('./passport');


const app = express();
const server = express();

server.use('/control-center/api', app); //base url api
app.use(cors()); 
app.use(bodyParser.json());

app.use(session({
    secret: process.env.MY_ENCRYPT, //environmental variables stored to .env file
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// connect to database
mongoose.connect("mongodb://localhost:27017/telDB", {useUnifiedTopology: true,useNewUrlParser: true})
.then(() => console.log('DB Connected!'));
mongoose.set("useCreateIndex", true);

const User = require("./schemas/User");

// passport - user
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*  endpoints   */
// health-check
const healthCheckRouter = require('./routes/healthCheck')
app.use(healthCheckRouter)

// reset
const resetRouter = require('./routes/reset')
app.use(resetRouter)

// incidents
const incidentRouter = require('./routes/incidents')
app.use(incidentRouter)

// reports
const reportRouter = require('./routes/reports')
app.use(reportRouter)

// formal-reports
const formalReportRouter = require('./routes/formalReports')
app.use(formalReportRouter)

// admin/users
const adminUserRouter = require('./routes/adminUser')
app.use(adminUserRouter)

// admin/agencies
const agencyRouter = require('./routes/agencies')
app.use(agencyRouter)

// profile
const profileRouter = require("./routes/profile")
app.use(profileRouter)

// login
const loginRouter = require('./routes/login')
app.use(loginRouter)

// logout
const logoutRouter = require('./routes/logout')
app.use(logoutRouter)

// start server
server.listen(3001,()=>{
    console.log("Server started on port 3001!");
});