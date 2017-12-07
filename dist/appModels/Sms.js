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
    const crypt = require('../appCore/Crypt');
    appModels_1.User.findOne({ token: this.token }, (err, user) => {
        // for test sending the default user is coming from config
        user = user || cfg.defUser;
        const smsAccount = JSON.parse(JSON.stringify(user.smsAccount[0]));
        smsAccount.auth.apiSecret = crypt.decrypt(smsAccount.auth.apiSecret);
        const nexmo = new Nexmo(smsAccount.auth);
        nexmo.message.sendSms(this.from, this.to, this.text);
        cb(this, true);
    });
};
exports.Sms = appCore_1.BaseProvider.discriminator('Sms', exports.SmsSchema);
//# sourceMappingURL=Sms.js.map