import Core = require('../appCore');

export enum DbCollection {
    Orders = <any>"Orders",
    Users = <any>"Users"
};

export class DataBase {

    static ds: any = {};

    constructor() {
        //var Datastore = require('nedb');

        // NEDB files using
        //this.ds[DbCollection.Orders] = new Datastore({ filename: '../data_files/' + DbCollection.Orders + '.json', autoload: true });
        //this.ds[DbCollection.Users] = new Datastore({ filename: '../data_files/' + DbCollection.Users + '.json', autoload: true });

        // NEDB memory using
        //this.ds[DbCollection.Orders] = new Datastore();
        //this.ds[DbCollection.Users] = new Datastore();
    }

    private static getDB(collection: DbCollection) {
        var Datastore = require('nedb');

        if (!this.ds[collection]) {
            //console.log(__dirname + '\\appData\\');
            this.ds[collection] = new Datastore({ filename: './appData/' + collection + '.json', autoload: true });
        }
        return this.ds[collection];
    }

    static insertNewOrder(doc: any, callcack: any) {
        let dbCollection = this.getDB(DbCollection.Orders);

        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.insert(doc, (err, result) => {
                        var res = (result._id === undefined) ? { error: err } : result;
                        callcack(res);
                    });
            } else {
                console.log(error);
            }
        });
    };

    public static findOrdersToSend(callcack: any) {

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
                dbCollection.find(params, (err, docs: any) => {
                    callcack(docs);
                });
            } else {
                console.log(error);
                callcack([]);
            }
        });
    };

    public static updateSentOrder(order: Core.BaseProvider, callcack: any) {
        let dbCollection = this.getDB(DbCollection.Orders);

        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.update({ _id: order._id }, { $set: { sent: order.sent, repeated: order.repeated, timeToSend: order.timeToSend } }, { upsert: true }, (err, numUpdated) => {
                        callcack(numUpdated);
                });
            } else {
                console.log(error);
                callcack(0);
            }
        });
    };

    public static find(collection: DbCollection, params: any, callcack) {
        let dbCollection = this.getDB(collection);

        dbCollection.loadDatabase((error) => {
            if (!error) {
                dbCollection.find(params, (err, docs: Core.IProvider) => {
                    callcack(docs);
                });
            } else {
                console.log(error);
                callcack([]);
            }
        });
    };

}