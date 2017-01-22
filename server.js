"use strict";
var express = require("express");
var cfg = require('./appConfig');
var Core = require('./appCore');
var app = express();
var port = process.env.PORT || 3000;
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
// the Loop Sending mechanism
//--------------------------------------
var loopSeconds = 30;
function loop() {
    Core.Sender.sendAll(function (sendResult) { return console.log('Performed ' + sendResult + ' orders'); });
    setTimeout(loop, loopSeconds * 1000);
}
cfg.app.active && loop();
app.listen(port);
//# sourceMappingURL=server.js.map