"use strict";
var Core = require('../appCore');
var Routers;
(function (Routers) {
    var express = require("express");
    Routers.router = express.Router();
    var bodyParser = require("body-parser");
    Routers.router.use(bodyParser.json()); // for parsing application/json
    Routers.router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    //  create instance by Factory activator
    var createInstance = function (router, jsonParams) {
        var providerName = router[0].toUpperCase() + router.slice(1).toLowerCase();
        return Core.Activator.createInstance(providerName, jsonParams);
    };
    var processRequest = function (order, callback) {
        order.insert(function (saveResult) {
            Core.Sender.sendAll(function (sendResult) {
                console.log("Performed " + sendResult + " orders");
                callback(saveResult);
            });
        });
    };
    // define home page route
    Routers.router.get("/", function (req, res) {
        res.send("<b>Wellcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
    });
    // full GET
    Routers.router.get("/:token/:from/:to/:delay/:repeat/:subject/:text", function (req, res) {
        var order = createInstance(req.baseUrl.slice(1), req.params);
        if (order.valid()) {
            processRequest(order, function (result) {
                res.json(result);
            });
        }
        else {
            res.status(400).send({ error: 'Validation Error' });
        }
    });
    // full POST for //mail/, //sms/, //*/
    Routers.router.post("/", function (req, res) {
        var order = createInstance(req.baseUrl.slice(1), req.body);
        if (order.valid()) {
            processRequest(order, function (result) {
                res.json(result);
            });
        }
        else {
            res.status(400).send({ error: 'Validation Error' });
        }
    });
})(Routers || (Routers = {}));
module.exports = Routers.router;
//# sourceMappingURL=AppRouter.js.map