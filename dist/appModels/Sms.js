"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appCore_1 = require("../appCore");
const mongoose_1 = require("mongoose");
const appModels_1 = require("../appModels");
exports.SmsSchema = new mongoose_1.Schema({
    smsProvider: { type: String, default: 'nexmo' }
});
exports.SmsSchema.methods.send = function (cb) {
    const Nexmo = require(this.smsProvider);
    const cfg = require('../appConfig');
    appModels_1.User.findOne({ token: this.token }, (err, user) => {
        // retrieve the default user from config for test sending
        user = user || cfg.defUser;
        const smsAccount = JSON.parse(JSON.stringify(user.smsAccount[0]));
        const nexmo = new Nexmo(smsAccount.auth);
        var from = this.from;
        var to = this.from;
        var text = this.text;
        nexmo.message.sendSms(from, to, text);
        //console.log(`The order ${this._id} was marked as sent. For real send please implement Sms.send() method`);
        cb(this, true);
    });
};
exports.Sms = appCore_1.BaseProvider.discriminator('Sms', exports.SmsSchema);
//# sourceMappingURL=Sms.js.map