"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cfg = require("./appConfig");
const appCore_1 = require("./appCore");
var mongoose = require('mongoose');
const app = express();
/* // the technique to provide params throw the layers of the application
app.set('dbUrl', cfg.dbUrl[app.settings.env]);
mongoose.connect(app.get('dbUrl')); */
let uri = process.env.MLAB_SENDAX_URI || cfg.dbUrl;
mongoose.connect(uri, { useMongoClient: true }, (err, res) => {
    if (err) {
        console.log('ERROR connecting to: ' + uri + '. ' + err);
    }
    else {
        console.log('Succeeded connected to: ' + uri);
    }
});
// Cross domain settings 
// TODO: take the code to external module
//--------------------------------------
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    var allowedOrigins = ["http://localhost:4200", "https://sendax-post.herokuapp.com"];
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
const mailRouter = require("./appRouters/AppRouter");
app.use("/mail", mailRouter);
const smsRouter = require("./appRouters/AppRouter");
app.use("/sms", smsRouter);
app.get("/", (req, res) => {
    res.send("<b>Welcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
});
// the Loop Sending mechanism - delay - seconds, default - half minute
//--------------------------------------
const cycleSend = cfg.app.cycleSend;
const cycleDelay = cfg.app.cycleDelay;
const loop = (delay) => {
    if (cycleSend) {
        appCore_1.Sender.sendAll((sendResult) => console.log(`Performed ${sendResult} orders`));
        setTimeout(loop, delay * 1000, delay);
    }
};
setTimeout(loop, 50, cycleDelay);
const port = process.env.PORT || 3000;
app.listen(port);
// 1. -- For repair the project tests I need inject the mongoose - http://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/, http://rob.conery.io/2012/02/24/testing-your-model-with-mocha-mongo-and-nodejs/
// 1.1 -- Should to refactoring the tests structure - http://www.albertgao.xyz/2017/06/19/test-your-model-via-jest-and-mongoose/, https://www.terlici.com/2014/09/15/node-testing.html, http://www.scotchmedia.com/tutorials/express/authentication/1/06
// 2. -- Organize the project structure - https://github.com/basarat/typescript-book/blob/master/docs/quick/nodejs.md
// 3. Extend the app by add the Telegram support - https://core.telegram.org/api/obtaining_api_id
// 4. Add history and active orders
// -----------------------------------------------------
// Production Installation important steps
// -----------------------------------------------------
// 1. set the NODE_ENV = "production" and MLAB_SENDAX_URI = "/*connection string*/" server environment variables 
//# sourceMappingURL=server.js.map