import { IProvider, Activator, Sender } from '../appCore';

namespace Routers {
    var express: any = require("express");
    export const router: any = express.Router();
    var bodyParser: any = require("body-parser");

    router.use(bodyParser.json());                          // for parsing application/json
    router.use(bodyParser.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded

    //  create instance by Factory activator
    var createInstance = (router: string, jsonParams) => {
        var providerName = router[0].toUpperCase() + router.slice(1).toLowerCase();
        return Activator.createInstance(providerName, jsonParams);
    };

    // todo: move to more appropriated place. maybe Sender.ts
    export const processRequest = (order: IProvider, callback: any, logSentResult: boolean = true) => {
        order.insert((saveResult: any) => {                       // store the send order
            Sender.sendAll((sendResult: any) => {
                logSentResult && console.log(`Performed ${sendResult} orders`);
                callback(saveResult);
            });
        });
    }

    // define home page route
    router.get("/",
        (req: any, res: any) => {
            res.send("<b>Welcome to Sendax Messaging System</b><p>Fix your request for send a message</p>");
        });

    // full GET
    router.get("/:token/:from/:to/:delay/:repeat/:subject/:text",
        (req: any, res: any) => {
            var order: IProvider = createInstance(req.baseUrl.slice(1), req.params);

            if (order.valid()) {                                                                                            // validate request fields
                processRequest(order, (result) => {
                    res.json(result);
                });
            } else {
                res.status(400).send({ error: 'Validation Error' });
            }
        });

    // full POST for //mail/, //sms/, //*/
    router.post("/",
        (req: any, res: any) => {
            var order: IProvider = createInstance(req.baseUrl.slice(1), req.body);

            if (order.valid()) {                                                                                            // validate request fields
                processRequest(order, (result) => {
                    res.json(result);
                });
            } else {
                res.status(400).send({ error: 'Validation Error' });
            }
        });
}

module.exports = {
    router: Routers.router,
    processRequest: Routers.processRequest
}
