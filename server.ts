const express: any = require("express");
import cfg = require('./appConfig');
import Core = require('./appCore');

const app: any = express();
const port: number = process.env.PORT || 3000;

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
const mailRouter: any = require("./appRouters/AppRouter");
app.use("/mail", mailRouter);
const smsRouter: any = require("./appRouters/AppRouter");
app.use("/sms", smsRouter);

app.get("/", (req: any, res: any) => {
    res.send("<b>Wellcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
});

//--------------------------------------
// the Loop Sending mechanism - delay - seconds, default - half minute
//--------------------------------------
const cycleSend = cfg.app.cycleSend;
const cycleDelay = cfg.app.cycleDelay;

const loop = (delay) => {
    if (cycleSend) {
        Core.Sender.sendAll((sendResult: any) => console.log(`Performed ${sendResult} orders`));
        setTimeout(loop, delay * 1000, delay);
    }
};
setTimeout(loop, cycleDelay * 1000, cycleDelay);

app.listen(port);