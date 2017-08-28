"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core = require("../appCore");
const cfg = require("../appConfig");
var RepeatPeriods;
(function (RepeatPeriods) {
    RepeatPeriods[RepeatPeriods["H"] = 3600000] = "H";
    RepeatPeriods[RepeatPeriods["D"] = 86400000] = "D";
    RepeatPeriods[RepeatPeriods["W"] = 604800000] = "W";
    RepeatPeriods[RepeatPeriods["M"] = 2592000000] = "M";
    //M = 60000,                  // one min
    RepeatPeriods[RepeatPeriods["Y"] = 31536000000] = "Y"; // 31,536,000,000 - year
})(RepeatPeriods = exports.RepeatPeriods || (exports.RepeatPeriods = {}));
;
class BaseProvider {
    constructor(doc) {
        this.sent = false;
        this.repeated = 0;
        this._id = doc._id;
        this.type = doc.type;
        this.token = doc.token;
        this.from = doc.from;
        this.to = typeof doc.to === "string" ? doc.to.split(',') : doc.to; // this.to is always Array
        this.delay = parseInt(doc.delay);
        this.repeat = doc.repeat;
        this.subject = doc.subject;
        this.text = doc.text;
        this.html = doc.html;
        this.timeToSend = doc.timeToSend && typeof doc.timeToSend === "number" ? doc.timeToSend : parseInt(doc.delay) + new Date().getTime();
        this.sent = typeof doc.sent !== "undefined" ? doc.sent : this.sent;
        this.repeated = doc.repeated && typeof (doc.repeated) == "number" ? doc.repeated : this.repeated;
    }
    // validate only and only the HTTP request structure
    valid() {
        // this.delay is should be positive whole number
        if (this.delay < 0) {
            return false;
        }
        // this.repeat[0] is should be H, D, W, M, Y or 0
        if (!/^[HDWMY0]$/.test(this.repeat[0].toUpperCase())) {
            return false;
        }
        // this.repeat is should contain number less then 12
        let regExp = this.repeat.match(/\d+/);
        if (!regExp || regExp.length < 1) {
            return false;
        }
        const reqRepeat = parseInt(regExp[0]);
        if (reqRepeat < 0 || reqRepeat > 12) {
            return false;
        }
        return true;
    }
    insert(cb) {
        Core.DataBase.getUser(this.token, (user) => {
            if (user) {
                if (user.type.toString() === 'Active') {
                    Core.DataBase.insertNewOrder(this, cb);
                }
                else {
                    cb({ error: `The user is ${user.type.toString()}` });
                }
            }
            else if (cfg.app.demoMode) {
                Core.DataBase.getOrder(this.token, (order) => {
                    if (!order) {
                        Core.DataBase.insertNewOrder(this, cb);
                    }
                    else {
                        cb({ error: "The token was used" });
                    }
                });
            }
            else {
                cb({ error: "Demo mode is off. For send login to the system" });
            }
        });
    }
    send(callback) { }
    ;
    // update
    update() {
        // TODO: if the user is test user, initial sent with true value and leave the func
        this.repeated = ++this.repeated || 0;
        if (this.repeat && this.repeat.length > 1 && /^[HDWMY]$/.test(this.repeat[0].toUpperCase()) && /^\d$/.test(this.repeat[1])) {
            if (this.repeated < parseInt(this.repeat[1])) {
                let repeatPeriods = RepeatPeriods[this.repeat[0].toUpperCase()];
                this.timeToSend = new Date().getTime() + repeatPeriods;
            }
            else {
                this.sent = true;
            }
        }
        else if (this.repeat && this.repeat === "0") {
            this.sent = true;
        }
        // TODO: here addition check of the user type and if it is equal to test set the sent to true
    }
    // store
    store(orderId) {
        Core.DataBase.updateSentOrder(this, (err, numUpdated) => {
            if (numUpdated < 1) {
                console.log('Can\'t update order record');
            }
        });
    }
    ;
}
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=BaseProvider.js.map