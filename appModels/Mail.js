"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Core = require('../appCore');
var Mail = (function (_super) {
    __extends(Mail, _super);
    function Mail(json) {
        _super.call(this, json);
    }
    Mail.prototype.valid = function () {
        // perform base validation
        if (!_super.prototype.valid.call(this)) {
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
    };
    ;
    Mail.prototype.insert = function (cb) {
        _super.prototype.insert.call(this, cb);
    };
    ;
    Mail.prototype.send = function (callback) {
        var _this = this;
        var nodemailer = require('nodemailer');
        var crypt = require('../appCore/Crypt');
        var encryptedPassword = '87cf1d70f26031a29aaa';
        var transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'simonbor.bell@gmail.com',
                pass: crypt.decrypt(encryptedPassword)
            }
        });
        transport.sendMail(this, function (error, info) {
            if (error) {
                console.log(error);
                callback(false);
            }
            else {
                console.log('Message sent: ' + info.response);
                callback(_this, true);
            }
        });
    };
    Mail.prototype.update = function () {
        // update sent order
        _super.prototype.update.call(this);
    };
    Mail.prototype.store = function (callback) {
        // update sent order
        _super.prototype.store.call(this, this._id);
    };
    return Mail;
}(Core.BaseProvider));
exports.Mail = Mail;
//# sourceMappingURL=Mail.js.map