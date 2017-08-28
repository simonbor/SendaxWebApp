"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongodb = require('mongodb');
var DataBase;
(function (DataBase) {
    let db;
    DataBase.mongoConnected = false;
    let uri = process.env.MLAB_SENDAX_URI;
    let DbCollection;
    (function (DbCollection) {
        DbCollection[DbCollection["Orders"] = "Orders"] = "Orders";
        DbCollection[DbCollection["Users"] = "Users"] = "Users";
    })(DbCollection = DataBase.DbCollection || (DataBase.DbCollection = {}));
    ;
    mongodb.MongoClient.connect(uri, function (err, dbMongoLab) {
        if (!err) {
            db = dbMongoLab;
            DataBase.mongoConnected = true;
        }
        else {
            console.log(err);
        }
        ;
    });
    function insertNewOrder(doc, callcack) {
        db.collection(DbCollection.Orders).insert(doc, (err, result) => {
            var res = err ? { error: err } : result;
            callcack(res);
        });
    }
    DataBase.insertNewOrder = insertNewOrder;
    ;
    function findOrdersToSend(cb) {
        var now = new Date().getTime();
        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        let params = {
            $and: [{
                    $or: [{ sent: false }, { sent: { $exists: false } }]
                }, {
                    timeToSend: { $lt: now }
                }]
        };
        try {
            db.collection(DbCollection.Orders).find(params).toArray((err, docs) => {
                // TODO: replace the console.log with DI logging mechanism
                err && console.log(`findOrdersToSend - ${err}`);
                cb(docs || []);
            });
        }
        catch (e) {
            // TODO: replace the console.log with DI logging mechanism
            console.log(`findOrdersToSend - ${e.message}`);
        }
    }
    DataBase.findOrdersToSend = findOrdersToSend;
    ;
    function updateSentOrder(order, callcack) {
        db.collection(DbCollection.Orders).update({ _id: order._id }, { $set: { sent: order.sent, repeated: order.repeated, timeToSend: order.timeToSend } }, { upsert: true }, (err, numUpdated) => {
            callcack(numUpdated);
        });
    }
    DataBase.updateSentOrder = updateSentOrder;
    ;
    // TODO: replace the console.log with DI logging mechanism and remove the comment
    function getUser(token, cb) {
        try {
            db.collection(DbCollection.Users).findOne({ token: token }, function (err, doc) {
                err && console.log(`getUser - ${err}`);
                cb(doc);
            });
        }
        catch (e) {
            console.log(`getUser - ${e.message}`);
        }
    }
    DataBase.getUser = getUser;
    ;
    // check the exists for eToken in the Orders collection
    // TODO: replace the console.log with DI logging mechanism and remove the comment
    function getOrder(token, cb) {
        try {
            db.collection(DbCollection.Orders).findOne({ token: token }, function (err, doc) {
                err && console.log(`getOrder - ${err}`);
                cb(doc);
            });
        }
        catch (e) {
            console.log(`getOrder - ${e.message}`);
        }
    }
    DataBase.getOrder = getOrder;
    ;
})(DataBase = exports.DataBase || (exports.DataBase = {}));
//# sourceMappingURL=MongoDal.js.map