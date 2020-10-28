"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appCore_1 = require("../appCore");
var Routers;
(function (Routers) {
    var express = require("express");
    Routers.router = express.Router();
    var bodyParser = require("body-parser");
    Routers.router.use(bodyParser.json()); // for parsing application/json
    Routers.router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    //  create instance by Factory activator
    var createInstance = (router, jsonParams) => {
        var providerName = router[0].toUpperCase() + router.slice(1).toLowerCase();
        return appCore_1.Activator.createInstance(providerName, jsonParams);
    };
    // todo: move to more appropriated place. maybe Sender.ts
    Routers.processRequest = (order, callback, logSentResult = true) => {
        order.insert((saveResult) => {
            appCore_1.Sender.sendAll((sendResult) => {
                logSentResult && console.log(`Performed ${sendResult} orders`);
                callback(saveResult);
            });
        });
    };
    // define home page route
    Routers.router.get("/", (req, res) => {
        res.send("<b>Welcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
    });
    // full GET
    Routers.router.get("/:token/:from/:to/:delay/:repeat/:subject/:text", (req, res) => {
        var order = createInstance(req.baseUrl.slice(1), req.params);
        if (order.valid()) { // validate request fields
            Routers.processRequest(order, (result) => {
                res.json(result);
            });
        }
        else {
            res.status(400).send({ error: 'Validation Error' });
        }
    });
    // full POST for //mail/, //sms/, //*/
    Routers.router.post("/", (req, res) => {
        var order = createInstance(req.baseUrl.slice(1), req.body);
        if (order.valid()) { // validate request fields
            Routers.processRequest(order, (result) => {
                res.json(result);
            });
        }
        else {
            res.status(400).send({ error: 'Validation Error' });
        }
    });
})(Routers || (Routers = {}));
module.exports = {
    router: Routers.router,
    processRequest: Routers.processRequest
};
//# sourceMappingURL=AppRouter.js.map