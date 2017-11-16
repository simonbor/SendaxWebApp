"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core = require("../appCore");
const appModels_1 = require("../appModels");
const mongoose_1 = require("mongoose");
exports.MailSchema = new mongoose_1.Schema({
    mailProvider: { type: String, default: 'nodemailer' }
});
exports.MailSchema.methods.send = function (cb) {
    const nodemailer = require(this.mailProvider); // 'nodemailer' or test/mocks/nodemailer.mock.ts
    const crypt = require('../appCore/Crypt');
    const cfg = require('../appConfig');
    appModels_1.User.findOne({ token: this.token }, (err, user) => {
        // retrieve the default user from config for test sending
        user = user || cfg.defUser;
        let mailAccount = JSON.parse(JSON.stringify(user.mailAccount[0]));
        mailAccount.auth.pass = crypt.decrypt(mailAccount.auth.pass);
        const transport = nodemailer.createTransport(mailAccount);
        transport.sendMail(this, (error, info) => {
            if (error) {
                // console.log('Message sent error: ' + error);
                cb(this, false);
            }
            else {
                // console.log('Message sent: ' + info.response);
                cb(this, true);
            }
        });
    });
};
exports.Mail = Core.BaseProvider.discriminator('Mail', exports.MailSchema);
//# sourceMappingURL=Mail.js.map