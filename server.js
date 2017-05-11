"use strict";
var express = require("express");
var cfg = require('./appConfig');
var Core = require('./appCore');
var app = express();
var port = process.env.PORT || 3000;
//--------------------------------------
// Express Routers
//--------------------------------------

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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

var mailRouter = require("./appRouters/AppRouter");
app.use("/mail", mailRouter);
var smsRouter = require("./appRouters/AppRouter");
app.use("/sms", smsRouter);
app.get("/", function (req, res) {
    res.send("<b>Wellcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
});
//--------------------------------------
// the Loop Sending mechanism
//--------------------------------------
function loop(delay) {
    Core.Sender.sendAll(function (sendResult) { return console.log('Performed ' + sendResult + ' orders'); });
    setTimeout(loop, delay * 1000, delay);
}
var delay = 30;
cfg.app.active && setTimeout(loop, delay * 1000, delay);
app.listen(port);
//# sourceMappingURL=server.js.map