let mongodb = require('mongodb');
//import { BaseProvider, RepeatPeriods } from './BaseProvider';
import {default as BaseProvider, RepeatPeriods } from "./BaseProvider"
//import Core = require('../appCore');

export namespace DataBase {

    let db: any;
    export let mongoConnected:boolean = false;
    let uri = process.env.MLAB_SENDAX_URI;

    export enum DbCollection {
        Orders = <any>"Orders", 
        Users = <any>"Users"
    };

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
                err && console.log(`findOrdersToSend - ${err}`);
                cb(docs || []);
            });
        } catch(e) {
            // TODO: replace the console.log with DI logging mechanism
            console.log(`findOrdersToSend - ${e.message}`);
        }
    };

    export function updateSentOrder(order: BaseProvider, callcack: any) {
        db.collection(DbCollection.Orders).update({ _id: order._id }, { $set: { sent: order.sent, repeated: order.repeated, timeToSend: order.timeToSend } }, { upsert: true }, (err, numUpdated) => {
                callcack(numUpdated);
        });
    };

    // TODO: replace the console.log with DI logging mechanism and remove the comment
    export function getUser(token: string, cb: any) {
        try {
            db.collection(DbCollection.Users).findOne({ token: token }, function (err, doc) {
                err && console.log(`getUser - ${err}`);
                cb(doc);
            });
        } catch (e) {
            console.log(`getUser - ${e.message}`);
        }
    };

    // check the exists for eToken in the Orders collection
    // TODO: replace the console.log with DI logging mechanism and remove the comment
    export function getOrder(token: string, cb: any) {
        try {
            db.collection(DbCollection.Orders).findOne({ token: token }, function (err, doc) {
                err && console.log(`getOrder - ${err}`);
                cb(doc);
            });
        } catch (e) {
            console.log(`getOrder - ${e.message}`);
        }
    };

}

