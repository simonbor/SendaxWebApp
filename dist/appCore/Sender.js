"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dal = require("./MongoDal");
const Factory = require("./Factory");
class Sender {
    static sendThese(orders, callback) {
        let sentNum = 0;
        for (var i = 0; i < orders.length; i++) {
            orders[i].send((that, result) => {
                result && that.update(); // update sent order
                result && that.store(() => { }); // store sent order in the DB 
                result && sentNum++;
                // return sent orders number on the last loop iteration
                (i >= orders.length) && callback(sentNum);
            });
        }
    }
    static sendAll(cb) {
        var orders = Array();
        Dal.DataBase.findOrdersToSend((docs) => {
            for (var i = 0; i < docs.length; i++) {
                orders[i] = Factory.Activator.createInstance(docs[i].type, docs[i]);
            }
            if (orders && orders.length > 0) {
                this.sendThese(orders, cb);
            }
            else {
                cb(0); // orders for sending not found
            }
        });
    }
}
exports.Sender = Sender;
//# sourceMappingURL=Sender.js.map