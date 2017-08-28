"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core = require("../appCore");
class Mail extends Core.BaseProvider {
    constructor(json) {
        super(json);
    }
    valid() {
        // perform base validation
        if (!super.valid()) {
            return false;
        }
        var validator = require('validator');
        // this.to validate
        for (var i = 0; i < this.to.length; i++) {
            if (!validator.isEmail(this.to[i].trim())) {
                return false;
            }
        }
        // this.from validate
        if (!validator.isEmail(this.from)) {
            return false;
        }
        return true;
    }
    ;
    insert(cb) {
        super.insert(cb);
    }
    ;
    send(callback) {
        const nodemailer = require('nodemailer');
        const crypt = require('../appCore/Crypt');
        const cfg = require('../appConfig');
        Core.DataBase.getUser(this.token, (user) => {
            // retrieve the default user from config for test sending
            user = user || cfg.defUser;
            let mailAccount = JSON.parse(JSON.stringify(user.mailAccount[0]));
            mailAccount.auth.pass = crypt.decrypt(mailAccount.auth.pass);
            const transport = nodemailer.createTransport(mailAccount);
            // this.text = JSON.stringify(this);
            transport.sendMail(this, (error, info) => {
                if (error) {
                    console.log(error);
                    callback(false);
                }
                else {
                    console.log('Message sent: ' + info.response);
                    callback(this, true);
                }
            });
        });
    }
    update() {
        // update sent order
        super.update();
    }
    store(callback) {
        // update sent order
        super.store(this._id);
    }
}
exports.Mail = Mail;
//# sourceMappingURL=Mail.js.map