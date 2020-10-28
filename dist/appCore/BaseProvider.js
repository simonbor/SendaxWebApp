"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = exports.BaseProviderSchema = exports.RepeatPeriods = void 0;
const cfg = require("../appConfig");
const mongoose_1 = require("mongoose");
const jUser_1 = require("../appModels/jUser");
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
exports.BaseProviderSchema = new mongoose_1.Schema({
    type: String,
    token: { type: String, required: true },
    from: String,
    delay: { type: Number, required: true },
    to: [String],
    repeat: { type: String, required: true },
    subject: String,
    text: String,
    html: String,
    timeToSend: Number,
    sent: { type: Boolean, default: false },
    repeated: { type: Number, default: 0 } // = 0
}, { discriminatorKey: 'kind' });
exports.BaseProviderSchema.pre("save", function (next) {
    let now = new Date();
    if (!this.createdAt) {
        //this.createdAt = now;
    }
    if (!this.timeToSend) {
        this.timeToSend = parseInt(this.delay) + new Date().getTime();
    }
    next();
});
// the necessary logic is implemented in derived classes (Mail and Sms)
// ----------------------------------------------------------------------
exports.BaseProviderSchema.methods.send = function (cb) {
    console.log('BaseProviderSchema send: ' + this);
    cb(0);
};
exports.BaseProviderSchema.methods.store = function (callback) {
    const params = { $set: { sent: this.sent, repeated: this.repeated, timeToSend: (this.timeToSend || -1) } };
    exports.BaseProvider.findOneAndUpdate({ _id: this._id }, params, (err, doc) => {
        if (err) {
            console.log('Can\'t update order record');
        }
    });
};
exports.BaseProviderSchema.methods.valid = function () {
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
};
exports.BaseProviderSchema.methods.insert = function (cb) {
    jUser_1.User.findOne({ token: this.token }, (err, user) => {
        if (err)
            console.log(err); // TODO: change to handleError(err);
        if (user) {
            if (user.type.toString() === 'Active') { // TODO: check the issue with using the - Models.UserType.Active
                exports.BaseProvider.create(this, (err, res) => {
                    if (err)
                        console.log(err); // TODO: change to handleError(err);
                    cb(res);
                });
                //Core.DataBase.insertNewOrder(this, cb);
            }
            else {
                cb({ error: `The user is ${user.type.toString()}` });
            }
        }
        else if (cfg.app.demoMode) {
            exports.BaseProvider.findOne({ token: this.token }, (order) => {
                if (!order) {
                    exports.BaseProvider.create(this, (err, res) => {
                        if (err)
                            console.log(err); // TODO: change to handleError(err);
                        cb(res);
                    });
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
    return true;
};
exports.BaseProviderSchema.methods.update = function () {
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
};
exports.BaseProvider = mongoose_1.model("BaseProvider", exports.BaseProviderSchema, 'Orders');
//# sourceMappingURL=BaseProvider.js.map