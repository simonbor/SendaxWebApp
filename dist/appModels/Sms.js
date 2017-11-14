"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appCore_1 = require("../appCore");
const mongoose_1 = require("mongoose");
exports.SmsSchema = new mongoose_1.Schema({});
exports.SmsSchema.methods.send = function (cb) {
    // TODO: here implement send SMS logic
    console.log(`The order ${this._id} was marked as sent. For real send please implement Sms.send() method`);
    cb(this, true);
};
exports.Sms = appCore_1.BaseProvider.discriminator('Sms', exports.SmsSchema);
//# sourceMappingURL=Sms.js.map