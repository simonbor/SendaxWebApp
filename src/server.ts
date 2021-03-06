﻿const express: any = require("express");
import cfg = require('./appConfig');
import { Sender } from './appCore';
const Routers: any = require("./appRouters/AppRouter");
var mongoose = require('mongoose');

const app: any = express();

/* // the technique to provide params throw the layers of the application
app.set('dbUrl', cfg.dbUrl[app.settings.env]);
mongoose.connect(app.get('dbUrl')); */
let uri = process.env.MLAB_SENDAX_URI || cfg.dbUrl;
mongoose.connect(uri, { useMongoClient: true }, (err, res) => {
    if (err) {
        console.log ('ERROR connecting to: ' + uri + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uri);
    }
});

// Cross domain settings 
// TODO: take the code to external module
//--------------------------------------
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    var allowedOrigins = ["http://localhost:4200", "http://sendax-post.herokuapp.com", "https://sendax-post.herokuapp.com"];
    if (allowedOrigins.indexOf(req.headers.origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Express Routers
//--------------------------------------
app.use("/mail", Routers.router);
app.use("/sms",  Routers.router);

app.get("/", (req: any, res: any) => {
    res.send("<b>Welcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
});

// the Loop Sending mechanism - delay - seconds, default - half minute
//--------------------------------------
const cycleSend = cfg.app.cycleSend;
const cycleDelay = cfg.app.cycleDelay;

const loop = (delay) => {
    if (cycleSend) {
        Sender.sendAll((sendResult: any) => console.log(`Performed ${sendResult} orders`));
        setTimeout(loop, delay * 1000, delay);
    }
};
setTimeout(loop, 50, cycleDelay);

const port = process.env.PORT || 3000;
app.listen(port);
