"use strict";
var express = require("express");
var cfg = require('./appConfig');
var Core = require('./appCore');
var app = express();
var port = process.env.PORT || 3000;
//--------------------------------------
// Cross domain settings 
// TODO: take the code to external module
//--------------------------------------
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    var allowedOrigins = ["http://localhost:4200", "http://sendax-post.herokuapp.com"];
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
//--------------------------------------
// Express Routers
//--------------------------------------
var mailRouter = require("./appRouters/AppRouter");
app.use("/mail", mailRouter);
var smsRouter = require("./appRouters/AppRouter");
app.use("/sms", smsRouter);
app.get("/", function (req, res) {
    res.send("<b>Wellcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
});
//--------------------------------------
// the Loop Sending mechanism - delay - seconds, default - half minute
//--------------------------------------
var cycleSend = cfg.app.cycleSend;
var cycleDelay = cfg.app.cycleDelay;
var loop = function (delay) {
    if (cycleSend) {
        Core.Sender.sendAll(function (sendResult) { return console.log("Performed " + sendResult + " orders"); });
        setTimeout(loop, delay * 1000, delay);
    }
};
setTimeout(loop, cycleDelay * 1000, cycleDelay);
app.listen(port);
//# sourceMappingURL=server.js.map