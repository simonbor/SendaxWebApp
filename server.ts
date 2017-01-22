const express: any = require("express");
const cfg = require('./appConfig');
import Core = require('./appCore');

const app: any = express();
const port: number = process.env.PORT || 3000;

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
// the Loop Sending mechanism
//--------------------------------------
const loopSeconds = 30;
function loop() {
    Core.Sender.sendAll((sendResult: any) => console.log('Performed ' + sendResult + ' orders'));
    setTimeout(loop, loopSeconds * 1000);
}
cfg.app.active && loop();

app.listen(port);