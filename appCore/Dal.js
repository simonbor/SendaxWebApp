"use strict";
(function (DbCollection) {
    DbCollection[DbCollection["Orders"] = "Orders"] = "Orders";
    DbCollection[DbCollection["Users"] = "Users"] = "Users";
})(exports.DbCollection || (exports.DbCollection = {}));
var DbCollection = exports.DbCollection;
;
var DataBase = (function () {
    function DataBase() {
        //var Datastore = require('nedb');
        // NEDB files using
        //this.ds[DbCollection.Orders] = new Datastore({ filename: '../data_files/' + DbCollection.Orders + '.json', autoload: true });
        //this.ds[DbCollection.Users] = new Datastore({ filename: '../data_files/' + DbCollection.Users + '.json', autoload: true });
        // NEDB memory using
        //this.ds[DbCollection.Orders] = new Datastore();
        //this.ds[DbCollection.Users] = new Datastore();
    }
    DataBase.getDB = function (collection) {
        var Datastore = require('nedb');
        if (!this.ds[collection]) {
            //console.log(__dirname + '\\appData\\');
            this.ds[collection] = new Datastore({ filename: './appData/' + collection + '.json', autoload: true });
        }
        return this.ds[collection];
    };
    DataBase.insertNewOrder = function (doc, callcack) {
        var dbCollection = this.getDB(DbCollection.Orders);
        dbCollection.loadDatabase(function (error) {
            if (!error) {
                dbCollection.insert(doc, function (err, result) {
                    var res = (result._id === undefined) ? { error: err } : result;
                    callcack(res);
                });
            }
            else {
                console.log(error);
            }
        });
    };
    ;
    DataBase.findOrdersToSend = function (callcack) {
        var now = new Date().getTime();
        var dbCollection = this.getDB(DbCollection.Orders);
        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        var params = {
            $and: [{
                    $or: [{ sent: false }, { sent: { $exists: false } }]
                }, {
                    timeToSend: { $lt: now }
                }]
        };
        dbCollection.loadDatabase(function (error) {
            if (!error) {
                dbCollection.find(params, function (err, docs) {
                    callcack(docs);
                });
            }
            else {
                console.log(error);
                callcack([]);
            }
        });
    };
    ;
    DataBase.updateSentOrder = function (order, callcack) {
        var dbCollection = this.getDB(DbCollection.Orders);
        dbCollection.loadDatabase(function (error) {
            if (!error) {
                dbCollection.update({ _id: order._id }, { $set: { sent: order.sent, repeated: order.repeated, timeToSend: order.timeToSend } }, { upsert: true }, function (err, numUpdated) {
                    callcack(numUpdated);
                });
            }
            else {
                console.log(error);
                callcack(0);
            }
        });
    };
    ;
    DataBase.find = function (collection, params, callcack) {
        var dbCollection = this.getDB(collection);
        dbCollection.loadDatabase(function (error) {
            if (!error) {
                dbCollection.find(params, function (err, docs) {
                    callcack(docs);
                });
            }
            else {
                console.log(error);
                callcack([]);
            }
        });
    };
    ;
    DataBase.ds = {};
    return DataBase;
}());
exports.DataBase = DataBase;
//# sourceMappingURL=Dal.js.map