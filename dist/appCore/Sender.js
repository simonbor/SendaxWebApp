"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Sender {
    static sendThese(orders, cb) {
        let sentNum = 0;
        for (let i = 0; i < orders.length; i++) {
            orders[i].send((that, result) => {
                if (result) {
                    that.update(); // update sent order
                    that.store(() => { }); // store sent order in the DB 
                    sentNum++;
                }
                // return sent orders number on the last loop iteration
                (i >= (orders.length - 1)) && cb(sentNum);
            });
        }
    }
    static sendAll(cb) {
        var now = new Date().getTime();
        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        let params = {
            $and: [{
                    $or: [{ sent: false }, { sent: { $exists: false } }]
                }, {
                    timeToSend: { $lt: now }
                }]
        };
        _1.BaseProvider.find(params, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                if (docs && docs.length > 0) {
                    this.sendThese(docs, cb);
                }
                else {
                    cb(0); // orders for sending not found
                }
            }
        });
    }
}
exports.Sender = Sender;
//# sourceMappingURL=Sender.js.map