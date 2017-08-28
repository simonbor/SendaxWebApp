"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DbCollection;
(function (DbCollection) {
    DbCollection[DbCollection["Orders"] = "Orders"] = "Orders";
    DbCollection[DbCollection["Users"] = "Users"] = "Users";
})(DbCollection = exports.DbCollection || (exports.DbCollection = {}));
;
class DataBase {
    constructor() {
        //var Datastore = require('nedb');
        // NEDB files using
        //this.ds[DbCollection.Orders] = new Datastore({ filename: '../data_files/' + DbCollection.Orders + '.json', autoload: true });
        //this.ds[DbCollection.Users] = new Datastore({ filename: '../data_files/' + DbCollection.Users + '.json', autoload: true });
        // NEDB memory using
        //this.ds[DbCollection.Orders] = new Datastore();
        //this.ds[DbCollection.Users] = new Datastore();
    }
    static getDB(collection) {
        var Datastore = require('nedb');
        if (!this.ds[collection]) {
            //console.log(__dirname + '\\appData\\');
            this.ds[collection] = new Datastore({ filename: './appData/' + collection + '.json', autoload: true });
        }
        return this.ds[collection];
    }
    static insertNewOrder(doc, callcack) {
        let dbCollection = this.getDB(DbCollection.Orders);
        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.insert(doc, (err, result) => {
                    var res = (result._id === undefined) ? { error: err } : result;
                    callcack(res);
                });
            }
            else {
                console.log(error);
            }
        });
    }
    ;
    static findOrdersToSend(callcack) {
        var now = new Date().getTime();
        let dbCollection = this.getDB(DbCollection.Orders);
        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        let params = {
            $and: [{
                    $or: [{ sent: false }, { sent: { $exists: false } }]
                }, {
                    timeToSend: { $lt: now }
                }]
        };
        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.find(params, (err, docs) => {
                    callcack(docs);
                });
            }
            else {
                console.log(error);
                callcack([]);
            }
        });
    }
    ;
    static updateSentOrder(order, callcack) {
        let dbCollection = this.getDB(DbCollection.Orders);
        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.update({ _id: order._id }, { $set: { sent: order.sent, repeated: order.repeated, timeToSend: order.timeToSend } }, { upsert: true }, (err, numUpdated) => {
                    callcack(numUpdated);
                });
            }
            else {
                console.log(error);
                callcack(0);
            }
        });
    }
    ;
    static find(collection, params, callcack) {
        let dbCollection = this.getDB(collection);
        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.find(params, (err, docs) => {
                    callcack(docs);
                });
            }
            else {
                console.log(error);
                callcack([]);
            }
        });
    }
    ;
}
DataBase.ds = {};
exports.DataBase = DataBase;
//# sourceMappingURL=Dal.js.map