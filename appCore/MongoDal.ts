let mongodb = require('mongodb');
import Core = require('../appCore');

export namespace DataBase {

    let db: any;
    export let mongoConnected:boolean = false;
    let uri = process.env.MLAB_SENDAX_URI;

    export enum DbCollection {
        Orders = <any>"Orders", // 
        Users = <any>"Users"    // { token: 0, type: 'active', mailConfig: { service: 'Gmail', auth: { user: 'simonbor.bell@gmail.com', pass: 'password' } } };
    };

    export enum UserType {
        inactive = 0,
        active = 1
    }

    mongodb.MongoClient.connect(uri, function(err, dbMongoLab) {
        if (!err) {
            db = dbMongoLab;
            mongoConnected = true;
        } else {
            console.log(err);
        };
    });

    export function insertNewOrder(doc: any, callcack: any) {
        db.collection(DbCollection.Orders).insert(doc, (err, result) => {
            var res = err ? { error: err } : result;
            callcack(res);
        });
    };

    export function findOrdersToSend(cb: any) {
        var now = new Date().getTime();

        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        let params = {
            $and: [{
                $or: [{ sent: false }, { sent: { $exists: false } }]
            }, {
                timeToSend: { $lt: now }
            }]
        };

        try{
            db.collection(DbCollection.Orders).find(params).toArray((err, docs: any) => {
                // TODO: replace the console.log with DI logging mechanism
                err && console.log('findOrdersToSend - ${err}');
                cb(docs || []);
            });
        } catch(e) {
            // TODO: replace the console.log with DI logging mechanism
            console.log('findOrdersToSend - ${e.message}');
        }
    };

    export function updateSentOrder(order: Core.BaseProvider, callcack: any) {
        db.collection(DbCollection.Orders).update({ _id: order._id }, { $set: { sent: order.sent, repeated: order.repeated, timeToSend: order.timeToSend } }, { upsert: true }, (err, numUpdated) => {
                callcack(numUpdated);
        });
    };

    export function getUser(token: string, cb: any) {
        // TODO: get the user doc by eToken field
        db.collection(DbCollection.Users).findOne({ token: token }, function (err, doc) {
            cb(doc);
        });
    };

    export function eTokenWasUsed(eToken: string, cb: any):boolean {
        // TODO: check the exists for eToken in the Orders collection

        return true;
    };

}

