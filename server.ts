var express: any = require("express");
import Core = require('./appCore/AppCore');

var app: any = express();
var port: number = process.env.PORT || 3000;

//--------------------------------------
// Express Routers
//--------------------------------------
var mailRouter: any = require("./appRouters/AppRouter");
app.use("/mail", mailRouter);
var smsRouter: any = require("./appRouters/AppRouter");
app.use("/sms", smsRouter);

app.get("/", (req: any, res: any) => {
    res.send("<b>Wellcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
});

//--------------------------------------
// turning on the Loop Sending mechanism
//--------------------------------------
let loopSeconds = 30;
function loop() {
    Core.Sender.sendAll((sendResult: any) => console.log('Performed ' + sendResult + ' orders'));
    setTimeout(loop, loopSeconds * 1000);
}
loop();


app.listen(port);